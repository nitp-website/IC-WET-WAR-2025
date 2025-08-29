import { NextResponse } from 'next/server';
const { query } = require('@/lib/db');

export async function POST(request) {
  try {
    const { mealType, mealDate, quantityDelivered, notes } = await request.json();

    if (!mealType || !mealDate || quantityDelivered === undefined) {
      return NextResponse.json(
        { error: 'Meal type, date, and quantity are required' },
        { status: 400 }
      );
    }

    // Check if restaurant meal record already exists for this date and type
    const existingMeals = await query(
      'SELECT id FROM restaurant_meals WHERE meal_type = ? AND meal_date = ?',
      [mealType, mealDate]
    );

    if (existingMeals.length > 0) {
      // Update existing record
      await query(
        'UPDATE restaurant_meals SET quantity_delivered = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE meal_type = ? AND meal_date = ?',
        [quantityDelivered, notes || null, mealType, mealDate]
      );
    } else {
      // Insert new record
      await query(
        'INSERT INTO restaurant_meals (meal_type, meal_date, quantity_delivered, notes, delivery_time) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)',
        [mealType, mealDate, quantityDelivered, notes || null]
      );
    }

    return NextResponse.json({
      message: 'Restaurant meal record updated successfully'
    });
  } catch (error) {
    console.error('Update restaurant meal error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const type = searchParams.get('type') || '';

    let whereClause = 'WHERE meal_date = ?';
    let params = [date];

    if (type) {
      whereClause += ' AND meal_type = ?';
      params.push(type);
    }

    // Get restaurant meal records
    const restaurantMeals = await query(
      `SELECT * FROM restaurant_meals ${whereClause} ORDER BY meal_type`,
      params
    );

    // Get attendee meal consumption for the same date
    const attendeeMeals = await query(
      `SELECT am.*, m.name, m.registration_number 
       FROM attendee_meals am 
       JOIN members m ON am.member_id = m.id 
       WHERE am.meal_date = ? ${type ? 'AND am.meal_type = ?' : ''}
       ORDER BY m.name`,
      type ? [date, type] : [date]
    );

    // Get meal settings
    const mealSettings = await query(
      'SELECT * FROM meal_settings WHERE is_active = TRUE ORDER BY meal_type'
    );

    // Calculate summary statistics
    const mealSummary = {};
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    
    for (const mealType of mealTypes) {
      const consumed = attendeeMeals.filter(am => am.meal_type === mealType).length;
      const delivered = restaurantMeals.find(rm => rm.meal_type === mealType)?.quantity_delivered || 0;
      
      mealSummary[mealType] = {
        consumed,
        delivered,
        remaining: delivered - consumed,
        attendees: attendeeMeals.filter(am => am.meal_type === mealType)
      };
    }

    return NextResponse.json({
      restaurantMeals,
      attendeeMeals,
      mealSettings,
      mealSummary,
      date
    });
  } catch (error) {
    console.error('Get meals error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { memberId, mealType, mealDate, isConsumed } = await request.json();

    if (!memberId || !mealType || !mealDate || isConsumed === undefined) {
      return NextResponse.json(
        { error: 'Member ID, meal type, date, and consumption status are required' },
        { status: 400 }
      );
    }

    // Update attendee meal consumption
    await query(
      'UPDATE attendee_meals SET is_consumed = ?, consumed_at = ? WHERE member_id = ? AND meal_type = ? AND meal_date = ?',
      [isConsumed, isConsumed ? new Date() : null, memberId, mealType, mealDate]
    );

    // Update restaurant meal consumed count
    const consumedCount = await query(
      'SELECT COUNT(*) as count FROM attendee_meals WHERE meal_type = ? AND meal_date = ? AND is_consumed = TRUE',
      [mealType, mealDate]
    );

    await query(
      'UPDATE restaurant_meals SET quantity_consumed = ? WHERE meal_type = ? AND meal_date = ?',
      [consumedCount[0].count, mealType, mealDate]
    );

    return NextResponse.json({
      message: 'Meal consumption updated successfully'
    });
  } catch (error) {
    console.error('Update meal consumption error:', error);
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
        { error: 'Meal record ID is required' },
        { status: 400 }
      );
    }

    // Delete restaurant meal record
    await query(
      'DELETE FROM restaurant_meals WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      message: 'Restaurant meal record deleted successfully'
    });
  } catch (error) {
    console.error('Delete meal record error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
