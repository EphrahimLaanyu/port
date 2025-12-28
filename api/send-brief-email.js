const { Resend } = require('resend');

// Use VITE_ prefix for client, but for backend/Vercel, 
// simply use the name you set in the Vercel Dashboard
const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;

    await resend.emails.send({
      from: 'J&E Maison <elaanyu@gmail.com.com>',
      to: data.email,
      subject: `Project Brief Received - ${data.client_name}`,
      html: `
        <div style="background-color: #EAE8E4; padding: 60px; font-family: serif; color: #1a1a1a;">
          <h1 style="border-bottom: 1px solid #1a1a1a; padding-bottom: 20px;">J&E Maison</h1>
          <p style="font-size: 24px; font-style: italic;">Thank you for your Project Brief, ${data.client_name}.</p>
          <p style="font-family: monospace; font-size: 12px; margin-bottom: 40px;">STATUS: RECEIVED // UNDER_REVIEW</p>
          <p>Expect a detailed response within 2-3 business days.</p>
        </div>
      `
    });

    return res.status(200).json({ message: 'Transmission Successful' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};