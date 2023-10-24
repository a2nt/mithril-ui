const NAME = 'uiPageTpl'

const m = require("mithril") // eslint-disable-line
const Page = require('./index')

module.exports = {
    oninit: () => {
        if (!window.app.Router.isFormResponse()) {
            Page.loadContent(document.location.pathname)
        } else {
            console.log(`${NAME}: Page is form response, stop page content loading`)
            window.app.Router.initLinks()
        }
    },
    onupdate: () => {
        window.app.Router.initLinks()
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
