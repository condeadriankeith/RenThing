import React from 'react';
import { AccessibilityProps, StyleProp, ViewStyle, ImageSourcePropType } from 'react-native';
import type { Token, CardActionError, StripeError, GooglePayCardToken } from '../types';
/**
 *  Add to wallet button component props
 */
export interface Props extends AccessibilityProps {
    style?: StyleProp<ViewStyle>;
    /** Sets the Apple Wallet/Google Pay button style. If the button is placed over a dark background, set this to 'onDarkBackground', otherwise set to 'onLightBackground'. */
    iOSButtonStyle?: 'onDarkBackground' | 'onLightBackground';
    /** The image asset to use as the Google Pay button. Downloadable from https://developers.google.com/static/pay/issuers/apis/push-provisioning/android/downloads/flutter/2022_googlepay_flutter_buttons.zip  */
    androidAssetSource: ImageSourcePropType;
    testID?: string;
    /** iOS only. Set this to `true` until shipping through TestFlight || App Store. If false, you must be using live cards, and have the proper iOS entitlement set up. See https://stripe.com/docs/issuing/cards/digital-wallets?platform=react-native#requesting-access-for-ios */
    testEnv?: boolean;
    /** Details of the Issued Card you'd like added to the device's wallet */
    cardDetails: {
        /** The `primary_account_identifier` value from the issued card. */
        primaryAccountIdentifier: string | null;
        /** The card holder name (used only on iOS) */
        name: string;
        /** A user-facing description of the card. Required on Android.*/
        description: string;
        /** Last 4 digits of the card, only used on iOS */
        lastFour?: string;
        /** Optional, only used on iOS */
        brand?: Token.CardBrand;
    };
    token?: GooglePayCardToken | null;
    /** Used by stripe to securely obtain card info of the card being provisioned. */
    ephemeralKey: object;
    /** Called when the flow completes. If the `error` field is `null`, then the card was successfully added to the user's native wallet. */
    onComplete(result: {
        error: StripeError<CardActionError> | null;
    }): void;
}
/**
 *  Add to wallet button
 *
 * @example
 * ```ts
 *  <AddToWalletButton
 *    testEnv={true}
 *    style={styles.myButtonStyle}
 *    iOSButtonStyle="onLightBackground"
 *    cardDetails={{
 *      primaryAccountIdentifier: "V-123",
 *      name: "David Wallace",
 *      lastFour: "4242",
 *    }}
 *    ephemeralKey={myEphemeralKey} // This object is retrieved from your server. See https://stripe.com/docs/issuing/cards/digital-wallets?platform=react-native#update-your-backend
 *    onComplete={(error) => {
 *      Alert.alert(
 *        error ? error.code : 'Success',
 *        error
 *          ? error.message
 *          : 'Card was successfully added to the wallet.'
 *      );
 *    }}
 *  />
 * ```
 * @param __namedParameters Props
 * @returns JSX.Element
 * @category ReactComponents
 */
export declare function AddToWalletButton({ onComplete, ...props }: Props): React.JSX.Element;
//# sourceMappingURL=AddToWalletButton.d.ts.map