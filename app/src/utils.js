export const onReady = (callback) => {
  let buttonIsReady = false
  let appIsReady = false

  const appContainer = document.createElement('div')
  appContainer.id = 'kindle-books-manager-app'

  const button = document.createElement('button')
  button.setAttribute('class', 'button_myx myx-button')
  button.innerHTML = '<span class="myx-button-text">Books Manager</span>'
  button.addEventListener('click', () => {
    callback()
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
