<template>
    <div class="card-container">
        <div class="card-details">{{ label }}</div>
    </div>
</template>

<script>
export default {
  name: 'CardComp',
  props: {
    label: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.card-container {
    width: 276px;
    min-height: 32px;
    position: relative;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 1px 0 rgba(9,30,66,.25);
    cursor: pointer;
    text-decoration: none;
    z-index: 0;
    padding: 6px 8px;
}
.card-details {
  word-wrap: break-word;
  overflow: hidden;
  position: relative;
  z-index: 10;
}
</style>
