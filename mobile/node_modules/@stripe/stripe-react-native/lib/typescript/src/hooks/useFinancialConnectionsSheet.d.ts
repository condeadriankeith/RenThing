import type { CollectFinancialConnectionsAccountsParams } from '../types/FinancialConnections';
import type { CollectBankAccountTokenParams } from '../types/PaymentMethod';
/**
 * React hook for accessing functions on the Financial Connections sheet.
 *
 * Retuns the `collectBankAccountToken` and `collectFinancialConnectionsAccounts` functions, and a `loading` boolean that you can use
 * to display loading state (like showing a spinner).
 */
export declare function useFinancialConnectionsSheet(): {
    collectBankAccountToken: (clientSecret: string, params?: CollectBankAccountTokenParams) => Promise<import("../types/FinancialConnections").TokenResult>;
    collectFinancialConnectionsAccounts: (clientSecret: string, params?: CollectFinancialConnectionsAccountsParams) => Promise<import("../types/FinancialConnections").SessionResult>;
    loading: boolean;
};
//# sourceMappingURL=useFinancialConnectionsSheet.d.ts.map