import nodemailer from 'nodemailer';
import { getRandomHREmails} from '@/data/hrEmails';

/* -------------------------------------------------------
   EMAIL CONFIG INTERFACE
------------------------------------------------------- */

export interface EmailConfig {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content?: Buffer | string;
    path?: string;
    contentType?: string;
  }>;
}

/* -------------------------------------------------------
   TRANSPORTER CONFIG
------------------------------------------------------- */
export const createEmailTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASS;
  const emailHost = process.env.EMAIL_HOST || "smtp.gmail.com";
  const emailPort = parseInt(process.env.EMAIL_PORT || "587");

  if (!emailUser || !emailPassword) {
    throw new Error("❌ Missing EMAIL_USER or EMAIL_PASSWORD in .env");
  }

  return nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: emailPort === 465,
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });
};

/* -------------------------------------------------------
   SEND SINGLE EMAIL
------------------------------------------------------- */
export const sendEmail = async (config: EmailConfig): Promise<boolean> => {
  try {
    const transporter = createEmailTransporter();

    const info = await transporter.sendMail({
      from: config.from,
      to: config.to,
      subject: config.subject,
      html: config.html,
      text: config.text || config.html.replace(/<[^>]*>/g, ""),
      attachments: config.attachments,
    });

    // console.log(`✅ Email sent successfully to ${config.to}: ${info.messageId}`);
    return true;
  } catch (error: any) {
    // console.error(`❌ Error sending email to ${config.to}:`, error.message);
    return false;
  }
};

/* -------------------------------------------------------
   SEND BULK EMAILS (NO DELAY)
------------------------------------------------------- */
export const sendBulkEmails = async (
  configs: EmailConfig[],
  onProgress?: (current: number, total: number) => void
): Promise<{ sent: number; failed: number; results: boolean[] }> => {
  let sent = 0;
  let failed = 0;
  const results: boolean[] = [];

  //console.log(`📧 Sending ${configs.length} emails...`);

  const transporter = createEmailTransporter();

  for (let i = 0; i < configs.length; i++) {
    try {
      const info = await transporter.sendMail({
        from: configs[i].from,
        to: configs[i].to,
        subject: configs[i].subject,
        html: configs[i].html,
        text: configs[i].text || configs[i].html.replace(/<[^>]*>/g, ""),
        attachments: configs[i].attachments,
      });
     // console.log(`✅ Sent ${i + 1}/${configs.length} → ${configs[i].to}: ${info.messageId}`);
      sent++;
      results.push(true);
    } catch (err: any) {
      // console.error(`❌ Failed ${i + 1}/${configs.length} → ${configs[i].to}: ${err.message}`);
      failed++;
      results.push(false);
    }

    if (onProgress) onProgress(i + 1, configs.length);
  }

  //console.log(`✅ Bulk complete: ${sent} sent, ${failed} failed`);
  return { sent, failed, results };
};

/* -------------------------------------------------------
   EMAIL TEMPLATE
------------------------------------------------------- */
export const generateJobApplicationEmail = (
  candidateName: string,
  jobTitle: string,
  resumeUrl?: string
): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
    }
    .content {
      padding: 20px;
    }
    .signature {
      margin-top: 20px;
    }
    .button {
      display: inline-block;
      background: #0066cc;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
      margin: 15px 0;
    }
  </style>
</head>
<body>
  <div class="content">
    <p>Dear Hiring Manager,</p>
    <p>I hope this email finds you well.</p>
    <p>I am writing to express my interest in the <strong>${jobTitle}</strong> position at your organization.</p>
    <p>Please find my resume attached below or via the link below:</p>
    ${resumeUrl ? `<p style="text-align: center;"><a href="${resumeUrl}" class="button">View My Resume</a></p>` : ""}
    <p>Looking forward to hearing from you.</p>
    <div class="signature">
      <p>Best regards,<br><strong>${candidateName}</strong></p>
    </div>
  </div>
</body>
</html>
  `.trim();
};

/* -------------------------------------------------------
   DEMO EXECUTION (Run directly with ts-node)
------------------------------------------------------- */
if (require.main === module) {
  (async () => {
    try {
      const hrList = getRandomHREmails(3); // Pick 3 random HRs
      const emails = hrList.map((to) => ({
        from: process.env.EMAIL_USER!,
        to,
        subject: "Application for Software Developer Role",
        html: generateJobApplicationEmail(
          "Syed Omer Ali",
          "Software Developer",
          "https://example.com/resume"
        ),
      }));

      const result = await sendBulkEmails(emails, (cur, total) =>
         console.log(`Progress: ${cur}/${total}`)
      );
      // console.log("Final result:", result);
    } catch (err) {
      console.error("Error:", err);
    }
  })();
}