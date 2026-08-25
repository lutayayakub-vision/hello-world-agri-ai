import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home — Your account dashboard" },
      {
        name: "description",
        content: "Sign in to view your account and profile details.",
      },
      { property: "og:title", content: "Home — Your account dashboard" },
      {
        property: "og:description",
        content: "Sign in to view your account and profile details.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  ssr: false,
  component: Index,
});

function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setDisplayName(null);
      return;
    }
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setDisplayName(data?.display_name ?? null));
  }, [user]);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        {loading ? "Loading…" : user ? `Hi, ${displayName ?? user.email}` : "Welcome"}
      </h1>
      <p className="max-w-md text-muted-foreground">
        {user
          ? "You're signed in. Your profile is stored securely in your account."
          : "Create an account or sign in to get started."}
      </p>
      {loading ? null : user ? (
        <Button onClick={handleSignOut}>Sign out</Button>
      ) : (
        <Button asChild>
          <Link to="/auth">Sign in</Link>
        </Button>
      )}
    </main>
  );
}
