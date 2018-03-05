<template>
  <div class='draggingItems' :style='position'>
    <div v-for='item in items' class='item'>
      {{item.title}}
    </div>
  </div>
</template>

<script>
export default {
  props: ['items', 'x', 'y'],
  computed: {
    position () {
      return {
        left: `${this.x + 5}px`,
        top: `${this.y + 10}px`
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.draggingItems {
  position: absolute;
  z-index: 9999;
  width: 200px;
  padding: 15px;
  font-size: 12px;
  background: rgba(255,255,255,.9);
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.05);
  .item {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
  }
}
</style>
