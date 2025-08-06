import type { HostComponent, ViewProps } from 'react-native';
export interface NativeProps extends ViewProps {
    keyboardShouldPersistTaps: boolean;
}
type ComponentType = HostComponent<NativeProps>;
declare const _default: ComponentType;
export default _default;
//# sourceMappingURL=NativeStripeContainer.d.ts.map