---
title: Troubleshooting
description: Fix common MuleSoftForge Studio AI problems
---

# Troubleshooting

## Certificate errors on a company network

If your company inspects HTTPS (Zscaler and similar), the plugin also trusts the operating system's certificates. If install or chat still fails with a certificate error, add your company's root certificate as a PEM file in **Preferences > MuleSoftForge AI > Network**. Studio's own installer uses Studio's Java trust store, so the install step may also need that certificate added to Studio's JRE, or a proxy set in **Preferences > General > Network Connections**.

## 401, "User not found" or "invalid API key"

The provider did not accept the key saved for it. Usually the key belongs to another provider, or it was revoked. Each provider keeps its own key, so pasting an OpenAI key while OpenRouter is selected saves it as the OpenRouter key.

Under the **API key** field, the settings page shows the start and end of the key it loaded for the selected provider, for example `sk-or-…a1b2, 73 characters`, and says when the key looks like it belongs to another provider. OpenRouter keys start with `sk-or-`, Anthropic keys with `sk-ant-`, and OpenAI keys with `sk-`. If the key looks wrong, paste the right one, click **Test connection**, then **Apply**.

## Could not save settings: No password provided

Eclipse secure storage on this computer has no master password. The API key and the plugin are not the cause.

The plugin keeps API keys in Eclipse secure storage, which is locked by a master password. On a Mac, Eclipse creates that password and keeps it in the macOS Keychain, so the first time a key is saved, macOS asks whether Anypoint Studio may use it. If that request is denied, or the Keychain can't be used, Eclipse has no password and reports **No password provided**. The base URL and model are still saved; only the key is not.

To fix it, on the computer that shows the error:

1. Click **Apply and Close** again. When macOS asks about `equinox.secure.storage`, enter your Mac login password and click **Always Allow**. If Studio asks for a master password instead, create one.
2. If no prompt appears, open **Preferences > General > Security > Secure Storage** (on a Mac, **Anypoint Studio > Settings**; on Windows, **Window > Preferences**) and go to the **Password** tab. Make sure a password provider is ticked: **MacOSX Keychain integration** on a Mac, or **Windows Integration** on Windows. Click **Clear Passwords**, restart Studio, then save the key again.
3. If it still fails, delete the stored data on the **Contents** tab, or delete the file `~/.eclipse/org.eclipse.equinox.security/secure_storage`. Restart Studio and enter the key again. This also erases anything else Studio kept in secure storage, such as saved Anypoint Platform or Git passwords.
