import type { PlatformPayError, ConfirmPaymentResult, ConfirmPaymentSheetPaymentResult, SetupIntent, PaymentIntent, ConfirmSetupIntentResult, CreatePaymentMethodResult, CreateTokenForCVCUpdateResult, CreateTokenResult, HandleNextActionResult, HandleNextActionForSetupResult, InitPaymentSheetResult, PaymentMethod, PaymentSheet, PresentPaymentSheetResult, RetrievePaymentIntentResult, RetrieveSetupIntentResult, StripeError, Token, VerifyMicrodepositsParams, VerifyMicrodepositsForPaymentResult, VerifyMicrodepositsForSetupResult, CollectBankAccountForPaymentResult, CollectBankAccountForSetupResult, IsCardInWalletResult, CanAddCardToWalletParams, CanAddCardToWalletResult, FinancialConnections, PlatformPay } from './types';
import type { CollectFinancialConnectionsAccountsParams } from './types/FinancialConnections';
import type { CollectBankAccountTokenParams } from './types/PaymentMethod';
export declare const createPaymentMethod: (params: PaymentMethod.CreateParams, options?: PaymentMethod.CreateOptions) => Promise<CreatePaymentMethodResult>;
export declare const createToken: (params: Token.CreateParams) => Promise<CreateTokenResult>;
export declare const retrievePaymentIntent: (clientSecret: string) => Promise<RetrievePaymentIntentResult>;
export declare const retrieveSetupIntent: (clientSecret: string) => Promise<RetrieveSetupIntentResult>;
/**
 * Confirm and, if necessary, authenticate a PaymentIntent.
 *
 * @param {string} paymentIntentClientSecret The client_secret of the associated [PaymentIntent](https://stripe.com/docs/api/payment_intents).
 * @param {object=} params An optional object that contains data related to the payment method used to confirm this payment. If no object is provided (undefined), then it is assumed that the payment method has already been [attached  to the Payment Intent](https://stripe.com/docs/api/payment_intents/create#create_payment_intent-payment_method).
 * @param {object=} options An optional object that contains options for this payment method.
 * @returns A promise that resolves to an object containing either a `paymentIntent` field, or an `error` field.
 */
export declare const confirmPayment: (paymentIntentClientSecret: string, params?: PaymentIntent.ConfirmParams, options?: PaymentIntent.ConfirmOptions) => Promise<ConfirmPaymentResult>;
/** Handles any nextAction required to authenticate the PaymentIntent.
 * Call this method if you are using manual confirmation. See https://stripe.com/docs/payments/accept-a-payment?platform=react-native&ui=custom
 *
 * @param {string} paymentIntentClientSecret The client secret associated with the PaymentIntent.
 * @param {string=} returnURL An optional return URL so the Stripe SDK can redirect back to your app after authentication. This should match the `return_url` you specified during PaymentIntent confirmation.
 * */
export declare const handleNextAction: (paymentIntentClientSecret: string, returnURL?: string) => Promise<HandleNextActionResult>;
/** Handles any nextAction required to authenticate the SetupIntent.
 * Call this method if you are confirming the SetupIntent on your backend and get a status of requires_action.
 *
 * @param {string} setupIntentClientSecret The client secret associated with the SetupIntent.
 * @param {string=} returnURL An optional return URL so the Stripe SDK can redirect back to your app after authentication. This should match the `return_url` you specified during PaymentIntent confirmation.
 * */
export declare const handleNextActionForSetup: (setupIntentClientSecret: string, returnURL?: string) => Promise<HandleNextActionForSetupResult>;
export declare const confirmSetupIntent: (paymentIntentClientSecret: string, params: SetupIntent.ConfirmParams, options?: SetupIntent.ConfirmOptions) => Promise<ConfirmSetupIntentResult>;
export declare const createTokenForCVCUpdate: (cvc: string) => Promise<CreateTokenForCVCUpdateResult>;
/**
 * Call this method in your app whenever you receive a URL for a Stripe callback.
 * For convenience, you can pass all URLs you receive to this method first, and
 * check the return value to easily determine whether it is a callback URL that Stripe will handle
 * or if your app should process it normally. This is iOS-only, and will always return false on Android.
 */
export declare const handleURLCallback: (url: string) => Promise<boolean>;
export declare const verifyMicrodepositsForPayment: (clientSecret: string, params: VerifyMicrodepositsParams) => Promise<VerifyMicrodepositsForPaymentResult>;
export declare const verifyMicrodepositsForSetup: (clientSecret: string, params: VerifyMicrodepositsParams) => Promise<VerifyMicrodepositsForSetupResult>;
export declare const initPaymentSheet: (params: PaymentSheet.SetupParams) => Promise<InitPaymentSheetResult>;
export declare const presentPaymentSheet: (options?: PaymentSheet.PresentOptions) => Promise<PresentPaymentSheetResult>;
export declare const confirmPaymentSheetPayment: () => Promise<ConfirmPaymentSheetPaymentResult>;
/**
 * You must call this method when the user logs out from your app. This will ensure that
 * any persisted authentication state in the PaymentSheet, such as authentication cookies,
 * is also cleared during logout.
 */
export declare const resetPaymentSheetCustomer: () => Promise<null>;
export declare const collectBankAccountForPayment: (clientSecret: string, params: PaymentMethod.CollectBankAccountParams) => Promise<CollectBankAccountForPaymentResult>;
export declare const collectBankAccountForSetup: (clientSecret: string, params: PaymentMethod.CollectBankAccountParams) => Promise<CollectBankAccountForSetupResult>;
/**
 * Use collectBankAccountToken in the [Add a Financial Connections Account to a US Custom Connect](https://stripe.com/docs/financial-connections/connect-payouts) account flow.
 * When called, it will load the Authentication Flow, an on-page modal UI which allows your user to securely link their external financial account for payouts.
 * @param {string} clientSecret The client_secret of the [Financial Connections Session](https://stripe.com/docs/api/financial_connections/session).
 * @param {CollectBankAccountTokenParams} params Optional parameters.
 * @returns A promise that resolves to an object containing either `session` and `token` fields, or an error field.
 */
export declare const collectBankAccountToken: (clientSecret: string, params?: CollectBankAccountTokenParams) => Promise<FinancialConnections.TokenResult>;
/**
 * Use collectFinancialConnectionsAccounts in the [Collect an account to build data-powered products](https://stripe.com/docs/financial-connections/other-data-powered-products) flow.
 * When called, it will load the Authentication Flow, an on-page modal UI which allows your user to securely link their external financial account.
 * @param {string} clientSecret The client_secret of the [Financial Connections Session](https://stripe.com/docs/api/financial_connections/session).
 * @param {CollectFinancialConnectionsAccountsParams} params Optional parameters.
 * @returns A promise that resolves to an object containing either a `session` field, or an error field.
 */
export declare const collectFinancialConnectionsAccounts: (clientSecret: string, params?: CollectFinancialConnectionsAccountsParams) => Promise<FinancialConnections.SessionResult>;
/**
 * Check if the app & device support adding this card to the native wallet.
 * @param params An object containing fields for `primaryAccountIdentifier`, `cardLastFour`, and `testEnv`.
 *
 * @returns A promise resolving to an object of type CanAddCardToWalletResult. Check the `canAddCard` field, if it's true, you should show the `<AddToWalletButton />`
 */
export declare const canAddCardToWallet: (params: CanAddCardToWalletParams) => Promise<CanAddCardToWalletResult>;
/** @deprecated Please use `canAddCardToWallet` instead. */
export declare const isCardInWallet: (params: {
    cardLastFour: string;
}) => Promise<IsCardInWalletResult>;
export declare const Constants: {
    API_VERSIONS: {
        CORE: string;
        ISSUING: string;
    };
};
/**
 * Check if the relevant native wallet (Apple Pay on iOS, Google Pay on Android) is supported.
 * @returns A boolean indicating whether or not the native wallet is supported.
 */
export declare const isPlatformPaySupported: (params?: {
    googlePay?: PlatformPay.IsGooglePaySupportedParams;
}) => Promise<boolean>;
/**
 * Launches the relevant native wallet sheet (Apple Pay on iOS, Google Pay on Android) in order to confirm a Stripe [SetupIntent](https://stripe.com/docs/api/setup_intents).
 * @param clientSecret The client secret of the SetupIntent.
 * @param params an object describing the Apple Pay and Google Pay configurations.
 * @returns An object with an error field if something went wrong or the flow was cancelled, otherwise an object with both `setupIntent` and `paymentMethod` fields.
 */
export declare const confirmPlatformPaySetupIntent: (clientSecret: string, params: PlatformPay.ConfirmParams) => Promise<PlatformPay.ConfirmSetupIntentResult>;
/**
 * Launches the relevant native wallet sheet (Apple Pay on iOS, Google Pay on Android) in order to confirm a Stripe [PaymentIntent](https://stripe.com/docs/api/payment_intents).
 * @param clientSecret The client secret of the PaymentIntent.
 * @param params an object describing the Apple Pay and Google Pay configurations.
 * @returns An object with an error field if something went wrong or the flow was cancelled, otherwise an object with both `paymentIntent` and `paymentMethod` fields.
 */
export declare const confirmPlatformPayPayment: (clientSecret: string, params: PlatformPay.ConfirmParams) => Promise<PlatformPay.ConfirmPaymentResult>;
/**
 * iOS only, this will always return false on Android. Dismisses the Apple Pay sheet if it is open.
 * @returns A boolean indicating whether or not the sheet was successfully closed. Will return false if the Apple Pay sheet was not open.
 */
export declare const dismissPlatformPay: () => Promise<boolean>;
/**
 * Launches the relevant native wallet sheet (Apple Pay on iOS, Google Pay on Android) in order to create a Stripe [PaymentMethod](https://stripe.com/docs/api/payment_methods).
 * @param params an object describing the Apple Pay and Google Pay configurations.
 * @returns An object with an error field if something went wrong or the flow was cancelled, otherwise an object with a `paymentMethod` field.
 */
export declare const createPlatformPayPaymentMethod: (params: PlatformPay.PaymentMethodParams) => Promise<PlatformPay.PaymentMethodResult>;
/**
 * @deprecated The Tokens API is deprecated, you should use Payment Methods and `createPlatformPayPaymentMethod` instead.  Launches the relevant native wallet sheet (Apple Pay on iOS, Google Pay on Android) in order to create a Stripe [token](https://stripe.com/docs/api/tokens).
 * @param params an object describing the Apple Pay and Google Pay configurations.
 * @returns An object with an error field if something went wrong or the flow was cancelled, otherwise an object with a `token` field.
 */
export declare const createPlatformPayToken: (params: PlatformPay.PaymentMethodParams) => Promise<PlatformPay.TokenResult>;
/**
 * iOS only. Update different items on the Apple Pay sheet, including the summary items, the shipping methods, and any errors shown. iOS only, this is a no-op on Android.
 * @param params an object describing the Apple Pay configuration, with the following fields:
 * - cartItems An array of payment summary items to display in the Apple Pay sheet.
 * - shippingMethods An array of shipping methods to display in the Apple Pay sheet.
 * - errors An array of errors associated with the user's input that must be corrected to proceed with payment. These errors will be shown in the Apple Pay sheet.
 *
 * @returns An object with an optional 'error' field, which is only populated if something went wrong.
 */
export declare const updatePlatformPaySheet: (params: {
    applePay: {
        cartItems: Array<PlatformPay.CartSummaryItem>;
        shippingMethods: Array<PlatformPay.ShippingMethod>;
        errors: Array<PlatformPay.ApplePaySheetError>;
    };
}) => Promise<{
    error?: StripeError<PlatformPayError>;
}>;
/**
 * iOS only, this is a no-op on Android. Use this method to move users to the interface for adding credit cards.
 * This method transfers control to the Wallet app on iPhone or to the Settings
 * app on iPad. For devices that don’t support Apple Pay, this method does nothing.
 */
export declare const openPlatformPaySetup: () => Promise<void>;
//# sourceMappingURL=functions.d.ts.map