// utils/sendEmail.js
import dotenv from "dotenv";
import { SendMailClient } from "zeptomail";

dotenv.config();

const client = new SendMailClient({
  url: process.env.ZEPTO_URL,
  token: process.env.ZEPTO_TOKEN,
});

// Send ZeptoMail Template Email

const sendEmail = async ({
  to,
  name,
  subject = "",
  templateKey,
  mergeInfo = {},
}) => {
  try {
    if (!to) {
      throw new Error("Recipient email is required.");
    }

    if (!templateKey) {
      throw new Error("Template key is required.");
    }

    const response = await client.sendMailWithTemplate({
      mail_template_key: templateKey,

      from: {
        address: process.env.ZEPTO_FROM,
        name: "Expocon",
      },
      to: [
        {
          email_address: {
            address: to,
            name,
          },
        },
      ],

      subject,

      merge_info: mergeInfo,
    });

    return response;
  } catch (error) {
    console.error("ZeptoMail Error:", JSON.stringify(error, null, 2));

    throw error;
  }
};

export default sendEmail;
