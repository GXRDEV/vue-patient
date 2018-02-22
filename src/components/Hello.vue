<template>
  <div class="hello">
    <h1>{{ title }}</h1>
    <h3>{{ subtitle }}</h3>
  </div>
</template>

<script>
export default {
  name: 'hello',
  props: ['title', 'subtitle']
}
</script>

<style scoped>
.hello{
  padding: 2em 0 0;
}
h1, h3 {
  font-weight: normal;
  line-height: 1.5em;
  padding: 0.5em 1em;
}
h3{
  color: #666;
}
ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
