---
title: MuleSoftForge Studio AI
description: Install, update and remove the MuleSoftForge AI plugin for Anypoint Studio
---

# MuleSoftForge Studio AI

MuleSoftForge AI adds an AI chat view to Anypoint Studio 7. It can read your Mule project, explain it, plan changes, and propose edits you review before they are applied. It works with OpenRouter, the MuleSoft AI Gateway LLM Proxy, OpenAI, Anthropic, Ollama, and other OpenAI-compatible endpoints, using your own API key.

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

5. When Studio asks to restart, click **Restart Now**.

   ![Software Updates dialog asking to restart Anypoint Studio](/images/studio-ai/install-5-restart.png)

6. After the restart, click the MuleSoftForge button on the toolbar (**Ask MuleSoftForge AI about the selection**). The **MuleSoftForge AI** view opens, with the installed version in its header.

   ![MuleSoftForge AI view opened from the toolbar button, showing v0.1.0](/images/studio-ai/install-6-open-view.png)

You can also open the view with **Window > Show View > Other… > MuleSoftForge > MuleSoftForge AI**, or **Cmd/Ctrl+Alt+I**. Then click **Settings** in the view to choose a provider and paste its API key. Keys are kept in Eclipse secure storage.

::: warning Installed from the dropins folder before?
Delete `com.mulesoftforge.studio.ai.jar` from Studio's `dropins` folder (on macOS, `AnypointStudio.app/Contents/Eclipse/dropins`) and restart Studio before installing from the update site. Two copies conflict, and Studio cannot update a dropins copy.
:::

## Update

The chat view shows the installed version in its header, for example `v0.1.0`. Once per Studio session it reads a small `latest.json` from this site. When a newer release exists, the label reads **Update to x.y.z**; clicking it opens **Help > Check for Updates**, which installs the new version. You can also run **Help > Check for Updates** at any time.

To turn the check off, open **Preferences > MuleSoftForge AI** and clear **Check for updates**. The check sends no project data; it is one HTTPS GET of `latest.json`.

## Roll back or remove

Every release stays on the update site. To go back to an earlier version, choose **Help > About Anypoint Studio > Installation Details**, select **MuleSoftForge Studio AI**, and click **Uninstall…**, then install again with **Show only the latest versions** cleared and pick the version you want.

## Corporate networks

If your company inspects HTTPS (Zscaler and similar), the plugin also trusts the operating system's certificates. If install or chat still fails with a certificate error, add your company's root certificate as a PEM file in **Preferences > MuleSoftForge AI > Network**. Studio's own installer uses Studio's Java trust store, so the install step may also need that certificate added to Studio's JRE, or a proxy set in **Preferences > General > Network Connections**.
