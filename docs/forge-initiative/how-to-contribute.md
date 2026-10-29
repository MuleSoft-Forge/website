---
title: How to Contribute
description: Contribute to an existing MuleSoftForge asset or propose a new one
---

# How to Contribute

MuleSoftForge is built by the people who use it. There are three ways to help, from five minutes to a whole new asset.

| You want to | Where to go |
| --- | --- |
| Report a bug or ask for a feature | The **Issues** link in the asset's **At a glance** box |
| Fix the docs | **Edit this page on GitHub** at the bottom of any page |
| Improve an asset's code | The steps below, on that asset's repository |
| Build something new | [Propose a new asset](#propose-a-new-asset) |

Contributions we especially value: tests, error handling, enterprise features (security, observability, reconnection), and examples from real projects.

## Contribute to an existing asset

Every asset lives in its own repository under [github.com/MuleSoft-Forge](https://github.com/MuleSoft-Forge). Find it from the asset's **At a glance** box or from [All Assets](../assets). The steps use `<asset-repo>` for the repository name, for example `mule4-typesafe-connector`.

<Stepper>
<Step title="Fork the repository">

Open the asset's repository and click **Fork** at the top right.

</Step>
<Step title="Clone your fork">

```bash
git clone https://github.com/<your-username>/<asset-repo>.git
cd <asset-repo>
```

</Step>
<Step title="Create a branch">

```bash
git checkout -b feature/your-feature-name
```

</Step>
<Step title="Make and test your change">

Build and run the tests before you commit. Mule connectors and modules build with Maven:

```bash
mvn clean install
```

Then commit with a message that says what changed and why:

```bash
git add .
git commit -m "Add retry on 429 responses"
```

</Step>
<Step title="Push and open a pull request">

```bash
git push origin feature/your-feature-name
```

On GitHub, click **Compare & pull request**. Check that the base repository is `MuleSoft-Forge/<asset-repo>` and the base branch is the repository's default branch (usually `main`). Describe what you changed, why, and how you tested it.

</Step>
<Step title="Review">

A maintainer reviews the pull request and may ask for changes. Once it is approved, it is merged and goes out in the next release.

</Step>
</Stepper>

## Propose a new asset

Have a connector, module, policy or tool the community needs? Tell us before you build it, so we can help with naming, publishing and docs.

[Propose a new asset on GitHub →](https://github.com/MuleSoft-Forge/website/issues/new?template=propose-asset.yml)

An asset is ready to join MuleSoftForge when it has:

- **Source on GitHub** under an open-source license (most assets use Apache 2.0)
- **A release you can install**, such as a Maven Central artifact for connectors and modules
- **A working example**, such as a sample Mule app or a flow snippet
- **Docs in the house style:** an overview, a Set Up page, and one page per operation, which we help you write
- **A maintainer** who will answer issues

## Licenses

The documentation site is released under the [Apache License 2.0](https://github.com/MuleSoft-Forge/website/blob/main/LICENSE). Each asset carries its own license, shown in its **At a glance** box and its repository. Most assets are Apache 2.0; some use CPAL 1.0.
