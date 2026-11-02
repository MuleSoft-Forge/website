// Step-by-step screenshots for the Studio AI doc pages, shown by StepCarousel.
// `text` is trusted HTML written here, not user input.

const install = (file) => `/images/studio-ai/install/${file}`
const setup = (file) => `/images/studio-ai/setup/${file}`
const discover = (file) => `/images/studio-ai/discover/${file}`

export const DISCOVER_PROJECT = 'mymulesoftforge-studio-ai-app'

export const stepSets = {
  install: [
    {
      src: install('01-welcome.png'),
      title: 'Start Anypoint Studio',
      text: 'If the welcome window opens, click <strong>Continue to Studio</strong>.',
      alt: 'Anypoint Studio welcome window with the Continue to Studio button'
    },
    {
      src: install('02-help-menu.png'),
      title: 'Open Install New Software',
      text: 'Choose <strong>Help &gt; Install New Software…</strong>',
      alt: 'Help menu in Anypoint Studio with Install New Software selected'
    },
    {
      src: install('03-available-software.png'),
      title: 'Add an update site',
      text: 'The <strong>Install</strong> dialog opens. Click <strong>Add…</strong> next to <strong>Work with</strong>.',
      alt: 'Install dialog with no site selected and the Add button'
    },
    {
      src: install('04-add-repository.png'),
      title: 'Enter the MuleSoftForge update site',
      text: 'For <strong>Name</strong>, type <code>MuleSoftForge Studio AI</code>. For <strong>Location</strong>, paste <code>https://docs.mulesoftforge.com/studio-ai/updates/</code>. Click <strong>Add</strong>.',
      alt: 'Add Repository dialog with the name MuleSoftForge Studio AI and the location https://docs.mulesoftforge.com/studio-ai/updates/'
    },
    {
      src: install('05-select-feature.png'),
      title: 'Select MuleSoftForge Studio AI',
      text: 'Tick <strong>MuleSoftForge</strong>. This also ticks <strong>MuleSoftForge Studio AI</strong> and shows its version. Click <strong>Next</strong>.',
      alt: 'Install dialog with MuleSoftForge and MuleSoftForge Studio AI 0.5.13 ticked'
    },
    {
      src: install('06-install-details.png'),
      title: 'Review and finish',
      text: 'Studio shows the item to install. Click <strong>Finish</strong>. The install continues in the status bar at the bottom of Studio.',
      alt: 'Install Details page listing MuleSoftForge Studio AI with the Finish button'
    },
    {
      src: install('07-always-trust-confirm.png'),
      title: 'Do not trust all content',
      text: 'Studio asks if you trust unsigned content. Do not tick <strong>Always trust all content</strong>. If you tick it, Studio asks you to confirm. Click <strong>No, Prompt Me Instead</strong>.',
      alt: 'Always Trust Everything Confirmation dialog with the No, Prompt Me Instead button'
    },
    {
      src: install('08-trust-artifacts.png'),
      title: 'Trust this plugin only',
      text: 'Tick the <strong>Unsigned</strong> row. The list under it must show <code>com.mulesoftforge.studio.ai</code> and <code>com.mulesoftforge.studio.ai.feature</code>. Click <strong>Trust Selected</strong>. Beta releases are not signed yet, so Studio asks on each install and update.',
      alt: 'Trust Artifacts dialog with the Unsigned row ticked and the plugin and feature listed'
    },
    {
      src: install('09-restart.png'),
      title: 'Restart Studio',
      text: 'When Studio asks to restart, click <strong>Restart Now</strong>.',
      alt: 'Software Updates dialog asking to restart Anypoint Studio, with the Restart Now button'
    },
    {
      src: install('10-toolbar-button.png'),
      title: 'Click the MuleSoftForge button',
      text: 'After the restart, the MuleSoftForge button is on the toolbar. Click it. You can also press <strong>Cmd/Ctrl+Alt+I</strong>.',
      alt: 'Anypoint Studio after the restart, with the MuleSoftForge button on the toolbar'
    },
    {
      src: install('11-view-opens.png'),
      title: 'The view opens',
      text: 'The <strong>MuleSoftForge Studio AI</strong> view opens in the bottom panel. Its header shows the provider, <strong>Settings</strong> and the installed version. On the right, all <strong>Cost</strong> values show <strong>$0.00 · 0 tokens</strong>. This is correct: they start empty and fill in when you send messages.',
      alt: 'MuleSoftForge Studio AI view in the bottom panel, showing OpenRouter, Settings and v0.5.13'
    },
    {
      src: install('11b-show-prices.png'),
      title: 'See the model prices',
      text: 'Click <strong>Show prices</strong> under <strong>Cost</strong> to see the price per 1M input and output tokens of each model. The prices are public list prices from OpenRouter. Your provider or endpoint can set different prices, so use them as a guide. Click <strong>Refresh</strong> to load them again.',
      alt: 'Cost column with empty costs and the price list per 1M tokens, from public OpenRouter list prices'
    },
    {
      src: install('12-view-moved.png'),
      title: 'Move the view',
      text: 'Drag the view tab to a different place, for example next to the editor.',
      alt: 'MuleSoftForge Studio AI view moved next to the editor area'
    },
    {
      src: install('13-view-light.png'),
      title: 'Give it more space',
      text: 'The chat fills the space that you give it. A tall column next to the editor works well.',
      alt: 'Large Anypoint Studio window with the MuleSoftForge Studio AI view as a tall column'
    },
    {
      src: install('14-view-dark.png'),
      title: 'Light or dark',
      text: 'The view follows the Studio theme. This is the dark theme.',
      alt: 'MuleSoftForge Studio AI view in the dark Anypoint Studio theme'
    }
  ],

  provider: [
    {
      src: setup('01-settings-menu.png'),
      title: 'Open Settings',
      text: 'On macOS, choose <strong>Anypoint Studio &gt; Settings…</strong> (Cmd+,). On Windows, choose <strong>Window &gt; Preferences</strong>. You can also click <strong>Settings</strong> in the view header.',
      alt: 'Anypoint Studio menu with Settings selected'
    },
    {
      src: setup('02-provider-list.png'),
      title: 'Pick a provider',
      text: 'Select <strong>MuleSoftForge Studio AI</strong> on the left. Open the <strong>Provider</strong> list and pick your provider: OpenRouter, OpenAI, Anthropic, Google Gemini, Azure OpenAI, Amazon Bedrock, Ollama (local) or Other OpenAI-compatible.',
      alt: 'MuleSoftForge Studio AI preferences with the Provider list open'
    },
    {
      src: setup('03-provider-fields.png'),
      title: 'Paste your API key',
      text: 'The <strong>Base URL</strong> fills in for the provider. Paste your <strong>API key</strong>. Under the field, Studio shows only the start, the last characters and the length of the key. <strong>Auto fast model</strong> and <strong>Auto strong model</strong> are the two models that <strong>Auto</strong> uses.',
      alt: 'OpenRouter selected, with Base URL, Model, Auto fast model, Auto strong model and a masked API key'
    },
    {
      src: setup('04-model-list.png'),
      title: 'Choose a model',
      text: 'Pick a <strong>Model</strong> from the list, or type any model id. <strong>Auto</strong> sends simple questions to the fast model and changes, reviews, fixes and images to the strong model. On OpenRouter, <code>openrouter/auto</code> lets OpenRouter pick.',
      alt: 'Model list open, with openrouter/auto, Auto and many provider models'
    },
    {
      src: setup('05-refresh-models.png'),
      title: 'Refresh the model list',
      text: 'Click <strong>Refresh models</strong> to load the models that your account can use. The line under the buttons shows how many models it loaded.',
      alt: 'Status line under the buttons: Loaded 415 from OpenRouter; showing 201 in the list'
    },
    {
      src: setup('06-test-connection.png'),
      title: 'Test the connection',
      text: 'Click <strong>Test connection</strong>. It sends a one-word request to the model. <strong>Connected. Model replied: ok</strong> means that the provider, model and key work. If it fails, the message shows the HTTP status and the response from the provider. Then click <strong>Apply and Close</strong>.',
      alt: 'Test connection result: Connected. Model replied: ok'
    }
  ],

  discoverPlan: [
    {
      src: discover('01-plan-prompt.png'),
      title: 'Create the project and ask in Plan mode',
      text: `Choose <strong>File &gt; New &gt; Mule Project</strong>. For <strong>Project Name</strong>, type <code>${DISCOVER_PROJECT}</code> and click <strong>Finish</strong>. Open MuleSoftForge Studio AI, select <strong>Plan</strong>, paste the prompt below, and click <strong>Send</strong>. Plan mode reads the project and writes a plan. It does not change files.`,
      alt: `Project ${DISCOVER_PROJECT} open with Plan mode selected and the customers flow prompt in the message box`
    },
    {
      src: discover('02-plan-working.png'),
      title: 'Plan mode works',
      text: 'The steps show <strong>Following your instructions</strong>, <strong>Listing project root</strong>, <strong>Looking up http</strong> and <strong>Running DataWeave on sample input</strong>. Wait for the plan.',
      alt: 'Plan mode working: Following your instructions, Listing project root, Looking up http, Running DataWeave on sample input'
    },
    {
      src: discover('03-plan-ready.png'),
      title: 'Review the plan',
      text: 'The plan is ready. <strong>Changes it can make</strong> lists one ticked change for the HTTP Listener, Transform Message and Loggers. Click <strong>Draft selected changes for review</strong>.',
      alt: 'Plan ready with Changes it can make and the Draft selected changes for review button'
    }
  ],

  discoverBuild: [
    {
      src: discover('04-agent-drafting.png'),
      title: 'Agent mode drafts the change',
      text: 'The view switches to <strong>Agent</strong> mode and drafts the change. Wait for the proposed files.',
      alt: 'Agent mode drafting the change after Draft selected changes for review'
    },
    {
      src: discover('05-proposed-changes.png'),
      title: 'Review the proposed files',
      text: '<strong>Proposed changes (2 files)</strong> lists <code>config.properties</code> (new) and the flow XML (+26 −2). The answer includes a <code>curl</code> command for the test. Click <strong>Review</strong> or <strong>Accept</strong>.',
      alt: 'Proposed changes for config.properties and the flow XML, with Review and Accept'
    },
    {
      src: discover('06-accepted-flow.png'),
      title: 'The flow is on the canvas',
      text: 'The changes are accepted. The canvas shows the flow: HTTP Listener, Logger before, Transform Message, Logger after. You can undo with <strong>Replace With &gt; Local History…</strong>.',
      alt: 'Accepted flow on the canvas with Local History undo available'
    }
  ],

  discoverDebug: [
    {
      src: discover('07-add-breakpoint.png'),
      title: 'Add a breakpoint',
      text: 'Right-click the first Logger (<strong>Log payload before</strong>) and choose <strong>Add Breakpoint</strong>.',
      alt: 'Right-click menu on Log payload before with Add Breakpoint selected'
    },
    {
      src: discover('08-debug-project.png'),
      title: 'Start the debug session',
      text: 'Right-click the canvas and choose <strong>Debug project mymulesoftforge-studio-ai-app</strong>.',
      alt: 'Right-click menu on the canvas with Debug project selected'
    },
    {
      src: discover('09-app-deployed.png'),
      title: 'The app is deployed',
      text: 'The Console shows that the app started. The Mule Debugger waits for a Mule message.',
      alt: 'Console shows DEPLOYED and the Mule Debugger waits for a message'
    },
    {
      src: discover('10-ai-in-debug.png'),
      title: 'Keep Studio AI in the Debug view',
      text: 'Move the MuleSoftForge Studio AI view into the Debug perspective. The note says that the debugger is not stopped yet.',
      alt: 'Studio AI in the Debug perspective with a note that the debugger is not stopped'
    },
    {
      src: discover('11-send-to-ai.png'),
      title: 'Send the flow to Studio AI',
      text: 'Right-click the flow and choose <strong>Send to MuleSoftForge Studio AI</strong>. This attaches the XML of the selected elements.',
      alt: 'Right-click menu with Send to MuleSoftForge Studio AI and its tooltip'
    },
    {
      src: discover('12-call-dont-wait.png'),
      title: 'Ask it to call the endpoint',
      text: 'The flow is attached. Type <code>Call and DONT wait for Return</code> and click <strong>Send</strong>.',
      alt: 'Message box with Call and DONT wait for Return and the attached flow'
    },
    {
      src: discover('13-debugger-stopped.png'),
      title: 'The debugger stops on the JSON',
      text: 'Studio AI calls <code>POST http://localhost:8081/api/customers</code>. The debugger stops at <strong>Log payload before</strong>, and the JSON payload shows. Click <strong>Ask about this event</strong> if you want Studio AI to explain it.',
      alt: 'Debugger stopped at Log payload before with the JSON customer payload'
    }
  ],

  discoverMetadata: [
    {
      src: discover('14-metadata-proposed.png'),
      title: 'Ask for metadata',
      text: 'Step the debugger to <strong>Log payload after</strong> so the XML payload shows. Ask <code>Create an example metadata file for test xml</code>. Studio AI proposes 4 files: <code>customer.json</code>, <code>customer.xml</code>, <code>application-types.xml</code> and the flow XML.',
      alt: 'Debugger at Log payload after with XML payload, and proposed metadata files'
    },
    {
      src: discover('15-metadata-instructions.png'),
      title: 'Follow the metadata steps',
      text: 'The answer follows the rules from <a href="/studio-ai/set-up#your-instructions">Your instructions</a>: close and reopen the XML file, run <strong>Project &gt; Clean</strong>, and update Maven with <strong>Alt+F5</strong>. Stop the project first if it is still running.',
      alt: 'Studio AI answer with After you accept the changes: close and reopen, Clean, Alt+F5'
    },
    {
      src: discover('16-transform-metadata.png'),
      title: 'Metadata appears on Transform Message',
      text: 'Open the Transform Message. The input shows <code>customerId</code>, <code>fullName</code> and <code>email</code>. The output shows the <code>Customer</code> root. The DataWeave editor shows <strong>1 issue found</strong>.',
      alt: 'Transform Message with input and output metadata and 1 issue found in DataWeave'
    }
  ],

  discoverFix: [
    {
      src: discover('17-fix-with-ai.png'),
      title: 'Fix with MuleSoftForge Studio AI',
      text: 'Right-click in the DataWeave editor and choose <strong>Fix with MuleSoftForge Studio AI</strong>.',
      alt: 'Right-click menu in the DataWeave editor with Fix with MuleSoftForge Studio AI'
    },
    {
      src: discover('18-fix-request-sent.png'),
      title: 'The fix request is sent',
      text: 'Accept the 4 metadata files if you have not yet. The fix request goes to Studio AI with the DataWeave script and the editor problems.',
      alt: 'Metadata files accepted and Fix this DataWeave script request sent'
    },
    {
      src: discover('19-fix-answer.png'),
      title: 'A comma is missing',
      text: 'The answer says that a comma is missing after <code>payload.customerId</code>. Click <strong>Review diff</strong> or <strong>Apply to the DataWeave editor</strong>.',
      alt: 'Fix answer with the corrected DataWeave, Review diff and Apply to the DataWeave editor'
    },
    {
      src: discover('20-review-diff.png'),
      title: 'Review the DataWeave diff',
      text: '<strong>Review diff</strong> opens the <strong>DataWeave Compare</strong> window. The proposed fix adds the missing comma. Click <strong>OK</strong>.',
      alt: 'DataWeave Compare window showing the missing comma in the proposed fix'
    },
    {
      src: discover('21-fix-applied.png'),
      title: 'The fix is applied',
      text: 'The mapping lines connect, and the issue is gone. Save the file to keep the fix.',
      alt: 'DataWeave editor after the fix, with mapping lines and no issue'
    }
  ],

  instructions: [
    {
      src: setup('08-your-instructions.png'),
      title: 'Write your instructions',
      text: 'Scroll to <strong>Instructions</strong>. Type or paste your rules in <strong>Your instructions (every chat, every project)</strong>, up to 8,000 characters. They go with every message, after secrets are masked.',
      alt: 'Your instructions box with metadata rules for Mule 4 projects'
    },
    {
      src: setup('09-built-in-prompt.png'),
      title: 'See the built-in prompt',
      text: 'Click <strong>Show built-in prompt</strong> to see the text that goes before your instructions. Your instructions can change the general guidance. They cannot change the rules: masked values stay masked, and changes stay proposals that you review.',
      alt: 'Built-in prompt window with general guidance and rules'
    }
  ]
}
