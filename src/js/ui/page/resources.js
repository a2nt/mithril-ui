
window.app ??= {}
window.app.filesLoaded ??= 'app.js app.css'

// Head tag
const head = document.getElementsByTagName('head')[0]

// For loading JS file
const loadJS = (src) => {
  if (window.app.filesLoaded.indexOf(src) !== -1) {
    return
  }

  // Adding the name of the file to keep record
  window.app.filesLoaded += ' ' + src

  return new Promise((resolve, reject) => {
    // Creating script element
    const script = document.createElement('script')
    script.src = src
    script.type = 'text/javascript'
    script.async = true
    script.onload = () => {
      console.log(`Loaded: ${src}`)
      resolve()
    }
    script.onerror = reject

    // Adding script element
    head.append(script)
  })
}

// To load CSS file
const loadCSS = (src) => {
  if (window.app.filesLoaded.indexOf(src) !== -1) {
    return
  }

  // Adding the name of the file to keep record
  window.app.filesLoaded += ' ' + src

  // Creating link element
  return new Promise((resolve, reject) => {
    const style = document.createElement('link')
    style.href = src
    style.type = 'text/css'
    style.rel = 'stylesheet'
    style.onload = () => {
      console.log(`Loaded: ${src}`)
      resolve()
    }
    style.onerror = reject

    head.append(style)
  })
}

const loadResource = (file) => {
  if (file.includes('js')) {
    return loadJS(file)
  }

  return loadCSS(file)
}

module.exports = loadResource
