import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, code: string) => {
  try {
    const verificationLink = `${process.env.NEXT_PUBLIC__DOMAIN}/verify-email?code=${code}&email=${encodeURIComponent(email)}`;

    const mailOptions = {
      from: `Job Search <${process.env.EMAIL_FROM}>`,
      to: [email],
      subject: 'Verify your email',
      html: `
        <h1>Welcome to Job Search!</h1>
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>This code expires in 24 hours.</p>
        <a href="${verificationLink}">
          Click here to verify automatically
        </a>
      `,
    };

    const info = await resend.emails.send(mailOptions);
    return { success: true, info };
  } catch (err) {
    console.error('Email failed to send:', err);
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
};