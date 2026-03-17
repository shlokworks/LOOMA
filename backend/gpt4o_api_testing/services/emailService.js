const nodemailer = require('nodemailer');

// Create transporter — auto-uses Ethereal (fake SMTP) if no EMAIL_USER is set.
// Ethereal emails are NOT delivered; view them at the preview URL logged in the console.
let transporter;

async function getTransporter() {
  if (transporter) return transporter;

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Real SMTP (Gmail, etc.)
    transporter = nodemailer.createTransport({
      host:   process.env.EMAIL_HOST   || 'smtp.gmail.com',
      port:   parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
  } else {
    // Auto-create a free Ethereal test account — no config needed
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host:   'smtp.ethereal.email',
      port:   587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    console.log('📧 Using Ethereal test email account:', testAccount.user);
  }
  return transporter;
}

const FROM = process.env.EMAIL_FROM || `"Looma" <${process.env.EMAIL_USER}>`;
const APP_URL = process.env.APP_URL || 'http://localhost:5173';

/**
 * Send a collaboration invite email.
 * @param {string} toEmail         - recipient email
 * @param {string} inviterName     - name of the person who invited
 * @param {string} projectName     - name of the project
 * @param {string} inviteToken     - unique token for accepting
 */
async function sendInviteEmail(toEmail, inviterName, projectName, inviteToken) {
  const acceptUrl = `${APP_URL}/invite/${inviteToken}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body { margin:0; padding:0; background:#f0f4ff; font-family: 'Segoe UI', Arial, sans-serif; }
    .wrapper { max-width:560px; margin:40px auto; background:#fff; border-radius:16px;
                overflow:hidden; box-shadow:0 4px 24px rgba(59,130,246,0.10); }
    .header { background: linear-gradient(135deg,#3b82f6,#8b5cf6);
               padding:36px 40px 28px; text-align:center; }
    .header .logo { color:#fff; font-size:28px; font-weight:800; letter-spacing:-0.5px; }
    .header .tagline { color:rgba(255,255,255,0.80); font-size:13px; margin-top:4px; }
    .body { padding:36px 40px; }
    .body h2 { color:#1e293b; font-size:20px; margin:0 0 12px; }
    .body p  { color:#475569; font-size:15px; line-height:1.65; margin:0 0 16px; }
    .project-badge { display:inline-block; background:#eff6ff; border:1px solid #bfdbfe;
                      color:#1d4ed8; border-radius:8px; padding:6px 14px;
                      font-size:14px; font-weight:600; margin-bottom:28px; }
    .btn { display:block; text-align:center; background:linear-gradient(135deg,#3b82f6,#8b5cf6);
            color:#fff !important; text-decoration:none; font-weight:700;
            font-size:15px; padding:14px 32px; border-radius:10px;
            margin:0 auto 28px; width:fit-content; }
    .note { color:#94a3b8; font-size:12px; text-align:center; }
    .footer { background:#f8fafc; padding:20px 40px; text-align:center;
               color:#94a3b8; font-size:12px; border-top:1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">Looma</div>
      <div class="tagline">AI-Powered Code Generation Platform</div>
    </div>
    <div class="body">
      <h2>You've been invited to collaborate!</h2>
      <p>
        <strong>${inviterName}</strong> has invited you to collaborate on a project in Looma.
      </p>
      <p>Project:</p>
      <div class="project-badge">📁 ${projectName}</div>
      <p>
        Click the button below to accept the invitation and start collaborating
        with real-time editing — like Google Docs, but for code.
      </p>
      <a class="btn" href="${acceptUrl}">Accept Invitation →</a>
      <p class="note">
        This link will expire in 7 days. If you don't have a Looma account yet,
        you'll be asked to create one first.
      </p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Looma · AI-Powered Development Platform<br/>
      If you didn't expect this invitation, you can safely ignore this email.
    </div>
  </div>
</body>
</html>`;

  const t = await getTransporter();
  const info = await t.sendMail({
    from:    FROM,
    to:      toEmail,
    subject: `${inviterName} invited you to "${projectName}" on Looma`,
    html,
    text: `${inviterName} invited you to collaborate on "${projectName}" in Looma.\n\nAccept here: ${acceptUrl}`,
  });

  // If using Ethereal, log the preview URL so you can see the email in your browser
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`📧 Email preview (Ethereal): ${previewUrl}`);
  }
}

module.exports = { sendInviteEmail };
