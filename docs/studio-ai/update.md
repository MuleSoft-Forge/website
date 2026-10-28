---
title: Update and Roll Back
description: Update, roll back, or remove MuleSoftForge Studio AI
---

# Update and roll back

## Update

The chat view shows the installed version in its header, for example `v0.2.0`. Once per Studio session it reads a small `latest.json` from this site. When a newer release exists, the label reads **Update to x.y.z**; clicking it opens **Help > Check for Updates**, which installs the new version. You can also run **Help > Check for Updates** at any time.

To turn the check off, open **Preferences > MuleSoftForge AI** and clear **Check for updates**. The check sends no project data; it is one HTTPS GET of `latest.json`.

## Roll back or remove

Every release stays on the update site. To go back to an earlier version, choose **Help > About Anypoint Studio > Installation Details**, select **MuleSoftForge Studio AI**, and click **Uninstall…**, then [install](./install) again with **Show only the latest versions** cleared and pick the version you want.

To remove it, uninstall it the same way and restart Studio.
