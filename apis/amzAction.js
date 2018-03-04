$.ajax({
  type: 'POST',
  dataType: 'json',
  url: 'https://www.amazon.cn/mn/dcw/myx/ajax-activity',
  csrfToken: 'gEpkSxbrDVBHVpMW2sPk05P9nxNJkTq4rnz0P0UAAAAJAAAAAFqVPFdyYXcAAAAA',
  data: JSON.stringify({
    "param":
    {
      "AddContentToCollection":
      {
        "collectionList": [
        {
          "collectionId": "c4ba7ac2-8c19-4dd6-bb84-b891340bfd77"
        }],
        "contentList": [
        {
          "asin": "X6WOWIDKHQ27ESCKTT3AHGFOG7LCGU27"
        }],
        "categoryList": [
        {
          "category": "KindlePDoc"
        }]
      }
    }
  })
})

function amzAction (action) {
  return $.ajax({
    type: 'POST',
    dataType: 'json',
    url: 'https://www.amazon.cn/mn/dcw/myx/ajax-activity',
    data: {
      data: JSON.stringify(action),
      csrfToken: csrfToken.csrfToken
    }
  })
}

function queryStringify (data) {
  const params = Object.keys(data).map(key => {
    return `${key}=${data[key]}`
  })
  return params.join('&')
}

function amzAction (action) {
  return fetch('https://www.amazon.cn/mn/dcw/myx/ajax-activity', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: queryStringify({
      data: JSON.stringify(action),
      csrfToken: window.csrfToken
    })
  })
}

// actions
function addContentToCollection ({ collectionId, asin, category }) {
  return amzAction({
    "param": {
      "AddContentToCollection":
      {
        "collectionList": [
        {
          "collectionId": collectionId
        }],
        "contentList": [
        {
          "asin": asin
        }],
        "categoryList": [
        {
          "category": category
        }]
      }
    }
  })
}

function createCollection (collectionName) {
  return amzAction({
    "param":{
      "CreateCollection":{
        "collectionName": collectionName
      }
    }
  })
}

function getCollections () {
  return amzAction({
    "param":{
      "GetCollections":{
        "startIndex":0,
        "batchSize":500,
        "sortOrder":"DESCENDING",
        "sortIndex":"MODIFIED_DATE"
      }
    }
  })
}

function getKindlePDocs () {
  return amzAction({
    "param": {
      "OwnershipData":{
        "sortOrder":"DESCENDING",
        "sortIndex":"DATE",
        "startIndex":0,
        "batchSize":18,
        "contentType": "KindlePDoc",
        "itemStatus": ["Active"],
        "isExtendedMYK": false
      }
    }
  })
}

function getEbooks () {
  return amzAction({
    "param":
    {
      "OwnershipData":
      {
        "sortOrder": "DESCENDING",
        "sortIndex": "DATE",
        "startIndex": 0,
        "batchSize": 18,
        "contentType": "Ebook",
        "itemStatus": ["Active", "Expired"],
        "excludeExpiredItemsFor": ["KOLL", "Purchase", "Pottermore", "FreeTrial", "DeviceRegistration", "ku", "Sample", "Prime"],
        "originType": ["Purchase", "PublicLibraryLending", "PersonalLending", "KOLL", "RFFLending", "Pottermore", "Rental", "DeviceRegistration", "FreeTrial", "ku", "Sample", "Prime"],
        "isExtendedMYK": false,
        "showSharedContent": true
      }
    }
  })
}

addContentToCollection({
  asin: "X6WOWIDKHQ27ESCKTT3AHGFOG7LCGU27",
  collectionId: "c4ba7ac2-8c19-4dd6-bb84-b891340bfd77"
}).done(result => {
  console.log('result', result)
  console.log(result.AddContentToCollection)
}).fail(err => {
  console.log('err', err)
})


