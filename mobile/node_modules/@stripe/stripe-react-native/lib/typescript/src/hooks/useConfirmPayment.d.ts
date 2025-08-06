import type { PaymentIntent } from '../types';
/**
 * useConfirmPayment hook
 */
export declare function useConfirmPayment(): {
    confirmPayment: (paymentIntentClientSecret: string, data?: PaymentIntent.ConfirmParams, options?: PaymentIntent.ConfirmOptions) => Promise<import("../types").ConfirmPaymentResult>;
    loading: boolean;
};
//# sourceMappingURL=useConfirmPayment.d.ts.map