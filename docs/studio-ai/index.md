---
title: MuleSoftForge Studio AI
description: AI helper for Mule source, DataWeave, Problems and Console in Anypoint Studio
---

# MuleSoftForge Studio AI

## About

MuleSoftForge AI is a helper for the source you already have open in Anypoint Studio. It sits beside your project so you can ask about flows, DataWeave, Problems view markers, and Console output, and — when you want a change — review proposed edits before anything is written.

Studio remains how you create, scaffold, import, run, deploy, and test. The helper does not replace those workflows. It reads the project you are working in, explains what is there, and helps you fix and improve it.

Use it to:

- Explain or change Mule XML and related project files
- Work through DataWeave transformations
- Attach Problems view errors and warnings and ask for fixes
- Attach Console output (build failures, runtime logs) and ask what went wrong

Open a project file (or select the project in Explorer) so the helper can see it. Attach more with **+ Context**, or use **Ask MuleSoftForge AI** from the editor, Problems, or Console.

It works with OpenRouter, the MuleSoft AI Gateway LLM Proxy, OpenAI, Anthropic, Ollama, and other OpenAI-compatible endpoints, using your own API key.

Tested with Anypoint Studio 7.28 (Eclipse 4.31, Java 17) on macOS. It needs no other Studio extensions.

## Install

1. In Anypoint Studio choose **Help > Install New Software…**

   ![Help menu with Install New Software selected](/images/studio-ai/install-1-help-menu.png)

2. Click **Add…**, name it `MuleSoftForge Studio AI`, paste this location, and click **Add**:

   ```text
   https://docs.mulesoftforge.com/studio-ai/updates/
   ```

   ![Add Repository dialog with the MuleSoftForge Studio AI update site](/images/studio-ai/install-2-add-repository.png)

3. Tick **MuleSoftForge > MuleSoftForge Studio AI** and click **Next** until **Finish**.

   ![Install dialog with MuleSoftForge Studio AI selected](/images/studio-ai/install-3-select-feature.png)

4. Studio asks whether you trust unsigned content. Leave the **Unsigned** row ticked and click **Trust Selected**. The items listed should be `com.mulesoftforge.studio.ai` and `com.mulesoftforge.studio.ai.feature`. Leave **Always trust all content** cleared.

   ![Trust Artifacts dialog listing the MuleSoftForge Studio AI plugin and feature](/images/studio-ai/install-4-trust-artifacts.png)

   Beta releases are not signed yet, so Studio asks on every install and update. The source is on GitHub, so you can review it and [build it yourself](#build-it-yourself).

5. When Studio asks to restart, click **Restart Now**.

   ![Software Updates dialog asking to restart Anypoint Studio](/images/studio-ai/install-5-restart.png)

6. After the restart, click the MuleSoftForge button on the toolbar (**Ask MuleSoftForge AI about the selection**). The **MuleSoftForge AI** view opens, with the installed version in its header.

   ![MuleSoftForge AI view opened from the toolbar button, showing v0.1.0](/images/studio-ai/install-6-open-view.png)

You can also open the view with **Window > Show View > Other… > MuleSoftForge > MuleSoftForge AI**, or **Cmd/Ctrl+Alt+I**.

## Set up a provider

Choose which AI provider to use and enter its API key. Keys are saved in Eclipse secure storage, which on macOS is protected by the Keychain, never in Studio's plain settings files.

1. On macOS choose **Anypoint Studio > Settings…** (Cmd+,). On Windows choose **Window > Preferences**. You can also click **Settings** in the MuleSoftForge AI view.

   ![Anypoint Studio menu with Settings selected](/images/studio-ai/setup-1-settings-menu.png)

2. Select **MuleSoftForge AI** in the list on the left. Pick a **Provider**; the **Base URL** fills in for it. Choose a **Model** (or type any model id; **Refresh models** lists what your account offers), paste your **API key**, and click **Test connection**.

   ![MuleSoftForge AI preferences with OpenAI selected and the API key masked](/images/studio-ai/setup-2-preferences.png)

3. **Test connection** sends a one-word request to the model. **Connected. Model replied: ok** means the provider, model and key work. If it fails, the message shows the exact HTTP status and response from the provider. When it works, click **Apply and Close**.

   ![Test connection result: Connected. Model replied: ok](/images/studio-ai/setup-3-test-connection.png)

   The same page has the **Chat view**, **Network** (corporate certificates) and **Chat history** settings. Chats are saved in your Studio workspace, never in your Mule projects, and API keys are never written to them.

## Paste screenshots and images

Copy a screenshot or picture, click in the chat view and press **Cmd+V** (Ctrl+V on Windows). It is attached as **pasted image 1** instead of pasting text; text on the clipboard still pastes as text. **+ Context > Clipboard image** does the same. On a Mac, Cmd+Ctrl+Shift+4 takes a screenshot straight to the clipboard; on Windows, use Windows+Shift+S.

- Up to 5 images go with one message. Large screenshots are scaled down to 1568 pixels on the longest side.
- An image is sent only with the message it was pasted into. Later messages and saved chats keep just its name, so it is not paid for again.
- The model must be able to read images. Claude, GPT-4o, GPT-5 and Gemini models can; in Ollama, use a vision model such as llava. If the model refuses the image, the error says so.

## Update

The chat view shows the installed version in its header, for example `v0.1.0`. Once per Studio session it reads a small `latest.json` from this site. When a newer release exists, the label reads **Update to x.y.z**; clicking it opens **Help > Check for Updates**, which installs the new version. You can also run **Help > Check for Updates** at any time.

To turn the check off, open **Preferences > MuleSoftForge AI** and clear **Check for updates**. The check sends no project data; it is one HTTPS GET of `latest.json`.

## Roll back or remove

Every release stays on the update site. To go back to an earlier version, choose **Help > About Anypoint Studio > Installation Details**, select **MuleSoftForge Studio AI**, and click **Uninstall…**, then install again with **Show only the latest versions** cleared and pick the version you want.

## Build it yourself

The source is at [github.com/MuleSoft-Forge/mulesoftforge-studio-ai](https://github.com/MuleSoft-Forge/mulesoftforge-studio-ai). You can read it, build it, and install your own build instead of the published one.

You need git, JDK 17 and Maven 3.9 or later. The build downloads its libraries (LangChain4j and Jackson) from Maven Central.

1. Get the source and build the update site:

   ```bash
   git clone https://github.com/MuleSoft-Forge/mulesoftforge-studio-ai.git
   cd mulesoftforge-studio-ai
   mvn clean package
   ```

   If Maven picks up another Java version, set it for the build, for example `JAVA_HOME=/path/to/jdk-17 mvn clean package`.

2. The build writes a complete update site to `com.mulesoftforge.studio.ai.updatesite/target/repository`.
3. In Studio, choose **Help > Install New Software… > Add… > Local…**, select that folder, and continue from [step 3 of Install](#install). If the published version is installed, uninstall it first (see [Roll back or remove](#roll-back-or-remove)).

Your build will not be byte-for-byte identical to the published jar, because each build stamps its own build time into the version (for example `0.2.0.202610281144`).

### What to look at

- **Network.** The plugin connects to the provider and Base URL you configure, and to `docs.mulesoftforge.com` once per Studio session to read `latest.json` (you can turn that off). To show prices, it also reads OpenRouter's public model list (`openrouter.ai/api/v1/models`) without sending your key or any project data.
- **API keys.** They are stored in Eclipse secure storage (`AiSettings.java`) and are never written to saved chats or logs.
- **Saved chats.** They live in your Studio workspace's `.metadata` folder, never in your Mule projects. They keep your prompts, the AI's replies, and the names of attachments, but not file contents or images.
- **Changes to files.** Only Agent mode can propose edits, and nothing is written until you accept them in the review panel. Ask and Plan modes only read the project.
- **Microphone.** The mic button starts the operating system's own dictation. The plugin never records audio.

## Corporate networks

If your company inspects HTTPS (Zscaler and similar), the plugin also trusts the operating system's certificates. If install or chat still fails with a certificate error, add your company's root certificate as a PEM file in **Preferences > MuleSoftForge AI > Network**. Studio's own installer uses Studio's Java trust store, so the install step may also need that certificate added to Studio's JRE, or a proxy set in **Preferences > General > Network Connections**.

## Troubleshooting

### Could not save settings: No password provided

Eclipse secure storage on this computer has no master password. The API key and the plugin are not the cause.

The plugin keeps API keys in Eclipse secure storage, which is locked by a master password. On a Mac, Eclipse creates that password and keeps it in the macOS Keychain, so the first time a key is saved, macOS asks whether Anypoint Studio may use it. If that request is denied, or the Keychain can't be used, Eclipse has no password and reports **No password provided**. The base URL and model are still saved; only the key is not.

To fix it, on the computer that shows the error:

1. Click **Apply and Close** again. When macOS asks about `equinox.secure.storage`, enter your Mac login password and click **Always Allow**. If Studio asks for a master password instead, create one.
2. If no prompt appears, open **Preferences > General > Security > Secure Storage** (on a Mac, **Anypoint Studio > Settings**; on Windows, **Window > Preferences**) and go to the **Password** tab. Make sure a password provider is ticked: **MacOSX Keychain integration** on a Mac, or **Windows Integration** on Windows. Click **Clear Passwords**, restart Studio, then save the key again.
3. If it still fails, delete the stored data on the **Contents** tab, or delete the file `~/.eclipse/org.eclipse.equinox.security/secure_storage`. Restart Studio and enter the key again. This also erases anything else Studio kept in secure storage, such as saved Anypoint Platform or Git passwords.
