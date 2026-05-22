import type { EmiResult } from "./types";

/** Standard reducing-balance EMI: P × r × (1+r)^n / ((1+r)^n − 1) */
export function calculateEmi(principal: number, annualRatePercent: number, tenureMonths: number): EmiResult {
  if (principal <= 0 || tenureMonths <= 0) {
    return { monthlyEmi: 0, totalPayment: 0, totalInterest: 0 };
  }
  if (annualRatePercent <= 0) {
    const monthlyEmi = principal / tenureMonths;
    return {
      monthlyEmi,
      totalPayment: principal,
      totalInterest: 0,
    };
  }

  const r = annualRatePercent / 12 / 100;
  const n = tenureMonths;
  const factor = (1 + r) ** n;
  const monthlyEmi = (principal * r * factor) / (factor - 1);
  const totalPayment = monthlyEmi * n;
  const totalInterest = totalPayment - principal;

  return {
    monthlyEmi: Math.round(monthlyEmi * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
  };
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
