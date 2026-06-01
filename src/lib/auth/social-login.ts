import { supabase } from "./supabase";

export type OAuthProvider = "google" | "apple" | "facebook";

export async function signInWithSocial(provider: OAuthProvider): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
}
