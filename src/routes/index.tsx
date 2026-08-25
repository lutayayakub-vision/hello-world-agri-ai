import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Welcome — Sign in to your account" },
      {
        name: "description",
        content: "Create an account or sign in to manage your profile and account settings.",
      },
      { property: "og:title", content: "Welcome — Sign in to your account" },
      {
        property: "og:description",
        content: "Create an account or sign in to manage your profile and account settings.",
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

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard", replace: true });
  }, [loading, user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-4 text-center">
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        ) : (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Welcome</h1>
            <p className="max-w-md text-muted-foreground">
              Create an account or sign in to manage your profile and account settings.
            </p>
            <Button asChild>
              <Link to="/auth">Get started</Link>
            </Button>
          </>
        )}
      </main>
    </div>
  );
}
