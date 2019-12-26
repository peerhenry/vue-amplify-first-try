<template lang="pug">
.about
  h1 This page interacts with AWS AppSync through GraphQL
  .inputs
    label(for="name") name
    input(placeholder="name" v-model="name")
    label(for="description") description
    input(placeholder="description" v-model="description")
  button(@click="createNewTodo" :disabled="pendingTodo !== null") Add todo
  ul.todos
    li(v-for="todo in todos" :key="todo.id") {{ todo.name }} - {{ todo.description }}
    li.pending(v-if="pendingTodo !== null") {{ pendingTodo.name }} - {{ pendingTodo.description }}
</template>

<script>
import API, { graphqlOperation } from '@aws-amplify/api'
import { createTodo } from '@/graphql/mutations.js'
import { listTodos } from '@/graphql/queries.js'
import { onCreateTodo } from '@/graphql/subscriptions'

export default {
  name: 'About',
  data() {
    return {
      pendingTodo: null,
      todos: [],
      name: '',
      description: '',
    }
  },
  methods: {
    async execute(graphqlQuery, input) {
      return await API.graphql(graphqlOperation(graphqlQuery, input))
    },
    async createNewTodo() {
      if (this.pendingTodo !== null) return
      const todoInput = {
        name: this.name,
        description: this.description,
      }
      this.pendingTodo = todoInput
      await this.execute(createTodo, { input: todoInput })
    },
    async fetchTodos() {
      const todosData = await this.execute(listTodos)
      this.todos.push(...this.todos, ...todosData.data.listTodos.items)
    },
    subscribeToCreate() {
      API.graphql(graphqlOperation(onCreateTodo)).subscribe({
        next: eventData => {
          const todo = eventData.value.data.onCreateTodo
          this.todos.push(todo)
          this.pendingTodo = null
        },
      })
    },
  },
  created() {
    this.fetchTodos()
    this.subscribeToCreate()
  },
}
</script>

<style lang="stylus" scoped>
.pending
  opacity 0.5
  color green
  background #ddd

.todos
  list-style-type none
  padding-left 0

  li
    margin 10px 0

.inputs
  display grid
  grid-template-columns 1fr 5fr
  grid-gap 10px
  margin-bottom 10px
  width 500px
  margin-left auto
  margin-right auto

  label
    text-align right
    font-weight bold
</style>
