import type { PaymentSheet } from '../types';
/**
 * usePaymentSheet hook
 */
export declare function usePaymentSheet(): {
    loading: boolean;
    initPaymentSheet: (params: PaymentSheet.SetupParams) => Promise<import("../types").InitPaymentSheetResult>;
    presentPaymentSheet: (options?: PaymentSheet.PresentOptions) => Promise<import("../types").PresentPaymentSheetResult>;
    confirmPaymentSheetPayment: () => Promise<import("../types").ConfirmPaymentSheetPaymentResult>;
    /**
     * You must call this method when the user logs out from your app. This will ensure that
     * any persisted authentication state in the PaymentSheet, such as authentication cookies,
     * is also cleared during logout.
     */
    resetPaymentSheetCustomer: () => Promise<null>;
};
//# sourceMappingURL=usePaymentSheet.d.ts.map