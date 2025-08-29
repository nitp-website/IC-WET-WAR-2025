import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

export async function generateQRCode(data, filename) {
  try {
    const qrCodePath = path.join(process.cwd(), 'public', 'qrcodes', filename);
    
    // Ensure directory exists
    const dir = path.dirname(qrCodePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    await QRCode.toFile(qrCodePath, data, {
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 200,
      margin: 2
    });
    
    return qrCodePath;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

export async function generateIDCard(memberData, qrCodePath) {
  try {
    const idCardPath = path.join(process.cwd(), 'public', 'idcards', `${memberData.registration_number}.html`);
    
    // Ensure directory exists
    const dir = path.dirname(idCardPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WET-WAR 2025 - ID Card</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .id-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            padding: 30px;
            max-width: 400px;
            width: 100%;
            text-align: center;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            margin: -30px -30px 20px -30px;
            border-radius: 15px 15px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
          }
          .header p {
            margin: 5px 0 0 0;
            opacity: 0.9;
          }
          .profile-section {
            margin: 20px 0;
          }
          .profile-section img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: 4px solid #667eea;
            margin-bottom: 15px;
          }
          .member-info {
            text-align: left;
            margin: 20px 0;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .info-label {
            font-weight: bold;
            color: #666;
          }
          .info-value {
            color: #333;
          }
          .qr-section {
            margin: 20px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
          }
          .qr-section img {
            width: 120px;
            height: 120px;
            margin: 10px auto;
            display: block;
          }
          .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="id-card">
          <div class="header">
            <h1>WET-WAR 2025</h1>
            <p>International Conference on Water, Environment, Technology & Waste Management</p>
          </div>
          
          <div class="profile-section">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: #667eea; margin: 0 auto 15px auto; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; font-weight: bold;">
              ${memberData.name.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <div class="member-info">
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span class="info-value">${memberData.name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Registration No:</span>
              <span class="info-value">${memberData.registration_number}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Designation:</span>
              <span class="info-value">${memberData.designation}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Institute:</span>
              <span class="info-value">${memberData.institute}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${memberData.email}</span>
            </div>
          </div>
          
          <div class="qr-section">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">QR Code for Verification</p>
            <img src="data:image/png;base64,${await QRCode.toDataURL(memberData.registration_number)}" alt="QR Code">
          </div>
          
          <div class="footer">
            <p>This ID card is valid for WET-WAR 2025 Conference</p>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    fs.writeFileSync(idCardPath, htmlContent);
    return idCardPath;
  } catch (error) {
    console.error('Error generating ID card:', error);
    throw error;
  }
}
