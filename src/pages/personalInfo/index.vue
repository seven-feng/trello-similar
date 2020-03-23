<template>
    <div class="page-container">
        <div class="board-header">
           <div class="board-name">{{ username }}</div>
        </div>
        <div class="board-content">
            <personal-info />
        </div>
    </div>
</template>

<script>
import PersonalInfo from './PersonalInfo'
export default {
  components: {
    PersonalInfo
  },
  props: {
    userid: [Number, String]
  },
  data () {
    return {
      username: '姓名'
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: rgb(75,191,107);
    color: #172b4d;
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif;
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
}
.page-header {
    height: 40px;
    background-color: rgba(0,0,0,.15);
}
.board-header {
    position: relative;
    padding: 8px 4px 4px 8px;
    color: #fff;
}
.board-name {
    font-size: 18px;
    font-weight: 700;
    line-height: 32px;
    padding: 0px 8px;
}
.board-content {
    position: relative;
    flex-grow: 1;
    padding: 0 8px;
}
</style>
