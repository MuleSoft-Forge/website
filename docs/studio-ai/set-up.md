---
title: Set Up
description: Choose an AI provider and save your API key for MuleSoftForge Studio AI
---

# Set up a provider

Choose which AI provider to use and enter its API key. Keys are saved in Eclipse secure storage, which on macOS is protected by the Keychain, never in Studio's plain settings files.

1. On macOS choose **Anypoint Studio > Settings…** (Cmd+,). On Windows choose **Window > Preferences**. You can also click **Settings** in the MuleSoftForge AI view.

   ![Anypoint Studio menu with Settings selected](/images/studio-ai/setup-1-settings-menu.png)

2. Select **MuleSoftForge AI** in the list on the left. Pick a **Provider**; the **Base URL** fills in for it. Choose a **Model** (or type any model id; **Refresh models** lists what your account offers), paste your **API key**, and click **Test connection**.

   ![MuleSoftForge AI preferences with OpenAI selected and the API key masked](/images/studio-ai/setup-2-preferences.png)

3. **Test connection** sends a one-word request to the model. **Connected. Model replied: ok** means the provider, model and key work. If it fails, the message shows the exact HTTP status and response from the provider. When it works, click **Apply and Close**.

   ![Test connection result: Connected. Model replied: ok](/images/studio-ai/setup-3-test-connection.png)

The same page has the **Chat view**, **Network** (company certificates) and **Chat history** settings. Chats are saved in your Studio workspace, never in your Mule projects, and API keys are never written to them.

If saving fails with **No password provided**, see [Troubleshooting](./troubleshooting#could-not-save-settings-no-password-provided).

Next: [use the chat](./use-the-chat).
