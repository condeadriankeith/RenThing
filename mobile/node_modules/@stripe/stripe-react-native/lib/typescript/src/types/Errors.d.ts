export declare enum ConfirmPaymentError {
    Canceled = "Canceled",
    Failed = "Failed",
    Unknown = "Unknown"
}
export declare enum CardActionError {
    Canceled = "Canceled",
    Failed = "Failed",
    Unknown = "Unknown"
}
export declare enum ConfirmSetupIntentError {
    Canceled = "Canceled",
    Failed = "Failed",
    Unknown = "Unknown"
}
export declare enum CreatePaymentMethodError {
    Failed = "Failed"
}
export declare enum CreateTokenError {
    Failed = "Failed"
}
export declare enum RetrievePaymentIntentError {
    Unknown = "Unknown"
}
export declare enum RetrieveSetupIntentError {
    Unknown = "Unknown"
}
export declare enum ApplePayError {
    Canceled = "Canceled",
    Failed = "Failed",
    Unknown = "Unknown"
}
export declare enum PaymentSheetError {
    Failed = "Failed",
    Canceled = "Canceled",
    Timeout = "Timeout"
}
export type ErrorType = 'api_connection_error' | 'api_error' | 'authentication_error' | 'card_error' | 'idempotency_error' | 'invalid_request_error' | 'rate_limit_error';
export interface StripeError<T> {
    code: T;
    message: string;
    localizedMessage?: string;
    declineCode?: string;
    stripeErrorCode?: string;
    type?: ErrorType;
}
export declare enum GooglePayError {
    Failed = "Failed",
    Canceled = "Canceled",
    Unknown = "Unknown"
}
export declare const MissingRoutingNumber: {
    code: CreateTokenError;
    message: string;
};
export declare enum VerifyMicrodepositsError {
    Canceled = "Canceled",
    Failed = "Failed",
    Unknown = "Unknown"
}
export declare enum CollectBankAccountError {
    Canceled = "Canceled",
    Failed = "Failed",
    Unknown = "Unknown"
}
export declare enum AddressSheetError {
    Failed = "Failed",
    Canceled = "Canceled"
}
export declare enum CustomerSheetError {
    Failed = "Failed",
    Canceled = "Canceled"
}
export declare enum PlatformPayError {
    Canceled = "Canceled",
    Failed = "Failed",
    Unknown = "Unknown"
}
//# sourceMappingURL=Errors.d.ts.map