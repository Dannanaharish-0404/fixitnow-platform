const { Resend } = require('resend'); 
require('dotenv').config(); 
 
const resend = new Resend(process.env.RESEND_API_KEY); 
 
console.log('Starting email test...'); 
 
async function sendTestEmail() { 
  try { 
    console.log('Sending test email...'); 
    const data = await resend.emails.send({ 
      from: 'onboarding@resend.dev', 
      to: 'harishharish2686@gmail.com', 
      subject: 'Test from Command Prompt', 
    }); 
    console.log('? Email sent successfully!'); 
  } catch (error) { 
    console.error('? Error:', error.message); 
  } 
} 
 
sendTestEmail(); 
