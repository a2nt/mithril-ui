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

      const loaded = resp.data.readOnePage

      console.log(`${NAME}: loadedContent: ${link}`)

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
        return
      }

      Page.title = loaded.title ?? window.document.title
      Page.id = loaded.id
      Page.link = loaded.link ?? '/'
      Page.requestlink = loaded.RequestLink ?? '/'
      Page.CSSClass = loaded.CSSClass
      Page.Resources = loaded.Resources

      // display template content or parse elements
      if (loaded.MainContent) {
        Page.content = await m.trust(loaded.MainContent)
      } else if (loaded.elementalArea) {
        Page.content = await m('.elemental-area', loaded.elementalArea.elements.map((el) => {
          const className = el.className.replaceAll('\\', '__').toLowerCase()
          return m(
            'div',
            { id: el.id, class: 'element ' + className },
            m('.element__container.container',
              m.trust(el.forTemplate)
            )
          )
        }))
      }

      window.app.Router.setPage(Page)
    } catch (error) {
      console.error(`${NAME}: loadContent > FAILED`)
      console.error(error)

      Page.title = 'Loading Failed!'
    }
  }
}

module.exports = Page
