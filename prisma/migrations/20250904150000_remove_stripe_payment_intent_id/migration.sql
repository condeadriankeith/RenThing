-- Remove the stripePaymentIntentId column from the Transaction table
ALTER TABLE "Transaction" DROP COLUMN "stripePaymentIntentId";