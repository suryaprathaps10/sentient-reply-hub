import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { createThread, newId, upsertThread } from "@/lib/threads";
import { profile } from "@/data/cv";

export const Route = createFileRoute("/chat/")({
  head: () => ({
    meta: [
      { title: `New chat · ${profile.name}` },
      {
        name: "description",
        content: `Start a conversation with the portfolio assistant for ${profile.name}.`,
      },
      { property: "og:title", content: `New chat · ${profile.name}` },
      {
        property: "og:description",
        content: "Start a guided Q&A about engineering experience, projects and skills.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewChat,
});

function NewChat() {
  const navigate = useNavigate();

  useEffect(() => {
    const id = newId();
    upsertThread(createThread(id));
    navigate({ to: "/chat/$threadId", params: { threadId: id }, replace: true });
  }, [navigate]);

  return (
    <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
      Opening a new chat…
    </div>
  );
}
