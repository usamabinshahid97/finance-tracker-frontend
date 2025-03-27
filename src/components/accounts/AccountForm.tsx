"use client";

import { useState } from "react";
import { Account } from "@/types";

interface AccountFormProps {
  initialData?: Partial<Account>;
  onSubmit: (data: Omit<Account, "id" | "userId">) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function AccountForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: AccountFormProps) {
  const [formData, setFormData] = useState<Partial<Account>>({
    name: initialData?.name || "",
    accountNumber: initialData?.accountNumber || "",
    bankName: initialData?.bankName || "",
    balance: initialData?.balance || 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Account name is required";
    }

    if (!formData.accountNumber?.trim()) {
      newErrors.accountNumber = "Account number is required";
    }

    if (!formData.bankName?.trim()) {
      newErrors.bankName = "Bank name is required";
    }

    if (formData.balance === undefined || isNaN(Number(formData.balance))) {
      newErrors.balance = "Valid balance is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "balance") {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData as Omit<Account, "id" | "userId">);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-700"
        >
          Account Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
            errors.name
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
          placeholder="e.g., Checking Account"
        />
        {errors.name && (
          <p className="mt-2 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="accountNumber"
          className="block text-sm font-medium text-slate-700"
        >
          Account Number
        </label>
        <input
          type="text"
          id="accountNumber"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
            errors.accountNumber
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
          placeholder="Last 4 digits only"
        />
        {errors.accountNumber && (
          <p className="mt-2 text-sm text-red-600">{errors.accountNumber}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="bankName"
          className="block text-sm font-medium text-slate-700"
        >
          Bank Name
        </label>
        <input
          type="text"
          id="bankName"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
            errors.bankName
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
          placeholder="e.g., Chase Bank"
        />
        {errors.bankName && (
          <p className="mt-2 text-sm text-red-600">{errors.bankName}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="balance"
          className="block text-sm font-medium text-slate-700"
        >
          Current Balance
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-slate-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            step="0.01"
            id="balance"
            name="balance"
            value={formData.balance}
            onChange={handleChange}
            className={`pl-7 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.balance
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            }`}
            placeholder="0.00"
          />
        </div>
        {errors.balance && (
          <p className="mt-2 text-sm text-red-600">{errors.balance}</p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : initialData?.id
            ? "Update Account"
            : "Create Account"}
        </button>
      </div>
    </form>
  );
}
