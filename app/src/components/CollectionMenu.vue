<template>
  <div class='menu' :style='menuPosition' v-show='show'>
    <a @click='onRename'>Rename</a>
    <a @click='onDelete'>Delete</a>
  </div>
</template>

<script>
export default {
  props: ['x', 'y', 'show', 'onDelete', 'onRename'],
  computed: {
    menuPosition () {
      return {
        left: `${this.x}px`,
        top: `${this.y}px`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.menu {
  position: fixed;
  width: 100px;
  background: #fff;
  border: 2px solid;
  background: #fff;
}
</style>
