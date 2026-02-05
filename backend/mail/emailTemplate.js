export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your AuthB Account</title>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #eaf3f2; 
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
      border: 3px solid #4CAF50; /* added border */
    }
    .header {
      background: linear-gradient(90deg, #4CAF50 0%, #2e7d32 100%);
      padding: 25px;
      text-align: center;
      color: #fff;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: 1px;
    }
    .sub-header {
      font-size: 14px;
      color: #d1f0d1;
      margin-top: 5px;
    }
    .content {
      padding: 35px 40px;
      font-size: 16px;
      color: #333;
    }
    .verification-code {
      display: block;
      margin: 30px auto;
      font-size: 38px;
      font-weight: 700;
      letter-spacing: 10px;
      color: #2e7d32;
      text-align: center;
      padding: 15px 0;
      border: 2px dashed #4CAF50;
      border-radius: 10px;
      background-color: #f0faf0;
      user-select: all;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #888888;
      padding: 20px 30px;
      background-color: #f4f6f8;
    }
    a {
      color: #4CAF50;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container" role="main">
    <div class="header">
      Verify Your AuthB Account
      <div class="sub-header">Secure. Fast. Reliable.</div>
    </div>
    <div class="content">
      <p>Hello {username},</p>
      <p>Welcome to <strong>AuthB</strong>! To complete your registration, please use the verification code below:</p>
      <span class="verification-code">{verificationCode}</span>
      <p>This code will expire in <strong>2 minutes</strong> for your security.</p>
      <p>If you didn't sign up for an AuthB account, you can safely ignore this email.</p>
      <p>Thank you for trusting AuthB,<br>The AuthB Team</p>
    </div>
    <div class="footer" role="contentinfo">
      <p>© ${new Date().getFullYear()} AuthB · All rights reserved</p>
      <p>This is an automated message. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your AuthB Password</title>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #eaf3f2;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
      border: 3px solid #4CAF50;
    }
    .header {
      background: linear-gradient(90deg, #4CAF50 0%, #2e7d32 100%);
      padding: 25px;
      text-align: center;
      color: #fff;
      font-size: 24px;
      font-weight: 700;
    }
    .sub-header {
      font-size: 14px;
      color: #d1f0d1;
      margin-top: 5px;
    }
    .content {
      padding: 35px 40px;
      font-size: 16px;
      color: #333;
    }
    .reset-button {
      display: inline-block;
      background-color: #4CAF50;
      color: #fff;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin: 30px 0;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #888888;
      padding: 20px 30px;
      background-color: #f4f6f8;
    }
    a {
      color: #4CAF50;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container" role="main">
    <div class="header">
      Reset Your Password
      <div class="sub-header">Secure. Fast. Reliable.</div>
    </div>
    <div class="content">
      <p>We received a request to reset your password. If you didn't request this, you can safely ignore this email.</p>
      <p>To reset your password, click the button below:</p>
      <p style="text-align: center;">
        <a href="{resetURL}" class="reset-button">Reset Password</a>
      </p>
      <p>This link will expire in <strong>15 minutes</strong> for your security.</p>
      <p>Best regards,<br>The AuthB Team</p>
    </div>
    <div class="footer" role="contentinfo">
      <p>© ${new Date().getFullYear()} AuthB · All rights reserved</p>
      <p>This is an automated message. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;
export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #eaf3f2;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
      border: 3px solid #4CAF50;
    }
    .header {
      background: linear-gradient(90deg, #4CAF50 0%, #2e7d32 100%);
      padding: 25px;
      text-align: center;
      color: #fff;
      font-size: 24px;
      font-weight: 700;
    }
    .sub-header {
      font-size: 14px;
      color: #d1f0d1;
      margin-top: 5px;
    }
    .content {
      padding: 35px 40px;
      font-size: 16px;
      color: #333;
    }
    .success-box {
      background-color: #e0f5e9;
      border-left: 5px solid #4CAF50;
      padding: 15px 20px;
      margin: 20px 0;
      border-radius: 5px;
      font-weight: 600;
      color: #2e7d32;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #888888;
      padding: 20px 30px;
      background-color: #f4f6f8;
    }
    ul {
      padding-left: 20px;
    }
  </style>
</head>
<body>
  <div class="container" role="main">
    <div class="header">
      Password Reset Successful
      <div class="sub-header">Secure. Fast. Reliable.</div>
    </div>
    <div class="content">
      <p>Hello, {username}</p>
      <div class="success-box">
        Your password has been successfully reset.
      </div>
      <p>If you did not initiate this password reset, please contact our support team immediately.</p>
      <p>For security reasons, we recommend that you:</p>
      <ul>
        <li>Use a strong, unique password.</li>
        <li>Enable two-factor authentication if available.</li>
        <li>Avoid using the same password across multiple sites.</li>
      </ul>
      <p>Thank you for helping us keep your account secure.</p>
      <p>Best regards,<br>The AuthB Team</p>
    </div>
    <div class="footer" role="contentinfo">
      <p>© ${new Date().getFullYear()} AuthB · All rights reserved</p>
      <p>This is an automated message. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;


export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to AuthB</title>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: #eaf3f2;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
      border: 3px solid #4CAF50;
    }
    .header {
      background: linear-gradient(90deg, #4CAF50 0%, #2e7d32 100%);
      padding: 30px 24px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 26px;
      font-weight: 700;
    }
    .header p {
      margin: 8px 0 0;
      font-size: 14px;
      color: #d1f0d1;
    }
    .content {
      padding: 35px 40px;
      font-size: 16px;
      color: #333;
    }
    .dashboard-button {
      display: inline-block;
      background-color: #4CAF50;
      color: white;
      padding: 14px 28px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: bold;
      margin: 30px 0;
    }
    a {
      color: #4CAF50;
      text-decoration: none;
      font-weight: 600;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #888888;
      padding: 20px 30px;
      background-color: #f4f6f8;
    }
    ul {
      padding-left: 20px;
      margin: 10px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to AuthB</h1>
      <p>Authentication. Simplified.</p>
    </div>
    <div class="content">
      <p>Hi {userName},</p>
      <p>Thank you for signing up to <strong>AuthB</strong>, your secure and easy-to-use authentication API platform.</p>
      <p>To get started, log in to your dashboard where you can:</p>
      <ul>
        <li>🔑 Generate and manage your API keys securely</li>
        <li>⚙️ Configure authentication settings</li>
        <li>📚 Access detailed API documentation and SDKs</li>
      </ul>
      <p style="text-align: center;">
        <a href="{dashboardUrl}" class="dashboard-button">Go to your Dashboard</a>
      </p>
      <p style="text-align: center;">
        Or check out the <a href="https://authb.dev/docs">API Documentation</a> to learn how to integrate AuthB into your apps.
      </p>
      <p>If you have any questions or need assistance, feel free to contact our support team anytime.</p>
      <p>Welcome aboard,<br>The AuthB Team</p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} AuthB · All rights reserved
    </div>
  </div>
</body>
</html>
`;


