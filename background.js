chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'autocomplete_query') {
    const query = message.data
    // TODO: retrieve autocomplete suggestions for the query
    const suggestions = ['suggestion 1', 'suggestion 2', 'suggestion 3']
    sendResponse({ type: 'autocomplete', data: suggestions })
  }
})
