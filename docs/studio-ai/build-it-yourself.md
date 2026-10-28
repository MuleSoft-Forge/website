---
title: Build It Yourself
description: Review the MuleSoftForge Studio AI source, build it, and install your own build
---

# Build it yourself

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
3. In Studio, choose **Help > Install New Software… > Add… > Local…**, select that folder, and continue from [step 3 of Install](./install). If the published version is installed, [uninstall it](./update#roll-back-or-remove) first.

Your build will not be byte-for-byte identical to the published jar, because each build stamps its own build time into the version (for example `0.2.0.202610281144`).

## What to look at

- **Network.** The plugin connects to the provider and Base URL you configure, and to `docs.mulesoftforge.com` once per Studio session to read `latest.json` (you can turn that off). To show prices, it also reads OpenRouter's public model list (`openrouter.ai/api/v1/models`) without sending your key or any project data.
- **API keys.** They are stored in Eclipse secure storage (`AiSettings.java`) and are never written to saved chats or logs.
- **Saved chats.** They live in your Studio workspace's `.metadata` folder, never in your Mule projects. They keep your prompts, the AI's replies, and the names of attachments, but not file contents or images.
- **Changes to files.** Only Agent mode can propose edits, and nothing is written until you accept them in the review panel. Ask and Plan modes only read the project.
- **Microphone.** The mic button starts the operating system's own dictation. The plugin never records audio.
