<template>
    <div class="list-card">
        <div class="list-card-details">{{ label }}</div>
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
.list-card {
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 1px 0 rgba(9,30,66,.25);
    cursor: pointer;
    display: block;
    margin-bottom: 8px;
    max-width: 300px;
    min-height: 20px;
    position: relative;
    text-decoration: none;
    z-index: 0;
    width: 256px;
    height: 26px;
    &-details {
        overflow: hidden;
        padding: 6px 8px 2px;
        position: relative;
        z-index: 10;
    }
    &-placeholder {
        display: none;
        width: 256px;
        height: 32px;
        background-color: grey;
    }
}
</style>