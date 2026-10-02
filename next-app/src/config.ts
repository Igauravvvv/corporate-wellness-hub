export interface Config { ii_derivation_origin?: string }
export async function loadConfig(): Promise<Config> { return {}; }
/** Legacy export only. The active application uses lib/backend.ts and Supabase. */
export async function createActorWithConfig(_options?: unknown): Promise<never> {
  throw new Error('The Internet Computer backend is retired. Use the Supabase backend.');
}
