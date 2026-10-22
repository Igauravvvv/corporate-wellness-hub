export interface DemoAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  memberType: "professional" | "student";
  badge: string;
  title: string;
}

export const DEMO_ACCOUNTS: readonly DemoAccount[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    email: "alex@company.com",
    password: "Corporate@2026",
    name: "Alex Chen",
    memberType: "professional",
    badge: "Corporate Member",
    title: "Senior Product Tech Lead",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    email: "student@college.edu",
    password: "Student@2026",
    name: "Priya Sharma",
    memberType: "student",
    badge: "Student Scholar",
    title: "Campus Wellness Lead",
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    email: "dr.claire@wellness.org",
    password: "Wellness@2026",
    name: "Dr. Claire Montgomery",
    memberType: "professional",
    badge: "Licensed Care Provider",
    title: "Lead Behavioral Health Specialist",
  },
];

export interface StoredAccount {
  id: string;
  email: string;
  password?: string;
  memberType: "professional" | "student";
  name?: string;
  role?: "admin" | "member";
  createdAt: string;
  lastLoginAt: string;
}

const STORAGE_KEY = "wellness_stored_accounts";
const LAST_EMAIL_KEY = "wellness_last_account_email";

/**
 * Generate a consistent, deterministic UUID for an email address.
 */
export function deterministicIdForEmail(email: string): string {
  const norm = email.trim().toLowerCase();
  if (
    norm === "alex@company.com" ||
    norm === "alex@example.com" ||
    norm === "alex@example.test"
  ) {
    return "11111111-1111-4111-8111-111111111111";
  }
  if (norm === "student@college.edu" || norm === "student@example.test") {
    return "22222222-2222-4222-8222-222222222222";
  }
  if (norm === "dr.claire@wellness.org" || norm === "claire@wellness.org") {
    return "33333333-3333-4333-8333-333333333333";
  }

  let hash1 = 0;
  let hash2 = 0;
  for (let i = 0; i < norm.length; i++) {
    const ch = norm.charCodeAt(i);
    hash1 = (hash1 << 5) - hash1 + ch;
    hash1 |= 0;
    hash2 = (hash2 << 7) - hash2 + ch;
    hash2 |= 0;
  }
  const hex1 = Math.abs(hash1).toString(16).padStart(8, "0");
  const hex2 = Math.abs(hash2).toString(16).padStart(8, "0");
  const hex3 = Math.abs((hash1 ^ hash2) >>> 0).toString(16).padStart(8, "0");
  const hex4 = Math.abs((hash1 * 31 + hash2) >>> 0).toString(16).padStart(8, "0");

  const p1 = (hex1 + hex2).slice(0, 8);
  const p2 = (hex2 + hex3).slice(0, 4);
  const p3 = "4" + (hex3 + hex4).slice(1, 4);
  const p4 = "a" + (hex4 + hex1).slice(1, 4);
  const p5 = (hex1 + hex2 + hex3 + hex4).slice(0, 12);

  return `${p1}-${p2}-${p3}-${p4}-${p5}`.toLowerCase();
}

export function getDemoAccountByEmail(email: string): DemoAccount | undefined {
  if (!email) return undefined;
  const norm = email.trim().toLowerCase();
  return DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === norm);
}

export function getStoredAccounts(): Record<string, StoredAccount> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getStoredAccountByEmail(
  email: string,
): StoredAccount | undefined {
  if (!email) return undefined;
  const accounts = getStoredAccounts();
  return accounts[email.trim().toLowerCase()];
}

export function saveStoredAccount(account: StoredAccount): void {
  if (typeof window === "undefined" || !account.email) return;
  try {
    const accounts = getStoredAccounts();
    const key = account.email.trim().toLowerCase();
    accounts[key] = {
      ...account,
      email: key,
      lastLoginAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    localStorage.setItem(LAST_EMAIL_KEY, key);
  } catch (e) {
    console.error("Error saving stored account", e);
  }
}

export function getLastLoginEmail(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    return localStorage.getItem(LAST_EMAIL_KEY) || undefined;
  } catch {
    return undefined;
  }
}
