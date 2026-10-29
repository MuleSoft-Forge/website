// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import { inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import Layout from './Layout.vue'
import { installImageZoom } from './imageZoom.js'

// Import custom components
import Hint from './components/Hint.vue'
import Stepper from './components/Stepper.vue'
import Step from './components/Step.vue'
import AssetCatalog from './components/AssetCatalog.vue'
import AtAGlance from './components/AtAGlance.vue'
import Contributors from './components/Contributors.vue'
import WhatsNew from './components/WhatsNew.vue'

// Import custom styles
import './styles/custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router, siteData }) {
    // Register custom components globally
    app.component('Hint', Hint)
    app.component('Stepper', Stepper)
    app.component('Step', Step)
    app.component('AssetCatalog', AssetCatalog)
    app.component('AtAGlance', AtAGlance)
    app.component('Contributors', Contributors)
    app.component('WhatsNew', WhatsNew)

    // Enhance app with tabs functionality
    enhanceAppWithTabs(app)

    if (inBrowser) {
      installImageZoom()
    }
  }
}
