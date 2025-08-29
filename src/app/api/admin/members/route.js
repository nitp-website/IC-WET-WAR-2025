import { NextResponse } from 'next/server';
const { query } = require('@/lib/db');
import { sendIDCardEmail, sendMemberUpdateEmail, sendMemberDeletionEmail } from '@/lib/email';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';

    const offset = (page - 1) * limit;

    // Build search condition
    let searchCondition = '';
    let searchParamsArray = [];
    
    if (search.trim()) {
      searchCondition = 'WHERE name LIKE ? OR email LIKE ? OR registration_number LIKE ? OR institute LIKE ?';
      const searchTerm = `%${search}%`;
      searchParamsArray = [searchTerm, searchTerm, searchTerm, searchTerm];
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM members ${searchCondition}`;
    const countResult = await query(countQuery, searchParamsArray);
    const totalItems = countResult[0].total;

    // Get members with pagination
    const membersQuery = `
      SELECT * FROM members 
      ${searchCondition}
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    const members = await query(membersQuery, searchParamsArray);

    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = offset;
    const endIndex = offset + limit;

    return NextResponse.json({
      members,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        startIndex,
        endIndex,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const memberData = await request.json();

    // Validate required fields
    if (!memberData.name || !memberData.email || !memberData.designation || !memberData.institute) {
      return NextResponse.json(
        { error: 'Name, email, designation, and institute are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(memberData.email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingMember = await query(
      'SELECT id FROM members WHERE email = ?',
      [memberData.email]
    );

    if (existingMember.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Generate registration number
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
    const registrationNumber = `WETWAR${timestamp}${randomChars}`;

    // Insert member using correct column names
    const insertResult = await query(
      'INSERT INTO members (name, email, phone_number, designation, institute, registration_number) VALUES (?, ?, ?, ?, ?, ?)',
      [
        memberData.name,
        memberData.email,
        memberData.phoneNumber || null,
        memberData.designation || null,
        memberData.institute || null,
        registrationNumber
      ]
    );

    const memberId = insertResult.insertId;

    // Initialize meal allocations for the member using batch operations
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    const today = new Date();
    
    // Prepare batch meal data
    const mealData = [];
    for (let i = 0; i < 7; i++) { // 7 days of conference
      const mealDate = new Date(today);
      mealDate.setDate(today.getDate() + i);
      const dateStr = mealDate.toISOString().split('T')[0];
      
      for (const mealType of mealTypes) {
        mealData.push([memberId, mealType, dateStr]);
      }
    }
    
    // Use batch insert for better performance
    if (mealData.length > 0) {
      const placeholders = mealData.map(() => '(?, ?, ?)').join(', ');
      const flatData = mealData.flat();
      
      await query(
        `INSERT INTO attendee_meals (member_id, meal_type, meal_date) VALUES ${placeholders}`,
        flatData
      );
    }

    // Send ID card email
    const memberWithRegNumber = {
      ...memberData,
      id: memberId,
      registration_number: registrationNumber
    };

    const emailSent = await sendIDCardEmail(memberWithRegNumber);
    if (!emailSent) {
      console.warn('Failed to send ID card email for member:', memberWithRegNumber.email);
    }

    return NextResponse.json({
      message: 'Member added successfully',
      member: {
        id: memberId,
        registration_number: registrationNumber,
        ...memberData
      }
    });
  } catch (error) {
    console.error('Error adding member:', error);
    return NextResponse.json(
      { error: 'Failed to add member' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('id');
    
    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      );
    }

    const updateData = await request.json();

    // Validate required fields
    if (!updateData.name || !updateData.email || !updateData.designation || !updateData.institute) {
      return NextResponse.json(
        { error: 'Name, email, designation, and institute are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updateData.email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists for another member
    const existingMember = await query(
      'SELECT id FROM members WHERE email = ? AND id != ?',
      [updateData.email, memberId]
    );

    if (existingMember.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered by another member' },
        { status: 400 }
      );
    }

    // Update member using correct column names
    await query(
      'UPDATE members SET name = ?, email = ?, phone_number = ?, designation = ?, institute = ? WHERE id = ?',
      [
        updateData.name,
        updateData.email,
        updateData.phoneNumber || null,
        updateData.designation || null,
        updateData.institute || null,
        memberId
      ]
    );

    // Get updated member data for email
    const updatedMember = await query(
      'SELECT * FROM members WHERE id = ?',
      [memberId]
    );

    if (updatedMember.length > 0) {
      // Send update notification email
      const emailSent = await sendMemberUpdateEmail(updatedMember[0]);
      if (!emailSent) {
        console.warn('Failed to send update email for member:', updatedMember[0].email);
      }
    }

    return NextResponse.json({
      message: 'Member updated successfully'
    });
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json(
      { error: 'Failed to update member' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('id');
    
    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      );
    }

    // Get member data before deletion for email
    const memberData = await query(
      'SELECT * FROM members WHERE id = ?',
      [memberId]
    );

    if (memberData.length === 0) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    // Delete related meal records first
    await query(
      'DELETE FROM attendee_meals WHERE member_id = ?',
      [memberId]
    );

    // Delete the member
    await query(
      'DELETE FROM members WHERE id = ?',
      [memberId]
    );

    // Send deletion notification email
    const emailSent = await sendMemberDeletionEmail(memberData[0]);
    if (!emailSent) {
      console.warn('Failed to send deletion email for member:', memberData[0].email);
    }

    return NextResponse.json({
      message: 'Member deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { error: 'Failed to delete member' },
      { status: 500 }
    );
  }
}
