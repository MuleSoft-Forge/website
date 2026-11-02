---
title: Discover Studio AI
description: Build your first Mule flow with MuleSoftForge Studio AI, from an empty project to a plan you review
---

# Discover Studio AI

Build a small Mule flow from an empty project. You ask in Plan mode first, so you see what the AI wants to do before any file changes. You need the plugin [installed](./install) and a provider [set up](./set-up).

## 1. Plan the flow

Create the project `mymulesoftforge-studio-ai-app`, open MuleSoftForge Studio AI, select **Plan**, and paste this prompt:

<div class="prompt-block">

```text
Create a Mule 4 flow with an HTTP Listener triggered by a POST request to the /api/customers path. The flow will receive a JSON customer payload containing customerId, fullName, and email. Use a Transform Message (DataWeave 2.0) component to convert this JSON into XML, ensuring the XML has a root node called <Customer>. Add Logger components immediately before and after the transformation to print the payload to the console.
```

</div>

Plan mode reads the project and answers with a plan. It does not change files. To learn more about the modes, see [Use the chat](./use-the-chat#modes).

<StepCarousel set="discoverPlan" />

## 2. Build it in Agent mode

**Draft selected changes for review** switches to Agent mode. Review the proposed files, then Accept. The flow appears on the canvas.

<StepCarousel set="discoverBuild" />

## 3. Run and debug with AI

Add a breakpoint, start a debug session, and ask Studio AI to call the endpoint. The debugger stops on the JSON payload.

<StepCarousel set="discoverDebug" />

## 4. Add metadata

Ask Studio AI for sample metadata for the Transform Message. Accept the files, then close and reopen the XML, run **Project > Clean**, and update Maven with **Alt+F5**.

<StepCarousel set="discoverMetadata" />

## 5. Fix the DataWeave

If the DataWeave editor shows an issue, right-click and choose **Fix with MuleSoftForge Studio AI**. Review the diff, apply it, and save.

<StepCarousel set="discoverFix" />

Next: [use the chat](./use-the-chat).
