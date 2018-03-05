<template>
  <div class='menu' :style='menuPosition' v-show='show'>
    <a @click='onRename'>Rename</a>
    <a @click='onDelete'>Delete</a>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: ['x', 'y', 'show', 'selectedCollection', 'currentDisplay', 'switchDisplay'],
  computed: {
    menuPosition () {
      return {
        left: `${this.x}px`,
        top: `${this.y}px`
      }
    }
  },
  methods: {
    ...mapActions([
      'deleteCollection',
      'renameCollection'
    ]),
    onDelete () {
      if (this.selectedCollection && window.confirm(`Sure to delete Collection ${this.selectedCollection.name} ?`)) {
        const { collectionId } = this.selectedCollection
        this.deleteCollection(collectionId)
          .then(() => {
            if (this.currentDisplay === collectionId) {
              this.switchDisplay('withoutCollection')
            }
          })
      }
    },
    onRename () {
      if (this.selectedCollection) {
        const name = window.prompt('Change Collection name', this.selectedCollection.name).trim()
        // TODO can't be repeated
        if (name && name !== this.selectedCollection.name) {
          this.renameCollection({ collectionId: this.selectedCollection.collectionId, name })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.menu {
  position: fixed;
  width: 100px;
  background: #fff;
  border: 1px solid #fafafa;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.05);
  border-radius: 2px;
  background: #fff;
  a {
    display: block;
    cursor: pointer;
    margin: 10px;
    &:hover {
      color: #d81717;
    }
  }
}
</style>
