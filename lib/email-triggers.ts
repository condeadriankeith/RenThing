import { PrismaClient } from '@prisma/client';
import { emailService } from './email-service';

// const prisma = new PrismaClient();

// export async function triggerBookingConfirmation(bookingId: string) {
//   try {
//     const bookingDetails = await emailService.getBookingEmailDetails(bookingId);
//     if (!bookingDetails) {
//       throw new Error('Booking not found');
//     }

//     await emailService.sendBookingConfirmation(bookingDetails);
//     console.log(`Booking confirmation email sent for booking ${bookingId}`);
//   } catch (error) {
//     console.error(`Failed to send booking confirmation email for booking ${bookingId}:`, error);
//   }
// }

// export async function triggerBookingCancellation(bookingId: string, reason?: string) {
//   try {
//     const bookingDetails = await emailService.getBookingEmailDetails(bookingId);
//     if (!bookingDetails) {
//       throw new Error('Booking not found');
//   }

//     await emailService.sendBookingCancellation(bookingDetails, reason);
//     console.log(`Booking cancellation email sent for booking ${bookingId}`);
//   } catch (error) {
//     console.error(`Failed to send booking cancellation email for booking ${bookingId}:`, error);
//   }
// }

// export async function triggerWelcomeEmail(userId: string) {
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: userId }
//     });

//     if (!user || !user.email) {
//       throw new Error('User not found or email missing');
//     }

//     await emailService.sendWelcomeEmail(user.email, user.name || 'there');
//     console.log(`Welcome email sent to user ${userId}`);
//   } catch (error) {
//     console.error(`Failed to send welcome email to user ${userId}:`, error);
//   }
// }

export async function triggerBookingConfirmation(bookingId: string) {
  console.log(`Booking confirmation email triggered for booking ${bookingId}`);
}

export async function triggerBookingCancellation(bookingId: string, reason?: string) {
  console.log(`Booking cancellation email triggered for booking ${bookingId}`);
}

export async function triggerWelcomeEmail(userId: string) {
  console.log(`Welcome email triggered for user ${userId}`);
}

export async function onPaymentConfirmed(transactionId: string) {
  console.log(`Payment confirmation email triggered for transaction ${transactionId}`);
}