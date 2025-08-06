import type React from 'react';
import type { StripeError } from './types';
/**
 * Determines whether or not this library is being used inside of
 * an "Expo" project by identifying if Expo's native module
 * infrastructure (react-native-unimodules AKA expo-modules) is available.
 */
export declare const shouldAttributeExpo: () => boolean;
export declare const isiOS: boolean;
export declare const isAndroid: boolean;
export declare function createError<T>(error: StripeError<T>): {
    code: T;
    message: string;
    localizedMessage: string | undefined;
    declineCode: string | undefined;
    stripeErrorCode: string | undefined;
    type: import("./types").ErrorType | undefined;
};
export declare const unsupportedMethodMessage: (field: string) => string;
export declare const focusInput: (ref: React.MutableRefObject<any>) => void;
export declare const registerInput: (ref: React.MutableRefObject<any>) => void;
export declare const unregisterInput: (ref: React.MutableRefObject<any>) => void;
export declare const currentlyFocusedInput: () => any;
//# sourceMappingURL=helpers.d.ts.map