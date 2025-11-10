# Custom Components Documentation

This document provides detailed technical documentation for the custom Vue components developed for the MuleSoft Forge website.

## Overview

Three custom components were developed to replicate GitBook functionality:

1. **Hint** - Callout boxes for notes, warnings, and alerts
2. **Tabs** - Tabbed content for multi-platform examples
3. **Stepper/Step** - Sequential numbered step-by-step guides

All components are built with Vue 3 Composition API and support both light and dark themes.

---

## Hint Component

**File**: `docs/.vitepress/theme/components/Hint.vue`

### Purpose

Creates styled callout boxes to highlight important information, warnings, tips, and errors in documentation.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `type` | String | No | `'info'` | Hint variant: `'success'`, `'info'`, `'warning'`, or `'danger'` |

### Prop Validation

The `type` prop is validated against allowed values. Invalid types will:
- Log a console warning
- Default to `'info'` type

### Usage

```vue
<Hint type="success">
Operation completed successfully!
</Hint>

<Hint type="info">
Additional context or helpful information.
</Hint>

<Hint type="warning">
Be careful with this configuration option.
</Hint>

<Hint type="danger">
Critical warning - this action cannot be undone.
</Hint>
```

### Styling Details

Each type has distinct styling:

#### Success (Green)
- Background: `#e8f5e9`
- Border: `#4caf50`
- Text: `#1b5e20`
- Icon: ✓ (checkmark)

#### Info (Blue)
- Background: `#e3f2fd`
- Border: `#2196f3`
- Text: `#0d47a1`
- Icon: ℹ (info symbol)

#### Warning (Orange)
- Background: `#fff3e0`
- Border: `#ff9800`
- Text: `#e65100`
- Icon: ⚠ (warning triangle)

#### Danger (Red)
- Background: `#ffebee`
- Border: `#f44336`
- Text: `#b71c1c`
- Icon: ✕ (X mark)

### Dark Mode

Dark mode uses semi-transparent backgrounds with adjusted text colors:
- Success: `rgba(76, 175, 80, 0.15)` background, `#a5d6a7` text
- Info: `rgba(33, 150, 243, 0.15)` background, `#90caf9` text
- Warning: `rgba(255, 152, 0, 0.15)` background, `#ffb74d` text
- Danger: `rgba(244, 67, 54, 0.15)` background, `#ef5350` text

### Accessibility

- Uses `role="note"` for semantic meaning
- Includes `aria-label` describing the message type
- Icons have `aria-hidden="true"` (decorative only)
- Proper color contrast ratios for readability

### Nested Content Support

The component supports nested elements:
- Paragraphs with proper spacing
- Inline code with styled backgrounds
- Lists and other markdown elements

### Layout

- Flexbox layout with icon on left, content on right
- 4px solid left border for visual emphasis
- 16px padding for comfortable reading
- Gap of 12px between icon and content
- 16px vertical margin for page spacing

---

## Tabs Component

**Implementation**: `vitepress-plugin-tabs` package

### Purpose

Provides tabbed content sections for organizing multi-platform examples, alternative approaches, or language-specific code.

### Installation

The plugin is installed as a dev dependency and configured in two places:

1. **Markdown config** (`docs/.vitepress/config.js`):
```javascript
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

export default defineConfig({
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)
    }
  }
})
```

2. **Theme enhancement** (`docs/.vitepress/theme/index.js`):
```javascript
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

export default {
  enhanceApp({ app }) {
    enhanceAppWithTabs(app)
  }
}
```

### Usage

Markdown syntax using `:::tabs` container and `==` tab markers:

```markdown
::: tabs

== Java

Java code example here...

== XML

XML configuration here...

== Python

Python implementation here...

:::
```

### Features

- Multiple independent tab groups per page
- Smooth transitions between tabs
- Keyboard navigation (arrow keys)
- Click or keyboard activation
- Remembers last active tab per group
- Fully responsive design

### Styling

The tabs component uses VitePress default theme styling and integrates seamlessly with the site's color scheme and dark mode.

### Best Practices

1. **Tab labels** - Keep short and descriptive (e.g., "Java", "XML", "Python")
2. **Content consistency** - Ensure all tabs contain similar types of content
3. **Order** - Place most common/recommended option first
4. **Code blocks** - Use syntax-highlighted code blocks within tabs
5. **Tab count** - Limit to 2-5 tabs for best user experience

---

## Stepper Component

**File**: `docs/.vitepress/theme/components/Stepper.vue`

### Purpose

Container component for sequential step-by-step guides. Manages step numbering via Vue's provide/inject pattern.

### Props

None - the component accepts only child `Step` components via slot.

### Architecture

Uses Vue 3's provide/inject for parent-child communication:

```javascript
// Step counter
const stepCount = ref(0)

// Registration function
const registerStep = () => {
  stepCount.value += 1
  return stepCount.value
}

// Provide to children
provide('registerStep', registerStep)
```

### Usage

```vue
<Stepper>
  <Step title="First Step">
    Content for step 1...
  </Step>

  <Step title="Second Step">
    Content for step 2...
  </Step>

  <Step title="Third Step">
    Content for step 3...
  </Step>
</Stepper>
```

### Styling

Minimal styling - primarily a container with 24px vertical margin.

---

## Step Component

**File**: `docs/.vitepress/theme/components/Step.vue`

### Purpose

Individual step within a Stepper, displaying numbered badge, title, and content.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | String | Yes | - | The step title/heading |

### Architecture

Registers with parent Stepper component on mount:

```javascript
const stepNumber = ref(null)
const registerStep = inject('registerStep', null)

onMounted(() => {
  if (registerStep) {
    stepNumber.value = registerStep()
  } else {
    console.warn('[Step] Must be used within Stepper')
  }
})
```

### Layout Structure

```
Step
├── Header (flex container)
│   ├── Indicator
│   │   ├── Number badge (circular, 32px)
│   │   └── Connector line (vertical, 2px)
│   └── Title wrapper
│       └── Title (h3, 18px)
└── Content (left-indented, 48px)
    └── Slot content
```

### Visual Design

#### Step Number Badge
- Size: 32px diameter (28px on mobile)
- Background: `var(--vp-c-brand-1)` (brand color)
- Text: White, 16px, weight 600
- Shape: Circular (border-radius: 50%)
- Position: Flex container, centered content

#### Connector Line
- Width: 2px
- Color: `var(--vp-c-divider)`
- Position: Absolute, below badge
- Height: Extends to next step
- Hidden: On last step (`:last-child .step-connector`)

#### Step Title
- Font size: 18px (16px on mobile)
- Font weight: 600
- Color: `var(--vp-c-text-1)`
- Margin: 0
- Alignment: Vertically centered with badge

#### Step Content
- Left margin: 48px (40px on mobile)
- Color: `var(--vp-c-text-2)`
- Line height: 1.7
- Supports nested elements with proper spacing

### Responsive Design

Mobile breakpoint: `max-width: 640px`

Changes:
- Badge: 32px → 28px
- Title: 18px → 16px
- Content margin: 48px → 40px
- Header gap: 16px → 12px

### Dark Mode

Uses CSS variables for automatic dark mode support:
- Badge background: `var(--vp-c-brand-1)` adjusts for dark theme
- Connector color: `var(--vp-c-divider)` adjusts for dark theme
- Text colors: Use VitePress theme variables

### Nested Content Support

The component handles various nested content with `:deep()` selectors:

- **Paragraphs**: 12px vertical margin
- **Lists**: 12px vertical margin, 20px left padding
- **Code blocks**: Inherit theme styling, 16px vertical margin
- **Hint components**: 16px vertical margin
- **First/last elements**: Adjusted margins for clean edges

### Accessibility

- Semantic HTML structure (div containers, h3 headings)
- Connector line has `aria-hidden="true"` (decorative)
- Proper heading hierarchy (h3 for step titles)
- Color contrast meets WCAG AA standards

### Best Practices

1. **Step count** - 3-6 steps is ideal for workflows
2. **Title clarity** - Use clear, action-oriented titles
3. **Content length** - Keep steps concise but complete
4. **Nesting** - Safe to nest Hint components and code blocks
5. **Code formatting** - Use proper markdown code blocks with language tags

---

## Technical Implementation Notes

### Vue 3 Composition API

All components use `<script setup>` syntax for cleaner, more concise code:

```vue
<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info'
  }
})

const icon = computed(() => {
  // Computed logic
})
</script>
```

### CSS Variables

Components use VitePress CSS variables for theming:

```css
.step-number {
  background-color: var(--vp-c-brand-1);
  color: white;
}

.step-connector {
  background-color: var(--vp-c-divider);
}
```

This ensures:
- Automatic dark mode support
- Consistent branding
- Easy theme customization

### Scoped Styling

All component styles are scoped to prevent conflicts:

```vue
<style scoped>
.hint {
  /* Styles only apply to this component */
}
</style>
```

Use `:deep()` for nested content styling:

```css
.hint-content :deep(p) {
  margin: 0;
}
```

### Global Registration

Components are registered globally in `docs/.vitepress/theme/index.js`:

```javascript
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Hint', Hint)
    app.component('Stepper', Stepper)
    app.component('Step', Step)
  }
}
```

This allows usage directly in markdown without imports.

---

## Testing Checklist

### Component Functionality
- [ ] Hint renders all 4 types correctly
- [ ] Hint validates prop types and shows warnings
- [ ] Tabs switch smoothly between panels
- [ ] Multiple tab groups work independently
- [ ] Stepper assigns sequential numbers
- [ ] Step displays badge and title correctly
- [ ] Connector lines appear between steps (not after last)

### Visual Quality
- [ ] Colors match specification
- [ ] Icons display correctly
- [ ] Spacing is appropriate
- [ ] Typography is readable
- [ ] Dark mode colors adjust properly

### Responsive Design
- [ ] Components work at 320px width
- [ ] Components work at 768px width
- [ ] Components work at 1920px width
- [ ] Text remains readable at all sizes
- [ ] Layout doesn't break on mobile

### Nested Content
- [ ] Paragraphs render correctly inside components
- [ ] Code blocks work inside components
- [ ] Hints work inside Steps
- [ ] Lists display properly
- [ ] Images don't break layout

### Accessibility
- [ ] Screen reader compatibility
- [ ] Keyboard navigation works
- [ ] Color contrast passes WCAG AA
- [ ] Focus indicators visible
- [ ] Semantic HTML structure

### Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari
- [ ] Chrome Android

---

## Performance Considerations

### Component Size
- Hint: ~2KB (component + styles)
- Stepper: ~1KB (minimal logic)
- Step: ~3KB (component + styles)
- Tabs plugin: ~8KB (external dependency)

Total overhead: **~14KB** for all custom components (minified + gzipped significantly smaller)

### Rendering Performance
- No unnecessary re-renders (proper use of reactive refs)
- Scoped styles for efficient CSS application
- No heavy computations or watchers
- Minimal DOM updates

### Best Practices Followed
- Vue 3 Composition API for better tree-shaking
- CSS variables instead of JavaScript for theming
- Lazy loading via VitePress (components load with pages)
- No external dependencies except tabs plugin

---

## Future Enhancements

Potential improvements for future phases:

1. **Hint Component**
   - Custom icons via prop
   - Dismissible hints with close button
   - Animation on first render

2. **Tabs Component**
   - Sync tabs across multiple tab groups
   - Persist selected tab in URL hash
   - Tab badges (e.g., "NEW", "BETA")

3. **Stepper Component**
   - Collapsible steps
   - Progress bar above stepper
   - Navigation buttons (Previous/Next)
   - Completion checkmarks for finished steps

4. **General**
   - Unit tests with Vitest
   - Storybook integration for component development
   - Automated visual regression testing

---

## Troubleshooting

### Hint Component

**Issue**: Invalid type doesn't show warning
- **Cause**: Validator only logs to console in development
- **Solution**: Check browser console, warnings won't appear in production builds

**Issue**: Dark mode colors look wrong
- **Cause**: Theme CSS variables not loading
- **Solution**: Ensure custom.css is imported in theme/index.js

### Tabs Component

**Issue**: Tabs don't render
- **Cause**: Plugin not properly registered
- **Solution**: Check both markdown config and theme enhancement

**Issue**: Multiple tab groups interfere
- **Cause**: Plugin should handle this automatically
- **Solution**: Ensure latest version of vitepress-plugin-tabs

### Stepper/Step Components

**Issue**: Step numbers don't appear
- **Cause**: Step not mounted or not inside Stepper
- **Solution**: Check console for warning, ensure Step is child of Stepper

**Issue**: Connector lines overlap content
- **Cause**: Z-index or positioning issue
- **Solution**: Content has default z-index, connectors are background

**Issue**: Last step shows connector
- **Cause**: CSS selector not working
- **Solution**: Check that `:last-child .step-connector` rule is present

---

## Support

For questions or issues with these components:

1. Check this documentation first
2. Review component source code for implementation details
3. Check VitePress documentation for framework-level questions
4. Create an issue in the repository with:
   - Component name
   - Expected behavior
   - Actual behavior
   - Browser and version
   - Screenshots if applicable

---

**Document Version**: 1.0
**Last Updated**: 2025-11-09
**Status**: Phase 1.1 Complete
