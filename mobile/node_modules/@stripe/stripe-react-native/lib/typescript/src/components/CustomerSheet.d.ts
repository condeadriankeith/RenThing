import type { CustomerSheetInitParams, CustomerSheetPresentParams, CustomerSheetResult, StripeError, CustomerSheetError } from '../types';
/**
 *  Props
 */
export type Props = {
    /** Whether the sheet is visible. Defaults to false. */
    visible: boolean;
    /** Called when the user submits, dismisses, or cancels the sheet, or when an error occurs. */
    onResult: (result: CustomerSheetResult) => void;
} & CustomerSheetInitParams & CustomerSheetPresentParams;
/**
 * A component wrapper around the Customer Sheet functions. Upon passing `true` to the `visible` prop,
 * Customer Sheet will call `initialize` and `present`, and the result(s) will be passed through to the
 * onResult callback.
 *
 * @example
 * ```ts
 *  const [selectedPaymentOption, setSelectedPaymentOption] = React.useState(null);
 *  const [customerSheetVisible, setCustomerSheetVisible] = React.useState(false);
 *
 *  return (
 *    <CustomerSheet
 *      visible={customerSheetVisible}
 *      customerEphemeralKeySecret={ephemeralKeySecret}
 *      customerId={customer}
 *      returnURL={'stripe-example://stripe-redirect'}
 *      onResult={({ error, paymentOption, paymentMethod }) => {
 *        setCustomerSheetVisible(false);
 *        if (error) {
 *          Alert.alert(error.code, error.localizedMessage);
 *        }
 *        if (paymentOption) {
 *          setSelectedPaymentOption(paymentOption);
 *          console.log(JSON.stringify(paymentOption, null, 2));
 *        }
 *        if (paymentMethod) {
 *          console.log(JSON.stringify(paymentMethod, null, 2));
 *        }
 *      }}
 *    />
 *  );
 * ```
 * @param __namedParameters Props
 * @returns JSX.Element
 * @category ReactComponents
 */
declare function Component({ visible, presentationStyle, animationStyle, style, appearance, setupIntentClientSecret, customerId, customerEphemeralKeySecret, merchantDisplayName, headerTextForSelectionScreen, defaultBillingDetails, billingDetailsCollectionConfiguration, returnURL, removeSavedPaymentMethodMessage, applePayEnabled, googlePayEnabled, timeout, onResult, customerAdapter, }: Props): null;
/**
 * The Customer Sheet is a prebuilt UI component that lets your customers manage their saved payment methods.
 */
export declare const CustomerSheet: {
    Component: typeof Component;
    initialize: (params: CustomerSheetInitParams) => Promise<{
        error?: StripeError<CustomerSheetError>;
    }>;
    present: (params?: CustomerSheetPresentParams) => Promise<CustomerSheetResult>;
    retrievePaymentOptionSelection: () => Promise<CustomerSheetResult>;
};
export {};
//# sourceMappingURL=CustomerSheet.d.ts.map