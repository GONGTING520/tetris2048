<template>
    <div class="container">
        <img src="/static/images/introducebg.png" alt="" width="100%">
        <BackBtn></BackBtn>
    </div>
</template>

<script>
import BackBtn from '@/components/BackBtn'
export default {
  name: 'Index',
  components: {
    BackBtn
  }
};
</script>

<style scope>
.container{
    width: 100%;
    height: 100%;
}
</style>
