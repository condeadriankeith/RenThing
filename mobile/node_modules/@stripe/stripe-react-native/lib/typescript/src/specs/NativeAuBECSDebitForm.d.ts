import type { HostComponent, ViewProps } from 'react-native';
import type { DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
import type { AuBECSDebitFormComponent } from '../types';
import type { UnsafeMixed } from './utils';
type FormDetailsEvent = Readonly<{
    accountNumber: string;
    bsbNumber: string;
    email: string;
    name: string;
}>;
export interface NativeProps extends ViewProps {
    companyName: string;
    onCompleteAction: DirectEventHandler<FormDetailsEvent>;
    formStyle?: UnsafeMixed<AuBECSDebitFormComponent.Styles>;
}
type ComponentType = HostComponent<NativeProps>;
declare const _default: ComponentType;
export default _default;
//# sourceMappingURL=NativeAuBECSDebitForm.d.ts.map