import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // [{
    //   id: ''
    //   name: 'a',
    //   placeholder: {
    //     x:
    //     y:
    //   }
    // }]
    lists: [
      {
        id: '111',
        name: 'undo',
        placeholder: {}
      },
      {
        id: '222',
        name: 'doing',
        placeholder: {}
      },
      {
        id: '333',
        name: 'done',
        placeholder: {}
      }
    ],
    // [{
    //   id: '',
    //   label: 'a1',
    //   listId: '',
    //   x: ,
    //   y:
    // }]
    cards: [
      {
        id: '123',
        label: 'a1',
        listId: '111',
        projectName: '',
        style: {},
        x: 0,
        y: 0
      },
      {
        id: '1233',
        label: 'a2',
        listId: '111',
        projectName: '',
        style: {},
        x: 0,
        y: 0
      },
      {
        id: '456',
        label: 'b1',
        listId: '222',
        projectName: '',
        style: {},
        x: 123,
        y: 123
      }
    ],
    comments: [
      {
        id: '123',
        carId: '123',
        name: 'abc',
        content: 'aaaaaaaaaaaaaaaa',
        time: '2020年3月23日 14:00:00'
      },
      {
        id: '234',
        carId: '123',
        name: 'abc',
        content: 'bbbbbbbbbbbbbb',
        time: '2020年3月23日 14:01:00'
      },
      {
        id: '165',
        carId: '123',
        name: 'abc',
        content: 'ccccccccccccccc',
        time: '2020年3月23日 14:02:00'
      }
    ]
  },
  getters: {
    getList: state => id => state.lists.find(item => item.id === id),
    getListFromIndex: state => index => state.lists[index],
    getLastList: state => state.lists[state.lists.length - 1],
    getCard: state => id => state.cards.find(item => item.id === id),
    getComments: state => id => state.comments.filter(item => item.cardId === id)
  },
  mutations: {
    addCard (state, card) {
      state.cards.push(card)
    },
    putCard (state, card) {
      for (let i = 0; i < state.cards.length; i++) {
        let tmpCard = state.cards[i]
        if (tmpCard.id === card.id) {
          state.cards.splice(i, 1, card)
          return
        }
      }
    },
    removeCard (state, cardId) {
      for (let i = 0; i < state.cards.length; i++) {
        let tmpCard = state.cards[i]
        if (tmpCard.id === cardId) {
          state.cards.splice(i, 1)
          break
        }
      }
    },
    clearCards (state) {
      state.cards = []
    },
    addList (state, list) {
      state.lists.push(list)
    },
    clearLists (state) {
      state.lists = []
    },
    recordPlaceholder (state, { cardId, x, y }) {
      let tmpCard
      // get card
      for (let i = 0; i < state.cards.length; i++) {
        tmpCard = state.cards[i]
        if (tmpCard.id.toString() === cardId) {
          state.cards[i].x = x
          state.cards[i].y = y
          state.cards[i].style.left = x + 'px'
          state.cards[i].style.top = y + 'px'
          break
        }
      }
      // record coordinate
      for (let i = 0; i < state.lists.length; i++) {
        let tmpList = state.lists[i]
        if (tmpList.id === tmpCard.listId) {
          state.lists[i].placeholder.x = x
          state.lists[i].placeholder.y = y
          break
        }
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
