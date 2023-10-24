const getParents = function (elem, selector) {
  const Element = window.Element
  // Element.matches() polyfill
  if (!Element.prototype.matches) {
    Element.prototype.matches =
            Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            function (s) {
              const matches = (this.document || this.ownerDocument).querySelectorAll(s)
              let i = matches.length
              while (--i >= 0 && matches.item(i) !== this) { } // eslint-disable-line
              return i > -1
            }
  }

  // Set up a parent array
  const parents = []

  // Push each parent element to the array
  for (; elem && elem !== document; elem = elem.parentNode) {
    if (selector) {
      if (elem.matches(selector)) {
        parents.push(elem)
      }
      continue
    }
    parents.push(elem)
  }

  // Return our parent array
  return parents
}

module.exports = getParents
