<template lang="pug" functional>
div
  #nav
    router-link(to="/") Home
    router-link(to="/todos") Todos
    router-link(to="/login") Login
  router-view
</template>

<style scoped lang="stylus">
a
  margin 0 10px
</style>
