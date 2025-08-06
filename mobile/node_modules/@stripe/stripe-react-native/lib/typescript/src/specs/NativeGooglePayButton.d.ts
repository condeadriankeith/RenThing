import type { HostComponent, ViewProps } from 'react-native';
import type { WithDefault, Int32 } from 'react-native/Libraries/Types/CodegenTypes';
export interface NativeProps extends ViewProps {
    type?: WithDefault<Int32, -1>;
    appearance: Int32;
    borderRadius?: Int32;
}
type ComponentType = HostComponent<NativeProps>;
declare const _default: ComponentType;
export default _default;
//# sourceMappingURL=NativeGooglePayButton.d.ts.map