# Reusable agent skills

Project-local skill instructions are in `.agents/skills/` and can be used by coding agents working in this repository. They are concise, project-scoped checklists rather than copies of upstream content.

## Requested upstream collections

The requested sources are `vercel-labs/agent-skills` and `emilkowalski/skill`. The documented Skills CLI add workflow is:

```sh
npx skills add vercel-labs/agent-skills
npx skills add emilkowalski/skill
```

Inspect the CLI's proposed skill names, files, and destination before confirming; review generated files and resolve overlapping skill IDs rather than overwriting project guidance blindly. Re-run the add workflow when intentionally updating upstream skills, then review the diff. Do not claim upstream skill files have been fetched when network/CLI access is unavailable.

The current project workspace has file-edit tools but no shell/CLI execution tool, so those upstream commands could not be executed or their install prompts/effects verified here. The local skills shipped in this phase are authored project guidance and are not represented as upstream copies. Run the commands above in a network-enabled project terminal to install the original collections and review the resulting changes.
