---
title: MuleSoftForge Studio AI Harness
description: Why faster, cheaper and local models stay on the rails in Anypoint Studio — the six-layer runtime harness around every model call
---

# MuleSoftForge Studio AI Harness

A system prompt alone will not keep a language model honest on Mule 4 XML, DataWeave 2.0, connector schemas or MUnit 3.7 — and smaller, cheaper or local models drift first. Left to themselves, weaker models invent connector attributes, mock `ee:transform` in MUnit, paste XML in chat instead of staging a diff, botch indentation, repeat failing tool calls, or blow past smaller token limits.

**MuleSoftForge Studio AI Harness** is the runtime layer inside the plugin that sits between every model call and your project. Rather than hoping a model follows every instruction in a long prompt, the harness supplies live project facts, tolerates formatting slips, compiles and validates proposals before you see them, nudges or stops misbehaving turns, keeps the context window lean, and routes each message to the model tier it actually needs.

| Where smaller models struggle | What the Studio AI Harness does |
| --- | --- |
| Hallucinating Mule XML tags, `doc:id`s, `pom.xml` coordinates or MUnit syntax | Runs static project checks and the DataWeave compiler on every edit, and holds the turn open until new errors are fixed |
| Guessing connector parameters or error types from training memory | Feeds exact operations, attributes and error types from the connector jars in your `pom.xml` and live Anypoint Exchange search |
| Missing `old_text` matches on whitespace, or deleting code with `<!-- ... -->` | Matches across four normalisation passes, re-indents replacements, blocks omission placeholders, and returns numbered closest lines on a miss |
| Pasting code into prose, claiming an edit without calling a tool, or looping | Auto-nudges pasted code into diffs, challenges false edit claims, blocks repeated calls, and salvages cut-off responses |
| Degrading under bloated prompts and huge MCP tool catalogs | Loads MUnit and metadata prompts only when relevant, funnels 126+ MCP tools through two lightweight tools, and prunes old tool output |
| Paying frontier-model prices on simple questions — or trusting a mini model on Mule XML | **Auto** sends quick questions and test/endpoint runs to your fast model, and promotes edits, DataWeave, MUnit and debugging to your strong model |

## 1. Pre-flight checks and the finish gate

Every time the model calls `edit_file` or `write_file` on Mule XML, MUnit suites, `pom.xml`, `application-types.xml`, DataWeave files or `.properties`/`.yaml` configs, the harness snapshots your project *with the pending proposals applied* and runs static and compiler checks immediately:

- **Mule XML and references:** well-formed XML, declared prefixes, `xsi:schemaLocation` pairs, matching `pom.xml` dependencies for each namespace, valid `config-ref` / `flow-ref` / `tlsContext` / `error-handler` targets, defined `${property}` placeholders, valid `MULE:*` error types, and `<error-handler>` placement.
- **Exact connector schema checks:** every connector operation, source, config attribute and error type is checked against the exact connector version declared in your `pom.xml`.
- **MUnit 3.7 traps:** catches missing `<munit:config>`, attempts to mock `logger` or `ee:transform`, `with-attribute` `doc:id` values that do not exist in `src/main/mule/`, text placed inside `<munit:payload>` instead of `value="…"`, Java-map or single-read stream traps in mocks, missing `src/test/resources/` files, and missing `munit-runner` / `munit-tools` / `munit-maven-plugin` entries in `pom.xml`.
- **Studio metadata (`application-types.xml`):** verifies well-formedness, `<types:enrichment>` references against real flow `doc:id`s, catalog type declarations, and unquoted hyphenated keys in Weave shapes that Studio otherwise surfaces only as baffling DataWeave errors.
- **DataWeave compilation:** when the [DataWeave CLI](./use-the-chat#run-dataweave-with-mulesoft-s-cli) is configured, every changed Transform Message script, inline `#[...]` expression and `.dwl` file is compiled before you see it.

Only problems **introduced by the proposal** are reported back to the model, so pre-existing warnings in an older project never derail a small fix.

### The finish gate

Smaller models sometimes read a check warning in a tool result and try to finish their answer anyway. When **Fix failing checks before finishing** is on (the default), the harness refuses to end the turn while proposed changes still fail checks. Up to twice per turn, it holds the reply back and sends the exact file, line and problem list back to the model so it repairs its own proposal before the diff reaches your screen.

## 2. Grounding tools: facts before XML

Cheaper and local models lack reliable recall for Mule connector versions and DataWeave edge cases. The harness gives them fast, read-only lookup and execution tools so they inspect reality instead of guessing:

- **`connector_reference`:** reads the extension models Anypoint Studio generates under `.mule/plugins-tmp/repository/` for the exact versions in your `pom.xml` — listing configs, connections, operations, sources, whether each parameter is an XML attribute or child element, default values, and raised error types.
- **`search_connectors`:** queries Anypoint Exchange (using Studio's Anypoint sign-in when present so private org assets appear too, or public Exchange otherwise) for ranked Mule 4 connectors and exact Maven coordinates before adding a new system or falling back to a raw `http:request`.
- **Procedural Skills (`use_skill`):** built-in and custom `SKILL.md` workflows (such as `build-mule-integration` and `generate-doc-description`) stay out of the base prompt as a compact catalog and load full step-by-step instructions only when the task calls for them.
- **Runtime verification (`run_dataweave`, `validate_dataweave`, `run_munit`, `call_endpoint`, `evaluate_at_breakpoint`):** instead of reasoning in the dark, a model can execute its DataWeave against sample payloads in an `--untrusted` sandbox, run Studio's native MUnit runner and inspect failure traces, call the running local app (receiving the console lines printed during that call), or evaluate read-only expressions on a paused debugger event.

## 3. Forgiving edits that protect your files

Search-and-replace edits are a classic failure point for smaller models: a tab turned into spaces, a curly quote, or a lazy comment can either fail to apply or wipe out half a flow. `ProjectTools` and `TextMatch` harden `edit_file` in four ways:

1. **Four-pass fuzzy matching:** `TextMatch` tries an exact match first, then falls back line-by-line ignoring trailing whitespace, ignoring leading indentation, and normalising typographic quotes, dashes and non-breaking spaces.
2. **Automatic re-indentation:** when a line match succeeds despite different indentation, `new_text` is re-indented relative to the matched lines in your file so nested XML stays cleanly aligned.
3. **Omission-placeholder blocker:** smaller models love writing shortcuts such as `<!-- ... rest unchanged ... -->` or `// existing flows ...` inside `new_text`. Because `edit_file` replaces `old_text` literally, applying that edit would delete real code — so the harness detects omission placeholders and rejects the edit with clear instructions.
4. **Closest-lines hints and partial-batch preservation:** if `old_text` is not found, the harness scores line similarity across the file and returns the numbered closest lines right in the error message (or notes when `new_text` is already present), so the model copies the exact lines on its next step without re-reading the whole file. When a multi-edit call partially succeeds, the applied edits stay staged and the model is told to resend only the failed ones.

Secrets masked as `«masked-N»` are restored automatically before staging, and if a model invents or mangles a `«masked-N»` token it was never shown, the edit is refused before corrupting a credential.

## 4. Loop recovery, nudges and gateway normalisation

Smaller and local models frequently stumble on multi-step agent mechanics. `ChatSession` and the HTTP layer catch those failure modes mid-turn:

- **Auto-draft nudge:** if you ask for a change in Agent mode and the model pastes XML or DataWeave into its reply instead of calling `edit_file` or `write_file`, the harness catches it before ending the turn and nudges the model once to stage that code as reviewable diffs.
- **False-claim nudge:** if a model replies *"I've proposed the changes"* without having called any edit tool, the harness challenges the reply in the same turn so you are never left looking for a diff that does not exist.
- **Repetition and failed-edit circuit breakers:** tool arguments are canonicalised with sorted JSON keys so key-order changes cannot disguise a loop. An identical failed edit is blocked on the very first retry; any tool call repeated three times with the same arguments is refused (`MAX_IDENTICAL_CALLS = 3`) and the model is told to use the result it already has or change tack.
- **Output-truncation salvage (`FinishReason.LENGTH`):** when a model hits its output token ceiling mid-response, any complete tool calls earlier in that message still execute; only the final truncated tool call is refused with guidance to make smaller `edit_file` steps rather than one large `write_file`. After two cut-offs in one turn, the harness stops cleanly rather than burning tokens in a loop.
- **Automatic `max_tokens` step-down (`OutputCap`):** requests ask for `32,000` output tokens so reasoning models have room to think. When a smaller model rejects that cap with HTTP `400`, the harness automatically retries at `16,384` and then `8,192`, and remembers the accepted ceiling for that endpoint and model on subsequent calls.
- **Gateway choice collapsing (`ChatCompletions`):** some OpenAI-compatible gateways split a single turn into two `choices` (one with reasoning text and a second with `tool_calls`). The harness merges them into one choice on the wire so the client never drops tool calls or throws a parse error.

## 5. Context diet for smaller windows

Smaller models lose track of instructions long before their nominal context limit is full, and prompt caches break whenever tool definitions churn. The harness keeps every request tight and cache-stable:

- **Conditional domain prompts:** the full MUnit 3.7 authoring guide and the Studio DataSense / `application-types.xml` guide are attached only when your message or attachments actually mention tests, `src/test/munit/`, `application-types.xml` or type warnings.
- **Two-tool MCP funnel:** the hosted MuleSoft Platform MCP server alone exposes 126 tools (~67,000 tokens of JSON schemas). Instead of flooding every turn with every server's schema, the harness exposes just two fixed tools — `mcp_find_tools` and `mcp_call` — returning up to 8 matching tool definitions on demand while keeping the tool list identical across turns so prompt caching holds.
- **Attachment deduplication and tool-output pruning:** unchanged file attachments already in the conversation are referenced rather than re-sent; images go only with the message they were pasted into; and older bulky tool outputs beyond the newest `30,000` tokens are replaced with a compact note once `20,000` tokens can be freed in one batch.
- **Proactive and reactive compaction:** when a conversation reaches **85%** of the model's context window — or immediately if a smaller-window model returns a context-overflow error — earlier turns are summarised while keeping recent turns intact.

## 6. `Auto` routing: use the cheap model where it wins

The best help for a small model is not asking it to write complex Mule XML in the first place. Selecting **Auto** at the top of the model picker pairs two models per provider — a **fast, low-cost** model (such as `gpt-5-mini`, `claude-haiku-4-5`, or `gemini-3-flash-preview`) and a **strong** model (such as `claude-sonnet-4.6`, `gpt-5`, or `gemini-3.1-pro-preview`):

- **Fast lane:** plain Ask-mode questions with light context, plus short operational commands (*"run munit"*, *"test again"*, *"call endpoint"*) where Studio's tools do the heavy lifting.
- **Strong lane:** Agent, Plan and Diagnose modes, DataWeave scripts and `.dwl` files, MUnit tests, reviews and bug fixes, live debugger events, pasted screenshots, prompts over 1,500 characters, and attachments over 24,000 characters.
- **Cache-aware stickiness and failover:** once a chat in Agent, Plan or Diagnose moves to the strong model, it stays there so switching models does not throw away your prompt cache; plain Ask questions drop back to the fast model. If the chosen model hits a `408`, `429`, `5xx` or network timeout before answering, `Auto` transparently runs the turn on the other model.

## Verified offline on every build

Every mechanism above is tested without a live API key before a release can ship. The repository's offline test suite (`harness/run-checks.sh`) drives scripted, misbehaving stand-in models through the real `ChatSession` loop — simulating hallucinated `flow-ref`s, pasted code in Agent mode, false edit claims, truncated tool JSON, `400` output-cap rejections, split gateway `choices`, context overflows, and MUnit schema mistakes. See [Build it yourself](./build-it-yourself) to inspect the source and run the checks locally.
