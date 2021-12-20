<!-- 下面导航栏  -->
<template>
  <div class="nav-wrap">
    <div class="column-wrap" v-for="(item, index) in list" :key="index">
      <router-link to="">
        {{ item.text }}
        <img :src="item.img" alt="" />
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  components: {},

  data() {
    return {
      list: [
        {
          img: "/images/nav/3D Models.jpg",
          text: "gltf模型"
        }
      ]
    };
  },

  computed: {},

  mounted() {},

  methods: {}
};
</script>
<style lang="less" scoped>
.nav-wrap {
  .column-wrap {
    width: 170px;
    height: 130px;
    margin-top: 4px;
    margin-left: 10px;
    border: 1px solid #759dc0;
    padding: 2px 4px 4px 4px;
    background-color: #bcd8f4;
    background-image: linear-gradient(
      #ffffff 0px,
      rgba(255, 255, 255, 0) 3px,
      rgba(255, 255, 255, 0.75) 100%
    );
    box-sizing: content-box;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background-color: #86bdf2;
    }
    img {
      width: 150px;
      margin: 5px auto;
      height: 100px;
      display: block;
    }
  }
  /*包含以下四种的链接*/
  a {
    color: #000;
  }
  /*正常的未被访问过的链接*/
  a:link {
    text-decoration: none;
  }
  /*已经访问过的链接*/
  a:visited {
    text-decoration: none;
  }
  /*鼠标划过(停留)的链接*/
  a:hover {
    text-decoration: none;
  }
  /* 正在点击的链接*/
  a:active {
    text-decoration: none;
  }
}
</style>
