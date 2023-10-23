const NAME = 'uiGraphql'

const m = require("mithril") // eslint-disable-line
const options = {
  url: 'https://run.local.pro/graphql/'
}

const GraphQL = {
  request: (query) => {
    console.log(`${NAME}: request`)

    return m.request({
      url: options.url,
      method: 'POST',
      body: query
    })
  }
}

module.exports = GraphQL
