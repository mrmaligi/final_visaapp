// Email notification service using Supabase Edge Functions or external service
// This can be integrated with Resend, SendGrid, AWS SES, or similar

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface PaymentConfirmationData {
  userEmail: string;
  userName: string;
  amount: number;
  currency: string;
  description: string;
  paymentId: string;
  date: string;
}

export interface BookingConfirmationData {
  userEmail: string;
  userName: string;
  lawyerName: string;
  visaType: string;
  duration: number;
  scheduledDate: string;
  scheduledTime: string;
  amount: number;
  meetingLink?: string;
}

export interface ConsultationReminderData {
  userEmail: string;
  userName: string;
  lawyerName: string;
  visaType: string;
  duration: number;
  scheduledDate: string;
  scheduledTime: string;
  meetingLink?: string;
}

// Send payment confirmation email
export async function sendPaymentConfirmationEmail(
  data: PaymentConfirmationData
): Promise<void> {
  const emailData: EmailData = {
    to: data.userEmail,
    subject: `Payment Confirmation - ${data.description}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0052cc; color: white; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Payment Confirmed</h1>
        </div>
        <div style="padding: 24px; background: #ffffff;">
          <p style="font-size: 16px; color: #333;">Dear ${data.userName},</p>
          <p style="font-size: 16px; color: #333;">Thank you for your payment. Here are your transaction details:</p>
          
          <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;">Description:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${data.description}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Amount:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${data.currency} ${data.amount.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Payment ID:</td>
                <td style="padding: 8px 0; text-align: right; font-family: monospace;">${data.paymentId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Date:</td>
                <td style="padding: 8px 0; text-align: right;">${data.date}</td>
              </tr>
            </table>
          </div>
          
          <p style="font-size: 14px; color: #666;">If you have any questions, please contact our support team.</p>
        </div>
        <div style="background: #f5f5f5; padding: 16px; text-align: center; color: #999; font-size: 12px;">
          <p>This is an automated email from VisaHelper. Please do not reply to this email.</p>
        </div>
      </div>
    `,
    text: `
Payment Confirmed

Dear ${data.userName},

Thank you for your payment. Here are your transaction details:

Description: ${data.description}
Amount: ${data.currency} ${data.amount.toFixed(2)}
Payment ID: ${data.paymentId}
Date: ${data.date}

If you have any questions, please contact our support team.
    `
  };

  await sendEmail(emailData);
}

// Send booking confirmation email
export async function sendBookingConfirmationEmail(
  data: BookingConfirmationData
): Promise<void> {
  const emailData: EmailData = {
    to: data.userEmail,
    subject: 'Consultation Booking Confirmed',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0052cc; color: white; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Booking Confirmed</h1>
        </div>
        <div style="padding: 24px; background: #ffffff;">
          <p style="font-size: 16px; color: #333;">Dear ${data.userName},</p>
          <p style="font-size: 16px; color: #333;">Your consultation has been successfully booked!</p>
          
          <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0052cc;">Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;">Lawyer:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${data.lawyerName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Visa Type:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${data.visaType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Duration:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${data.duration} minutes</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Date:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${data.scheduledDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Time:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${data.scheduledTime}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Amount Paid:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">$${data.amount.toFixed(2)}</td>
              </tr>
            </table>
          </div>
          
          ${data.meetingLink ? `
          <div style="background: #e8f5e9; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
            <h3 style="margin-top: 0; color: #2e7d32;">Meeting Link</h3>
            <p style="margin-bottom: 0;">
              <a href="${data.meetingLink}" style="color: #0052cc; text-decoration: none; font-weight: bold;">
                Join Video Call
              </a>
            </p>
            <p style="font-size: 12px; color: #666; margin-top: 8px;">The link will be active 5 minutes before your scheduled time.</p>
          </div>
          ` : ''}
          
          <div style="background: #fff3e0; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff9800;">
            <p style="margin: 0; font-size: 14px; color: #333;">
              <strong>Reminder:</strong> You will receive a reminder email 24 hours before your consultation.
            </p>
          </div>
          
          <p style="font-size: 14px; color: #666;">If you need to reschedule or cancel, please visit your dashboard.</p>
        </div>
        <div style="background: #f5f5f5; padding: 16px; text-align: center; color: #999; font-size: 12px;">
          <p>This is an automated email from VisaHelper. Please do not reply to this email.</p>
        </div>
      </div>
    `,
    text: `
Booking Confirmed

Dear ${data.userName},

Your consultation has been successfully booked!

Booking Details:
- Lawyer: ${data.lawyerName}
- Visa Type: ${data.visaType}
- Duration: ${data.duration} minutes
- Date: ${data.scheduledDate}
- Time: ${data.scheduledTime}
- Amount Paid: $${data.amount.toFixed(2)}

${data.meetingLink ? `Meeting Link: ${data.meetingLink}` : ''}

You will receive a reminder email 24 hours before your consultation.
If you need to reschedule or cancel, please visit your dashboard.
    `
  };

  await sendEmail(emailData);
}

// Send consultation reminder email
export async function sendConsultationReminderEmail(
  data: ConsultationReminderData
): Promise<void> {
  const emailData: EmailData = {
    to: data.userEmail,
    subject: 'Reminder: Upcoming Consultation Tomorrow',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ff9800; color: white; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Consultation Reminder</h1>
        </div>
        <div style="padding: 24px; background: #ffffff;">
          <p style="font-size: 16px; color: #333;">Dear ${data.userName},</p>
          <p style="font-size: 16px; color: #333;">This is a friendly reminder about your upcoming consultation tomorrow.</p>
          
          <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0052cc;">Consultation Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;">Lawyer:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${data.lawyerName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Visa Type:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${data.visaType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Duration:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${data.duration} minutes</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Date:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${data.scheduledDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Time:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${data.scheduledTime}</td>
              </tr>
            </table>
          </div>
          
          ${data.meetingLink ? `
          <div style="background: #e8f5e9; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
            <h3 style="margin-top: 0; color: #2e7d32;">Join Your Consultation</h3>
            <p style="margin-bottom: 0;">
              <a href="${data.meetingLink}" style="color: #0052cc; text-decoration: none; font-weight: bold;">
                Click here to join the video call
              </a>
            </p>
            <p style="font-size: 12px; color: #666; margin-top: 8px;">The link will be active 5 minutes before your scheduled time.</p>
          </div>
          ` : '<p style="font-size: 14px; color: #666;">You will receive the meeting link shortly before your consultation.</p>'}
          
          <div style="background: #e3f2fd; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
            <h4 style="margin-top: 0; color: #1976d2;">Preparation Tips</h4>
            <ul style="margin-bottom: 0; padding-left: 20px;">
              <li>Test your camera and microphone beforehand</li>
              <li>Prepare your questions in advance</li>
              <li>Have relevant documents ready</li>
              <li>Join the call a few minutes early</li>
            </ul>
          </div>
        </div>
        <div style="background: #f5f5f5; padding: 16px; text-align: center; color: #999; font-size: 12px;">
          <p>This is an automated email from VisaHelper. Please do not reply to this email.</p>
        </div>
      </div>
    `,
    text: `
Consultation Reminder

Dear ${data.userName},

This is a friendly reminder about your upcoming consultation tomorrow.

Consultation Details:
- Lawyer: ${data.lawyerName}
- Visa Type: ${data.visaType}
- Duration: ${data.duration} minutes
- Date: ${data.scheduledDate}
- Time: ${data.scheduledTime}

${data.meetingLink ? `Meeting Link: ${data.meetingLink}` : 'You will receive the meeting link shortly before your consultation.'}

Preparation Tips:
- Test your camera and microphone beforehand
- Prepare your questions in advance
- Have relevant documents ready
- Join the call a few minutes early
    `
  };

  await sendEmail(emailData);
}

// Send email to lawyer about new booking
export async function sendLawyerBookingNotification(
  lawyerEmail: string,
  lawyerName: string,
  clientName: string,
  visaType: string,
  scheduledDate: string,
  scheduledTime: string,
  duration: number,
  notes?: string
): Promise<void> {
  const emailData: EmailData = {
    to: lawyerEmail,
    subject: 'New Consultation Booking',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0052cc; color: white; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">New Booking</h1>
        </div>
        <div style="padding: 24px; background: #ffffff;">
          <p style="font-size: 16px; color: #333;">Dear ${lawyerName},</p>
          <p style="font-size: 16px; color: #333;">You have a new consultation booking!</p>
          
          <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0052cc;">Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;">Client:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${clientName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Visa Type:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${visaType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Duration:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${duration} minutes</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Date:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${scheduledDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Time:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${scheduledTime}</td>
              </tr>
            </table>
            
            ${notes ? `
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #ddd;">
              <h4 style="margin-top: 0; color: #666;">Client Notes:</h4>
              <p style="color: #333; font-style: italic;">${notes}</p>
            </div>
            ` : ''}
          </div>
          
          <p style="font-size: 14px; color: #666;">Please review the client details in your dashboard.</p>
        </div>
        <div style="background: #f5f5f5; padding: 16px; text-align: center; color: #999; font-size: 12px;">
          <p>This is an automated email from VisaHelper. Please do not reply to this email.</p>
        </div>
      </div>
    `,
    text: `
New Booking

Dear ${lawyerName},

You have a new consultation booking!

Booking Details:
- Client: ${clientName}
- Visa Type: ${visaType}
- Duration: ${duration} minutes
- Date: ${scheduledDate}
- Time: ${scheduledTime}

${notes ? `Client Notes: ${notes}` : ''}

Please review the client details in your dashboard.
    `
  };

  await sendEmail(emailData);
}

// Base email sending function
async function sendEmail(emailData: EmailData): Promise<void> {
  // For now, log the email (in production, this would call an email service)
  console.log('📧 Sending email:', {
    to: emailData.to,
    subject: emailData.subject,
  });

  // In production, you would integrate with:
  // - Resend (recommended for Next.js)
  // - SendGrid
  // - AWS SES
  // - Postmark
  // - Or Supabase Edge Functions

  // Example with Resend (would need @resend/node package):
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'noreply@visahelper.com',
  //   ...emailData
  // });

  // For now, we'll just log it
  console.log('Email HTML length:', emailData.html.length);
}
