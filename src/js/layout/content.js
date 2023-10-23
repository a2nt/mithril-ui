const m = require("mithril") // eslint-disable-line

const MainContent = document.getElementById('MainContent')
MainContent.classList.add('page--container')

const page = require('../ui/page/tpl')
m.mount(MainContent, page)

module.exports = MainContent
