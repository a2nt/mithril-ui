const m = require("mithril") // eslint-disable-line
const Page = require('./index')

module.exports = {
  oninit: Page.loadContent('home'),
  onupdate: () => {
    window.app.Router.initLinks()
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
