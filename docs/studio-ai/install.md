---
title: Install
description: Install MuleSoftForge Studio AI into Anypoint Studio from the update site
---

# Install

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

   Beta releases are not signed yet, so Studio asks on every install and update. The source is on GitHub, so you can review it and [build it yourself](./build-it-yourself).

5. When Studio asks to restart, click **Restart Now**.

   ![Software Updates dialog asking to restart Anypoint Studio](/images/studio-ai/install-5-restart.png)

6. After the restart, click the MuleSoftForge button on the toolbar (**Send the selection to MuleSoftForge AI**). The **MuleSoftForge AI** view opens, with the installed version in its header.

   ![MuleSoftForge AI view opened from the toolbar button, showing v0.1.0](/images/studio-ai/install-6-open-view.png)

You can also open the view with **Window > Show View > Other… > MuleSoftForge > MuleSoftForge AI**, or **Cmd/Ctrl+Alt+I**.

Next: [set up a provider](./set-up).

If the install fails with a certificate error on a company network, see [Troubleshooting](./troubleshooting#certificate-errors-on-a-company-network).
