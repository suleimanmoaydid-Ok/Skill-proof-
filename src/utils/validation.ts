export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export function validateSafeHttpUrl(rawUrl: string): ValidationResult {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { valid: true };
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return {
        valid: false,
        message: "URL must begin with https:// or http://.",
      };
    }
    if (!parsed.hostname || !parsed.hostname.includes(".")) {
      return {
        valid: false,
        message: "Enter a valid domain name (for example, https://example.org).",
      };
    }
    return { valid: true };
  } catch {
    return {
      valid: false,
      message: "Enter a complete URL including https://.",
    };
  }
}

export function validateGithubRepositoryUrl(rawUrl: string): ValidationResult {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return {
      valid: false,
      message: "Provide a GitHub repository URL or switch to offline evidence notes.",
    };
  }
  const baseCheck = validateSafeHttpUrl(trimmed);
  if (!baseCheck.valid) {
    return baseCheck;
  }
  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    if (host !== "github.com" && host !== "www.github.com") {
      return {
        valid: false,
        message: "Repository URL must point to github.com/owner/repository.",
      };
    }
    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments.length < 2) {
      return {
        valid: false,
        message: "Include both owner and repository name (e.g., https://github.com/owner/project).",
      };
    }
    return { valid: true };
  } catch {
    return { valid: false, message: "Invalid GitHub URL format." };
  }
}

export function validateCompletionYear(year: string): ValidationResult {
  const trimmed = year.trim();
  if (!trimmed) {
    return { valid: false, message: "Year of completion is required." };
  }
  const num = Number(trimmed);
  const currentYear = new Date().getFullYear();
  if (!Number.isInteger(num) || num < 1960 || num > currentYear + 1) {
    return {
      valid: false,
      message: `Enter a valid year between 1960 and ${currentYear + 1}.`,
    };
  }
  return { valid: true };
}
