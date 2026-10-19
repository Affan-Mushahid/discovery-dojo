---
name: interaction-design
description: Design restrained, polished interactions and motion for DiscoveryDojo without sacrificing clarity or accessibility.
---

# Interaction and motion checklist

Use for transitions, feedback states, conversation controls, and other interactive UI. This is project-authored guidance, not an upstream skill copy.

- Motion should communicate cause and effect, hierarchy, or state. Do not animate merely for decoration.
- Prefer short, subtle transitions; avoid delaying user input or making essential information appear only through animation.
- Respect `prefers-reduced-motion`; provide an equivalent non-animated experience.
- Keep interaction states explicit: idle, pending, success, and error. Prevent duplicate submissions while a request is in progress and explain recoverable failures.
- For conversation interfaces, preserve readable transcript order, keep the latest response discoverable, and never make auto-scroll prevent a learner from reviewing earlier messages.
- Check keyboard use, focus continuity, touch behavior, and narrow-screen layouts alongside visual polish.
