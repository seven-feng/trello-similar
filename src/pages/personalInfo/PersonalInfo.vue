<template>
    <div class="personalInfo-container">
        <div class="board-canvas">
          <div v-for="list in lists" :key="list.id" :id="list.id" class="list-wrapper">
              <div class="list-content">
                  <div class="list-header">{{ list.name }}</div>
                  <div class="list-cards">
                      <div v-for="card in listCards[list.id]" :key="card.id" class="list-card" :style="{ height: card.style.height }">
                          <div :id="card.id" :style="card.style" @mousedown="mouseDown" @click="handleDetail">
                              <div is="CardComp" :label="card.label"></div>
                          </div>
                      </div>
                      <div class="card-composer" :class="[openCardComposerId === list.id ? '': 'hide']">
                        <el-input type="textarea" :autosize="{ minRows: 3 }" resize="none" placeholder="为这个卡片输入标题..." v-model="cardTitle" />
                        <div class="card-composer-buttons">
                          <el-button type="success" size="small" @click="addCard(list.id)">添加卡片</el-button>
                          <div class="card-composer-buttons-delete" @click="closeCardComposer"><i class="el-icon-close" /></div>
                        </div>
                      </div>
                  </div>
                  <div class="list-footer" :class="[openCardComposerId === list.id  ? 'hide': '']">
                      <div class="card-composer-container" >
                          <div class="open-card-composer" @click="openCardComposer(list.id)">
                              <i class="el-icon-plus"/>
                              <span>添加另一个卡片</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div class="list-composer-container">
            <div class="open-list-composer" :class="[isListComposerOpen ? 'hide': '']" @click="openListComposer">
              <i class="el-icon-plus"/>
              <span>添加另一个列表</span>
            </div>
            <div class="list-composer" :class="[isListComposerOpen ? '': 'hide']">
              <el-input type="text" size="small" placeholder="输入列表标题..." v-model="listTitle" />
              <div class="list-composer-buttons">
                <el-button type="success" size="small" @click="addList">添加列表</el-button>
                <div class="list-composer-buttons-delete" @click="closeListComposer"><i class="el-icon-close" /></div>
              </div>
            </div>
          </div>
        </div>
        <el-dialog :visible.sync="dialogVisible" class="cardDialog" width="584px">
          <div class="cardDialog-block">
            <div class="cardDialog-block-title"><span>{{ selectedCard.label }}</span></div>
            <div class="carDialog-titile">在 {{ selectedList.name }} 中</div>
          </div>
          <div class="cardDialog-block">
            <div class="cardDialog-block-title"><img src="/static/images/description.png" alt=""><span>描述</span></div>
            <el-input type="textarea" readonly v-model="selectedCard.description"></el-input>
          </div>
          <div class="cardDialog-block">
            <div class="cardDialog-block-title"><img src="/static/images/message.png" alt=""><span>留言</span></div>
            <div class="cardDialog-message">
              <el-input size="small" v-model="leaveMessage"></el-input>
              <div class="cardDialog-message-button">发送</div>
            </div>
            <div class="cardDialog-comments">
              <div v-for="comment in selectedCardComments" :key="comment.id" class="cardDialog-comment">
                <div><span class="strong">{{ comment.name }}：</span>{{ comment.content }}</div>
                <div>{{ comment.time }}</div>
              </div>
            </div>

          </div>
        </el-dialog>
    </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import CardComp from './components/CardComp'
export default {
  components: {
    CardComp
  },
  data () {
    return {
      cardTitle: '',
      openCardComposerId: '',
      listTitle: '',
      isListComposerOpen: false,
      dialogVisible: false,
      selectedList: {
        id: null,
        name: ''
      },
      selectedCard: {
        projectName: '',
        description: ''
      },
      leaveMessage: '',
      selectedCardComments: []
    }
  },
  computed: {
    lists () {
      return this.$store.state.lists
    },
    listCards () {
      const lists = this.lists
      const cards = this.cards
      let listCards = {}
      for (let i = 0; i < lists.length; i++) {
        let listId = lists[i].id
        listCards[listId] = cards.filter(item => item.listId === listId)
      }
      return listCards
    },
    cards () {
      return this.$store.state.cards
    }
  },
  methods: {
    handleDetail (e) {
      this.dialogVisible = true
      let cardId = e.currentTarget.id
      this.selectedCard = this.$store.getters.getCard(cardId)
      this.selectedList = this.$store.getters.getList(this.selectedCard.listId)
      let res = this.$store.getters.getComments(cardId)
      this.selectedCardComments = res
    },
    mouseDown (e) {
      let cardId = e.currentTarget.id
      let x = e.currentTarget.offsetLeft
      let y = e.currentTarget.offsetTop
      // record placeholder coordinate
      this.$store.commit('recordPlaceholder', { cardId, x, y })
      // change card position
      let card = this.$store.getters.getCard(cardId)
      card.style.position = 'absolute'
      card.style.height = e.currentTarget.offsetHeight + 'px'
      this.$store.commit('putCard', card)

      document.onmousemove = e => {
        let card = this.$store.getters.getCard(cardId)
        card.x += e.movementX
        card.y += e.movementY
        card.style.left = card.x + 'px'
        card.style.top = card.y + 'px'
        this.$store.commit('putCard', card)
      }
      document.onmouseup = () => {
        let card = this.$store.getters.getCard(cardId)
        let list = this.$store.getters.getListFromIndex(Math.floor(Math.abs(card.x) / 300))
        if (!list) list = this.$store.getters.getLastList
        if (card.listId === list.id) {
          card.x = list.placeholder.x
          card.y = list.placeholder.y
          card.style.left = card.x + 'px'
          card.style.top = card.y + 'px'
          this.$store.commit('putCard', card)
        } else {
          this.$store.commit('removeCard', card.id)
          card.listId = list.id
          card.x = ''
          card.y = ''
          card.style.position = ''
          card.style.left = ''
          card.style.top = ''
          this.$store.commit('addCard', card)
        }
        document.onmousemove = null
        document.onmouseup = null
        e.stopPropagation()
      }
    },
    addCard (listId) {
      let uuid = uuidv4()
      let card = {
        id: uuid,
        label: this.cardTitle,
        listId: listId,
        style: {},
        x: 0,
        y: 0
      }
      this.$store.commit('addCard', card)
      this.closeCardComposer()
    },
    openCardComposer (listId) {
      this.openCardComposerId = listId
    },
    closeCardComposer () {
      this.cardTitle = ''
      this.openCardComposerId = ''
    },
    addList () {
      let uuid = uuidv4()
      let list = {
        id: uuid,
        name: this.listTitle,
        placeholder: {}
      }
      this.$store.commit('addList', list)
      this.closeListComposer()
    },
    openListComposer () {
      this.isListComposerOpen = true
    },
    closeListComposer () {
      this.listTitle = ''
      this.isListComposerOpen = false
    }
  }
}
</script>

<style lang="scss" scoped>
.personalInfo-container {
    height: 100%;
}
.board-canvas {
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select: none;
    user-select:none;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}
.list-wrapper {
    width: 292px;
    margin: 0 4px;
    height: 100%;
    display: inline-block;
    &:first-child {
      margin-left: 8px;
    }
}
.list-content {
    display: flex;
    flex-direction: column;
    max-height: 100%;
    background-color: #ebecf0;
    border-radius: 3px;
    white-space: normal;
    padding: 8px;
}
.list-header {
    font-size: 20px;
    font-weight: 600;
    padding: 2px 10px;
    word-wrap: break-word;
}
.list-cards {
    min-height: 0;
    flex: 1 1 auto;
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 1;
}
.list-card {
    width: 276px;
    min-height: 32px;
    margin-top: 8px;
    background-color: rgb(226, 228, 234);
}
.card-composer {
  margin-top: 8px;
  & /deep/.el-textarea__inner {
    outline: none;
    border: none;
    box-shadow: 0 1px 0 rgba(9, 30, 66, .25);
  }
  &-buttons {
    display: flex;
    align-items: center;
    margin-top: 8px;
    &-delete {
      font-size: 16px;
      cursor: pointer;
      margin-left: 6px;
    }
  }
}
.list-footer {
    margin-top: 6px;
}
.card-composer-container {
    height: 100%;
    display: flex;
    align-items: center;
}
.open-card-composer {
    border-radius: 3px;
    padding: 6px 10px;
    color: #5e6c84;
    flex: 1 0 auto;
    cursor: pointer;
    display: flex;
    align-items: center;
    &:hover {
        background-color: rgba(9, 30, 66, .08);
        color: #172b4d;
    }
}
.list-composer-container {
  display: inline-block;
  vertical-align: top;
}
.open-list-composer {
  width: 292px;
  color: #fff;
  cursor: pointer;
  border-radius: 3px;
  margin: 0 4px;
  padding: 8px 10px;
  background-color: hsla(0, 100%, 100%, .24);
  &:hover {
    background-color: hsla(0, 0%, 100%, .35);
  }
}
.list-composer {
    width: 292px;
    border-radius: 3px;
    padding: 4px;
    background-color: #ebecf0;
    transition: background 85ms ease-in,opacity 40ms ease-in,border-color 85ms ease-in;
  & /deep/.el-input__inner {
    outline: none;
    border: none;
  }
  &-buttons {
    display: flex;
    align-items: center;
    margin-top: 8px;
    &-delete {
      font-size: 16px;
      cursor: pointer;
      margin-left: 6px;
    }
  }
}
.hide {
  display: none;
}
/*定义滚动条整体部分*/
div::-webkit-scrollbar{
  width: 5px;
  height: 10px;
}
/*定义滚动条轨道 颜色+圆角*/
div::-webkit-scrollbar-track{
  background: rgb(255, 255, 255);
  border-radius: 10px;
}
/*定义滑块 颜色+圆角*/
div::-webkit-scrollbar-thumb{
  background-color: rgb(140,199,157);
  border-radius: 10px;
}
.cardDialog {
  & /deep/.el-dialog {
    background-color: #f4f5f7;
  }
  & /deep/.el-input__inner {
    outline: none;
    border: none;
  }
  & /deep/.el-textarea__inner {
    outline: none;
    border: none;
  }
  &-block {
    margin-bottom: 32px;
    &:last-child {
      margin-bottom: 0px;
    }
    &-title {
      display: flex;
      align-items: center;
      font-size: 16px;
      color: #000;
      margin: 10px 0px;
    }
  }
  &-title {
    font-size: 14px;
    color: #616C82;
  }
  &-message {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    &-button {
      font-size: 14px;
      color: rgb(103, 194, 58);
      line-height: 22px;
      width: 50px;
      margin: 0 10px;
      cursor: pointer;
    }
  }
  &-comments {
    max-height: 200px;
    overflow-y: auto;
  }
  &-comment {
    color: #616C82;
    margin-bottom: 16px;
    & .strong {
      font-weight: 600;
      color: #000;
    }
  }
  & /deep/.el-dialog__body {
    padding: 0px 48px 28px 48px;
  }
}
</style>
