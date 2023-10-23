const NAME = 'uiRouter'

const Page = require('./page')

const Router = {
  initLinks () {
    document.querySelectorAll('a:not(.legacy)').forEach((el) => {
      if (el.dataset[NAME]) {
        return
      }

      el.dataset[NAME] = 'active'
      el.addEventListener('click', (e) => {
        Router.linkClick(el, e)
      })
    })
  },

  linkClick (el, e) {
    console.log(`${NAME} > linkClick`)

    const link = el
    const href = link.getAttribute('href')
    if (!href) {
      e.preventDefault()
      console.warn('No href')
      console.warn(e)
      return
    }

    if (href && !link.getAttribute('target') && Router.sameOrigin(href)) {
      e.preventDefault()
      Router.openURL(href)
    }
  },

  sameOrigin (uri) {
    const url = Router.getAbsURL(uri)

    const newURL = new URL(url)
    const currURL = new URL(window.location.href)

    if (newURL.host !== currURL.host) return false
    if (newURL.port !== currURL.port) return false
    if (newURL.protocol !== currURL.protocol) return false

    return true
  },

  isAbsURL (url) {
    return url.indexOf('://') > 0 || url.indexOf('//') === 0
  },

  getAbsURL (url) {
    if (!Router.isAbsURL(url)) {
      return new URL(url, document.location.origin).href
    }
    return url
  },

  getRelURL (url) {
    if (Router.isAbsURL(url)) {
      return new URL(url, document.location.origin).pathname
    }
    return url
  },

  openURL: (url) => {
    console.log('openURL')
    console.log(Router.getRelURL(url))
    Page.loadContent(Router.getRelURL(url))
  },

  setPage (page) {
    Router.setLocation(page.title, page.link, page)

    // window.dispatchEvent(new Event(window.app.Events.LOADED))
    window.dispatchEvent(new Event(window.app.Events.AJAX))
  },

  setLocation (title, url, state) {
    const pushState = state
      ? {
          id: state.id,
          link: state.link,
          title: state.title
        }
      : {}

    const absURL = Router.getAbsURL(url)

    window.history.replaceState(pushState, title, absURL)

    // set window title
    document.title = title
        window.top.document.title // eslint-disable-line

    // set active links
    document.querySelectorAll('a,.a').forEach((el) => {
      el.classList.remove('nav-active')
    })

    document.querySelectorAll(`a[href="${url}"],.a[data-href="${url}"]`).forEach((el) => {
      el.classList.add('nav-active')
    })
  }
}

module.exports = Router
