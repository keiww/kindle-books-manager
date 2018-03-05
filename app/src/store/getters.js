const getters = {
  collections: state => {
    return state.collections.sort((a, b) => b.lastModifiedDateUnixTimestamp - a.lastModifiedDateUnixTimestamp)
  },
  collectionById: (state, getters) => (collectionId) => {
    return getters.collections.find(collection => collection.collectionId === collectionId)
  },
  books: (state, getters) => {
    return state.books.sort((item1, item2) => item2.acquiredTime - item1.acquiredTime)
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

export default getters
