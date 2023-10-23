const m = require("mithril") // eslint-disable-line
const Page = require('./index')

module.exports = {
  oninit: Page.loadContent('home'),
  onupdate: () => {
    window.app.Router.initLinks()
  },
  view: () => {
    return (
      <main>
        <h1>{Page.title}</h1>
        {Page.content}
      </main>
    )
  }
}
