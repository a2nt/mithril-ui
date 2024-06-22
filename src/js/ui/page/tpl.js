const NAME = 'uiPageTpl'

const m = require("mithril") // eslint-disable-line
const Page = require('./index')
const loadResource = require('./resources')

module.exports = {
  oninit: () => {
    if (window.preloadedData) {
      console.log(`${NAME}: render preloaded`)

      Page.renderPage(window.preloadedData)
      window.app.Router.setPage(Page)
      setTimeout(() => {
        window.app.Router.initLinks()
      }, 500);
      

      window.preloadedData = null
    } else if (!window.app.Router.isFormResponse()) {
      console.log(`${NAME}: load on init`)

      // load content on init
      const prefetchURL = document.querySelector('link[rel="preload"][as="fetch"]')
      const link = prefetchURL ? prefetchURL.getAttribute('href') : document.location.pathname

      Page.loadContent(link)
    } else {
      console.log(`${NAME}: Page is form response, stop page content loading`)

      window.app.Router.initLinks()

      // hide loading spinner
      const spinner = document.getElementById('PageLoading')
      if (spinner) {
        spinner.classList.add('d-none')
      }
    }

    window.preloadedData = null
  },
  onupdate: async () => {
    window.app.Router.initLinks()

    if (Page.Resources) {
      // load extra page scripts
      const scripts = Array.isArray(Page.Resources) ? Page.Resources : JSON.parse(Page.Resources)

      const promises = scripts.map(loadResource)
      await Promise.all(promises)
    }

    window.dispatchEvent(new Event(window.app.Events.AJAX))
  },
  view: () => {
    return (
      <main class={Page.CSSClass}>
        <div class='element page-header-element'>
          <div class='element-container container'>
            <h1 class='page-header'>{Page.title}</h1>
          </div>
        </div>
        {Page.content}
      </main>
    )
  }
}
