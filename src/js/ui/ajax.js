const NAME = 'uiAjax'

const m = require("mithril") // eslint-disable-line
// const curParams = [...new URLSearchParams(window.location.search).entries()].reduce((r, [k, v]) => { r[k] = v; return r; }, {})
const options = {
    withCredentials: true,
    params: {
        // ...curParams,
    },
    headers: {
        HTTP_X_REQUESTED_WITH: 'XMLHttpRequest'
    }
}

const AJAX = {
    request: async (opts) => {
        if (!opts.url.includes('ajax=1')) {
            options.params.ajax = '1'
        }

        if (!opts.url.includes('m=')) {
            options.params.m = Date.now()
        }

        const res = await m.request({
            ...options,
            ...opts
        })

        if (res && res.errors) {
            console.error(`${NAME} > request: Error`)
            res.errors.forEach((e) => {
                console.error(e.message)
            })
        }

        return await res
    }
}

module.exports = AJAX
