<template>
  <div class="home">
      plugin_home
  </div>
</template>
<script>
import {addCookie} from "../../utils/cookie"
export default {
  name: "home",
  mounted(){
    addCookie('dzgj_token','111111',99999)
  }
};
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
  .content {
    display: flex;
    justify-content: space-between;
  }
}
</style>