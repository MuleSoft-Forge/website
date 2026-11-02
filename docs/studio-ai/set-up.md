---
title: Set Up
description: Choose an AI provider and save your API key for MuleSoftForge Studio AI
---

# Set up a provider

Choose which AI provider to use and enter its API key. Keys are saved in Eclipse secure storage, which on macOS is protected by the Keychain, never in Studio's plain settings files.

<StepCarousel set="provider" />

If saving fails with **No password provided**, see [Troubleshooting](./troubleshooting#could-not-save-settings-no-password-provided).

## Other settings

The same page has more settings under the provider:

- **Chat view**: the rich chat view, the update check, and hiding passwords, keys, tokens, email addresses and phone numbers from the model.
- **Instructions**: your own rules for every chat. See [Your instructions](#your-instructions).
- **HTTP and documentation**: the hosts that the AI can read docs from, and extra HTTP guidance.
- **Network**: company certificates, for Zscaler and similar proxies.
- [**DataWeave CLI**](./use-the-chat#run-dataweave-with-mulesoft-s-cli): where to find `dw`, and a download button.
- **Chat history**: save chats, how many days to keep them, and the raw log of each request and response.

Chats are saved in your Studio workspace, never in your Mule projects, and API keys are never written to them.

![MuleSoftForge Studio AI preferences: Chat view, Instructions, HTTP and documentation, Network, DataWeave CLI and Chat history](/images/studio-ai/setup/07-other-settings.png)

## Your instructions

Your instructions go with every message in every project. Use them for rules that you want each time, so you do not type them again. For rules that belong to one project and its team, use an `AGENTS.md` file at the project root. See [Give it standing instructions](./use-the-chat#give-it-standing-instructions).

<StepCarousel set="instructions" />

### Example: metadata rules for Mule 4

Studio checks each sub-flow and private flow by itself, so DataWeave often shows errors such as `Unable to resolve reference of: payload`. The AI can try to fix these by changing the flows. These rules tell it to fix the metadata instead. Copy them into **Your instructions** and change them for your projects.

::: details Show the metadata rules

```text
METADATA RULES FOR MULE 4 PROJECTS

Studio checks each sub-flow and each private flow by itself.
It does not know the payload, attributes or vars that the calling flow sets.
This gives DataWeave errors such as "Unable to resolve reference of: payload"
and "Property was not found in: Object".
These are metadata problems. They are not code problems.

1. Do not restructure flows to fix them.
   Do not change sub-flows to flows. Do not move scripts to .dwl files.
   Do not inline sub-flows. Do not change pom.xml.
   None of these fix a metadata problem.

2. Put the metadata in these files:
   - src/main/resources/application-types.xml
   - src/main/resources/examples/*.json (one sample file per type)

3. Link a component to its metadata with a doc:id:
   - Give the first component of the sub-flow a unique doc:id (UUID).
   - Add <types:enrichment select="#<doc:id>"> in application-types.xml.
   - Use the same id in both places.
   - Inside it, use types:processor-declaration > types:input-event.
   - Put payload and attributes in types:message
     (types:payload type="X", types:attributes type="Y").
   - Put variables in types:variables.

4. Define every type in types:catalog:
   <types:type name="X" format="json">
     <types:shape format="weave" example="examples/x.json"><![CDATA[%dw 2.0

   type X = { ... }

   ]]></types:shape>
   </types:type>
   - Always write the DataWeave type inside types:shape.
   - An example= attribute alone does not work.
   - Make the type match the example file.

5. Variables:
   <types:variable name="startedAt" type="PlaygroundStartedAt"/>
   - Use name=, not key=.
   - The type must be the name of a catalog type.
     Built-in names such as Number and String do not resolve.
   - For a simple value, make a catalog type, for example
     type PlaygroundStartedAt = Number.

6. Work out the sample data from the code.
   - Read the DataWeave in the sub-flow and the flows that call it.
   - Find every field of payload, attributes and vars that the script uses.
   - Put all of them in the types.
   - Keep the types for the same variable consistent across all callers.

7. Errors show one layer at a time.
   - When one layer is fixed, the next error can show.
   - Read each new message and the stack trace.
   - Stack trace "requireAttribute": an attribute is missing or has the wrong name.
   - "Failed to resolve type X": the type is not in the catalog, or has no shape.
   - Make the smallest change for each message.

8. Warnings "Auto-Coercing type from Any":
   - Do not use "as Object".
   - Use: payload.x match { case v is Object -> v else -> {} }

9. You cannot see what Studio writes.
   - If you are not sure of a format, say so.
   - Ask me to make one example in Studio and copy the file that it writes.
   - Prefer that format to a format from memory.

10. After a metadata change, tell me to do these steps:
    - Close and reopen the XML file.
    - Run Project > Clean.
    - Update Maven with Alt+F5.
```

:::

Next: [discover Studio AI](./discover) with your first flow.
