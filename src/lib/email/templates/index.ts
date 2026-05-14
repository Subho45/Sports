import { sendEmail } from '../mailer';
import { 
  welcomeTemplate, 
  paymentSuccessTemplate, 
  paymentFailedTemplate,
  eventReminderTemplate,
  documentStatusTemplate,
  resultsPublishedTemplate,
  certificateReadyTemplate 
} from './templates';

export async function sendWelcomeEmail(user: { email: string; name: string }) {
  const html = welcomeTemplate(user.name);
  await sendEmail(user.email, 'Welcome to SPORVIA!', html);
}

export async function sendPaymentSuccessEmail(data: {
  email: string;
  name: string;
  amount: number;
  paymentId: string;
  eventName: string;
  registrationId: string;
}) {
  const html = paymentSuccessTemplate(data);
  await sendEmail(data.email, 'Payment Successful - SPORVIA', html);
}

export async function sendPaymentFailedEmail(data: {
  email: string;
  name: string;
  amount: number;
  registrationId: string;
}) {
  const html = paymentFailedTemplate(data);
  await sendEmail(data.email, 'Payment Failed - SPORVIA', html);
}

export async function sendEventReminderEmail(data: {
  email: string;
  name: string;
  eventName: string;
  eventDate: string;
  venue: string;
  reportingTime: string;
  checklist: string[];
}) {
  const html = eventReminderTemplate(data);
  await sendEmail(data.email, `Reminder: ${data.eventName} Tomorrow!`, html);
}

export async function sendDocumentStatusEmail(data: {
  email: string;
  name: string;
  documentType: string;
  status: 'approved' | 'rejected';
  reason?: string;
}) {
  const html = documentStatusTemplate(data);
  await sendEmail(data.email, `Document ${data.status.toUpperCase()} - SPORVIA`, html);
}

export async function sendResultsPublishedEmail(data: {
  email: string;
  name: string;
  eventName: string;
  rank?: number;
  viewResultsUrl: string;
}) {
  const html = resultsPublishedTemplate(data);
  await sendEmail(data.email, `Results Published: ${data.eventName}`, html);
}

export async function sendCertificateReadyEmail(data: {
  email: string;
  name: string;
  eventName: string;
  certificateUrl: string;
}) {
  const html = certificateReadyTemplate(data);
  await sendEmail(data.email, 'Your Certificate is Ready! - SPORVIA', html);
}