const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Twilio configuration
const twilioClient = process.env.TWILIO_ACCOUNT_SID ? 
  twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) : 
  null;

// Send email alert
async function sendEmailAlert(alert, subscriber) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️ Email not configured. Skipping email notification.');
    return { success: false, error: 'Email not configured' };
  }

  try {
    const lang = subscriber.preferredLanguage || 'en';
    const title = alert.titleTranslations?.[lang] || alert.title;
    const description = alert.descriptionTranslations?.[lang] || alert.description;
    const safetyInstructions = alert.safetyTranslations?.[lang] || alert.safetyInstructions;

    const mailOptions = {
      from: `"Disaster Alert System" <${process.env.EMAIL_USER}>`,
      to: subscriber.email,
      subject: `🚨 DISASTER ALERT: ${title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #dc3545; border-radius: 10px;">
          <h1 style="color: #dc3545; text-align: center;">⚠️ DISASTER ALERT</h1>
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #856404; margin-top: 0;">${title}</h2>
            <p><strong>Type:</strong> ${alert.type}</p>
            <p><strong>Severity:</strong> <span style="color: ${getSeverityColor(alert.severity)}; font-weight: bold;">${alert.severity}</span></p>
            <p><strong>Location:</strong> ${alert.location}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3>Description:</h3>
            <p>${description}</p>
          </div>
          
          <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #155724; margin-top: 0;">🛡️ Safety Instructions:</h3>
            <p>${safetyInstructions}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.SITE_URL || 'http://localhost:3000'}/alerts/${alert._id}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Full Details
            </a>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 12px; text-align: center;">
            You received this alert because you subscribed to Disaster Alert System.<br>
            <a href="${process.env.SITE_URL || 'http://localhost:3000'}/unsubscribe?email=${subscriber.email}">Unsubscribe</a>
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${subscriber.email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email failed to ${subscriber.email}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Send WhatsApp alert
async function sendWhatsAppAlert(alert, subscriber) {
  if (!twilioClient || !process.env.TWILIO_PHONE_NUMBER) {
    console.log('⚠️ Twilio not configured. Skipping WhatsApp notification.');
    return { success: false, error: 'Twilio not configured' };
  }

  if (!subscriber.phone || !subscriber.whatsappEnabled) {
    return { success: false, error: 'No phone number or WhatsApp not enabled' };
  }

  try {
    const lang = subscriber.preferredLanguage || 'en';
    const title = alert.titleTranslations?.[lang] || alert.title;
    
    const message = `
🚨 *DISASTER ALERT*

*${title}*
Type: ${alert.type}
Severity: ${alert.severity}
Location: ${alert.location}

Stay safe! Check email for details.
    `;

    const response = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `whatsapp:${subscriber.phone}`
    });

    console.log(`✅ WhatsApp sent to ${subscriber.phone}: ${response.sid}`);
    return { success: true, messageId: response.sid };
  } catch (error) {
    console.error(`❌ WhatsApp failed to ${subscriber.phone}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Helper function for severity colors
function getSeverityColor(severity) {
  const colors = {
    'Low': '#28a745',
    'Medium': '#ffc107',
    'High': '#fd7e14',
    'Critical': '#dc3545'
  };
  return colors[severity] || '#6c757d';
}

// Send alert to all subscribers
async function broadcastAlert(alert, subscribers) {
  const results = {
    email: { sent: 0, failed: 0, errors: [] },
    whatsapp: { sent: 0, failed: 0, errors: [] }
  };

  for (const subscriber of subscribers) {
    // Send Email
    if (subscriber.email) {
      const emailResult = await sendEmailAlert(alert, subscriber);
      if (emailResult.success) {
        results.email.sent++;
      } else {
        results.email.failed++;
        results.email.errors.push({ email: subscriber.email, error: emailResult.error });
      }
    }

    // Send WhatsApp
    if (subscriber.whatsappEnabled && subscriber.phone) {
      const waResult = await sendWhatsAppAlert(alert, subscriber);
      if (waResult.success) {
        results.whatsapp.sent++;
      } else {
        results.whatsapp.failed++;
        results.whatsapp.errors.push({ phone: subscriber.phone, error: waResult.error });
      }
    }
  }

  console.log(`📊 Broadcast complete: ${results.email.sent} emails, ${results.whatsapp.sent} WhatsApp messages sent`);
  return results;
}

module.exports = {
  sendEmailAlert,
  sendWhatsAppAlert,
  broadcastAlert
};