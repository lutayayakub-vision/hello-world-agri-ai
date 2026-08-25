import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Your account" },
      { name: "description", content: "Your signed-in account overview and profile summary." },
      { property: "og:title", content: "Dashboard — Your account" },
      {
        property: "og:description",
        content: "Your signed-in account overview and profile summary.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();

  const { data, isPending } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, bio, website, location")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {isPending ? (
            <Skeleton className="h-9 w-64" />
          ) : (
            `Hi, ${data?.display_name ?? user?.email}`
          )}
        </h1>
        <p className="mt-2 text-muted-foreground">You're signed in to your account.</p>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>A quick look at your profile details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {isPending ? (
              <>
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-64" />
              </>
            ) : (
              <>
                <p>
                  <span className="text-muted-foreground">Email: </span>
                  {user?.email}
                </p>
                <p>
                  <span className="text-muted-foreground">Location: </span>
                  {data?.location || "—"}
                </p>
                <p>
                  <span className="text-muted-foreground">Website: </span>
                  {data?.website || "—"}
                </p>
                <p>
                  <span className="text-muted-foreground">Bio: </span>
                  {data?.bio || "—"}
                </p>
              </>
            )}
            <Button asChild className="mt-2">
              <Link to="/settings">Edit profile</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
