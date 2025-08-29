import { NextResponse } from 'next/server';
import { testSmtpConnection } from '@/lib/email';

export async function GET() {
  try {
    const result = await testSmtpConnection();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        details: result.details
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message,
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Email test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to test email configuration',
      error: error.message
    }, { status: 500 });
  }
}
