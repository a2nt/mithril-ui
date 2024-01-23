const NAME = 'uiAjax'

const m = require("mithril") // eslint-disable-line
const options = {
  withCredentials: true,
  params: {
    ajax: '1'
  },
  headers: {
    HTTP_X_REQUESTED_WITH: 'XMLHttpRequest'
  }
}

const AJAX = {
  request: async (opts) => {
    const res = await m.request({
      ...options,
      ...opts
    })

    if (res.errors) {
      console.error(`${NAME} > request: Error`)
      res.errors.forEach((e) => {
        console.error(e.message)
      })
    }

    return await res
  }
}

module.exports = AJAX
