<template>
  <div class='container' @contextmenu.prevent='' @click='handleOutsideClick'>

    <aside class='collections'>
      <div class='collection home' @click='switchDisplay("all")'>All Books</div>
      <div class='collection home' @click='switchDisplay("withoutCollection")'>Book without Collection</div>

      <h2>Collections</h2>
      <div
        class='collection'
        v-for='collection in collections'
        @click='switchDisplay(collection.collectionId)'
        @contextmenu.prevent='handleCollectionOption($event, collection)'
      >
        <span class='name'>{{ collection.name }}</span>
      </div>
      <button @click='newCollection'>Add Collection</button>
    </aside>

    <main class='explorer'>
      <!-- <div
        class="item"
        v-for='collection in collections'
        @contextmenu.prevent='handleCollectionOption($event, collection)'
      >
        <span class='name'>{{ collection.name }}</span>
      </div> -->
      <div class='item' v-for='book in displayBooks' draggable @dragstart="">
        <span class='name'>{{ book.title }}</span>
        <span>{{ book.acquiredDate }}</span>
      </div>
    </main>

    <CollectionMenu
      :show='showCollectionMenu'
      :x='collectionMenuX'
      :y='collectionMenuY'
      :onDelete='handleDeleteCollection'
      :onRename='handleRenameCollection'
    ></CollectionMenu>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CollectionMenu from '@/components/CollectionMenu'

export default {
  name: 'kindle-books-manager',
  data () {
    return {
      currentDisplay: 'all', // all, withoutCollection, <collectionId>
      showCollectionMenu: false,
      collectionMenuX: 0,
      collectionMenuY: 0,
      collectionWithMenu: null
    }
  },
  components: {
    CollectionMenu
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
    this.$store.dispatch('getCollections')
    this.$store.dispatch('getEbooks')
    this.$store.dispatch('getKindlePDocs')
  },
  methods: {
    switchDisplay (display) {
      this.currentDisplay = display
    },
    newCollection () {
      const name = prompt('New Collection Name').trim()
      if (name) {
        console.log(name)
        this.$store.dispatch('createCollection', name)
      }
    },
    handleCollectionOption (event, collection) {
      this.collectionWithMenu = collection
      this.collectionMenuX = event.clientX
      this.collectionMenuY = event.clientY
      if (!this.showCollectionMenu) {
        this.showCollectionMenu = true
      }
    },
    handleOutsideClick (event) {
      if (this.showCollectionMenu) {
        this.showCollectionMenu = false
      }
    },
    handleDeleteCollection () {
      if (this.collectionWithMenu && confirm(`Sure to delete Collection ${this.collectionWithMenu.name}?`)) {
        this.$store.dispatch('deleteCollection', this.collectionWithMenu.collectionId)
      }
    },
    handleRenameCollection () {
      if (this.collectionWithMenu) {
        const name = prompt('Change Collection name', this.collectionWithMenu.name).trim()
        // TODO can't be repeated
        if (name && name !== this.collectionWithMenu.name) {
          this.$store.dispatch('renameCollection', { collectionId: this.collectionWithMenu.collectionId, name })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$gutter: 20px;

.container {
  padding: $gutter;
  display: flex;
  border: 1px solid #ccc;
  font-size: 16px;
  font-family: sans-serif;
  user-select: none;
}
.collections {
  background: #f8f8f8;
  padding: $gutter;
  border-right: 1px solid #ccc;
  .collection {
    margin-bottom: 10px;
    background: #e8e8e8;
    padding: $gutter / 2;
    &.home {
      font-weight: bold;
    }
    .name {

    }
  }
}
.explorer {
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  background: #fff;
  .item {
    padding: $gutter / 4 $gutter;
    background: #fff;
    &:nth-child(odd) {
      background: #fafafa;
    }
    &:hover {
      background: #f4f4f4;
    }
    &.active {
      background: #d0ecff;
    }
    .collection {
      background: #e8e8e8;
    }
  }
}
</style>
