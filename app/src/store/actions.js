import TYPES from './types'
import {
  getCollections,
  createCollection,
  deleteCollection,
  editCollection,

  getEbooks,
  getKindlePDocs,
  deleteContent,

  addContentToCollection,
  removeContentsFromCollection
} from '@/api'

const actions = {
  // collections
  getCollections ({ commit, dispatch, getters }, startIndex = 0) {
    return getCollections({ startIndex })
      .then(data => {
        const collections = data.GetCollections.items
        commit(TYPES.ADD_COLLECTIONS, { collections })
        if (data.GetCollections.hasMoreItems) {
          dispatch('getCollections', getters.collections.length)
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
  },
  // books
  getBooks ({ commit, dispatch }) {
    dispatch('getEbooks', 0)
    dispatch('getKindlePDocs', 0)
  },
  getKindlePDocs ({ commit, dispatch }, startIndex = 0) {
    return getKindlePDocs({ startIndex })
      .then(data => {
        const pdocs = data.OwnershipData.items
        commit(TYPES.ADD_BOOKS, { books: pdocs })
        if (data.OwnershipData.hasMoreItems && startIndex === 0) {
          for (let i = 18, total = data.OwnershipData.numberOfItems; i < total + 18 - 1; i += 18) {
            dispatch('getKindlePDocs', i)
          }
        }
      })
  },
  getEbooks ({ commit, dispatch, startIndex = 0 }) {
    return getEbooks({ startIndex })
      .then(data => {
        const ebooks = data.OwnershipData.items
        commit(TYPES.ADD_BOOKS, { books: ebooks })
        if (data.OwnershipData.hasMoreItems && startIndex === 0) {
          for (let i = 18, total = data.OwnershipData.numberOfItems; i < total + 18 - 1; i += 18) {
            dispatch('getEbooks', i)
          }
        }
      })
  },
  createCollection ({ commit }, collectionName) {
    return createCollection(collectionName)
      .then(res => {
        if (res.CreateCollection.success) {
          commit(TYPES.CREATE_COLLECTION, { collection: res.CreateCollection.newCollectionItem })
        }
      })
  },
  addBooksToCollection ({ commit, getters }, { collectionId, books }) {
    for (let i = 0, l = books.length; i < l; i++) {
      const book = books[i]
      addContentToCollection({ collectionId: collectionId, asin: book.asin, category: book.category })
        .then(res => {
          if (res.AddContentToCollection.success) {
            commit(TYPES.EDIT_BOOK, {
              asin: book.asin,
              category: book.category,
              collectionCount: book.collectionCount + 1,
              collectionIds: (book.collectionIds || []).concat(collectionId)
            })
          }
        })
    }
  },
  removeBooksFromCollection ({ commit, getters }, { collectionId, books }) {
    books.forEach(book => {
      removeContentsFromCollection({ collectionId: collectionId, asin: book.asin, category: book.category })
        .then(res => {
          if (res.RemoveContentsFromCollection.success) {
            book.collectionIds.splice(book.collectionIds.indexOf(collectionId), 1)
            commit(TYPES.EDIT_BOOK, {
              asin: book.asin,
              category: book.category,
              collectionCount: book.collectionCount - 1,
              collectionIds: book.collectionIds
            })
          }
        })
    })
  },
  deleteBooks ({ commit, getters }, { books }) {
    books.forEach(book => {
      deleteContent({ asin: book.asin, category: book.category })
        .then(res => {
          if (res.DeleteContent.success) {
            commit(TYPES.DELETE_BOOK, {
              asin: book.asin
            })
          }
        })
    })
  }
}

export default actions
