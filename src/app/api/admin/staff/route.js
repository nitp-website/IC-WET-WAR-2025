import { NextResponse } from 'next/server';
const { query } = require('@/lib/db');

export async function POST(request) {
  try {
    const { name, email, phoneNumber, role } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingStaff = await query(
      'SELECT id FROM staff WHERE email = ?',
      [email]
    );

    if (existingStaff.length > 0) {
      return NextResponse.json(
        { error: 'Staff member with this email already exists' },
        { status: 409 }
      );
    }

    // Insert new staff member
    const result = await query(
      'INSERT INTO staff (name, email, phone_number, role) VALUES (?, ?, ?, ?)',
      [name, email, phoneNumber || null, role || 'staff']
    );

    return NextResponse.json({
      message: 'Staff member added successfully',
      staff: {
        id: result.insertId,
        name,
        email,
        phone_number: phoneNumber,
        role: role || 'staff'
      }
    });
  } catch (error) {
    console.error('Add staff error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';

    const offset = (page - 1) * limit;

    let whereClause = '';
    let params = [];

    if (search) {
      whereClause = 'WHERE name LIKE ? OR email LIKE ? OR role LIKE ?';
      params = [`%${search}%`, `%${search}%`, `%${search}%`];
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM staff ${whereClause}`;
    const countResult = await query(countQuery, search ? params : []);
    const total = countResult[0].total;

    // Use a different query structure to avoid LIMIT/OFFSET parameter issues
    let staffQuery = `SELECT * FROM staff ${whereClause} ORDER BY created_at DESC`;
    if (limit > 0) {
      staffQuery += ` LIMIT ${limit}`;
      if (offset > 0) {
        staffQuery += ` OFFSET ${offset}`;
      }
    }
    
    // Only pass parameters if there's a search clause
    const queryParams = search ? params : [];
    const staff = await query(staffQuery, queryParams);

    return NextResponse.json({
      staff,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get staff error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id, name, email, phoneNumber, role, isActive } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Staff ID is required' },
        { status: 400 }
      );
    }

    // Update staff member
    await query(
      'UPDATE staff SET name = ?, email = ?, phone_number = ?, role = ?, is_active = ? WHERE id = ?',
      [name, email, phoneNumber || null, role || 'staff', isActive, id]
    );

    return NextResponse.json({
      message: 'Staff member updated successfully'
    });
  } catch (error) {
    console.error('Update staff error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Staff ID is required' },
        { status: 400 }
      );
    }

    // Soft delete by setting is_active to false
    await query(
      'UPDATE staff SET is_active = FALSE WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      message: 'Staff member deactivated successfully'
    });
  } catch (error) {
    console.error('Delete staff error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
