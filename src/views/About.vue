<template lang="pug">
.about
  h1(style="color: red;") This page interacts with AWS AppSync through GraphQL
  .inputs
    label(for="name") name
    input(placeholder="name" v-model="name" :disabled="isPending")
    label(for="description") description
    input(placeholder="description" v-model="description" :disabled="isPending")
  button(@click="createNewTodo({ name, description })" :disabled="isPending") Add todo
  ul.todos
    li.todo(v-for="todo in todos" :class="{ pending: pendingDeleteId === todo.id }" :key="todo.id")
      span {{ todo.name }} - {{ todo.description }}
      span.delete-todo(@click="maybeDeleteTodo(todo)") ✖
    li.todo.pending(v-if="pendingTodo")
      span {{ pendingTodo.name }} - {{ pendingTodo.description }}
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'About',
  data() {
    return {
      name: '',
      description: '',
      pendingDeleteId: null,
    }
  },
  computed: {
    ...mapState(['pendingTodo', 'todos']),
    ...mapGetters(['isPending']),
  },
  methods: {
    ...mapActions(['createNewTodo', 'fetchTodos', 'subscribe', 'deleteTodo']),
    async maybeDeleteTodo(todo) {
      this.pendingDeleteId = todo.id
      await this.deleteTodo(todo)
    },
  },
  created() {
    this.fetchTodos()
    this.subscribe() // does not work outside the store in main.js or with a timeout
  },
}
</script>

<style lang="stylus" scoped>
.pending
  opacity 0.5
  color grey
  background #ddd

.todos
  list-style-type none
  padding-left 0
  display table
  margin auto

  li
    display flex
    justify-content space-between
    margin 10px 0

    span:first-child
      margin-right 16px

.delete-todo
  border 1px solid grey
  border-radius 4px
  cursor pointer
  padding 5px

  &:hover
    background #ccc

.todo
  display block

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
