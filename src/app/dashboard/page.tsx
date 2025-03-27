"use client";

import { useEffect, useState } from "react";
import { accountService } from "@/services/accountService";
import { Account, CreditCard, Transaction } from "@/types";
import {
  BanknotesIcon,
  CreditCardIcon,
  ArrowDownIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sample transaction data - would be fetched from API
  const recentTransactions: Transaction[] = [
    {
      id: "1",
      userId: "1",
      amount: 120.5,
      description: "Grocery Shopping",
      date: new Date("2024-03-15"),
      isExpense: true,
      accountId: "1",
    },
    {
      id: "2",
      userId: "1",
      amount: 1500,
      description: "Salary Deposit",
      date: new Date("2024-03-10"),
      isExpense: false,
      accountId: "1",
    },
    {
      id: "3",
      userId: "1",
      amount: 45.99,
      description: "Restaurant Bill",
      date: new Date("2024-03-13"),
      isExpense: true,
      creditCardId: "1",
    },
  ];

  // Sample spending by category - would be fetched from API
  const spendingByCategory = [
    { name: "Groceries", amount: 450 },
    { name: "Utilities", amount: 320 },
    { name: "Dining", amount: 280 },
    { name: "Transportation", amount: 210 },
    { name: "Entertainment", amount: 150 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch accounts and credit cards in parallel
        const [accountsResponse, creditCardsResponse] = await Promise.all([
          accountService.getAccounts(),
          accountService.getCreditCards(),
        ]);

        setAccounts(accountsResponse.data);
        setCreditCards(creditCardsResponse.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate totals
  const totalAccountBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );
  const totalCreditCardBalance = creditCards.reduce(
    (sum, card) => sum + card.balance,
    0
  );
  const netWorth = totalAccountBalance - totalCreditCardBalance;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="text-red-700">{error}</div>
        <button
          className="mt-2 text-sm text-red-600 hover:text-red-800"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Financial Dashboard</h1>

      {/* Financial summary */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Balance */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-md p-3">
                <BanknotesIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-slate-500 truncate">
                  Total Balance
                </dt>
                <dd className="flex items-center">
                  <div className="text-lg font-medium text-slate-900">
                    ${totalAccountBalance.toFixed(2)}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>

        {/* Credit Card Debt */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="bg-red-100 rounded-md p-3">
                <CreditCardIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-slate-500 truncate">
                  Credit Card Debt
                </dt>
                <dd className="flex items-center">
                  <div className="text-lg font-medium text-slate-900">
                    ${totalCreditCardBalance.toFixed(2)}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>

        {/* Net Worth */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div
                className={`rounded-md p-3 ${
                  netWorth >= 0 ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {netWorth >= 0 ? (
                  <ArrowUpIcon className="h-6 w-6 text-green-600" />
                ) : (
                  <ArrowDownIcon className="h-6 w-6 text-red-600" />
                )}
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-slate-500 truncate">
                  Net Worth
                </dt>
                <dd className="flex items-center">
                  <div
                    className={`text-lg font-medium ${
                      netWorth >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ${Math.abs(netWorth).toFixed(2)}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spending by Category Chart */}
      <div className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-lg font-medium text-slate-900 mb-4">
          Spending by Category
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spendingByCategory}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}`, "Amount"]} />
              <Legend />
              <Bar dataKey="amount" fill="#3B82F6" name="Amount ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-slate-200">
          <h2 className="text-lg font-medium text-slate-900">
            Recent Transactions
          </h2>
        </div>
        <div className="divide-y divide-slate-200">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-slate-500">
                    {transaction.date.toLocaleDateString()}
                  </p>
                </div>
                <div
                  className={`text-sm font-medium ${
                    transaction.isExpense ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {transaction.isExpense ? "-" : "+"}$
                  {transaction.amount.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-4 sm:px-6 border-t border-slate-200">
          <a
            href="/transactions"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all transactions
          </a>
        </div>
      </div>
    </div>
  );
}
