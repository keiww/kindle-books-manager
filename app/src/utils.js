export const onReady = (newVueApp) => {
  let buttonIsReady = false
  let appIsReady = false

  const appContainer = document.createElement('div')
  appContainer.id = 'kindle-books-manager-app-container'
  appContainer.innerHTML = '<div id="kindle-books-manager-app"></div>'

  const button = document.createElement('button')
  button.setAttribute('class', 'button_myx myx-button myx-button-primary')
  button.innerHTML = '<span class="myx-button-text">Books Manager</span>'
  button.addEventListener('click', () => {
    document.body.style.overflow = 'hidden'
    if (appContainer.style.display === 'none') {
      appContainer.style.display = 'block'
    } else {
      newVueApp()
    }
  }, false)

  const addButton = () => {
    const buttonList = document.querySelector('.inline_myx.button_myx')
    if (buttonList && !buttonIsReady) {
      buttonIsReady = true
      document.removeEventListener('DOMNodeInserted', addButton)
      buttonList.appendChild(button)
    }
  }

  document.addEventListener('DOMNodeInserted', addButton, false)
  document.body.appendChild(appContainer)

  window.closeKindleBookManager = () => {
    document.body.style.overflow = 'initial'
    appContainer.style.display = 'none'
  }
}


export const queryStringify = (data) => {
  const params = Object.keys(data).map(key => {
    return `${key}=${encodeURIComponent(data[key])}`
  })
  return params.join('&')
}

export const htmlDecode = (str) => {
  const div = document.createElement('div')
  div.innerHTML = str
  return div.textConnect || div.innerText
}
