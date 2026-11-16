---
title: Update and Roll Back
description: Update, roll back, or remove MuleSoftForge Studio AI
---

# Update and roll back

## Update

The chat view shows the installed version in its header, for example `v0.2.0`. Once per Studio session it reads a small `latest.json` from this site. When a newer release exists, the label reads **Update to x.y.z**; clicking it opens **Help > Check for Updates**, which installs the new version. You can also run **Help > Check for Updates** at any time.

To turn the check off, open **Preferences > MuleSoftForge Studio AI** and clear **Check for updates**. The check sends no project data; it is one HTTPS GET of `latest.json`.

## Updating to 0.5.36 or later

From 0.5.35, settings are [shared by every workspace](./set-up#settings-in-every-workspace). Updating does not lose or change any settings. Each workspace sorts itself out the first time it starts after the update and says which case applied in a note in the chat view:

- **The first workspace you open** copies its settings to the shared file. Your other workspaces now start with them.
- **A workspace set up differently**, for example with another provider or model, keeps its own settings, as if **Use these settings in this workspace only** were ticked. Clear that box in Preferences to use the shared settings instead.
- **A workspace you never set up**, or set up the same way, uses the shared settings.

API keys and saved chats are unchanged. **Today** and **This month** in the cost column now add up every workspace, so they can be higher than before.

Each workspace's old settings are also left where they were, so if you roll back, the earlier version finds them.

If you updated to 0.5.35 and a second workspace has picked up another workspace's provider, set it back in Preferences and tick **Use these settings in this workspace only**.

## Roll back or remove

Every release stays on the update site. To go back to an earlier version, choose **Help > About Anypoint Studio > Installation Details**, select **MuleSoftForge Studio AI**, and click **Uninstall…**, then [install](./install) again with **Show only the latest versions** cleared and pick the version you want.

To remove it, uninstall it the same way and restart Studio.
