const NAME = 'uiPage'

const m = require("mithril") // eslint-disable-line

const queries = require('../queries/page')
const GraphQL = require('../graphql')

const Defaults = {
    id: 0,
    link: '/',
    title: 'Loading ...',
    content: '',
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

                if (resp.errors[0]) {
                    console.warn(resp.errors)
                }
                return
            }

            Page.title = loaded.title
            Page.id = loaded.id
            Page.link = loaded.link
            Page.requestlink = loaded.RequestLink
            Page.CSSClass = loaded.CSSClass

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
