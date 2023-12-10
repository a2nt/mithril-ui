const NAME = 'uiGraphql'

const m = require("mithril") // eslint-disable-line
const options = {
  url: '/graphql/'
}

const GraphQL = {
  request: async (body) => {
    const res = await m.request({
      url: options.url,
      method: 'POST',
      body
    })

    if (res.errors) {
      console.error(`${NAME} > request: Error`)
      res.errors.forEach((e) => {
        console.error(e.message)
      })
    }

    return res
  }
}

module.exports = GraphQL
