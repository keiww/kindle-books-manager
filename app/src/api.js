import { queryStringify, htmlDecode } from '@/utils'

const amzAction = (action) => {
  const host = process.env.NODE_ENV === 'production' ? window.location.host : 'www.amazon.cn'
  const url = `https://${host}/mn/dcw/myx/ajax-activity`
  return fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: queryStringify({
      data: JSON.stringify(action),
      csrfToken: window.csrfToken || process.env.TOKEN
    })
  }).then(res => {
    return res.text()
  }).then(jsonText => {
    return JSON.parse(htmlDecode(jsonText))
  }).catch(err => {
    throw err
  })
}

// books
export const getKindlePDocs = ({ startIndex = 0 } = {}) => {
  return amzAction({
    "param": {
      "OwnershipData": {
        "sortOrder": "DESCENDING",
        "sortIndex": "DATE",
        "startIndex": startIndex,
        "batchSize": 18,
        "contentType": "KindlePDoc",
        "itemStatus": ["Active"],
        "isExtendedMYK": false
      }
    }
  })
}

export const getEbooks = ({ startIndex = 0 } = {}) => {
  return amzAction({
    "param": {
      "OwnershipData": {
        "sortOrder": "DESCENDING",
        "sortIndex": "DATE",
        "startIndex": startIndex,
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

// collections
export const getCollections = () => {
  return amzAction({
    "param": {
      "GetCollections": {
        "startIndex": 0,
        "batchSize": 500,
        "sortOrder": "DESCENDING",
        "sortIndex": "MODIFIED_DATE"
      }
    }
  })
}

export const createCollection = (collectionName) => {
  return amzAction({
    "param": {
      "CreateCollection": {
        "collectionName": collectionName
      }
    }
  })
}

export const deleteCollection = (collectionId) => {
  return amzAction({
    "param": {
      "DeleteCollections": {
        "collectionList": [
          { "collectionId": collectionId }
        ]
      }
    }
  })
}

export const editCollection = (collectionId, payload) => {
  return amzAction({
    "param": {
      "EditCollection": {
        "collectionId": collectionId,
        "newCollectionName": payload.name,
        locale: "zh_CN"
      }
    }
  })
}

export const addContentToCollection = ({ collectionId, asin, category }) => {
  return amzAction({
    "param": {
      "AddContentToCollection": {
        "collectionList": [{
          "collectionId": collectionId
        }],
        "contentList": [{
          "asin": asin
        }],
        "categoryList": [{
          "category": category
        }]
      }
    }
  })
}

export const deleteContent = ({ asin, category }) => {
  return amzAction({
    "param": {
      "DeleteContent": {
        "asinDetails": {
          [asin]: {
            "category": category
          }
        }
      }
    }
  })
}

export const removeContentsFromCollection = ({ collectionId, asin, category }) => {
  return amzAction({
    "param": {
      "RemoveContentsFromCollection": {
        "collectionList": [ {
          "collectionId": collectionId
        }],
        "contentList": [{
          "asin": asin
        }],
        "categoryList": [{
          "category": category
        }]
      }
    }
  })
}
