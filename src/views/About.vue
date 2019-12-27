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
    li(v-for="todo in todos" :key="todo.id") {{ todo.name }} - {{ todo.description }}
    li.pending(v-if="isPending") {{ pendingTodo.name }} - {{ pendingTodo.description }}
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'About',
  data() {
    return {
      name: '',
      description: '',
    }
  },
  computed: {
    ...mapState(['pendingTodo', 'todos']),
    ...mapGetters(['isPending']),
  },
  methods: { ...mapActions(['createNewTodo', 'fetchTodos', 'subscribe']) },
  created() {
    this.fetchTodos()
    this.subscribe() // does not work outside the store in main.js or with a timeout
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
