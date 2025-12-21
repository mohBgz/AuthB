import { transporter, senderEmail, sesClient } from "./email.config.js";
import { SendEmailCommand } from "@aws-sdk/client-ses";

import {
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplate.js";

export async function sendVerificationEmail(username, email, verificationCode) {
  const params = {
    Source: process.env.SES_FROM_EMAIL, // Must be verified
    Destination: {
      ToAddresses: [email], // Your test email
    },
    Message: {
      Subject: {
        Data: "Verify Email",
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: VERIFICATION_EMAIL_TEMPLATE.replace(
            "{username}",
            username
          ).replace("{verificationCode}", verificationCode),
          Charset: "UTF-8",
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const result = await sesClient.send(command);
    console.log("✅ Verification Email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error.message);

    // Common error handling
    if (error.name === "MessageRejected") {
      console.log("💡 Make sure your email is verified in SES");
    }
    if (error.name === "CredentialsError") {
      console.log("💡 Check your AWS credentials");
    }

    throw new Error(`"Error sending email:"${error}`);
  }
}

export async function sendWelcomeEmail(email, name) {
  if (!process.env.SES_FROM_EMAIL) {
    throw new Error("SES_FROM_EMAIL is not defined in environment variables");
  }

  const params = {
    Source: process.env.SES_FROM_EMAIL, // Must be verified
    Destination: {
      ToAddresses: [email], // Your test email
    },
    Message: {
      Subject: {
        Data: "Welcome to AuthB",
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: WELCOME_EMAIL_TEMPLATE.replace("{userName}", name),
          Charset: "UTF-8",
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const result = await sesClient.send(command);
    console.log("✅ Welcome Email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error.message);

    // Common error handling
    if (error.name === "MessageRejected") {
      console.log("💡 Make sure your email is verified in SES");
    }
    if (error.name === "CredentialsError") {
      console.log("💡 Check your AWS credentials");
    }

    throw new Error(`"Error sending email:"${error}`);
  }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
  if (!process.env.SES_FROM_EMAIL) {
    throw new Error("SES_FROM_EMAIL is not defined in environment variables");
  }
  const params = {
    Source: process.env.SES_FROM_EMAIL, // Must be verified
    Destination: {
      ToAddresses: [email], // Your test email
    },
    Message: {
      Subject: {
        Data: "Reset Password",
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
          Charset: "UTF-8",
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const result = await sesClient.send(command);
    console.log("✅ Reset Password sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error.message);

    // Common error handling
    if (error.name === "MessageRejected") {
      console.log("💡 Make sure your email is verified in SES");
    }
    if (error.name === "CredentialsError") {
      console.log("💡 Check your AWS credentials");
    }

    throw new Error(`"Error sending email:"${error}`);
  }
};

export const sendResetSuccessfulEmail = async (email, username) => {
  if (!process.env.SES_FROM_EMAIL) {
    throw new Error("SES_FROM_EMAIL is not defined in environment variables");
  }
  const params = {
    Source: process.env.SES_FROM_EMAIL, // Must be verified
    Destination: {
      ToAddresses: [email], // Your test email
    },
    Message: {
      Subject: {
        Data: "Password has been changed",
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: PASSWORD_RESET_SUCCESS_TEMPLATE.replace("{username}", username),
          Charset: "UTF-8",
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const result = await sesClient.send(command);
    console.log("✅ Reset Password succesful sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error.message);

    // Common error handling
    if (error.name === "MessageRejected") {
      console.log("💡 Make sure your email is verified in SES");
    }
    if (error.name === "CredentialsError") {
      console.log("💡 Check your AWS credentials");
    }

    throw new Error(`"Error sending email:"${error}`);
  }
};
