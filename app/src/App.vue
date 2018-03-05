<template>
  <div
    class='container'
    @contextmenu.prevent=''
    @click='onClickOutside'
    ref='kindleBooksManager'
  >
    <aside class='sidebar'>
      <header class='logo'><span>K</span>indle books manager</header>
      <div
        class='collection'
        :class='{ active: activeDisplay("all") }'
        @click='switchDisplay("all")'
      >
        <span>All Books</span>
        <span>({{this.books.length}})</span>
      </div>
      <div
        class='collection'
        :class='{ active: activeDisplay("withoutCollection") }'
        @click='switchDisplay("withoutCollection")'
      >
        <span>Books without Collection</span>
        <span>({{this.booksWithoutCollection.length}})</span>
      </div>

      <label>Collections</label>
      <div class='collections'>
        <div
          v-for='collection in collections'
          class='collection'
          :class='{ active: activeDisplay(collection.collectionId), hover: isDraggingOver(collection) }'
          @dragover='onDragoverCollection($event, collection)'
          @dragleave='onDragleaveCollection($event, collection)'
          @drop='onDropBooks($event, collection)'
          @click='switchDisplay(collection.collectionId)'
          @contextmenu.prevent='onCollectionMenu($event, collection)'
        >
          <span class='name'>{{ collection.name }}</span>
          <span class='count'>({{ booksInCollection(collection.collectionId).length }})</span>
        </div>
      </div>

      <div class='bottom-bar'>
        <button @click='newCollection'><AddIcon /></button>
      </div>
    </aside>

    <main class='explorer'>
      <header class='topbar'>
        <button class='btn-close' @click='closeKindleBookManager'><CloseIcon /></button>
      </header>
      <div class='file-list'>
        <div
          class='item'
          v-for='book in displayBooks'
          :class='{ selected: isBookSelected(book) }'
          @click='onSelectBook(book)'
          @dragstart='onDragstart($event, book)'
          draggable
          @contextmenu.prevent='onBookMenu($event, book)'
        >
          <span class='name'>{{ book.title }}</span>
          <span class='modified-date'>{{ book.acquiredDate }}</span>
        </div>
      </div>
    </main>

    <CollectionMenu
      :show='showCollectionMenu'
      :x='menuX'
      :y='menuY'
      :selectedCollection='collectionWithMenu'
      :currentDisplay='currentDisplay'
      :switchDisplay='switchDisplay'
    ></CollectionMenu>

    <BookMenu
      :show='showBookMenu'
      :x='menuX'
      :y='menuY'
      :selectedBooks='selectedBooks'
      :currentDisplay='currentDisplay'
    ></BookMenu>

    <DraggingItems
      v-show='showDraggingItems'
      :items='selectedBooks'
      :x='draggingX'
      :y='draggingY'
    ></DraggingItems>

    <div ref='dragGhost' class='drag-ghost'></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CollectionMenu from '@/components/CollectionMenu'
import BookMenu from '@/components/BookMenu'
import DraggingItems from '@/components/DraggingItems'
import AddIcon from '@/assets/add.svg'
import CloseIcon from '@/assets/close.svg'

export default {
  name: 'kindle-books-manager',
  data () {
    return {
      currentDisplay: 'withoutCollection', // all, withoutCollection, <collectionId>
      showCollectionMenu: false,
      showBookMenu: false,
      menuX: 0,
      menuY: 0,
      collectionWithMenu: null,
      bookWithMenu: null,
      selectedBooks: [],
      shortcutCommand: false,
      shortcutShift: false,
      showDraggingItems: false,
      draggingOverCollection: null,
      draggingX: 0,
      draggingY: 0
    }
  },
  components: {
    CollectionMenu,
    BookMenu,
    DraggingItems,
    AddIcon,
    CloseIcon
  },
  computed: {
    ...mapGetters([
      'collections',
      'books',
      'booksWithoutCollection',
      'booksInCollection'
    ]),
    displayBooks () {
      switch (this.currentDisplay) {
        case 'all':
          return this.books
        case 'withoutCollection':
          return this.booksWithoutCollection
          break
        default:
          if (this.currentDisplay) {
            return this.booksInCollection(this.currentDisplay)
          }
          return []
      }
    }
  },
  created () {
    this.getCollections()
    this.getBooks()

    window.addEventListener('keydown', this.onShortcut, false)
    window.addEventListener('keyup', this.cancelShortcut, false)
    document.addEventListener('dragover', this.onDragover, false)
    document.addEventListener('dragend', this.onDragend, false)
  },
  methods: {
    ...mapActions([
      'getCollections',
      'getBooks',
      'createCollection',
      'addBooksToCollection'
    ]),
    // global
    activeDisplay (display) {
      return display === this.currentDisplay
    },
    switchDisplay (display) {
      this.currentDisplay = display
      this.selectedBooks = []
    },
    onClickOutside (event) {
      if (this.showCollectionMenu) {
        this.showCollectionMenu = false
        this.collectionWithMenu = null
      }
      if (this.showBookMenu) {
        this.showBookMenu = false
        this.bookWithMenu = null
      }
    },
    onShortcut (e) {
      if (e.keyCode === 91 || e.keyCode === 224) { // chrome && firefox
        this.shortcutCommand = true
      }
      if (e.keyCode === 16) {
        this.shortcutShift = true
      }
      if (e.keyCode === 27) {
        this.selectedBooks = []
      }
    },
    cancelShortcut (e) {
      if (e.keyCode === 91 || e.keyCode === 224) { // chrome && firefox
        this.shortcutCommand = false
      }
      if (e.keyCode === 16) {
        this.shortcutShift = false
      }
    },
    onDragover (e) {
      this.draggingX = e.clientX
      this.draggingY = e.clientY
      e.preventDefault()
    },
    onDragend (e) {
      this.showDraggingItems = false
      e.preventDefault()
    },

    // collections
    newCollection () {
      let name = window.prompt('New Collection Name')
      name = (name || '').trim()
      if (name) {
        this.createCollection(name)
      }
    },
    onCollectionMenu (e, collection) {
      this.menuX = e.clientX
      this.menuY = e.clientY
      this.showBookMenu = false
      this.showCollectionMenu = true
      this.collectionWithMenu = collection
    },
    onDropBooks (e, collection) {
      e.preventDefault()
      this.addBooksToCollection({ books: this.selectedBooks, collectionId: collection.collectionId })
    },
    onDragoverCollection (e, collection) {
      e.preventDefault()
      this.draggingOverCollection = collection
    },
    onDragleaveCollection (e, collection) {
      e.preventDefault()
      this.draggingOverCollection = null
    },
    isDraggingOver (collection) {
      return this.draggingOverCollection === collection
    },

    // explorer
    isBookSelected (book) {
      return this.selectedBooks.includes(book)
    },
    onSelectBook (book) {
      if (this.shortcutCommand) {
        const idx = this.selectedBooks.indexOf(book)
        if (idx > -1) {
          this.selectedBooks.splice(idx, 1)
        } else {
          this.selectedBooks.push(book)
        }
      } else if (this.shortcutShift && this.selectedBooks.length) {
        const idx = this.displayBooks.indexOf(book)
        const firstSelectedIdx = this.displayBooks.indexOf(this.selectedBooks[0])
        this.selectedBooks = []
        if (idx >= firstSelectedIdx) {
          for (let i = firstSelectedIdx; i <= idx; i++) {
            this.selectedBooks.push(this.displayBooks[i])
          }
        } else {
          for (let i = firstSelectedIdx; i >= idx; i--) {
            this.selectedBooks.push(this.displayBooks[i])
          }
        }
      } else {
        this.selectedBooks = [book]
      }
    },
    onDragstart (e, book) {
      if (!this.isBookSelected(book)) {
        this.onSelectBook(book)
      }
      this.showDraggingItems = true
      e.dataTransfer.setDragImage(this.$refs.dragGhost, 0, 0)
    },
    onBookMenu (e, book) {
      if (!this.isBookSelected(book)) {
        this.onSelectBook(book)
      }
      this.showCollectionMenu = false
      this.menuX = e.clientX
      this.menuY = e.clientY
      this.showBookMenu = true
      this.bookWithMenu = book
    },

    closeKindleBookManager () {
      window.closeKindleBookManager && window.closeKindleBookManager()
    }
  }
}
</script>

<style lang="scss">
// body {
//   margin: 0;
//   overflow: hidden;
// }
*, *:before, *:after {
    box-sizing: border-box;
}
</style>

<style lang="scss" scoped>
$mainColor: #d81717;
$gutter: 20px;

button {
  appearance: none;
  border: none;
  outline: none;
  cursor: pointer;
  background: none;
}

.container {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: #fff;
  font-size: 14px;
  color: #333;
  font-family: 'Avenir', 'Helvetica Neue', sans-serif;
  user-select: none;
}

.logo {
  height: 60px;
  padding: 0 $gutter;
  margin-bottom: $gutter;
  border-bottom: 1px solid #efefef;
  line-height: 62px;
  color: #888;
  span {
    margin-right: 2px;
    font-size: 40px;
    font-weight: 500;
    color: $mainColor;
  }
}

.sidebar {
  position: relative;
  min-width: 250px;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  .collections {
    overflow: hidden;
    overflow-y: auto;
    flex: 1;
  }
  .bottom-bar {
    align-self: flex-end;
    display: flex;
    align-items: center;
    padding: 0 $gutter / 2;
    min-height: 40px;
    width: 100%;
  }
  .collection {
    cursor: pointer;
    padding: 4px $gutter - 4px;
    margin: 6px 0;
    color: #555;
    border-left: 4px solid transparent;
    &.active {
      color: #333;
      font-weight: 500;
      border-left-color: $mainColor;
    }
    &:hover, &.hover {
      background: rgba(255, 220, 220, 0.3)
    }
  }
  label {
    display: block;
    font-weight: 500;
    padding: $gutter $gutter $gutter / 4;
    color: #888;
    font-size: 14px;
    text-transform: uppercase;
  }
}

.explorer {
  display: flex;
  flex: 1;
  flex-flow: column nowrap;
  background: #fff;
  .topbar {
    position: relative;
    min-height: 60px;
    border-bottom: 1px solid #efefef;
    .btn-close {
      position: absolute;
      right: $gutter;
      top: 24px;
    }
  }
  .file-list {
    padding: $gutter;
    overflow: hidden;
    overflow-y: auto;
    cursor: default;
  }
  .item {
    display: flex;
    justify-content: space-between;
    padding: $gutter / 4 $gutter;
    // border-radius: 4px;
    background: #fff;
    &:nth-child(odd) {
      background: #f6f6f6;
    }
    &:hover {
      background: rgba(255, 220, 220, 0.3);
    }
    &.selected {
      background: rgba(255, 220, 220, 0.5);
    }
    .modified-date {
      color: #666;
    }
  }
}
.drag-ghost {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
}
</style>
