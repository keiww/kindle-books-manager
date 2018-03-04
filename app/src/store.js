import Vue from 'vue'
import Vuex from 'vuex'
import {
  getCollections,
  createCollection,
  deleteCollection,
  editCollection,

  getEbooks,
  getKindlePDocs,
  ceteContent
} from '@/api'

Vue.use(Vuex)

const TYPES = {
  ADD_COLLECTIONS : 'addCollections',
  CREATE_COLLECTION: 'createCollection',
  DELETE_COLLECTION: 'deleteCollection',
  EDIT_COLLECTION: 'editCollection',

  ADD_EBOOKS : 'addEbooks',
  ADD_KINDLEPDOCS : 'addKindlePDocs',
  DELETE_CONTENT: 'deleteContent'
}

const state = {
  collections: [],
  ebooks: [],
  pdocs: []
}

const mutations = {
  addCollections (state, { collections }) {
    state.collections = [
      ...state.collections,
      ...collections
    ]
  },
  createCollection (state, { collection }) {
    state.collections.unshift(collection)
  },
  editCollection (state, { collectionId, ...payload }) {
    console.log(collectionId, payload)
    let collection = state.collections.find(item => item.collectionId === collectionId)
    const idx = state.collections.indexOf(collection)
    for (let key in payload) {
      state.collections[idx][key] = payload[key]
    }
    console.log(state.collections)
  },
  deleteCollection (state, { collectionId }) {
    const collection = state.collections.find(item => item.collectionId === collectionId)
    const idx = state.collections.indexOf(collection)
    state.collections.splice(idx, 1)
  },
  addEbooks (state, { ebooks }) {
    state.ebooks = [
      ...state.ebooks,
      ...ebooks
    ]
  },
  addKindlePDocs (state, { pdocs }) {
    state.pdocs = [
      ...state.pdocs,
      ...pdocs
    ]
  },
  deleteContent (state, { asin, category }) {
    const keyMap = {
      ebooks: 'Ebook',
      pdocs: 'KindlePDoc'
    }
    const key = keyMap[category]
    let targetIdx
    state[key].forEach((item, idx) => {
      if (item.asin === asin) {
        targetIdx = idx
      }
    })
    if (targetIdx) {
      state[key].splice(targetIdx, 1)
    }
  }
}

const getters = {
  collections: state => {
    return state.collections.sort((a, b) => b.lastModifiedDateUnixTimestamp - a.lastModifiedDateUnixTimestamp)
  },
  ebooks: state => state.ebooks,
  pdocs: state => state.pdocs,
  books: (state, getters) => {
    const books = [
      ...getters.ebooks,
      ...getters.pdocs
    ]
    books.sort((item1, item2) => item2.acquiredTime - item1.acquiredTime)
    return books
  },
  booksWithoutCollection (state, getters) {
    const books = getters.books.filter(book => !book.collectionCount)
    return books
  },
  booksInCollection: (state, getters) => (collectionId) => {
    const books = getters.books.filter(book => {
      return book.collectionIds && book.collectionIds.indexOf(collectionId) > -1
    })
    return books
  }
}

const actions = {
  getCollections ({ commit, dispatch }, startIndex = 0) {
    return getCollections({ startIndex })
      .then(data => {
        const collections = data.GetCollections.items
        commit(TYPES.ADD_COLLECTIONS, { collections })
        if (data.GetCollections.hasMoreItems) {
          dispatch('getCollections', state.collections.length)
        } else {
          console.log('Getting All Collections is finished')
        }
      })
      // .catch(err => {
      //   console.log('[ERROR] getCollections', err)
      //   // alert(err)
      // })
  },
  getKindlePDocs ({ commit, dispatch }, startIndex = 0) {
    return getKindlePDocs({ startIndex })
      .then(data => {
        const pdocs = data.OwnershipData.items
        commit(TYPES.ADD_KINDLEPDOCS, { pdocs })
        if (data.OwnershipData.hasMoreItems && startIndex === 0) {
          for (let i = state.pdocs.length, total = data.OwnershipData.numberOfItems; i < total + 18 - 1; i += 18) {
            console.log('getKindlePDocs', i)
            dispatch('getKindlePDocs', i)
          }
        }
      })
      // .catch(err => {
      //   console.log('[ERROR] getKindlePDocs', err)
      //   // alert(err)
      // })
  },
  getEbooks ({ commit, dispatch, startIndex = 0 }) {
    return getEbooks({ startIndex })
      .then(data => {
        const ebooks = data.OwnershipData.items
        commit(TYPES.ADD_EBOOKS, { ebooks })
        if (data.OwnershipData.hasMoreItems && startIndex === 0) {
          for (let i = state.ebooks.length, total = data.OwnershipData.numberOfItems; i < total + 18 - 1; i += 18) {
            console.log('getEbooks', i)
            dispatch('getEbooks', i)
          }
        }
      })
      // .catch(err => {
      //   console.log('[ERROR] getEbooks', err)
      //   // alert(err)
      // })
  },
  createCollection ({ commit }, collectionName) {
    return createCollection(collectionName)
      .then(res => {
        if (res.CreateCollection.success) {
          commit(TYPES.CREATE_COLLECTION, { collecrtion: res.CreateCollection.newCollectionItem })
        }
      })
  },
  deleteCollection ({ commit }, collectionId) {
    return deleteCollection(collectionId)
      .then(res => {
        if (res.DeleteCollections.success) {
          commit(TYPES.DELETE_COLLECTION, { collectionId })
        }
      })
  },
  renameCollection ({ commit }, { collectionId, name }) {
    console.log(collectionId, name)
    return editCollection(collectionId, { name })
      .then(res => {
        if (res.EditCollection.success) {
          commit(TYPES.EDIT_COLLECTION, {
            collectionId,
            name,
            lastModifiedDateUnixTimestamp: res.EditCollection.editCollectionItem.lastModifiedDateUnixTimestamp
          })
        }
      })
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})


if (module.hot) {
  store.hotUpdate({
    state,
    mutations,
    actions,
    getters
  })
}

export default store
