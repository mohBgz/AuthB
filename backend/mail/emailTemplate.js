export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Verify Your Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 6px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(90deg, #4caf50 0%, #2e7d32 100%);
      padding: 20px;
      text-align: center;
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
    }
    .content {
      padding: 30px 40px;
      font-size: 16px;
      color: #333333;
    }
    .verification-code {
      display: block;
      margin: 30px auto;
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #4caf50;
      text-align: center;
      user-select: all;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #888888;
      padding: 20px 40px;
    }
  </style>
</head>
<body>
  <div class="container" role="main">
    <div class="header">
      Verify your email
    </div>
    <div class="content">
      <p>Hello {username},</p>
      <p>Thank you for signing up to <strong>AuthB</strong>! Your verification code is:</p>
      <span class="verification-code">{verificationCode}</span>
      <p>Please enter this code on the verification page to complete your registration.</p>
      <p>This code will expire in 2 minutes for security reasons.</p>
      <p>If you did not create an account with <strong>AuthB</strong>, please ignore this message.</p>
      <p>Best regards,<br />The AuthB Team</p>
    </div>
    <div class="footer" role="contentinfo">
      <p>This is an automated message from AuthB — please do not reply to this email.</p>
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
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello, {username}</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
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
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p>This link will expire in 15 minutes for security reasons.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
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
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f7f5; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
    <header style="background: linear-gradient(to right, #4CAF50, #45a049); color: white; padding: 30px 24px; text-align: center;">
      <h1 style="margin: 0;">Welcome to AuthB</h1>
      <p style="margin: 8px 0 0;">Authentication. Simplified.</p>
    </header>
    <main style="padding: 24px; color: #333;">
      <p>Hi {userName},</p>

      <p>Thank you for signing up to <strong>AuthB</strong>, your secure and easy-to-use authentication API platform.</p>

      <p>To get started, log in to your dashboard where you can:</p>
      <ul style="padding-left: 20px;">
        <li>🔑 Generate and manage your API keys securely</li>
        <li>⚙️ Configure authentication settings</li>
        <li>📚 Access detailed API documentation and SDKs</li>
      </ul>

      <p style="text-align: center; margin: 30px 0;">
        <a href="{dashboardUrl}" style="background-color: #4CAF50; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
          Go to your Dashboard
        </a>
      </p>

      <p style="text-align: center;">
        Or check out the <a href="https://authb.dev/docs" style="color: #4CAF50; font-weight: bold;">API Documentation</a> to learn how to integrate AuthB into your apps.</p>

      <p>If you have any questions or need assistance, feel free to contact our support team anytime.</p>

      <p>Welcome aboard,<br>The AuthB Team</p>
    </main>
    <footer style="text-align: center; font-size: 12px; color: #888; padding: 16px;">
      © ${new Date().getFullYear()} AuthB · All rights reserved
    </footer>
  </div>
</body>
</html>

`;
