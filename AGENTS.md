<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
# Rules
- Chatbot is rule-based (src/lib/chat-engine.ts), no LLM — user explicitly forbade AI APIs.
- Chat threads live in browser localStorage at /chat/$threadId — no sign-in needed for visitors.
- Feedback is inserted from the browser into the feedback table (anon insert only, no public reads).
- Admin access: user_roles table + has_role(); first signed-in user claims admin via claim_first_admin() RPC on /admin.
- Portfolio page content/styles live as one JSON row in site_content (public read, admin write), edited in /admin; src/lib/site-content.ts holds defaults from cv.ts — lets the owner edit without code.
