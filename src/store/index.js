import Vue from 'vue'
import Vuex from 'vuex'
import API, { graphqlOperation } from '@aws-amplify/api'
import { createTodo } from '@/graphql/mutations.js'
import { listTodos } from '@/graphql/queries.js'
import { onCreateTodo } from '@/graphql/subscriptions'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    wasFetched: false,
    todos: [],
    pendingTodo: null,
  },
  getters: {
    isPending: state => state.pendingTodo !== null,
  },
  mutations: {
    WAS_FETCHED: state => (state.wasFetched = true),
    SET_TODOS: (state, payload) => (state.todos = payload),
    ADD_TODO: (state, payload) => state.todos.push(payload),
    SET_PENDING_TODO: (state, payload) => (state.pendingTodo = payload),
    RESET_PENDING_TODO: state => (state.pendingTodo = null),
  },
  actions: {
    createNewTodo: async (context, payload) => {
      if (context.getters.isPending) return
      store.commit('SET_PENDING_TODO', payload)
      try {
        await API.graphql(graphqlOperation(createTodo, { input: payload }))
      } catch (gqlErr) {
        for (const err of gqlErr.errors) console.error(err.message)
      }
    },
    fetchTodos: async context => {
      if (context.state.wasFetched) {
        return
      }
      const query = listTodos
      const response = await API.graphql(graphqlOperation(query))
      context.commit('SET_TODOS', response.data.listTodos.items)
      context.commit('WAS_FETCHED')
    },
    subscribe() {
      API.graphql(graphqlOperation(onCreateTodo)).subscribe({
        next: eventData => {
          const todo = eventData.value.data.onCreateTodo
          store.commit('ADD_TODO', todo)
          store.commit('RESET_PENDING_TODO')
        },
      })
    },
  },
  modules: {},
})

export default store
