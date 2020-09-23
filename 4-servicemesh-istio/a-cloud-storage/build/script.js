/* eslint-env browser */
/* eslint no-unused-vars: "off" */
function setMainDisplayImage (imageData) {
  const myImage = document.querySelector('.my-image')
  myImage.src = imageData
}
function getFileExtention (imageString) {
  const matches = imageString.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/)
  if (matches.length !== 3) {
    return null
  }
  const result = matches[1] === 'jpeg' ? 'jpg' : matches[1]
  return result
}
function uploadImage () {
  const fileInput = document.getElementById('theFile')
  const file = fileInput.files[0]
  const reader = new FileReader()
  reader.onload = async () => {
    const imageData = reader.result
    setMainDisplayImage(imageData)
    const ext = getFileExtention(imageData)
    document.getElementById('aiData').innerHTML = 'Uploading file...'
    const response = await fetch(`/api/storage?ext=${ext}`)
    if (response.status >= 400) {
      document.getElementById('aiData').innerHTML = 'Error: Getting signed url ' + response.statusText
      return response
    }
    const data = await response.json()
    const cosResponse = await fetch(data.putUrl, {
      method: 'PUT',
      body: file
    })
    if (response.status >= 400) {
      document.getElementById('aiData').innerHTML = 'Error: Uploading file ' + cosResponse.statusText
      return response
    }
    const model = document.querySelectorAll('input[id="food"]')[0].checked ? 'food' : 'default'
    await classifyImage(data.getUrl, model)
  }
  reader.readAsDataURL(file)
}
const classifyImage = async (url, model) => {
  document.getElementById('aiData').innerHTML = 'Detecting objects...'
  const response = await fetch('/api/classify', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url: url, model: model })
  })
  if (response.status >= 400) {
    document.getElementById('aiData').innerHTML = 'Error: ' + response.statusText
  } else {
    const data = await response.json()
    console.log(JSON.stringify(data, null, 2))
    const classes = data.result.images[0].classifiers[0].classes
    tableFromJson('aiData', classes)
  }
}
function tableFromJson (div, json) {
  // Create a table.
  const table = document.createElement('table')

  // Create table header row using the extracted headers above.
  let tr = table.insertRow(-1) // table row.
  const thc = document.createElement('th')
  thc.innerHTML = 'classes'
  tr.appendChild(thc)
  const ths = document.createElement('th')
  ths.innerHTML = 'score'
  tr.appendChild(ths)

  // sort largest confindence first
  json.sort((a, b) => (a.score > b.score) ? -1 : ((b.score > a.score) ? 1 : 0))
  // add json data to the table as rows.
  for (let i = 0; i < json.length; i++) {
    tr = table.insertRow(-1)
    const tabCellC = tr.insertCell(-1)
    tabCellC.innerHTML = json[i].class
    const tabCellS = tr.insertCell(-1)
    tabCellS.innerHTML = parseFloat(json[i].score * 100).toFixed(2) + '%'
  }

  // Now, add the newly created table with json data, to a container.
  const divShowData = document.getElementById(div)
  divShowData.innerHTML = ''
  divShowData.appendChild(table)
}
