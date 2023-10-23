// const NAME = 'uiGraphql'

const m = require("mithril") // eslint-disable-line
const options = {
  url: '/graphql/'
}

const GraphQL = {
  request: (query) => {
    return m.request({
      url: options.url,
      method: 'POST',
      body: query
    })
  }
}

module.exports = GraphQL
