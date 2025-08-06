import React from 'react';
import { AccessibilityProps, StyleProp, ViewStyle } from 'react-native';
import type { CardBrand, CardFormView } from '../types';
/**
 *  Card Form Component Props
 */
export interface Props extends AccessibilityProps {
    style?: StyleProp<ViewStyle>;
    autofocus?: boolean;
    testID?: string;
    /** Applies a disabled state such that user input is not accepted. Defaults to false. */
    disabled?: boolean;
    /** All styles except backgroundColor, cursorColor, borderColor, and borderRadius are Android only */
    cardStyle?: CardFormView.Styles;
    /** The list of preferred networks that should be used to process payments made with a co-branded card.
     * This value will only be used if your user hasn't selected a network themselves. */
    preferredNetworks?: Array<CardBrand>;
    /** Android only */
    placeholders?: CardFormView.Placeholders;
    /** Android only */
    defaultValues?: CardFormView.DefaultValues;
    onFormComplete?(card: CardFormView.Details): void;
    /**
     * WARNING: If set to `true` the full card number will be returned in the `onFormComplete` handler.
     * Only do this if you're certain that you fulfill the necessary PCI compliance requirements.
     * Make sure that you're not mistakenly logging or storing full card details!
     * See the docs for details: https://stripe.com/docs/security/guide#validating-pci-compliance
     */
    dangerouslyGetFullCardDetails?: boolean;
}
/**
 *  Card Form Component
 *
 * @example
 * ```ts
 * <CardForm
 *    onFormComplete={(cardDetails) => {
 *    console.log('card details', cardDetails);
 *      setCard(cardDetails);
 *    }}
 *    style={{height: 200}}
 *  />
 * ```
 * @param __namedParameters Props
 * @returns JSX.Element
 * @category ReactComponents
 */
export declare const CardForm: React.ForwardRefExoticComponent<Props & React.RefAttributes<CardFormView.Methods>>;
//# sourceMappingURL=CardForm.d.ts.map