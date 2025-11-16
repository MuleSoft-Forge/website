# Contributing to MuleSoft Forge Documentation

Guidelines for contributing to the MuleSoft Forge documentation website.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Style Guidelines](#style-guidelines)
- [Submitting Changes](#submitting-changes)

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Issues

- Use the GitHub issue templates to report bugs, request features, or suggest documentation improvements
- Search existing issues before creating a new one to avoid duplicates
- Provide clear, detailed information to help us understand and address the issue

### Improving Documentation

- Fix typos, grammar, or formatting
- Clarify confusing sections
- Add examples or use cases
- Update outdated information
- Improve navigation or organization

### Suggesting Features

- Describe the problem you're trying to solve
- Explain how your suggestion addresses that problem
- Consider how it fits with the existing site structure

## Development Setup

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Setup Steps

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/website.git
   cd website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run docs:dev
   ```

4. **View the site**:
   Open http://localhost:5173 in your browser

## Making Changes

### Branch Naming

Use descriptive branch names:
- `fix/broken-link-in-setup-guide`
- `docs/add-advanced-examples`
- `feature/add-search-functionality`

### Workflow

1. **Create a branch** from `main`:
   ```bash
   git checkout -b fix/your-fix-description
   ```

2. **Make your changes**:
   - Edit markdown files in `docs/` directory
   - Test locally with `npm run docs:dev`

3. **Test your changes**:
   ```bash
   npm run docs:build  # Verify build succeeds
   npm run docs:preview  # Preview production build
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "fix: correct broken link in setup guide"
   ```

5. **Push to your fork**:
   ```bash
   git push origin fix/your-fix-description
   ```

6. **Open a Pull Request**:
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

## Style Guidelines

### Markdown Content

- Use clear, concise language
- Write in second person ("you") when addressing the reader
- Use sentence case for headings
- Include code examples where appropriate
- Use relative links for internal pages: `[link](../other-page.md)`

### Code Blocks

- Specify language for syntax highlighting:
  ````markdown
  ```xml
  <configuration>
    ...
  </configuration>
  ```
  ````

- Include comments to explain complex code
- Keep examples focused and minimal

### Images

- Use descriptive alt text for accessibility
- Optimize image file sizes
- Place images in `docs/public/images/` directory
- Reference with: `![Alt text](/images/filename.png)`

### Formatting

- **Bold** for UI elements: Click the **Save** button
- *Italic* for emphasis: This is *important*
- `Code` for inline code, file names, commands

### Headings

- Use `#` for page title (one per page)
- Use `##` for main sections
- Use `###` for subsections
- Don't skip heading levels

### Lists

- Use `-` for unordered lists
- Use `1.` for ordered lists
- Keep list items parallel in structure

## Submitting Changes

### Pull Request Guidelines

- Fill out the PR template completely
- Link related issues using keywords: "Fixes #123"
- Keep changes focused - one logical change per PR
- Update documentation if you change functionality
- Ensure all checks pass (build, link validation)

### Review Process

1. A maintainer will review your PR
2. They may request changes or ask questions
3. Address feedback by pushing new commits to your branch
4. Once approved, a maintainer will merge your PR
5. Your changes will be deployed automatically to staging

### After Your PR is Merged

- Your changes will appear on the staging site immediately
- Production deployment happens after manual approval

## Questions?

- Open a [GitHub Discussion](https://github.com/MuleSoft-Forge/website/discussions)
- Create an issue with the "question" label
- Check existing documentation and issues first
