---
title: Use the Chat
description: Modes, context, screenshots, and reviewing proposed changes in MuleSoftForge Studio AI
---

# Use the chat

Open a Mule file, type a question in the MuleSoftForge AI view, and press Enter (Shift+Enter adds a line). **Include open file** sends the active editor's content, unsaved edits included, with your message. **New chat** starts over.

## Modes

The first drop-down under the message box picks the mode:

- **Ask** answers and explains. It can read the project but never proposes changes.
- **Agent** reads the project and proposes changes for you to review.
- **Plan** reads the project and writes a plan: the goal, the changes per file, the risks, and how to test. **Build this plan in Agent mode** under the answer switches to Agent and asks it to propose those changes.

The next box picks the model. Choose a suggestion or type any model id and press Enter. The list price per 1M input and output tokens shows underneath. You can switch models mid-chat and the conversation carries on.

## Give it context

**+ Context** attaches more to your next message. Attachments show above the message box and clear once sent.

- **Files or folders**: files are sent with their content, folders as a list of the files inside.
- **Selected lines in the editor**, or the project's whole file list.
- **Problems in the open file** or **in the project**: what Studio's Problems view lists, up to 200 entries.
- **Console**: a console's text, such as Maven output from a failed build or a running Mule app's log. Long output keeps its last part, where errors usually are.
- **Clipboard image**: see [Screenshots and images](#screenshots-and-images).

**Ask MuleSoftForge AI** does the same from where you are working: the MuleSoftForge button on the toolbar, the right-click menu in editors, Package Explorer, Problems and Console, or **Cmd/Ctrl+Alt+I**. It opens the view with the selected lines, files, problems, or console text attached.

When you attach problems with errors, or console output that shows a failure, and the message box is empty, the helper fills in a request to fix them and switches from Ask to Agent mode, so the fix comes back as a change you can review.

## Screenshots and images

Copy a screenshot or picture, click in the chat view and press **Cmd+V** (Ctrl+V on Windows). It is attached as **pasted image 1** instead of pasting text; text on the clipboard still pastes as text. **+ Context > Clipboard image** does the same. On a Mac, Cmd+Ctrl+Shift+4 takes a screenshot straight to the clipboard; on Windows, use Windows+Shift+S.

- Up to 5 images go with one message. Large screenshots are scaled down to 1568 pixels on the longest side.
- An image is sent only with the message it was pasted into. Later messages and saved chats keep just its name, so it is not paid for again.
- The model must be able to read images. Claude, GPT-4o, GPT-5 and Gemini models can; in Ollama, use a vision model such as llava. If the model refuses the image, the error says so.

## Review proposed changes

In Agent mode the AI can list and read the files of the open project and propose edits. Nothing is written until you accept it.

![Proposed changes panel under the answer, listing src/main/mule/employees-api.xml with 45 lines added and 12 removed, and Review diff, Accept, Reject buttons](/images/studio-ai/overview-agent-review.png)

- Proposals appear under **Proposed changes**. **Review diff** (or double-click) opens Studio's compare editor: the current file on the left, the proposal on the right.
- **Accept** writes the file and keeps local history. To undo, right-click the file and choose **Replace With > Local History**.
- **Reject** discards the proposal. With your next message the AI is told what you accepted and rejected.
- Accept refuses if the file has unsaved edits or changed on disk after the proposal was made.
- Edits must stay inside the project. Build output and settings folders such as `target/` and `.settings/` are off limits.

## Speak instead of typing

The microphone button next to **Send** starts the operating system's dictation in the message box: macOS Dictation (turn it on in **System Settings > Keyboard > Dictation**) or Windows voice typing (Windows+H). The plugin never records audio and sends none to the provider; the system turns speech into text, and the text is sent like typing.

## Saved chats and cost

Chats save automatically after every answer, in your Studio workspace, never in your Mule projects. File contents, images and API keys are not saved. **History ▾** in the view lists recent chats so you can open, rename, export as Markdown, or delete them. Proposals you have not reviewed expire when a chat is closed.

The line under the provider name shows what this chat, today and this month have cost; hover for the Studio session, all time, and the project. To turn saving off or change how long chats are kept, open **Preferences > MuleSoftForge AI > Chat history**.

If you cancel a request, the AI is told with your next message that it was dropped, so it does not assume the work was done.
