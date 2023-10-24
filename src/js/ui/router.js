const NAME = 'uiRouter'

// const Events = require('../_events')
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
    const link = el
    const url = link.getAttribute('href')
    const urlObj = new URL(url, document.location.origin)

    // no URL defined
    if (!url) {
      e.preventDefault()

      console.warn(`${NAME} > linkClick: no href`)
      console.warn(e)

      return false
    }

    // same URL
    if (urlObj.pathname === document.location.pathname) {
      e.preventDefault()
      console.log(`${NAME} > linkClick: same URL`)

      return false
    }

    // scroll to hash url
    if (urlObj.hash && (!urlObj.pathname || urlObj.pathname === '/graphql/')) {
      e.preventDefault()
      console.log(`${NAME} > linkClick: hash URL`)

      const target = document.querySelector(urlObj.hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
      }

      return true
    }

    // local URL
    if (!link.getAttribute('target') && Router.sameOrigin(url)) {
      e.preventDefault()

      console.log(`${NAME} > linkClick: local URL`)
      el.classList.add('loading')
      return Router.openURL(url)
    }

    // external URL
    console.log(`${NAME} > linkClick: external URL`)
    return true
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
    /* if (Router.isAbsURL(url)) {
                return new URL(url, document.location.origin).pathname
            } */
    return new URL(url, document.location.origin).pathname
  },

  requestMethod () {
    return document.querySelector('meta[name="http_method"]').getAttribute('content')
  },

  isFormResponse () {
    return document.location.search.includes('SecurityID') || Router.requestMethod() === 'POST'
  },

  openURL: (url) => {
    return Page.loadContent(Router.getRelURL(url))
  },

  setPage (page) {
    Router.setLocation(page.title, page.link, page)

    // window.dispatchEvent(new Event(window.app.Events.LOADED))
    // window.dispatchEvent(new Event(window.app.Events.AJAX))
  },

  setLocation (title, url, state) {
    const link = state.requestlink ?? url
    const pushState = state
      ? {
          id: state.id,
          link,
          title: state.title
        }
      : {}

    const absURL = Router.getAbsURL(link)

    window.history.replaceState(pushState, title, absURL)

    // set window title
    document.title = title
    // window.top.document.title // eslint-disable-line

    // set active links
    document.querySelectorAll('a,.a').forEach((el) => {
      el.classList.remove('nav-active')
      el.classList.remove('loading')
    })

    document.querySelectorAll(`a[href="${link}"],.a[data-href="${link}"]`).forEach((el) => {
      el.classList.add('nav-active')
    })
  }
}

module.exports = Router
