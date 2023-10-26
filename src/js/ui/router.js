const NAME = 'uiRouter'

// const Events = require('../_events')
const Page = require('./page')
const getParents = require('../util/getParents')
const scrollOptions = { behavior: 'smooth', block: 'end', inline: 'nearest' }

const Router = {
  FirstLoad: true,
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
        target.scrollIntoView(scrollOptions)
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
    if (Router.sameOrigin(url)) {
      return Page.loadContent(Router.getRelURL(url))
    }
    window.location.href = url
    return true
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
    const curState = window.history.state

    // state should be null on first load, otherwise back button will lead to the same page
    if (
      !Router.FirstLoad &&
            (!curState || !curState.link || (curState.link !== pushState.link))
    ) {
      window.history.pushState(pushState, title, absURL)
    }
    Router.FirstLoad = false

    // set window title
    document.title = title
    // window.top.document.title // eslint-disable-line

    Router.removeActiveState()
    Router.setActiveState(link)
  },

  // set active links
  setActiveState (link) {
    document.querySelectorAll(`a[href="${link}"],.a[data-href="${link}"]`).forEach((el) => {
      el.classList.add('active')

      // activate nav sections
      if (el.classList.contains('nav-link')) {
        getParents(el, '.nav-item').forEach((navEl) => {
          const navLink = navEl.querySelector(':scope > .nav-link')
          if (navLink) {
            navLink.classList.add('section')
          }
        })
      }
    })
  },

  removeActiveState () {
    document.querySelectorAll('a,.a').forEach((el) => {
      el.classList.remove('active', 'loading', 'section')
    })

    // reset focus
    if (document.activeElement instanceof window.HTMLElement) {
      document.activeElement.blur()
    }

    // scroll to top
    const target = document.getElementById('Logo')
    if (target) {
      target.scrollIntoView(scrollOptions)
    }
  },

  popState (state = null) {
    if (state && state.link) {
      console.log(`${NAME}: [popstate] load`)

      Router.openURL(state.link)
    } else if (state && state.landing) {
      console.log(`${NAME}: [popstate] go to landing`)

      Router.openURL(state.landing)
    } else {
      console.warn(`${NAME}: [popstate] state is missing`)
      console.log(state)
    }
  }
}

window.addEventListener('popstate', (e) => {
  Router.popState(window.history.state)
})

module.exports = Router
