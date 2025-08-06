import type { SetupIntent } from '../types';
/**
 * useConfirmSetupIntent hook
 */
export declare function useConfirmSetupIntent(): {
    confirmSetupIntent: (paymentIntentClientSecret: string, data: SetupIntent.ConfirmParams, options?: SetupIntent.ConfirmOptions) => Promise<import("../types").ConfirmSetupIntentResult>;
    loading: boolean;
};
//# sourceMappingURL=useConfirmSetupIntent.d.ts.map