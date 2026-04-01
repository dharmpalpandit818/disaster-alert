require('dotenv').config();

const nodemailer = require('nodemailer');
const twilio = require('twilio');
const { translateText } = require('./translation');

const EN_EMAIL_LABELS = {
  subjectPrefix: 'DISASTER ALERT:',
  heading: 'Disaster Alert',
  type: 'Type',
  severity: 'Severity',
  location: 'Location',
  description: 'Description',
  safetyTitle: 'Safety instructions',
  viewDetails: 'View details'
};

const EN_WA_LABELS = {
  heading: 'DISASTER ALERT',
  type: 'Type',
  severity: 'Severity',
  location: 'Location',
  staySafe: 'Stay safe!'
};

function recipientLang(recipient) {
  return recipient.preferredLanguage || recipient.language || 'en';
}

/**
 * Translate alert fields for outbound messages. Falls back to English on failure (translateText already returns original text on error).
 */
async function translateAlertFields(alert, lang) {
  const base = {
    title: alert.title,
    description: alert.description,
    location: alert.location,
    safetyInstructions: alert.safetyInstructions,
    type: String(alert.type),
    severity: String(alert.severity)
  };
  if (!lang || lang === 'en') {
    return base;
  }
  const [title, description, location, safetyInstructions, type, severity] = await Promise.all([
    translateText(alert.title, lang),
    translateText(alert.description, lang),
    translateText(alert.location, lang),
    translateText(alert.safetyInstructions, lang),
    translateText(String(alert.type), lang),
    translateText(String(alert.severity), lang)
  ]);
  return {
    title: title || base.title,
    description: description || base.description,
    location: location || base.location,
    safetyInstructions: safetyInstructions || base.safetyInstructions,
    type: type || base.type,
    severity: severity || base.severity
  };
}

async function translateLabelObject(labels, lang) {
  if (!lang || lang === 'en') {
    return labels;
  }
  const entries = Object.entries(labels);
  const values = await Promise.all(entries.map(([, v]) => translateText(v, lang)));
  return Object.fromEntries(entries.map(([k], i) => (values[i] ? [k, values[i]] : [k, labels[k]])));
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const twilioClient = process.env.TWILIO_ACCOUNT_SID
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

console.log('EMAIL:', process.env.EMAIL_USER || 'missing');
console.log('TWILIO:', process.env.TWILIO_ACCOUNT_SID || 'missing');

async function sendEmailAlert(alert, subscriber) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email not configured.');
    return { success: false, error: 'Email not configured' };
  }

  try {
    const lang = recipientLang(subscriber);
    const content = await translateAlertFields(alert, lang);
    const labels = await translateLabelObject(EN_EMAIL_LABELS, lang);

    const mailOptions = {
      from: `"Disaster Alert System" <${process.env.EMAIL_USER}>`,
      to: subscriber.email,
      subject: `🚨 ${labels.subjectPrefix} ${content.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding:20px;">
          <h2>🚨 ${labels.heading}</h2>
          <h3>${content.title}</h3>
          <p><b>${labels.type}:</b> ${content.type}</p>
          <p><b>${labels.severity}:</b> ${content.severity}</p>
          <p><b>${labels.location}:</b> ${content.location}</p>

          <h4>${labels.description}</h4>
          <p>${content.description}</p>

          <h4>${labels.safetyTitle}</h4>
          <p>${content.safetyInstructions}</p>

          <a href="${process.env.SITE_URL || 'http://localhost:3000'}/alerts/${alert._id}">
            ${labels.viewDetails}
          </a>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);

    return { success: true };
  } catch (error) {
    console.error('Email error:', error.message);
    return { success: false, error: error.message };
  }
}

async function sendWhatsAppAlert(alert, subscriber) {
  if (!twilioClient || !process.env.TWILIO_PHONE_NUMBER) {
    console.log('Twilio not configured.');
    return { success: false, error: 'Twilio not configured' };
  }

  if (!subscriber.phone) {
    return { success: false, error: 'No phone number' };
  }

  try {
    const lang = recipientLang(subscriber);
    const content = await translateAlertFields(alert, lang);
    const labels = await translateLabelObject(EN_WA_LABELS, lang);

    const message = `
${labels.heading}

${content.title}
${labels.type}: ${content.type}
${labels.severity}: ${content.severity}
${labels.location}: ${content.location}

${labels.staySafe}
`.trim();

    const raw = subscriber.phone.trim();
    const phone = raw.startsWith('+') ? raw : `+${raw.replace(/^\+/, '')}`;

    const fromNumber = process.env.TWILIO_PHONE_NUMBER.startsWith('whatsapp:')
      ? process.env.TWILIO_PHONE_NUMBER
      : `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`;

    const response = await twilioClient.messages.create({
      body: message,
      from: fromNumber,
      to: `whatsapp:${phone}`
    });

    console.log(`WhatsApp sent: ${response.sid}`);

    return { success: true };
  } catch (error) {
    console.error('WhatsApp error:', error.message);
    return { success: false, error: error.message };
  }
}

async function broadcastAlert(alert, subscribers) {
  const results = {
    email: { sent: 0, failed: 0 },
    whatsapp: { sent: 0, failed: 0 }
  };

  for (const subscriber of subscribers) {
    if (subscriber.email) {
      const emailResult = await sendEmailAlert(alert, subscriber);
      emailResult.success ? results.email.sent++ : results.email.failed++;
    }

    if (subscriber.phone) {
      const waResult = await sendWhatsAppAlert(alert, subscriber);
      waResult.success ? results.whatsapp.sent++ : results.whatsapp.failed++;
    }
  }

  console.log('Notification broadcast results:', results);

  return results;
}

module.exports = {
  sendEmailAlert,
  sendWhatsAppAlert,
  broadcastAlert
};
