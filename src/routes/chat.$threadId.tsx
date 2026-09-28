import { createFileRoute, Link } from "@tanstack/react-router";
import { ChatWindow } from "@/components/ChatWindow";
import { profile } from "@/data/cv";

export const Route = createFileRoute("/chat/$threadId")({
  head: () => ({
    meta: [
      { title: `Chat · ${profile.name}` },
      {
        name: "description",
        content: `Ask the portfolio assistant about ${profile.name}'s engineering experience, projects and skills.`,
      },
      { property: "og:title", content: `Chat with ${profile.name}'s portfolio assistant` },
      {
        property: "og:description",
        content: "A guided Q&A about workflow automation, projects and technical skills.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const { threadId } = Route.useParams();

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <nav className="mb-6 flex items-center justify-between text-sm">
        <Link to="/" className="font-display text-lg font-bold">
          {profile.initials}
          <span className="text-lime-deep">.</span>
        </Link>
        <Link to="/" className="text-muted-foreground transition hover:text-foreground">
          ← Back to portfolio
        </Link>
      </nav>
      <ChatWindow key={threadId} threadId={threadId} />
    </main>
  );
}
