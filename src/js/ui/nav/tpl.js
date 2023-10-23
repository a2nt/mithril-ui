const NAME = 'uiNavTpl' // eslint-disable-line

const m = require("mithril") // eslint-disable-line
const Nav = require('./index')

const renderItems = (items) => {
  if (!items) { return '' };

  return items.map((obj, i) => {
    const hasChildren = obj.children && obj.children.length
    const className = 'nav-item ' + obj.CSSClass + (hasChildren ? ' dropdown' : '')

    const opts = {
      class: className
    }

    const links = [
      m('a', {
        class: 'nav-link nav-load',
        onclick: Nav.linkClick,
        href: obj.link
      }, obj.title)
    ]

    if (hasChildren) {
      opts.onmouseover = Nav.showDropdown
      opts.onmouseleave = Nav.hideDropdown

      links.push(<div class='dropdown-menu'>{renderItems(obj.children)}</div>)
    }

    return m('div', opts, links)
  })
}

module.exports = {
  oninit: Nav.loadContent,
  view: () => {
    return (
      <nav>
        {renderItems(Nav.Children)}
      </nav>
    )
  }
}
