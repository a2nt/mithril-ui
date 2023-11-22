const NAME = 'uiPage'

const m = require("mithril") // eslint-disable-line

const queries = require('../queries/page')
const GraphQL = require('../graphql')

const Defaults = {
  id: 0,
  link: '/',
  title: 'Loading ...',
  // content: '',
  CSSClass: 'loading'
}

const Page = {
  ...Defaults,
  loadContent: async (link) => {
    console.log(`${NAME} > loadContent: start ${link}`)
    console.time(`${NAME} > loadContent`)

    // legacy code compatibility: clean predefined content (ex. Form Submission)
    const predefined = document.querySelector('#MainContent>.main-content')
    if (predefined) {
      predefined.remove()
    }

    // reset Page keys
    Object.keys(Defaults).forEach(k => {
      Page[k] = Defaults[k]
    })

    m.redraw()

    try {
      const resp = await GraphQL.request({
        variables: { url: link },
        query: queries.byLink
      })

      const loaded = await resp.data.readOnePage

      console.log(`${NAME} > loadContent: done`)

      if (!loaded) {
        console.warn(`${NAME}: loadContent: ${link} > NOT FOUND`)
        Page.title = 'NOT FOUND'
        Page.content = (
          <div class='elemental-area'>
            <div class='element elemen--not-found'>
              <div class='element__container container'>Server Error</div>
            </div>
          </div>
        )

        window.app.Router.removeActiveState()

        // TODO: load not found page using GraphQL
        // redirect to not found
        // window.location.href = '/page-not-found/'

        console.timeEnd(`${NAME} > loadContent`)
        return
      }

      Page.title = loaded.title ?? window.document.title
      Page.id = loaded.id
      Page.link = loaded.link ?? '/'
      Page.requestlink = loaded.RequestLink ?? '/'
      Page.CSSClass = loaded.CSSClass + ' loaded'
      Page.Resources = loaded.Resources

      Page.renderPage(loaded)
      window.app.Router.setPage(Page)

      console.timeEnd(`${NAME} > loadContent`)

    } catch (error) {
      console.error(`${NAME}: loadContent > FAILED`)
      console.error(error)

      Page.title = 'Loading Failed!'
      console.timeEnd(`${NAME} > loadContent`)
    }
  },

  renderPage: (loaded) => {
    // display template content or parse elements
    if (loaded.MainContent) {
      Page.content = m.trust(loaded.MainContent)
      return
    }

    if (loaded.elementalArea) {
      Page.content = m('.elemental-area', loaded.elementalArea.elements.map((el) => {
        const className = el.className.replaceAll('\\', '__').toLowerCase()
        return m(
          'div',
          { id: el.id, class: 'element ' + className },
          m('.element__container.container',
            m.trust(el.forTemplate)
          )
        )
      }))

      return
    }
  }
}

module.exports = Page
