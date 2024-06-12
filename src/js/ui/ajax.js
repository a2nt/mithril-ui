const NAME = 'uiAjax'

const m = require("mithril") // eslint-disable-line
//const curParams = [...new URLSearchParams(window.location.search).entries()].reduce((r, [k, v]) => { r[k] = v; return r; }, {})
const options = {
    withCredentials: true,
    params: {
        //...curParams,
        ajax: '1',
        m: Date.now(),
    },
    headers: {
        HTTP_X_REQUESTED_WITH: 'XMLHttpRequest'
    }
}

const AJAX = {
    request: async (opts) => {
        const res = await m.request({
            ...options,
            ...opts,
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
