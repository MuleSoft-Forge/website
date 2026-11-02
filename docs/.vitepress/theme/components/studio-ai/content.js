// Copy and demo scripts for the Studio AI landing page.
// Every claim here must match the plugin's README; demos use the employees-app sample.

export const UPDATE_SITE = 'https://docs.mulesoftforge.com/studio-ai/updates/'

export const REPO = 'https://github.com/MuleSoft-Forge/mulesoftforge-studio-ai'

// The doc pages under /studio-ai/; heading replaces each page's Markdown h1, which the product skin hides.
export const docPages = [
  { link: '/studio-ai/', text: 'Overview' },
  { link: '/studio-ai/install', text: 'Install', heading: 'Install', kicker: 'Step 1 of 4' },
  { link: '/studio-ai/set-up', text: 'Set up', heading: 'Set up a provider', kicker: 'Step 2 of 4' },
  { link: '/studio-ai/discover', text: 'Discover', heading: 'Discover Studio AI', kicker: 'Step 3 of 4' },
  { link: '/studio-ai/use-the-chat', text: 'Use the chat', heading: 'Use the chat', kicker: 'Step 4 of 4' },
  { link: '/studio-ai/update', text: 'Update', heading: 'Update and roll back', kicker: 'Stay current' },
  { link: '/studio-ai/troubleshooting', text: 'Help', heading: 'Troubleshooting', kicker: 'Help' },
  { link: '/studio-ai/build-it-yourself', text: 'Source', heading: 'Build it yourself', kicker: 'Open source' }
]

export const scenarios = [
  {
    id: 'agent',
    tab: 'Improve a flow',
    mode: 'Agent',
    model: 'Auto',
    file: 'employees-api.xml',
    context: [],
    prompt: 'How can I improve the error handling?',
    steps: [
      'Read src/main/mule/employees-api.xml',
      'connector_reference http, apikit',
      'Proposed change to employees-api.xml',
      'check_project: no new problems'
    ],
    answer:
      'Each `on-error-propagate` repeats the same `ee:transform`. I moved it into one shared `api-error-handler` so every error returns the same JSON contract, and checked the project with the change applied.',
    diffLang: 'xml',
    diff: [
      ['-', '<on-error-propagate type="APIKIT:NOT_FOUND">'],
      ['-', '  <ee:transform>…</ee:transform>'],
      ['+', '<error-handler name="api-error-handler">'],
      ['+', '  <on-error-propagate type="APIKIT:NOT_FOUND">'],
      ['+', '    <set-variable variableName="httpStatus" value="404"/>'],
      ['+', '    <flow-ref name="build-error-response"/>'],
      [' ', '  </on-error-propagate>']
    ],
    proposal: { file: 'src/main/mule/employees-api.xml', add: 45, del: 12 },
    actions: ['Review diff', 'Accept', 'Reject'],
    done: 'Accepted · written with local history'
  },
  {
    id: 'diagnose',
    tab: 'Diagnose a 500',
    mode: 'Diagnose',
    model: 'Auto',
    file: 'get-employees.xml',
    context: ['Problems in employees-app'],
    prompt: 'GET /api/employees returns 500. Why?',
    steps: [
      'list_endpoints: GET http://localhost:8081/api/employees',
      'call_endpoint GET /api/employees → 500 · console attached',
      'Read src/main/mule/get-employees.xml around line 23',
      'call_endpoint GET /api/employees?limit=1 → 500 again'
    ],
    answer:
      'Symptom: every GET returns 500. Evidence: the console shows `Element: get-employees/processors/2 @ employees-app:get-employees.xml:23` and `Couldn\'t find configuration property value for key ${hr.db.host}`. Cause: `hr.db.host` is not in `config-local.yaml`. Checked with a second call and check_project.',
    diffLang: 'xml',
    diff: [],
    proposal: null,
    actions: ['Draft selected changes for review'],
    done: 'Agent drafts the fix as a diff for you to review'
  },
  {
    id: 'dataweave',
    tab: 'Fix DataWeave',
    mode: 'Ask',
    model: 'Auto',
    file: 'Transform Message',
    context: ['DataWeave in Transform Message · 2 errors'],
    prompt: 'Fix with MuleSoftForge Studio AI',
    steps: ['Read the script and the 2 errors the editor marks', 'validate_dataweave: compiles'],
    answer:
      'A comma is missing after `name: payload.fullName`, so the parser stops at the next field and reports both errors. Here is the corrected script.',
    diffLang: 'dataweave',
    diff: [
      [' ', 'output application/json'],
      [' ', '---'],
      [' ', 'payload map {'],
      ['-', '  name: payload.fullName'],
      ['+', '  name: payload.fullName,'],
      [' ', '  email: lower($.email)'],
      [' ', '}']
    ],
    proposal: null,
    actions: ['Review diff', 'Apply to the DataWeave editor'],
    done: 'Applied · Cmd+Z in the editor undoes it'
  },
  {
    id: 'debug',
    tab: 'Debug a live event',
    mode: 'Agent',
    model: 'Auto',
    file: 'get-employees',
    banner: 'Debugger stopped on an error at Transform Message in get-employees',
    context: ['live event · error, payload, attributes, 3 variables'],
    prompt: 'Ask about this event',
    steps: [
      'evaluate_at_breakpoint: payload.employees[0].salary',
      'evaluate_at_breakpoint: typeOf(payload.employees[0].salary)',
      'Proposed change to get-employees.xml'
    ],
    answer:
      '`salary` arrives as the String `"52,000"`, and the script multiplies it. I ran the fix on this event in your app\'s runtime: it returns `52000`.',
    diffLang: 'dataweave',
    diff: [
      ['-', '  annual: $.salary * 12'],
      ['+', '  annual: ($.salary replace "," with "" as Number) * 12']
    ],
    proposal: { file: 'src/main/mule/get-employees.xml', add: 1, del: 1 },
    actions: ['Review diff', 'Accept', 'Reject'],
    done: 'Accepted · resume the debugger to try it'
  }
]

export const sources = [
  {
    id: 'canvas',
    title: 'Message Flow canvas',
    how: 'Select processors, right-click',
    chip: 'canvas selection in employees-api.xml (2 elements: logger, http:request)'
  },
  {
    id: 'problems',
    title: 'Problems view',
    how: 'Select markers, Send to MuleSoftForge Studio AI',
    chip: 'Fix these problems. · switches to Agent'
  },
  {
    id: 'console',
    title: 'Console',
    how: 'Failed build or runtime log',
    chip: 'Find the cause of the error in this console output. · switches to Diagnose'
  },
  {
    id: 'debugger',
    title: 'Mule debugger',
    how: 'Stopped at a breakpoint or error',
    chip: 'Ask about this event · payload, attributes, variables'
  },
  {
    id: 'dataweave',
    title: 'DataWeave editor',
    how: 'Right-click in Transform Message',
    chip: 'Fix with MuleSoftForge Studio AI · script + editor errors'
  },
  {
    id: 'screenshot',
    title: 'Screenshots',
    how: 'Paste with Cmd/Ctrl+V',
    chip: 'pasted image 1 (1440×900)'
  },
  {
    id: 'app',
    title: 'Your running app',
    how: 'Calls localhost endpoints only',
    chip: 'call_endpoint GET http://localhost:8081/api/employees → 500 · with the console lines it printed'
  },
  {
    id: 'voice',
    title: 'Your voice',
    how: 'OS dictation, no audio sent',
    chip: 'macOS Dictation · Windows voice typing'
  }
]

export const modes = [
  {
    id: 'ask',
    name: 'Ask',
    tagline: 'Explains. Never changes a file.',
    detail:
      'Reads the project and answers. When you ask for a review or a fix, it lists the changes it could make, unticked, so you choose what Agent mode drafts.',
    can: { read: true, propose: false, plan: false, diagnose: false, writes: false },
    preview: {
      kind: 'checklist',
      title: 'Changes it can make',
      items: [
        { label: 'Share one error handler across flows', files: 'employees-api.xml', on: true },
        { label: 'Move the hardcoded password to secure properties', files: 'global.xml, config.yaml', on: true },
        { label: 'Add a /health flow', files: 'health.xml', on: false }
      ],
      cta: 'Draft selected changes for review'
    }
  },
  {
    id: 'agent',
    name: 'Agent',
    tagline: 'Proposes edits as diffs you review.',
    detail:
      'Reads, proposes and checks its own changes. Nothing is written until you Accept, and Accept refuses if the file changed since the proposal.',
    can: { read: true, propose: true, plan: false, diagnose: false, writes: true },
    preview: {
      kind: 'proposals',
      title: 'Proposed changes · nothing is written until you accept',
      items: [
        { file: 'src/main/mule/employees-api.xml', add: 45, del: 12 },
        { file: 'src/main/mule/global.xml', add: 3, del: 1 },
        { file: 'src/main/resources/config.yaml', add: 2, del: 0 }
      ]
    }
  },
  {
    id: 'plan',
    name: 'Plan',
    tagline: 'Writes the plan before the code.',
    detail:
      'Reads the project and writes a plan: goal, changes per file, risks, and how to test. Its changes come back as a checklist for Agent mode.',
    can: { read: true, propose: false, plan: true, diagnose: false, writes: false },
    preview: {
      kind: 'plan',
      title: 'Plan · employees-app',
      sections: [
        ['Goal', 'One JSON error contract for every API error'],
        ['Changes', 'employees-api.xml: shared error handler · global.xml: error flow'],
        ['Risks', 'Clients that parse the old error body'],
        ['How to test', 'GET /api/employees/999 returns 404 with the new body']
      ],
      cta: 'Draft this plan for review in Agent mode'
    }
  },
  {
    id: 'diagnose',
    name: 'Diagnose',
    tagline: 'Finds the cause, with evidence.',
    detail:
      'Reproduces the problem against your running app, reads the console and the Mule XML at the line the error names, and checks the cause before it states it. The fixes come back as a checklist for Agent mode.',
    can: { read: true, propose: false, plan: false, diagnose: true, writes: true },
    preview: {
      kind: 'plan',
      title: 'Diagnosis · GET /api/employees',
      sections: [
        ['Symptom', 'Every GET /api/employees returns 500'],
        ['Evidence', 'Element: get-employees/processors/2 @ get-employees.xml:23'],
        ['Cause', '${hr.db.host} is not defined in config-local.yaml'],
        ['Checked', 'A second call with ?limit=1 fails the same way']
      ],
      cta: 'Draft selected changes for review'
    }
  }
]

export const checks = [
  { label: 'XML is well-formed, every prefix declared' },
  { label: 'Namespaces and xsi:schemaLocation' },
  { label: 'Connector dependency in pom.xml' },
  {
    label: 'config-ref, flow-ref and error-handler names exist',
    fail: 'config-ref "hr-db" does not exist',
    fix: 'hr-db-config'
  },
  { label: '${property} defined in .properties or .yaml' },
  { label: 'Operations and attributes match the connector version' },
  { label: 'DataWeave compiles (DataWeave CLI)' }
]

// Each line is a list of segments: plain text, a secret (masked for the model), or a kept reference.
export const secretFile = [
  [{ t: '# src/main/resources/config.properties', c: 'comment' }],
  [{ t: 'db.url=jdbc:mysql://hr_admin:' }, { secret: 'Sup3rS3cret!' }, { t: '@db.internal:3306/hr' }],
  [{ t: 'db.password=' }, { secret: 'Sup3rS3cret!' }],
  [{ t: 'api.token=' }, { secret: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJocn0.x9c' }],
  [{ t: 'salesforce.password=' }, { keep: '${secure::sf.password}' }],
  [{ t: '' }],
  [{ t: '<!-- src/main/mule/global.xml -->', c: 'comment' }],
  [{ t: '<http:basic-authentication username="svc-hr"' }],
  [{ t: '    password="' }, { secret: 'hunter2' }, { t: '"/>' }],
  [{ t: '<db:my-sql-connection password="' }, { keep: '${db.password}' }, { t: '"/>' }]
]

export const providers = [
  'OpenRouter',
  'OpenAI',
  'Anthropic',
  'Google Gemini',
  'Azure OpenAI',
  'Amazon Bedrock',
  'Ollama (local)',
  'Any OpenAI-compatible endpoint'
]

export const gallery = [
  {
    src: '/images/studio-ai/overview-agent-review.png',
    alt: 'MuleSoftForge Studio AI in Anypoint Studio reviewing error handling in Agent mode, with a proposed change to employees-api.xml waiting for Review diff, Accept or Reject',
    caption: 'Agent mode reviews the error handling and proposes a change. Nothing is written until you accept.'
  },
  {
    src: '/images/studio-ai/overview-dataweave-fix.png',
    alt: 'MuleSoftForge Studio AI returns the corrected DataWeave, explains the missing comma, and offers Review diff and Apply to the DataWeave editor',
    caption: 'Fix with MuleSoftForge Studio AI explains the parse error and hands back the script. The cost column shows what this chat cost.'
  },
  {
    src: '/images/studio-ai/fix-with-ai-context-menu.png',
    alt: 'Right-click in the DataWeave editor of a Transform Message: the menu shows Send to MuleSoftForge Studio AI and Fix with MuleSoftForge Studio AI',
    caption: 'Right-click in any DataWeave editor to send the script, or fix it.'
  }
]
