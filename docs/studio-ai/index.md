---
title: MuleSoftForge Studio AI
description: AI helper for Mule source, DataWeave, Problems and Console in Anypoint Studio
---

# MuleSoftForge Studio AI

<AtAGlance id="studio-ai" />

MuleSoftForge AI is a helper for the source you already have open in Anypoint Studio. It sits beside your project so you can ask about flows, DataWeave, Problems view markers, and Console output, and — when you want a change — review proposed edits before anything is written.

![Right-click in the DataWeave editor of a Transform Message with two errors: the menu shows Send to MuleSoftForge AI and Fix with MuleSoftForge AI](/images/studio-ai/fix-with-ai-context-menu.png)

*Broken DataWeave? Right-click in the editor and choose **Fix with MuleSoftForge AI**. **Send to MuleSoftForge AI** attaches the script to the chat so you can ask about it instead.*

![MuleSoftForge AI in Anypoint Studio: asked to fix a Transform Message script, the AI returned the corrected DataWeave, explained the missing comma, and offered Review diff and Apply to the DataWeave editor](/images/studio-ai/overview-dataweave-fix.png)

*Asked to fix a Transform Message script with a parse error, the AI returned the corrected DataWeave and explained what changed: a missing comma. **Review diff** compares it with your script, and **Apply to the DataWeave editor** puts it in place; nothing changes until you choose. The column on the right shows the model and what this chat, today and this month have cost.*

Studio remains how you create, scaffold, import, run, deploy, and test. The helper does not replace those workflows. It reads the project you are working in, explains what is there, and helps you fix and improve it.

Use it to:

- Explain or change Mule XML and related project files
- Work through DataWeave transformations
- Attach Problems view errors and warnings and ask for fixes
- Attach Console output (build failures, runtime logs) and ask what went wrong
- Paste a screenshot, such as an error dialog or a design, and ask about it

Open a project file (or select the project in Explorer) so the helper can see it. Attach more with **+ Context**, or use **Send to MuleSoftForge AI** from the editor, the canvas, Problems, or Console.

It works with OpenRouter, the MuleSoft AI Gateway LLM Proxy, OpenAI, Anthropic, Ollama, and other OpenAI-compatible endpoints, using your own API key.

Tested with Anypoint Studio 7.28 (Eclipse 4.31, Java 17) on macOS. It needs no other Studio extensions.

## Get started

1. [Install](./install) the plugin from the MuleSoftForge update site.
2. [Set up](./set-up) a provider and your API key.
3. [Use the chat](./use-the-chat): modes, context, and reviewing changes.

New releases arrive through Studio's own updates; see [Update and roll back](./update). To read and build the source yourself, see [Build it yourself](./build-it-yourself).
