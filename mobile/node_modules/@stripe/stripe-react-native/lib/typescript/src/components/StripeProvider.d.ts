import React from 'react';
import type { InitStripeParams } from '../types';
/**
 *  Stripe Provider Component Props
 */
export type Props = InitStripeParams & {
    children: React.ReactElement | React.ReactElement[];
};
export declare const initStripe: (params: InitStripeParams) => Promise<void>;
/**
 *  StripeProvider Component
 *
 * @example
 * ```ts
 *  <StripeProvider
 *    publishableKey="_publishableKey"
 *    merchantIdentifier="merchant.com.stripe.react.native"
 *    threeDSecureParams={{
 *      backgroundColor: "#FFF",
 *      timeout: 5,
 *    }}
 *  >
 *    <App />
 *  </StripeProvider>
 * ```
 * @param __namedParameters Props
 * @returns JSX.Element
 * @category ReactComponents
 */
export declare function StripeProvider({ children, publishableKey, merchantIdentifier, threeDSecureParams, stripeAccountId, urlScheme, setReturnUrlSchemeOnAndroid, }: Props): React.JSX.Element;
//# sourceMappingURL=StripeProvider.d.ts.map