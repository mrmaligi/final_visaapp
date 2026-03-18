import "server-only";

const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_APP_URL",
];

const optionalEnvVars = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
];

export function validateEnv(): { valid: boolean; missing: string[]; warnings: string[] } {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  // Check optional variables (warn but don't fail)
  for (const envVar of optionalEnvVars) {
    if (!process.env[envVar]) {
      warnings.push(`${envVar} is not set (optional)`);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
  };
}

export function getEnvVar(name: string, required = true): string {
  const value = process.env[name];
  
  if (!value && required) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  
  return value || "";
}

export function getPublicEnvVars() {
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://visahelper.com",
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  };
}

// Runtime validation - call this in layout or middleware
export function validateRuntimeEnv(): void {
  if (typeof window === "undefined") {
    const { valid, missing } = validateEnv();
    
    if (!valid) {
      console.error("Missing required environment variables:", missing);
      // Don't throw in development to allow partial builds
      if (process.env.NODE_ENV === "production") {
        throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
      }
    }
  }
}
