# MuleSoft Forge Website

Official documentation website for MuleSoft Forge - a community-driven collection of connectors and modules for MuleSoft.

## Overview

MuleSoft Forge provides comprehensive documentation for community-contributed MuleSoft connectors and modules. This website is built with VitePress, offering:

- **Open Source** - Fully open source, enabling community contributions
- **Fast & Modern** - Built with Vue 3 and VitePress for excellent performance
- **Rich Components** - Custom components for tutorials, examples, and guides
- **Developer Friendly** - Easy to contribute and maintain documentation

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher
- **npm** (comes with Node.js)

To verify your installation:

```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
```

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/MuleSoft-Forge/website.git
cd website
npm install
```

## Development

Start the development server with hot-reload:

```bash
npm run docs:dev
```

The development server will start at `http://localhost:5173` (port may vary if 5173 is in use).

VitePress will automatically reload when you make changes to:
- Markdown files (`docs/**/*.md`)
- Vue components (`docs/.vitepress/theme/**/*.vue`)
- Configuration files (`docs/.vitepress/config.js`)

## Build

Build the site for production:

```bash
npm run docs:build
```

The build output will be generated in the `docs/.vitepress/dist` directory. The build process:
- Compiles all markdown pages to static HTML
- Optimizes assets and images
- Generates search index
- Minifies CSS and JavaScript

## Preview

Preview the production build locally:

```bash
npm run docs:preview
```

This serves the built site from `docs/.vitepress/dist` at `http://localhost:4173` to verify the production build before deployment.

## Custom Components

This project includes three custom Vue components that replicate GitBook functionality:

### 1. Hint Component

Callout boxes for important information, available in four variants:

```vue
<Hint type="success">Operation completed successfully!</Hint>
<Hint type="info">Additional context and information.</Hint>
<Hint type="warning">Be careful with this configuration.</Hint>
<Hint type="danger">Critical warning or error message.</Hint>
```

**Props:**
- `type` (String): `'success'`, `'info'`, `'warning'`, or `'danger'` (default: `'info'`)

**Features:**
- Color-coded backgrounds and icons
- Dark mode support
- Accessible with proper ARIA roles
- Responsive design

### 2. Tabs Component

Organize multi-platform examples or alternative code approaches:

```markdown
::: tabs

== Java

Java code here...

== XML

XML configuration here...

== Python

Python code here...

:::
```

**Features:**
- Multiple independent tab groups per page
- Keyboard navigation support
- Smooth transitions
- Works with any markdown content

**Implementation:** Uses [vitepress-plugin-tabs](https://www.npmjs.com/package/vitepress-plugin-tabs)

### 3. Stepper & Step Components

Sequential numbered workflows and tutorials:

```vue
<Stepper>
  <Step title="Configure Connection">
    Set up your connection parameters...
  </Step>

  <Step title="Add Operation">
    Add the operation to your flow...
  </Step>

  <Step title="Test">
    Run and verify the implementation...
  </Step>
</Stepper>
```

**Step Props:**
- `title` (String, required): The step title

**Features:**
- Automatic step numbering
- Visual connector lines between steps
- Supports nested components (hints, code blocks, etc.)
- Responsive design with mobile optimization
- Dark mode support

## Component Usage Examples

For comprehensive examples demonstrating all components, see the [Component Examples](docs/examples/components.md) page or visit `/examples/components` when running the development server.

## Project Structure

```
website/
├── docs/                          # Documentation source files
│   ├── .vitepress/               # VitePress configuration
│   │   ├── config.js             # Site configuration
│   │   └── theme/                # Custom theme
│   │       ├── index.js          # Theme entry point
│   │       ├── components/       # Custom Vue components
│   │       │   ├── Hint.vue
│   │       │   ├── Stepper.vue
│   │       │   └── Step.vue
│   │       └── styles/
│   │           └── custom.css    # Custom styles
│   ├── examples/                 # Example documentation
│   │   └── components.md         # Component demos
│   └── index.md                  # Homepage
├── public/                        # Static assets
│   ├── images/                   # Image assets (organized by connector)
│   └── assets/                   # Other static files
├── package.json                  # Project dependencies
├── LICENSE                       # MIT License
└── README.md                     # This file
```

## Writing Documentation

### Basic Markdown

VitePress supports standard GitHub-flavored markdown plus additional features:

```markdown
# Heading 1
## Heading 2

**Bold text** and *italic text*

- Bullet list
- Item 2

1. Numbered list
2. Item 2

[Link text](https://example.com)

![Image alt text](/images/example.png)
```

### Code Blocks

Use fenced code blocks with syntax highlighting:

````markdown
```java
public class Example {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```
````

Supported languages include: `java`, `xml`, `javascript`, `python`, `bash`, `yaml`, `json`, and many more.

### Custom Components

All custom components are globally registered and can be used directly in markdown:

```markdown
<Hint type="info">
This is helpful information for the reader.
</Hint>

<Stepper>
  <Step title="First Step">
    Instructions here...
  </Step>
</Stepper>
```

### Images

Place images in the `public/` directory and reference them:

```markdown
![Connector Architecture](/images/idp-connector/architecture.png)
```

## Configuration

Main configuration is in `docs/.vitepress/config.js`. Key settings:

- **Site metadata**: Title, description
- **Navigation**: Top nav and sidebar
- **Theme**: Colors, fonts, layout
- **Search**: Local search configuration
- **Plugins**: Markdown plugins and extensions

## Deployment

This site is deployed to **Cloudflare Pages** with automatic deployments:

- **Staging**: Automatically deploys from `main` branch to https://mulesoftforge.nonprod.app
- **Production**: Manually deployed after approval
- **PR Previews**: Every pull request gets a unique preview URL

Build command: `npm run docs:build`
Output directory: `docs/.vitepress/dist`

The site uses GitHub Actions for CI/CD. See `.github/workflows/` for deployment configuration.

## Technology Stack

- **[VitePress](https://vitepress.dev/)** - Vue-powered static site generator
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework
- **[Vite](https://vitejs.dev/)** - Next-generation frontend build tool
- **[vitepress-plugin-tabs](https://github.com/Red-Asuka/vitepress-plugin-tabs)** - Tabs functionality

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

We welcome contributions from the community! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- How to set up your development environment
- Content guidelines and style standards
- How to submit changes
- Issue and pull request templates

For quick fixes (typos, broken links), feel free to open a PR directly. For larger changes, please open an issue first to discuss your proposed changes.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Resources

- **MuleSoft Forge Documentation**: https://docs.mulesoftforge.com
- **VitePress Documentation**: https://vitepress.dev/
- **Component Examples**: See `docs/examples/components.md` or `/examples/components` when running the site
- **Component Documentation**: See `COMPONENTS.md` for detailed technical documentation

## Support

For questions or support:
- Create an issue in this repository
- Contact the MuleSoft Forge team
- Join the community discussions

---

**MuleSoft Forge** - Community-driven MuleSoft connectors and modules
