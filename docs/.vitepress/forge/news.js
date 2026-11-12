// Newest first. Feeds the What's New page and /feed.xml.

export const news = [
  {
    date: '2026-11-11',
    asset: 'chunking',
    title: 'Mule Chunking Connector 1.0.0: chunking by delimiter',
    summary: 'Process any stream in chunks, by size or by record, without holding the whole content in memory. 1.0.0 adds chunking by delimited records, such as 1000 lines each. Its four streaming strategies count their limits in chunks, one of them a sliding window for several readers at the same time, and invalid settings raise typed errors. 1.0.0 changes the operation\'s settings: 0.2.0 applications need the upgrade steps.',
    link: '/connectors/mule-chunking-connector/upgrading'
  },
  {
    date: '2026-11-08',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.34: MCP servers',
    summary: 'Turn on the hosted MuleSoft Platform server and ask about your APIs, policies, environments, governance and monitoring — it signs in with Studio\'s Anypoint login. Add your own remote servers in mcp.json. Tools that change your account run only in Agent mode, and Studio asks you to allow each call.',
    link: '/studio-ai/set-up'
  },
  {
    date: '2026-11-08',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.33: search Exchange for connectors',
    summary: 'search_connectors finds the Exchange connector for a named system (Salesforce, ServiceNow, Slack…) and proposes its pom.xml dependency. Uses Studio\'s Anypoint login when signed in so private org connectors are found too; otherwise the public Exchange.',
    link: '/studio-ai/use-the-chat'
  },
  {
    date: '2026-11-08',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.32: rules, skills and workflows',
    summary: 'Add rules, skills and workflows at built-in, global and project levels. Rules go with every message; skills load when a task matches; type /name to run a workflow. Failing project checks are sent back (up to twice) before the AI may finish, and Accept asks you to confirm if they still fail.',
    link: '/studio-ai/set-up'
  },
  {
    date: '2026-11-07',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.31: Don\'t suggest unwanted offers',
    summary: 'Stop unwanted suggestions with Don\'t suggest on each offered change: save a rule for you alone (memory.md) or for the project (AGENTS.md). Both are sent with every chat. Settings links open those files for editing.',
    link: '/studio-ai/use-the-chat'
  },
  {
    date: '2026-11-06',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.30: diagnose failed runs from the console',
    summary: 'When an app, debug or MUnit run fails, the AI reads the console\'s error lines — including ones in the middle of a long console — and diagnoses from them instead of guessing. MUnit failures keep every test\'s message and the run\'s console. A new chat starts at the top of the page.',
    link: '/studio-ai/use-the-chat'
  },
  {
    date: '2026-11-06',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.29: stop the app again, steadier scrolling',
    summary: 'The chat can stop, restart and switch your app between run and debug again (0.5.28 removed that by mistake), and starts the right project when another one is running. Chat scrolling follows new output until you scroll up, and long answers open at their first line.',
    link: '/studio-ai/use-the-chat'
  },
  {
    date: '2026-11-06',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.28: news feed and quieter side panel',
    summary: 'News from MuleSoftForge in the side panel (folded away until opened); Prices and News are tidy section headers; tips and witty loading lines are on by default. The AI starts the app or debugger when asked but never stops it — stopping stays with you in Studio.',
    link: '/studio-ai/use-the-chat'
  },
  {
    date: '2026-11-06',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.27: chat polish, hooks and richer HTTP',
    summary: 'Thought blocks, shimmer and loading phrases; background alerts with an optional sound; user hooks; thumbs open LinkedIn or feedback; starter cards use Studio icons and the Forge round logo. call_endpoint supports multipart and binary bodies, plus search_files and tighter Mule checks.',
    link: '/studio-ai/use-the-chat'
  },
  {
    date: '2026-11-05',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.26: interactive chat',
    summary: 'ask_followup_question and update_todo_list, plus chat UX: clickable answers, live todos, retry/edit, message queue, sticky header, quote, starters, thumbs and plan approve. Azure Refresh uses /openai/models so listing no longer 404s on the data plane.',
    link: '/studio-ai/use-the-chat'
  },
  {
    date: '2026-11-05',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.25: Bedrock, Azure and Gemini',
    summary: 'Amazon Bedrock uses inference-profile defaults, can Refresh models from AWS, labels the Region field, and estimates cost for us./global. ids. Azure OpenAI works with GPT-5.x (SDK latest api-version and max_completion_tokens). Gemini defaults to gemini-3-flash-preview for new Google AI Studio keys.',
    link: '/studio-ai/set-up'
  },
  {
    date: '2026-11-05',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.24: streaming replies',
    summary: 'Replies stream into the chat with a live status line, a seconds counter and the answer text as it arrives. edit_file takes several edits at once, long chats are compacted automatically, failed calls are retried, and a Continue button appears at the step limit. Prompt caching also works on native Anthropic and Bedrock.',
    link: '/studio-ai/use-the-chat'
  },
  {
    date: '2026-11-04',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.23: cheaper follow-up questions',
    summary: 'Switching modes no longer clears the cached conversation. Earlier turns keep only the names of attached files, and the open file is attached again each turn, so each new message reuses the prompt cache.',
    link: '/studio-ai/use-the-chat'
  },
  {
    date: '2026-11-04',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.22: finish cut-off edits, keep the cache',
    summary: 'When a reply hits the output limit, finished edits in it still run and only the cut-off one is retried. Every mode offers the same tools, so switching from Ask to Agent keeps the prompt cache and costs less.',
    link: '/studio-ai/use-the-chat'
  },
  {
    date: '2026-11-04',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.21: reopened chats keep their project',
    summary: 'A reopened chat keeps working on its project after a restart, even with no file open. When no project is available, the AI asks you to open or select one. Also includes 0.5.20: cut-off replies no longer loop, and large files use small edits.',
    link: '/studio-ai/use-the-chat'
  },
  {
    date: '2026-11-04',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.19: secrets in pasted messages',
    summary: 'Tokens, passwords and API keys pasted into a message are hidden from the model; calls to your app still use the real value. Auto keeps short run and call requests on the fast model even when they include a long token.',
    link: '/studio-ai/use-the-chat#secrets-stay-off-the-model'
  },
  {
    date: '2026-11-04',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.18: prompt caching and metadata help',
    summary: 'Prompt caching for Claude models cuts the cost of long chats. Auto sends simple run and call requests to the fast model. Help for Studio metadata (application-types.xml), clearer DataWeave Fix messages when metadata is missing, and MUnit test data that no longer fails with Stream closed.',
    link: '/studio-ai/set-up#your-instructions'
  },
  {
    date: '2026-11-03',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.17: MUnit mocks that pass first time',
    summary: 'MUnit mock payloads that stay as Java maps or Strings are rejected, and the prompt teaches JSON-typed mocks so suites pass first time. DataWeave checks accept one-line output headers and #[...] values.',
    link: '/studio-ai/use-the-chat'
  },
  {
    date: '2026-11-03',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.16: MUnit shapes and accurate run results',
    summary: 'MUnit suites are checked against MUnit\'s own schemas, so drafted tests parse first time. run_munit waits for its own run to finish and no longer reports the previous run\'s results.',
    link: '/studio-ai/use-the-chat'
  },
  {
    date: '2026-11-03',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.15: MUnit from a flow',
    summary: 'Create MUnit tests from a flow or sub-flow on the canvas, with scenarios to pick and static checks for suites and the pom. In Agent and Diagnose mode, run_munit runs your suites in Studio and explains the failures.',
    link: '/studio-ai/use-the-chat'
  },
  {
    date: '2026-11-03',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.14: run or debug the app from chat',
    summary: 'The AI can run or debug your app in Agent and Diagnose mode, like Run As / Debug As > Mule Application. Calling an endpoint while debugging no longer hangs the chat: a request held at a breakpoint comes back as PAUSED, and Cancel works at once.',
    link: '/studio-ai/discover'
  },
  {
    date: '2026-11-02',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.13: renamed to MuleSoftForge Studio AI',
    summary: 'Renamed to MuleSoftForge Studio AI everywhere: the view tab, Preferences, menus, chat speaker label, and the system prompt persona.',
    link: '/studio-ai/'
  },
  {
    date: '2026-11-02',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.12: card-style chat and DataWeave CLI fallback',
    summary: 'The message box and Proposed changes are cards in the chat view. The price list folds under Show prices. A missing or broken DataWeave CLI no longer stops a chat: Preferences shows why, and the DataWeave tools stay off until it runs.',
    link: '/studio-ai/install'
  },
  {
    date: '2026-11-01',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.11: Diagnose mode',
    summary: 'A new Diagnose mode finds why something goes wrong, with evidence: it reproduces the problem against your running app, reads the console and the Mule XML at the line the error names, checks the cause, and offers the fixes for Agent mode. Calls to the running app now include what its console printed.',
    link: '/studio-ai/use-the-chat#modes'
  },
  {
    date: '2026-11-01',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.9: call the running app and read MuleSoft docs',
    summary: 'The AI can list your app\'s HTTP endpoints, call the app you are running in Studio on localhost, and compare the response with what you expect. It reads MuleSoft documentation pages to check a connector\'s parameters instead of answering from memory.',
    link: '/studio-ai/use-the-chat'
  },
  {
    date: '2026-10-31',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.8: Feedback in the view',
    summary: 'Feedback in the MuleSoftForge Studio AI header opens a bug or feedback form. Open on GitHub fills a public issue on the plugin\'s repository for you to create. Secrets are masked; leave out customer data.',
    link: '/studio-ai/use-the-chat#feedback-and-bug-reports'
  },
  {
    date: '2026-10-31',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.7: debug with AI, and DataWeave checked with MuleSoft\'s CLI',
    summary: 'When Studio\'s Mule debugger stops, Ask about this event attaches the live payload, attributes, variables and error, and the AI tests its fix against that event before proposing it. With MuleSoft\'s DataWeave CLI, proposed DataWeave is compiled and scripts are run on sample input. Accept now works for proposals that create files or folders.',
    link: '/studio-ai/use-the-chat#debug-with-ai'
  },
  {
    date: '2026-10-31',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.6: cancel from the Progress view, Studio themes, clearer errors',
    summary: 'Each answer runs as a Studio job you can cancel from the chat or the Progress view. The view follows Studio\'s light and dark themes, with its colours under Colors and Fonts. Accept all writes every file in one step, and network errors say what to fix.',
    link: '/studio-ai/use-the-chat#review-proposed-changes'
  },
  {
    date: '2026-10-30',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.4: standing instructions from AGENTS.md and Preferences',
    summary: 'Team conventions in the project\'s AGENTS.md and your own instructions in Preferences go with every message, with secrets masked. They shape style and Mule conventions; the rules that keep secrets masked and changes reviewable always apply. Show built-in prompt shows what the helper sends.',
    link: '/studio-ai/use-the-chat#give-it-standing-instructions'
  },
  {
    date: '2026-10-30',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.3: every suggested change arrives as a diff',
    summary: 'In Agent mode, code the model writes in its answer is turned into proposed changes in the same turn, so you review diffs instead of copying code. Buttons under answers now say Draft, because nothing is written until you accept.',
    link: '/studio-ai/use-the-chat#modes'
  },
  {
    date: '2026-10-30',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.2: Auto picks the model for you',
    summary: 'Choose Auto and each message goes to a fast model for simple questions or a strong one for changes, reviews, fixes and images. If the chosen model is rate-limited or down, Auto tries the other. Ask mode now only lists fixes when you ask for a review or a fix.',
    link: '/studio-ai/use-the-chat#auto'
  },
  {
    date: '2026-10-30',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.1: see the raw request and response of every turn',
    summary: 'Tick Raw in the chat view and each answer gets a collapsed section with every model call it made: method, URL, HTTP status and the exact request and response bodies. Headers and API keys are never recorded.',
    link: '/studio-ai/use-the-chat#see-exactly-what-was-sent'
  },
  {
    date: '2026-10-30',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.0: passwords and secrets scrubbed before the model sees them',
    summary: 'Passwords, API keys, tokens and client ids in properties, YAML, Mule XML, URLs, console output and your messages are hidden from the model as «masked-N». Proposed edits still apply with the real values. .env files, private keys and keystores are never sent.',
    link: '/studio-ai/update'
  },
  {
    date: '2026-10-28',
    asset: 'studio-ai',
    title: 'Studio AI 0.4: proposal checks, connector lookup and Send to MuleSoftForge Studio AI everywhere',
    summary: 'Proposed edits are checked before you apply them, the helper can look up connectors, and you can send a selection to the chat from DataWeave editors and the flow canvas. 0.4.6 tidies the chat composer onto one row.',
    link: '/studio-ai/update'
  },
  {
    date: '2026-10-28',
    asset: 'studio-ai',
    title: 'MuleSoftForge Studio AI launches',
    summary: 'An AI helper inside Anypoint Studio for Mule XML, DataWeave, Problems and Console output. Bring your own key for OpenRouter, MuleSoft AI Gateway, OpenAI, Anthropic, Ollama or any OpenAI-compatible endpoint.',
    link: '/studio-ai/'
  },
  {
    date: '2026-10-26',
    asset: 'json-logger',
    title: 'JSON Logger documentation',
    summary: 'Set-up, the Logger operation and the Logger Scope are now documented, including forwarding to Anypoint MQ, JMS and AMQP.',
    link: '/modules/json-logger/'
  },
  {
    date: '2026-10-25',
    asset: 'typesafe',
    title: 'TypeSafe Connector 1.0.3: Locate, Why a Connector and the playground',
    summary: 'Locate returns a bounding box for image questions, and a new sample app playground runs every operation from the browser.',
    link: '/connectors/mule4-typesafe-connector/operations/locate'
  },
  {
    date: '2026-10-01',
    asset: 'typesafe',
    title: 'TypeSafe Connector 1.0.2: per-option Choice and three-band policies',
    summary: 'Apply Policy now fails closed and validates policies, Choice supports per-option thresholds, and Yes/No policies gain a REVIEW band.',
    link: '/connectors/mule4-typesafe-connector/how-decisions-work'
  },
  {
    date: '2026-09-28',
    asset: 'typesafe',
    title: 'TypeSafe Connector for Mule 4 on Maven Central',
    summary: 'Typed decisions with Jev from a Mule flow: Evaluate, Ask Yes/No, Choose and Score with native DataSense.',
    link: '/connectors/mule4-typesafe-connector/'
  },
  {
    date: '2026-08-23',
    asset: 'salesforce-userinfo',
    title: 'Agent Network Studio and the Salesforce UserInfo Claims Enrichment Policy',
    summary: 'A browser studio for MuleSoft Agent Networks, and a Flex Gateway policy that brings per-user Salesforce attributes to MCP tool authorization.',
    link: 'https://www.agentnetworktracer.com'
  },
  {
    date: '2026-03-13',
    asset: 'infa-mdm',
    title: 'Informatica MDM Connector 1.0.5: non-blocking re-authentication',
    summary: 'A 401 now triggers asynchronous re-login and retry, so the HTTP requester thread is no longer blocked.',
    link: '/connectors/mule-infa-mdm-connector/set-up'
  },
  {
    date: '2026-03-07',
    asset: 'infa-mdm',
    title: 'Informatica MDM Connector 1.0.4: MetaData Read and Http Request',
    summary: 'Passthrough authentication, automatic reconnect on 401, a MetaData Read operation and the renamed Http Request operation.',
    link: '/connectors/mule-infa-mdm-connector/operations/'
  },
  {
    date: '2026-02-22',
    asset: 'lettuce-redis',
    title: 'Lettuce Redis Connector documentation',
    summary: 'Every operation group, Pub/Sub sources and Send Command are now documented.',
    link: '/connectors/mule-lettuce-redis-connector/'
  },
  {
    date: '2026-01-23',
    asset: 'chunking',
    title: 'Mule Chunking Connector 0.2.0',
    summary: 'Released to Maven Central under com.mulesoftforge.',
    link: '/connectors/mule-chunking-connector/set-up'
  },
  {
    date: '2025-09-08',
    asset: 'pdfbox',
    title: 'PDFBox Module 1.0.2: Image to PDF',
    summary: 'Convert images into PDF documents inside a flow.',
    link: '/modules/mule-pdfbox-module/operations/apache-pdfbox-image-to-pdf'
  },
  {
    date: '2025-09-07',
    asset: 'idp',
    title: 'IDP Connector 1.0.6',
    summary: 'Maintenance release on Maven Central.',
    link: '/connectors/mule-idp-connector/set-up'
  }
]
