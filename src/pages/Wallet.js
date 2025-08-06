import React, { useState } from 'react';

// SVG Icons
const WalletIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const MinusIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
);

const ArrowUpIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
  </svg>
);

const ArrowDownIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
  </svg>
);

const Wallet = () => {
  const [activeTab, setActiveTab] = useState('balance');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const balance = 2847.50;
  const pendingBalance = 125.00;
  const totalEarnings = 3420.00;

  const transactions = [
    {
      id: 1,
      type: 'credit',
      title: 'Rental Payment - iPhone 15 Pro Max',
      amount: 125.00,
      date: '2024-01-15',
      status: 'completed',
    },
    {
      id: 2,
      type: 'debit',
      title: 'Withdrawal to Bank',
      amount: 500.00,
      date: '2024-01-14',
      status: 'completed',
    },
    {
      id: 3,
      type: 'credit',
      title: 'Rental Payment - Canon EOS R5',
      amount: 180.00,
      date: '2024-01-13',
      status: 'completed',
    },
    {
      id: 4,
      type: 'credit',
      title: 'Rental Payment - DJI Mini 3',
      amount: 105.00,
      date: '2024-01-12',
      status: 'pending',
    },
    {
      id: 5,
      type: 'credit',
      title: 'Rental Payment - Gaming Laptop',
      amount: 220.00,
      date: '2024-01-11',
      status: 'completed',
    },
  ];

  const payoutMethods = [
    { id: 1, type: 'bank', name: 'BPI Savings Account', last4: '1234', isDefault: true },
    { id: 2, type: 'gcash', name: 'GCash Wallet', number: '0917-123-4567', isDefault: false },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-glass';
    }
  };

  return (
    <div className="bg-glass bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
      <div className="min-h-screen bg-glass">
        {/* Header */}
        <div className="bg-glass shadow-sm sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
          </div>
        </div>

        {/* Balance Card */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-teal-100 text-sm">Available Balance</p>
                <p className="text-3xl font-bold">₱{balance.toFixed(2)}</p>
              </div>
              <WalletIcon className="h-12 w-12 text-teal-200" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-teal-100 text-sm">Pending</p>
                <p className="text-lg font-semibold">₱{pendingBalance.toFixed(2)}</p>
              </div>
              <div className="bg-glass border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition">
                <p className="text-teal-100 text-sm">Total Earnings</p>
                <p className="text-lg font-semibold">₱{totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-glass border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition"
            >
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <ArrowUpIcon className="h-6 w-6 text-green-600" />
              </div>
              <p className="font-medium text-gray-900">Add Funds</p>
            </button>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="bg-glass border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition"
            >
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <ArrowDownIcon className="h-6 w-6 text-red-600" />
              </div>
              <p className="font-medium text-gray-900">Withdraw</p>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 bg-glass p-1 rounded-lg">
            {[
              { id: 'balance', label: 'Balance' },
              { id: 'transactions', label: 'Transactions' },
              { id: 'payouts', label: 'Payout Methods' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-glass text-teal-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {activeTab === 'balance' && (
            <div className="bg-glass rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Balance Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Available for withdrawal</span>
                  <span className="font-semibold">₱{balance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Pending clearance</span>
                  <span className="font-semibold">₱{pendingBalance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Total lifetime earnings</span>
                  <span className="font-semibold">₱{totalEarnings.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="bg-glass rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              </div>
              <div className="divide-y">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 hover:bg-glass">
                    <div className="bg-glass rounded-lg shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'credit' ? (
                            <ArrowUpIcon className="h-5 w-5 text-green-600" />
                          ) : (
                            <ArrowDownIcon className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.title}</p>
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}₱{transaction.amount.toFixed(2)}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payouts' && (
            <div className="bg-glass rounded-lg shadow-sm">
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Payout Methods</h3>
                <button className="text-teal-600 hover:text-teal-700 font-medium">
                  Add New
                </button>
              </div>
              <div className="p-6">
                {payoutMethods.map((method) => (
                  <div key={method.id} className="border rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{method.name}</p>
                        <p className="text-sm text-gray-500">
                          {method.type === 'bank' ? `**** ${method.last4}` : method.number}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {method.isDefault && (
                          <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Add Funds Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-glass rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Funds</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter amount"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-glass"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                    Add Funds
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-glass rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Withdraw Funds</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter amount"
                    max={balance}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payout Method</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>BPI Savings Account ****1234</option>
                    <option>GCash 0917-123-4567</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowWithdrawModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-glass"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wallet;