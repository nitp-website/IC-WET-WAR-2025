import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import { v2 as cloudinary } from 'cloudinary';
import { jsPDF } from 'jspdf';
import { createCanvas } from 'canvas';
import JsBarcode from 'jsbarcode';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function getSmtpSettings() {
  return {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    from: process.env.SMTP_FROM_EMAIL
  };
}

async function createTransporter() {
  const settings = await getSmtpSettings();
  const transporter = nodemailer.createTransport({
    host: settings.host,
    port: settings.port,
    secure: settings.secure,
    auth: settings.auth,
    debug: process.env.NODE_ENV === 'development',
    tls: {
      rejectUnauthorized: true
    }
  });

  try {
    await transporter.verify();
  } catch (error) {
    console.error('SMTP connection verification failed:', error);
  }
  
  return transporter;
}

// Test function to check SMTP configuration
export async function testSmtpConnection() {
  try {
    const transporter = await createTransporter();
    const result = await transporter.verify();
    return {
      success: true,
      message: 'SMTP connection verified successfully',
      details: result
    };
  } catch (error) {
    console.error('SMTP test connection failed:', error);
    return {
      success: false,
      message: 'SMTP connection failed',
      error: {
        code: error.code,
        command: error.command,
        message: error.message
      }
    };
  }
}

// Upload QR code to Cloudinary
async function uploadQRCodeToCloudinary(registrationNumber) {
  try {
    // Generate QR code as buffer
    const qrBuffer = await QRCode.toBuffer(registrationNumber, {
      color: { dark: '#000000', light: '#FFFFFF' },
      width: 300,
      margin: 2,
      errorCorrectionLevel: 'H'
    });

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'wetwar-qrcodes',
          public_id: `qr_${registrationNumber}`,
          overwrite: true,
          resource_type: 'image'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(qrBuffer);
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading QR code to Cloudinary:', error);
    throw error;
  }
}

// Generate ID Card PDF
async function generateIDCardPDF(memberData) {
  try {
    // Create high-resolution canvas for better quality (multiply by 3 for better text rendering)
    const scale = 3;
    const width = 340;
    const height = 560;
    const canvas = createCanvas(width * scale, height * scale);
    const ctx = canvas.getContext('2d');
    
    // Scale context for high-quality rendering
    ctx.scale(scale, scale);

    // Fill white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Top blue wave header
    ctx.fillStyle = '#00B4D8';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, 180);
    ctx.quadraticCurveTo(width/2, 200, 0, 180);
    ctx.closePath();
    ctx.fill();

    // WET-WAR 2025 title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('WET-WAR 2025', width/2, 30);

    // Conference subtitle
    ctx.font = '12px Arial';
    ctx.fillText('International Conference', width/2, 55);
    ctx.fillText('"Wetlands and water resources for sustainable', width/2, 68);
    ctx.fillText('development 2025"', width/2, 81);

    // Date
    ctx.font = 'bold 13px Arial';
    ctx.fillText('(29 TO 31 December 2025)', width/2, 98);

    // Institute
    ctx.font = '14px Arial';
    ctx.fillText('National institute of Technology Patna India', width/2, 113);

    // Member Name
    ctx.fillStyle = '#000080';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(memberData.name.toUpperCase(), width/2, 240);

    // Member's Designation (from form)
    ctx.fillStyle = '#00008B';
    ctx.font = '10px Arial';
    ctx.fillText(memberData.designation || 'PARTICIPANT', width/2, 265);

    // Institute
    ctx.font = 'bold 13px Arial';
    ctx.fillText((memberData.institute || 'NOT SPECIFIED').toUpperCase(), width/2, 282);

    // India
    ctx.fillStyle = '#FF8C00';
    ctx.font = 'bold 13px Arial';
    ctx.fillText('INDIA', width/2, 298);

    // ID No
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`ID No  : ${memberData.registration_number}`, 40, 330);

    // Generate barcode at higher resolution
    const barcodeCanvas = createCanvas(280 * scale, 80 * scale);
    JsBarcode(barcodeCanvas, memberData.registration_number, {
      format: 'CODE128',
      width: 2 * scale,
      height: 60 * scale,
      displayValue: false,
      margin: 5 * scale
    });

    // Draw barcode on main canvas
    ctx.drawImage(barcodeCanvas, 30, 345, 280, 70);

    // Bottom blue wave footer
    ctx.fillStyle = '#0077B6';
    ctx.beginPath();
    ctx.moveTo(0, 490);
    ctx.quadraticCurveTo(width/2, 470, width, 490);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // Footer text - Use member's designation or default role
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    const footerText = (memberData.designation || 'PARTICIPANT').toUpperCase();
    ctx.fillText(footerText, width/2, 525);

    // Convert canvas to PDF using jsPDF with high quality
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [width, height],
      compress: false
    });

    // Add canvas as high-quality image to PDF
    const imgData = canvas.toDataURL('image/png', 1.0);
    pdf.addImage(imgData, 'PNG', 0, 0, width, height, undefined, 'FAST');

    // Return PDF as buffer
    return Buffer.from(pdf.output('arraybuffer'));
  } catch (error) {
    console.error('Error generating ID card PDF:', error);
    throw error;
  }
}

export async function sendIDCardEmail(memberData) {
  try {
    const transporter = await createTransporter();
    if (!process.env.SMTP_FROM_EMAIL) {
      console.error('SMTP_FROM_EMAIL environment variable is missing');
      return false;
    }

    // Upload QR code to Cloudinary
    const qrCodeUrl = await uploadQRCodeToCloudinary(memberData.registration_number);

    // Generate ID Card PDF
    const idCardPDF = await generateIDCardPDF(memberData);

    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: memberData.email,
      subject: 'WET-WAR 2025 Conference - Your ID Card',
      attachments: [
        {
          filename: `ID_Card_${memberData.registration_number}.pdf`,
          content: idCardPDF,
          contentType: 'application/pdf'
        }
      ],
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>WET-WAR 2025 ID Card</title>
          <style>
            /* Reset and base styles */
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background-color: #f3f4f6; }
            
            /* Container */
            .email-container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            
            /* Header */
            .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 40px 20px; text-align: center; }
            .header h1 { color: white; font-size: 28px; font-weight: 800; margin-bottom: 10px; }
            .header p { color: #dbeafe; font-size: 16px; }
            
            /* Content */
            .content { padding: 30px; }
            .welcome-text { margin-bottom: 30px; text-align: center; }
            .welcome-text h2 { color: #1e3a8a; font-size: 22px; margin-bottom: 15px; }
            .welcome-text p { color: #4b5563; font-size: 16px; }
            
            /* ID Card */
            .id-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 15px; padding: 25px; margin: 25px 0; }
            
            .id-card-header { text-align: center; margin-bottom: 25px; }
            .id-card-header h3 { font-size: 20px; font-weight: 700; color: #1e3a8a; margin-bottom: 5px; }
            .id-card-header p { font-size: 14px; color: #6b7280; }

            .registration-info { text-align: center; margin-bottom: 25px; }
            .registration-info .info-label { font-weight: 600; color: #374151; font-size: 16px; }
            .registration-info .info-value { font-size: 18px; font-weight: 700; color: #1e3a8a; display: block; margin-top: 5px; text-align: center; }
            
            .member-info { border-top: 1px solid #e5e7eb; padding-top: 10px; }
            .info-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb; }
            .info-row:last-child { border-bottom: none; }
            .info-label { font-weight: 600; color: #374151; font-size: 15px; }
            .info-value { color: #1f2937; font-size: 15px; text-align: right; }
            
            .qr-section { margin-top: 30px; padding: 25px; background: #ffffff; border-radius: 10px; border: 1px solid #e2e8f0; text-align: center; }
            .qr-section h4 { color: #1e3a8a; font-size: 18px; margin-bottom: 10px; }
            .qr-code { margin-top: 15px; }
            .qr-code img { width: 160px; height: 160px; border: 4px solid #1e3a8a; border-radius: 12px; padding: 5px; background: white; }
            
            /* Footer */
            .footer { background: #1f2937; padding: 30px 20px; text-align: center; }
            .footer p { color: #9ca3af; font-size: 14px; margin-bottom: 10px; }
            .footer .highlight { color: #60a5fa; font-weight: 600; }
            
            /* Mobile responsiveness */
            @media (max-width: 600px) {
              .email-container { margin: 0; border-radius: 0; }
              .header { padding: 30px 15px; }
              .header h1 { font-size: 24px; }
              .content { padding: 20px 15px; }
              .id-card { padding: 20px; }
              .info-row { flex-direction: column; align-items: flex-start; }
              .info-label { margin-bottom: 8px; font-size: 14px; }
              .info-value { text-align: left; font-size: 14px; }
              .qr-code img { width: 140px; height: 140px; }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <!-- Header -->
            <div class="header">
              <h1>WET-WAR 2025</h1>
              <p>International Conference on Water, Environment, Technology & Waste Management</p>
            </div>
            
            <!-- Content -->
            <div class="content">
              <div class="welcome-text">
                <h2>Welcome to WET-WAR 2025!</h2>
                <p>Dear <strong>${memberData.name}</strong>,</p>
                <p>Thank you for registering. Your ID card is ready.</p>
              </div>
              
              <!-- ID Card -->
              <div class="id-card">
                <div class="id-card-header">
                  <h3>Conference ID Card</h3>
                  <p>WET-WAR 2025</p>
                </div>

                <div class="registration-info">
                  <span class="info-label">Registration Number</span>
                  <span class="info-value">${memberData.registration_number}</span>
                </div>
                
                <div class="member-info">
                  <div class="info-row">
                    <span class="info-label">Name:&nbsp;</span>
                    <span class="info-value">${memberData.name}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Email:&nbsp;</span>
                    <span class="info-value">${memberData.email}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Phone:&nbsp;</span>
                    <span class="info-value">${memberData.phoneNumber || 'Not provided'}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Designation:&nbsp;</span>
                    <span class="info-value">${memberData.designation || 'Not specified'}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Institute:&nbsp;</span>
                    <span class="info-value">${memberData.institute || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              <div class="qr-section">
                <h4>Your QR Code for Entry</h4>
                <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">Scan this for quick check-in at the conference.</p>
                <div class="qr-code">
                  <img src="${qrCodeUrl}" alt="QR Code for ${memberData.registration_number}" />
                </div>
              </div>
              
              <div style="background: #e0f2fe; padding: 20px; border-radius: 10px; margin-top: 30px; border-left: 5px solid #3b82f6;">
                <h4 style="color: #1e3a8a; margin-bottom: 10px;">Important Information</h4>
                <ul style="color: #374151; padding-left: 20px; font-size: 15px;">
                  <li style="margin-bottom: 8px;">Keep this digital ID card with you during the conference.</li>
                  <li style="margin-bottom: 8px;">Present the QR code for entry at each session.</li>
                  <li>This email serves as your official confirmation.</li>
                </ul>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <p><span class="highlight">Conference Date:</span> February 15-17, 2025</p>
              <p><span class="highlight">Venue:</span> NIT Patna, Bihar, India</p>
              <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                This is an automated email from the WET-WAR 2025 Conference System. Please do not reply.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('ID card email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Error sending ID card email:', error);
    return false;
  }
}

export async function sendMemberUpdateEmail(memberData) {
  try {
    const transporter = await createTransporter();
    if (!process.env.SMTP_FROM_EMAIL) {
      console.error('SMTP_FROM_EMAIL environment variable is missing');
      return false;
    }

    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: memberData.email,
      subject: 'WET-WAR 2025 - Member Details Updated',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Member Details Updated</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .email-container { max-width: 600px; margin: 0 auto; background: #f8f9fa; }
            .header { background: linear-gradient(135deg, #059669, #10b981); padding: 30px 20px; text-align: center; }
            .header h1 { color: white; font-size: 24px; font-weight: 700; }
            .content { padding: 30px 20px; }
            .update-box { background: white; border-radius: 10px; padding: 25px; margin: 20px 0; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
            .footer { background: #f1f5f9; padding: 20px; text-align: center; color: #64748b; }
            @media (max-width: 600px) { .email-container { margin: 0; } .header { padding: 20px 15px; } .content { padding: 20px 15px; } }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Member Details Updated</h1>
            </div>
            <div class="content">
              <div class="update-box">
                <h2 style="color: #059669; margin-bottom: 20px;">Hello ${memberData.name}!</h2>
                <p style="margin-bottom: 15px;">Your member details for WET-WAR 2025 have been successfully updated.</p>
                <p style="margin-bottom: 15px;"><strong>Registration Number:</strong> ${memberData.registration_number}</p>
                <p style="margin-bottom: 15px;"><strong>Updated Email:</strong> ${memberData.email}</p>
                <p style="margin-bottom: 15px;"><strong>Updated Phone:</strong> ${memberData.phoneNumber || 'Not provided'}</p>
                <p style="margin-bottom: 15px;"><strong>Updated Designation:</strong> ${memberData.designation || 'Not specified'}</p>
                <p style="margin-bottom: 15px;"><strong>Updated Institute:</strong> ${memberData.institute || 'Not specified'}</p>
                <p style="color: #059669; font-weight: 600;">If you did not request this change, please contact the conference organizers immediately.</p>
              </div>
            </div>
            <div class="footer">
              <p>WET-WAR 2025 Conference System</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Member update email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending member update email:', error);
    return false;
  }
}

export async function sendMemberDeletionEmail(memberData) {
  try {
    const transporter = await createTransporter();
    if (!process.env.SMTP_FROM_EMAIL) {
      console.error('SMTP_FROM_EMAIL environment variable is missing');
      return false;
    }

    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: memberData.email,
      subject: 'WET-WAR 2025 - Registration Cancelled',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Registration Cancelled</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .email-container { max-width: 600px; margin: 0 auto; background: #f8f9fa; }
            .header { background: linear-gradient(135deg, #dc2626, #ef4444); padding: 30px 20px; text-align: center; }
            .header h1 { color: white; font-size: 24px; font-weight: 700; }
            .content { padding: 30px 20px; }
            .cancellation-box { background: white; border-radius: 10px; padding: 25px; margin: 20px 0; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
            .footer { background: #f1f5f9; padding: 20px; text-align: center; color: #64748b; }
            @media (max-width: 600px) { .email-container { margin: 0; } .header { padding: 20px 15px; } .content { padding: 20px 15px; } }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Registration Cancelled</h1>
            </div>
            <div class="content">
              <div class="cancellation-box">
                <h2 style="color: #dc2626; margin-bottom: 20px;">Hello ${memberData.name}!</h2>
                <p style="margin-bottom: 15px;">Your registration for WET-WAR 2025 has been cancelled.</p>
                <p style="margin-bottom: 15px;"><strong>Registration Number:</strong> ${memberData.registration_number}</p>
                <p style="margin-bottom: 15px;">If you believe this was done in error, please contact the conference organizers immediately.</p>
                <p style="color: #dc2626; font-weight: 600;">We hope to see you at future conferences!</p>
              </div>
            </div>
            <div class="footer">
              <p>WET-WAR 2025 Conference System</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Member deletion email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending member deletion email:', error);
    return false;
  }
}
