// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

// Import custom components
import Hint from './components/Hint.vue'
import Stepper from './components/Stepper.vue'
import Step from './components/Step.vue'

// Import custom styles
import './styles/custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // Register custom components globally
    app.component('Hint', Hint)
    app.component('Stepper', Stepper)
    app.component('Step', Step)

    // Enhance app with tabs functionality
    enhanceAppWithTabs(app)
  }
}
