const m = require('mithril') // eslint-disable-line

const Header = document.getElementById('Header')

const navContainer = document.createElement('div')
navContainer.classList.add('nav--container')
Header.appendChild(navContainer)

const nav = require('../ui/nav/tpl')
m.mount(navContainer, nav)

module.exports = Header
