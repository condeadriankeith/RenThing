import { emailService } from './email-service';

// Email triggers are currently disabled to prevent errors
// All functions are no-ops that simply log the action

export async function triggerBookingConfirmation(bookingId: string) {
  console.log(`[EMAIL TRIGGERS DISABLED] Booking confirmation email triggered for booking ${bookingId}`);
}

export async function triggerBookingCancellation(bookingId: string, reason?: string) {
  console.log(`[EMAIL TRIGGERS DISABLED] Booking cancellation email triggered for booking ${bookingId}`);
}

export async function triggerWelcomeEmail(userId: string) {
  console.log(`[EMAIL TRIGGERS DISABLED] Welcome email triggered for user ${userId}`);
}

export async function onPaymentConfirmed(transactionId: string) {
  console.log(`[EMAIL TRIGGERS DISABLED] Payment confirmation email triggered for transaction ${transactionId}`);
}