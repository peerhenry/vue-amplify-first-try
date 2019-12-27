import Vue from 'vue'
import Vuex from 'vuex'
import API, { graphqlOperation } from '@aws-amplify/api'
import { createTodo, deleteTodo } from '@/graphql/mutations.js'
import { listTodos } from '@/graphql/queries.js'
import { onCreateTodo, onDeleteTodo } from '@/graphql/subscriptions'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    wasFetched: false,
    todos: [],
    pendingTodo: null,
    deletePending: false,
  },
  getters: {
    isPending: state => state.pendingTodo !== null || state.deletePending,
  },
  mutations: {
    WAS_FETCHED: state => (state.wasFetched = true),
    SET_TODOS: (state, payload) => (state.todos = payload),
    ADD_TODO: (state, payload) => state.todos.push(payload),
    SET_PENDING_TODO: (state, payload) => (state.pendingTodo = payload),
    RESET_PENDING_TODO: state => (state.pendingTodo = null),
    SET_DELETE_PENDING: state => (state.deletePending = true),
    RESET_DELETE_PENDING: state => (state.deletePending = false),
    REMOVE_TODO: (state, id) =>
      (state.todos = state.todos.filter(t => t.id !== id)),
  },
  actions: {
    fetchTodos: async context => {
      if (context.state.wasFetched) {
        return
      }
      const query = listTodos
      const response = await API.graphql(graphqlOperation(query))
      context.commit('SET_TODOS', response.data.listTodos.items)
      context.commit('WAS_FETCHED')
    },

    createNewTodo: async (context, payload) => {
      if (context.getters.isPending) return
      store.commit('SET_PENDING_TODO', payload)
      try {
        await API.graphql(graphqlOperation(createTodo, { input: payload }))
      } catch (gqlErr) {
        // eslint-disable-next-line no-console
        for (const err of gqlErr.errors) console.error(err.message)
      }
    },

    deleteTodo: async (context, todo) => {
      context.commit('SET_DELETE_PENDING')
      const deleteInput = { id: todo.id }
      try {
        await API.graphql(graphqlOperation(deleteTodo, { input: deleteInput }))
      } catch (gqlErr) {
        // eslint-disable-next-line no-console
        for (const err of gqlErr.errors) console.error(err.message)
      }
    },

    subscribe() {
      API.graphql(graphqlOperation(onCreateTodo)).subscribe({
        next: eventData => {
          const todo = eventData.value.data.onCreateTodo
          store.commit('ADD_TODO', todo)
          store.commit('RESET_PENDING_TODO')
        },
      })
      API.graphql(graphqlOperation(onDeleteTodo)).subscribe({
        next: eventData => {
          const todo = eventData.value.data.onDeleteTodo
          store.commit('REMOVE_TODO', todo.id)
          store.commit('RESET_DELETE_PENDING')
        },
      })
    },
  },
  modules: {},
})

export default store
