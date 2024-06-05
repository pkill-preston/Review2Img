<template>
  <div v-if="this.getWindowHeight() > 768" class="footer">
    <h1 class="footerItem"><a href="https://github.com/pkill-preston/letterboxd-review-to-img">Github</a></h1>
    <h1 class="footerItem">© {{ new Date().getFullYear() }} Heron Lorena. All rights reserved.</h1>
    <h1 class="footerItem"><a href="https://www.linkedin.com/in/heron-lorena/">Heron Lorena</a></h1>
  </div>
</template>

<script>
export default {
  setup() {
    return {
    }
  },
  methods: {
    getWindowHeight(){
      return window.innerHeight
    }
  }
}
</script>

<style lang="css" scoped>
.footer {
  color: white;
  display: flex;
  height: 80px;
  width: 100%;
  align-items: flex-end;
  align-items: center;
  justify-content: space-around;
}

.footerItem {
  font-weight: 200;
  text-decoration: none;
  cursor: pointer;
}

.footerItem > a {
  text-decoration: none;
  color: white;
}
</style>