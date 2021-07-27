<template>
  <div class="test-component">{{ msg }}</div>
</template>

<script lang="ts">
import Vue from 'vue';

const testTs: string = 'testts';

export default Vue.extend({
  name: 'test-component',
  props: {
    msg: String,
  },
  mounted() {
    console.log(testTs);
  }
});
</script>

<style lang="less" scoped>
.test-component {
  background-color: green;
}
</style>
