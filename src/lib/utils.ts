import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(2)} K`;
  }
  return `₹${amount}`;
}

export function formatFees(fees: number): string {
  if (fees >= 100000) {
    return `₹${(fees / 100000).toFixed(2)} Lakhs`;
  }
  return `₹${fees.toLocaleString('en-IN')}`;
}

export function formatPackage(packageAmount: number): string {
  if (packageAmount >= 10000000) {
    return `₹${(packageAmount / 10000000).toFixed(2)} Cr PA`;
  } else if (packageAmount >= 1000000) {
    return `₹${(packageAmount / 1000000).toFixed(2)} LPA`;
  }
  return `₹${packageAmount.toLocaleString('en-IN')} PA`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}