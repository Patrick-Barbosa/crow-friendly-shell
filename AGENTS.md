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

## CROW architecture
- Keep prototype library metadata separate from viewer state in the CROW provider; the front-end shell deliberately uses mock session state without a backend.
- Each primary destination and detail/player screen has its own TanStack route with leaf metadata; shared navigation and profile entry belong to the root CROW shell.
- Use a shared directional-focus controller and stable remote IDs for controls, with explicit restoration after transient screens, so television navigation stays consistent.
- All CROW visual colors are semantic global CSS tokens; artwork is served through asset pointers and never used as interface chrome.
