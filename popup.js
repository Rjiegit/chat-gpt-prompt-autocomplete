const input = document.querySelector('#autocomplete-input')
const suggestions = document.querySelector('#suggestions')

input.addEventListener('input', () => {
  const query = input.value
  if (query.trim().length === 0) {
    suggestions.innerHTML = ''
    return
  }
  // TODO: send a message to background.js to retrieve autocomplete suggestions for the query
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'autocomplete') {
    const items = message.data
    const html = items.map((item) => `<div>${item}</div>`).join('')
    suggestions.innerHTML = html
  }
})
