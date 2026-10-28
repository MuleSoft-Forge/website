---
title: MuleSoftForge Studio AI
description: AI helper for Mule source, DataWeave, Problems and Console in Anypoint Studio
---

# MuleSoftForge Studio AI

MuleSoftForge AI is a helper for the source you already have open in Anypoint Studio. It sits beside your project so you can ask about flows, DataWeave, Problems view markers, and Console output, and — when you want a change — review proposed edits before anything is written.

![MuleSoftForge AI in Anypoint Studio: asked how to improve a flow's error handling, the AI read the project, explained what to change, and proposed an edit to employees-api.xml for review](/images/studio-ai/overview-agent-review.png)

*Asked "How can I improve the error handling", the AI read the project in 10 steps, explained what to change, and proposed an edit to `employees-api.xml`. Nothing is written until you click **Accept**. The header shows what this chat, today and this month have cost.*

Studio remains how you create, scaffold, import, run, deploy, and test. The helper does not replace those workflows. It reads the project you are working in, explains what is there, and helps you fix and improve it.

Use it to:

- Explain or change Mule XML and related project files
- Work through DataWeave transformations
- Attach Problems view errors and warnings and ask for fixes
- Attach Console output (build failures, runtime logs) and ask what went wrong
- Paste a screenshot, such as an error dialog or a design, and ask about it

Open a project file (or select the project in Explorer) so the helper can see it. Attach more with **+ Context**, or use **Ask MuleSoftForge AI** from the editor, Problems, or Console.

It works with OpenRouter, the MuleSoft AI Gateway LLM Proxy, OpenAI, Anthropic, Ollama, and other OpenAI-compatible endpoints, using your own API key.

Tested with Anypoint Studio 7.28 (Eclipse 4.31, Java 17) on macOS. It needs no other Studio extensions.

## Get started

1. [Install](./install) the plugin from the MuleSoftForge update site.
2. [Set up](./set-up) a provider and your API key.
3. [Use the chat](./use-the-chat): modes, context, and reviewing changes.

New releases arrive through Studio's own updates; see [Update and roll back](./update). To read and build the source yourself, see [Build it yourself](./build-it-yourself).
