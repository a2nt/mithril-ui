const Events = require('../_events')
const Router = require('./router')
const Page = require('./page')

window.app ??= {}

window.app.Events = Events
window.app.Router = Router
window.app.Page = Page

window.addEventListener(`${Events.DOMLOADED}`, () => {
  Router.initLinks()
})

window.addEventListener(`${Events.AJAX}`, () => {
  Router.initLinks()
})
