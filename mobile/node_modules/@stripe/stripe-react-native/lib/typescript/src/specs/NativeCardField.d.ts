import type { HostComponent, ViewProps } from 'react-native';
import type { DirectEventHandler, Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import type { Details, Placeholders, Styles } from '../types/components/CardFieldInput';
import type { UnsafeMixed } from './utils';
type CardChangeEvent = Readonly<{
    card: UnsafeMixed<Details>;
}>;
export type FocusChangeEvent = Readonly<{
    focusedField: string;
}>;
export interface NativeProps extends ViewProps {
    autofocus: boolean;
    cardStyle: UnsafeMixed<Styles>;
    countryCode?: string;
    dangerouslyGetFullCardDetails: boolean;
    disabled: boolean;
    onBehalfOf?: string;
    onCardChange?: DirectEventHandler<CardChangeEvent>;
    onFocusChange?: DirectEventHandler<FocusChangeEvent>;
    placeholders: UnsafeMixed<Placeholders>;
    postalCodeEnabled: boolean;
    preferredNetworks?: ReadonlyArray<Int32>;
}
type ComponentType = HostComponent<NativeProps>;
interface NativeCommands {
    blur: (viewRef: React.ElementRef<ComponentType>) => void;
    focus: (viewRef: React.ElementRef<ComponentType>) => void;
    clear: (viewRef: React.ElementRef<ComponentType>) => void;
}
export declare const Commands: NativeCommands;
declare const _default: ComponentType;
export default _default;
//# sourceMappingURL=NativeCardField.d.ts.map