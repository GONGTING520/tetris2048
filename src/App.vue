<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted(){
  }
};
</script>

<style>
html {
  height: 100%;
}

body {
  margin: 0;
  height: 100%;
  font-size: 16px;
}

#app {
  position: relative;
  margin: 0 auto;
  width: 7.5rem;
  height: 100%;
  /* background: #eee; */
}
</style>
