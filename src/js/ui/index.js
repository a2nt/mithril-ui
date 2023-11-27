const NAME = 'ui'

const Events = require('../_events')
const Router = require('./router')
const Page = require('./page')

window.app ??= {}

window.app.Events = Events.default
window.app.Router = Router
window.app.Page = Page

const MainContentContainer = document.getElementById('MainContent')
if (!MainContentContainer || !MainContentContainer.dataset['legacy']) {
  window.addEventListener(`${Events.DOMLOADED}`, () => {
    console.log(`${NAME}: Router.initLinks`)
    Router.initLinks()
  })

  window.addEventListener(`${Events.AJAX}`, () => {
    console.log(`${NAME}: Router.initLinks`)
    Router.initLinks()
  })
}
