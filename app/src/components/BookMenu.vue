<template>
  <div class='menu' :style='menuPosition' v-show='show' ref='menu'>
    <div class='item' v-show='isShowingCollection' @click='onRemove'>Remove From Collection</div>
    <div class='item' @click='onDelete'>Delete</div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: ['x', 'y', 'show', 'currentDisplay', 'selectedBooks'],
  computed: {
    menuPosition () {
      const menuHeight = (this.$refs.menu || {}).clientHeight || 0
      return {
        left: `${Math.min(window.innerWidth - 220, this.x)}px`,
        top: this.y + menuHeight > window.innerHeight ? `${this.y - menuHeight}px` : `${this.y}px`
      }
    },
    isShowingCollection () {
      return !['all', 'withoutCollection'].includes(this.currentDisplay)
    }
  },
  methods: {
    ...mapActions([
      'deleteBooks',
      'removeBooksFromCollection'
    ]),
    onDelete () {
      const confirmText = this.selectedBooks.length
        ? `Sure to delete Books ${this.selectedBooks.map(book => book.title).join(', ')} ?`
        : `Sure to delete Book ${this.selectedBooks[0].title} ?`
      if (this.selectedBooks && window.confirm(confirmText)) {
        this.deleteBooks({ books: this.selectedBooks })
      }
    },
    onRemove () {
      this.removeBooksFromCollection({ books: this.selectedBooks, collectionId: this.currentDisplay })
    }
  }
}
</script>

<style lang="scss" scoped>

.menu {
  position: fixed;
  width: 200px;
  background: #fff;
  border: 1px solid #fafafa;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.05);
  border-radius: 2px;
  background: #fff;
  .item {
    display: block;
    cursor: pointer;
    margin: 10px;
    &:hover {
      color: #d81717;
    }
  }
}
</style>
