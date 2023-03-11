// TODO: add a listener for when the user types in the prompt input field
// when the user types, send a message to background.js to retrieve autocomplete suggestions for the query
console.log('init chat gpt prompt autocomplete ...')

// Get the input fields on the current page
const inputField = document.querySelector('textarea')

function getPrompts() {
  console.log('load prompts...')
  // https://github.com/f/awesome-chatgpt-prompts
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest()
    xhr.open(
      'GET',
      'https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv',
      true
    )

    xhr.onload = function () {
      if (this.readyState === 4 && this.status === 200) {
        let lines = xhr.responseText.split('\n')
        let result = []
        let headers = lines[0].split(',')
        for (let i = 1; i < lines.length; i++) {
          let obj = {}
          let currentline = lines[i].split(',"')
          for (let j = 0; j < headers.length; j++) {
            obj[headers[j].split('"').join('')] = currentline[j].split('"').join('')
          }
          result.push(obj)
        }
        resolve(result)
      } else {
        reject(this.statusText)
      }
    }

    xhr.onerror = function () {
      reject(this.statusText)
    }

    xhr.send()
  })
}

function clearElements() {
  const listItems = document.querySelectorAll('.list-items')
  listItems.forEach((item) => {
    item.remove()
  })
}

// Define the autocomplete function
async function autocomplete(inputField) {
  const suggestions = await getPrompts()

  inputField.addEventListener('input', () => {
    clearElements()

    const value = inputField.value.toLowerCase()

    if (value === '') {
      return
    }

    // Filter the suggestions based on the current input value
    const filteredSuggestions = suggestions.filter((suggestion) =>
      suggestion.act.toLowerCase().startsWith(value)
    )

    const list = document.createElement('ul')
    list.setAttribute('class', 'list')

    filteredSuggestions.forEach((suggestion) => {
      const listItem = document.createElement('li')
      listItem.classList.add('list-items')
      listItem.style.cursor = 'pointer'
      listItem.innerHTML = suggestion.act
      listItem.addEventListener('click', () => {
        inputField.value = suggestion.prompt
        clearElements()
      })

      list.appendChild(listItem)
    })

    inputField.parentNode.appendChild(list)
  })
}

autocomplete(inputField)