const NAME = 'uiRouter'

// const Events = require('../_events')
const Page = require('./page')
const getParents = require('../util/getParents')
const scrollOptions = { behavior: 'smooth', block: 'start', inline: 'nearest' }

const Router = {
  FirstLoad: true,
  initLinks () {
    document.querySelectorAll('a:not(.legacy,.download)').forEach((el) => {
      if (el.dataset[NAME]) {
        return
      }

      el.dataset[NAME] = 'active'
      el.addEventListener('click', (e) => {
        Router.linkClick(el, e)
      })
    })
  },

  async linkClick (el, e) {
    console.time(`${NAME} > linkClick`)

    const link = el
    const url = link.getAttribute('href')
    const urlObj = new URL(url, document.location.origin)

    // no URL defined
    if (!url) {
      e.preventDefault()

      console.warn(`${NAME} > linkClick: no href`)
      console.warn(e)

      console.timeEnd(`${NAME} > linkClick`)
      return false
    }

    // scroll to hash url
    if (
      urlObj.hash &&
      (
        !urlObj.pathname || urlObj.pathname === '/graphql/' ||
        (urlObj.hostname === document.location.hostname && urlObj.pathname === document.location.pathname)
      )
    ) {
      e.preventDefault()
      console.log(`${NAME} > linkClick: hash URL`)

      const target = document.querySelector(urlObj.hash)
      if (target) {
        target.scrollIntoView(scrollOptions)
      }

      console.timeEnd(`${NAME} > linkClick`)
      return true
    }

    // same URL
    if (
      urlObj.hostname === document.location.hostname &&
      urlObj.pathname === document.location.pathname &&
      urlObj.search === document.location.search
    ) {
      e.preventDefault()
      console.log(`${NAME} > linkClick: same URL`)
      console.timeEnd(`${NAME} > linkClick`)
      return false
    }

    /* const target = document.getElementById('TopAnchor')
        if (target) {
          target.scrollIntoView(scrollOptions)
        } */

    // local URL
    if (!link.getAttribute('target') && Router.sameOrigin(url)) {
      e.preventDefault()

      console.log(`${NAME} > linkClick: local URL`)

      el.classList.add('loading')
      Router.setNavParentClasses(el, 'loading')

      if (el.classList.contains('stretched-link')) {
        const parent = el.parentElement
        if (parent.classList.contains('element')) {
          parent.classList.add('loading')
        }
      }

      const res = await Router.openURL(url)
      console.timeEnd(`${NAME} > linkClick`)

      return res
    }

    // external URL
    console.log(`${NAME} > linkClick: external URL`)
    console.timeEnd(`${NAME} > linkClick`)
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
    const urlObj = new URL(url, document.location.origin)
    return urlObj.pathname + urlObj.search
  },

  requestMethod () {
    return document.querySelector('meta[name="http_method"]').getAttribute('content')
  },

  isFormResponse () {
    return document.location.search.includes('SecurityID') || Router.requestMethod() === 'POST' || document.location.pathname.match('element/([0-9]+)/([A-z]+)')
  },

  openURL: async (url) => {
    if (Router.sameOrigin(url)) {
      return await Page.loadContent(Router.getRelURL(url))
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

  // set nav parent classes
  setNavParentClasses (el, className) {
    // activate nav sections
    if (el.classList.contains('nav-link')) {
      getParents(el, '.nav-item').forEach((navEl) => {
        navEl.querySelectorAll(':scope > .nav-link').forEach((navLink) => {
          navLink.classList.add(className)
        })
      })
    }
  },

  // set active links
  setActiveState (link) {
    document.querySelectorAll(`a[href="${link}"],.a[data-href="${link}"]`).forEach((el) => {
      el.classList.add('active')

      // activate nav sections
      if (el.classList.contains('nav-link')) {
        Router.setNavParentClasses(el, 'section')
      }
    })

    // hide loading spinner
    const spinner = document.getElementById('PageLoading')
    if (spinner) {
      spinner.classList.add('d-none')
    }

    // instant scroll to top
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'instant'
    })

    /* setTimeout(() => {
          const target = document.getElementById('TopAnchor')
          if (target) {
            target.scrollIntoView(scrollOptions)
          }
        }, 500) */
  },

  removeActiveState () {
    document.querySelectorAll('a,.a,.nav-link,.element').forEach((el) => {
      el.classList.remove('active', 'loading', 'section')
    })

    // reset focus
    if (document.activeElement instanceof window.HTMLElement) {
      document.activeElement.blur()
    }

    // close mobile dropdowns
    document.querySelectorAll('.navbar-toggler[aria-expanded="true"]').forEach((el) => { el.click() })

    // close search bar
    const searchBar = document.getElementById('SearchFormContainer')
    if (searchBar) {
      searchBar.classList.remove('show')
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

// bfcache
window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
        console.log(`${NAME}: This page was restored from the bfcache.`)
        Router.openURL(window.location.href)
    }
})

module.exports = Router
