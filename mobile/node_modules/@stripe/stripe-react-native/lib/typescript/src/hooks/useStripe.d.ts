import type { PaymentMethod, PaymentIntent, PaymentSheet, CreatePaymentMethodResult, RetrievePaymentIntentResult, RetrieveSetupIntentResult, ConfirmPaymentResult, HandleNextActionResult, HandleNextActionForSetupResult, ConfirmSetupIntentResult, CreateTokenForCVCUpdateResult, StripeError, InitPaymentSheetResult, PresentPaymentSheetResult, ConfirmPaymentSheetPaymentResult, SetupIntent, CreateTokenResult, Token, VerifyMicrodepositsParams, VerifyMicrodepositsForPaymentResult, VerifyMicrodepositsForSetupResult, CollectBankAccountForSetupResult, CollectBankAccountForPaymentResult, CanAddCardToWalletParams, CanAddCardToWalletResult, FinancialConnections, PlatformPay, PlatformPayError } from '../types';
import type { CollectBankAccountTokenParams } from '../types/PaymentMethod';
import type { CollectFinancialConnectionsAccountsParams } from '../types/FinancialConnections';
/**
 * useStripe hook
 */
export declare function useStripe(): {
    retrievePaymentIntent: (clientSecret: string) => Promise<RetrievePaymentIntentResult>;
    retrieveSetupIntent: (clientSecret: string) => Promise<RetrieveSetupIntentResult>;
    confirmPayment: (paymentIntentClientSecret: string, data?: PaymentIntent.ConfirmParams, options?: PaymentIntent.ConfirmOptions) => Promise<ConfirmPaymentResult>;
    createPaymentMethod: (data: PaymentMethod.CreateParams, options?: PaymentMethod.CreateOptions) => Promise<CreatePaymentMethodResult>;
    handleNextAction: (paymentIntentClientSecret: string, returnURL?: string) => Promise<HandleNextActionResult>;
    handleNextActionForSetup: (setupIntentClientSecret: string, returnURL?: string) => Promise<HandleNextActionForSetupResult>;
    confirmSetupIntent: (paymentIntentClientSecret: string, data: SetupIntent.ConfirmParams, options?: SetupIntent.ConfirmOptions) => Promise<ConfirmSetupIntentResult>;
    createTokenForCVCUpdate: (cvc: string) => Promise<CreateTokenForCVCUpdateResult>;
    handleURLCallback: (url: string) => Promise<boolean>;
    confirmPaymentSheetPayment: () => Promise<ConfirmPaymentSheetPaymentResult>;
    presentPaymentSheet: (options?: PaymentSheet.PresentOptions) => Promise<PresentPaymentSheetResult>;
    initPaymentSheet: (params: PaymentSheet.SetupParams) => Promise<InitPaymentSheetResult>;
    createToken: (params: Token.CreateParams) => Promise<CreateTokenResult>;
    collectBankAccountForPayment: (clientSecret: string, params: PaymentMethod.CollectBankAccountParams) => Promise<CollectBankAccountForPaymentResult>;
    collectBankAccountForSetup: (clientSecret: string, params: PaymentMethod.CollectBankAccountParams) => Promise<CollectBankAccountForSetupResult>;
    verifyMicrodepositsForPayment: (clientSecret: string, params: VerifyMicrodepositsParams) => Promise<VerifyMicrodepositsForPaymentResult>;
    verifyMicrodepositsForSetup: (clientSecret: string, params: VerifyMicrodepositsParams) => Promise<VerifyMicrodepositsForSetupResult>;
    canAddCardToWallet: (params: CanAddCardToWalletParams) => Promise<CanAddCardToWalletResult>;
    collectBankAccountToken: (clientSecret: string, params?: CollectBankAccountTokenParams) => Promise<FinancialConnections.TokenResult>;
    collectFinancialConnectionsAccounts: (clientSecret: string, params?: CollectFinancialConnectionsAccountsParams) => Promise<FinancialConnections.SessionResult>;
    /**
     * You must call this method when the user logs out from your app. This will ensure that
     * any persisted authentication state in the PaymentSheet, such as authentication cookies,
     * is also cleared during logout.
     */
    resetPaymentSheetCustomer: () => Promise<null>;
    isPlatformPaySupported: (params?: {
        googlePay?: PlatformPay.IsGooglePaySupportedParams;
    }) => Promise<boolean>;
    confirmPlatformPaySetupIntent: (clientSecret: string, params: PlatformPay.ConfirmParams) => Promise<PlatformPay.ConfirmSetupIntentResult>;
    confirmPlatformPayPayment: (clientSecret: string, params: PlatformPay.ConfirmParams) => Promise<PlatformPay.ConfirmPaymentResult>;
    dismissPlatformPay: () => Promise<boolean>;
    createPlatformPayPaymentMethod: (params: PlatformPay.PaymentMethodParams) => Promise<PlatformPay.PaymentMethodResult>;
    createPlatformPayToken: (params: PlatformPay.PaymentMethodParams) => Promise<PlatformPay.TokenResult>;
    updatePlatformPaySheet: (params: {
        applePay: {
            cartItems: Array<PlatformPay.CartSummaryItem>;
            shippingMethods: Array<PlatformPay.ShippingMethod>;
            errors: Array<PlatformPay.ApplePaySheetError>;
        };
    }) => Promise<{
        error?: StripeError<PlatformPayError>;
    }>;
    openPlatformPaySetup: () => Promise<void>;
};
//# sourceMappingURL=useStripe.d.ts.map