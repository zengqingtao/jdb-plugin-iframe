<template>
  <div class="app-layout" id="app-layout" ref="app">
	  <router-view />
  </div>
</template>

<script>
export default {
  name: "layout",
};
</script>
<style lang="scss" scoped>
.app-layout {
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>