const mutations = {
  // collections
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
    let collection = state.collections.find(item => item.collectionId === collectionId)
    const idx = state.collections.indexOf(collection)
    for (let key in payload) {
      state.collections[idx][key] = payload[key]
    }
  },
  deleteCollection (state, { collectionId }) {
    const collection = state.collections.find(item => item.collectionId === collectionId)
    const idx = state.collections.indexOf(collection)
    state.collections.splice(idx, 1)
  },
  // books
  addBooks (state, { books }) {
    state.books = [
      ...state.books,
      ...books
    ]
  },
  deleteBook (state, { asin }) {
    let targetIdx
    state.books.forEach((item, idx) => {
      if (item.asin === asin) {
        targetIdx = idx
      }
    })
    if (targetIdx) {
      state.books.splice(targetIdx, 1)
    }
  },
  editBook (state, { asin, ...payload }) {
    let book = state.books.find(item => item.asin === asin)
    const idx = state.books.indexOf(book)
    for (let key in payload) {
      state.books[idx][key] = payload[key]
    }
  }
}

export default mutations
