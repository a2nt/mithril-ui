const NAME = 'uiNav'

const m = require('mithril') // eslint-disable-line

const queries = require('../queries/page')
const GraphQL = require('../graphql')

const Defaults = {
  Children: null
}

const Nav = {
  ...Defaults,
  linkClick: (e) => {
    e.preventDefault()
    const link = e.target

    window.app.Router.linkClick(link, e)
  },

  hideDropdown: (e) => {
    const link = e.target
    console.log(`${NAME} > hideDropdown`)

    link.closest('.dropdown').querySelectorAll('.dropdown-menu')
      .forEach((el) => el.classList.remove('show'))
  },

  showDropdown: (e) => {
    console.log(`${NAME} > showDropdown`)
    const link = e.target

    // show current
    link.closest('.dropdown')
      .querySelector('.dropdown-menu').classList.add('show')
  },

  loadContent: async () => {
    console.log(`${NAME}: loadContent`)

    // reset Nav keys
    Object.keys(Defaults).forEach(k => {
      Nav[k] = Defaults[k]
    })

    try {
      const resp = await GraphQL.request({
        variables: { id: '0' },
        query: queries.menu
      })

      const loaded = resp.data.readPages
      Nav.Children = loaded.nodes
    } catch (error) {
      console.error(`${NAME}: loadContent > FAILED`)

      Nav.Title = 'Loading Failed!'
    }
  }
}

module.exports = Nav
