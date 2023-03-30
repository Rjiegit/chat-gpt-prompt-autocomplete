// TODO: add a listener for when the user types in the prompt input field
// when the user types, send a message to background.js to retrieve autocomplete suggestions for the query
console.log('init chat gpt prompt autocomplete ...')

// Get the input fields on the current page
const inputField = document.querySelector('textarea')

const customPrompts = [
  {
    act: 'Laravel developer',
    prompt:
      '請扮演一名資深 PHP 工程師，擅長使用 Laravel 框架進行開發。請協助我進行接下來的開發，並回覆我提出的問題。',
  },
  {
    act: 'Typescript developer',
    prompt:
      '請扮演一名資深的 Node.JS 工程師，擅長使用 Typescript 進行開發，請協助我進行接下來的開發，並回覆我提出的問題。',
  },
  {
    act: 'Git commit message generator',
    prompt:
      '請扮演一名資深軟體工程師，請針對以下問題，建議我 commit message，message 部分請用英文回覆。須包含以下要素：動詞開頭、簡潔描述。',
  },
]

function getDefaultPrompts() {
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
        const lines = xhr.responseText.split('\n')
        let result = []
        const headers = lines[0].split(',')
        const lineLength = lines[lines.length - 1] === '' ? lines.length - 1 : lines.length

        for (let i = 1; i < lineLength; i++) {
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
  const suggestions = (await getDefaultPrompts()).concat(customPrompts)

  const list = document.createElement('ul')
  list.setAttribute('class', 'list')
  list.style.position = 'absolute'
  list.style.overflowY = 'auto'
  list.style.bottom = '100%'
  list.style.maxHeight = '200px'
  list.style.width = '100%'
  list.style.zIndex = '1'
  list.style.background = '#40414F'
  list.style.borderRadius = '6px'

  inputField.addEventListener('input', () => {
    clearElements()

    const value = inputField.value.toLowerCase()

    if (value === '') {
      return
    }

    // Filter the suggestions based on the current input value
    const filteredSuggestions = suggestions
      .map((suggestion) => {
        suggestion.act = suggestion.act.startsWith('/') ? suggestion.act : '/' + suggestion.act
        return suggestion
      })
      .filter((suggestion) => suggestion.act.toLowerCase().startsWith(value))

    filteredSuggestions.forEach((suggestion) => {
      const listItem = document.createElement('li')
      listItem.classList.add('list-items')
      listItem.style.cursor = 'pointer'
      listItem.style.paddingLeft = '20px'

      const pattern = new RegExp(`(${value})+`, 'gi')
      listItem.innerHTML = suggestion.act.replace(pattern, '<b>$&</b>')

      listItem.addEventListener('click', () => {
        inputField.value = suggestion.prompt
        inputField.style.height = inputField.scrollHeight + 'px'
        inputField.focus()
        clearElements()
      })

      list.appendChild(listItem)
    })

    inputField.parentNode.parentNode.appendChild(list)
  })
}

autocomplete(inputField)
