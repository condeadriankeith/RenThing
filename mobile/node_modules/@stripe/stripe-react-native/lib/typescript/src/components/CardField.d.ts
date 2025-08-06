import React from 'react';
import { AccessibilityProps, StyleProp, ViewStyle } from 'react-native';
import type { CardBrand, CardFieldInput } from '../types';
/**
 *  Card Field Component Props
 */
export interface Props extends AccessibilityProps {
    style?: StyleProp<ViewStyle>;
    /** Controls if a postal code entry field can be displayed to the user. If true, the type of code entry shown is controlled by the set countryCode prop. Some country codes may result in no postal code entry being shown if those countries do not commonly use postal codes. If false, no postal code entry will ever be displayed. Defaults to true.*/
    postalCodeEnabled?: boolean;
    /** Controls the postal code entry shown (if the postalCodeEnabled prop is set to true). Defaults to the device's default locale. */
    countryCode?: string;
    /** Applies a disabled state such that user input is not accepted. Defaults to false. */
    disabled?: boolean;
    cardStyle?: CardFieldInput.Styles;
    placeholders?: CardFieldInput.Placeholders;
    autofocus?: boolean;
    onCardChange?(card: CardFieldInput.Details): void;
    onBlur?(): void;
    onFocus?(focusedField: CardFieldInput.FieldName | null): void;
    testID?: string;
    /** The list of preferred networks that should be used to process payments made with a co-branded card.
     * This value will only be used if your user hasn't selected a network themselves. */
    preferredNetworks?: Array<CardBrand>;
    /** The account (if any) for which the funds of the intent are intended. */
    onBehalfOf?: string;
    /**
     * WARNING: If set to `true` the full card number will be returned in the `onCardChange` handler.
     * Only do this if you're certain that you fulfill the necessary PCI compliance requirements.
     * Make sure that you're not mistakenly logging or storing full card details!
     * See the docs for details: https://stripe.com/docs/security/guide#validating-pci-compliance
     */
    dangerouslyGetFullCardDetails?: boolean;
}
/**
 *  Card Field Component
 *
 * @example
 * ```ts
 * <CardField
 *    postalCodeEnabled={false}
 *    onCardChange={(cardDetails) => {
 *    console.log('card details', cardDetails);
 *      setCard(cardDetails);
 *    }}
 *    style={{height: 50}}
 *  />
 * ```
 * @param __namedParameters Props
 * @returns JSX.Element
 * @category ReactComponents
 */
export declare const CardField: React.ForwardRefExoticComponent<Props & React.RefAttributes<CardFieldInput.Methods>>;
//# sourceMappingURL=CardField.d.ts.map