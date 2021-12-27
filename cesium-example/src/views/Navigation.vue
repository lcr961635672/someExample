<!-- 下面导航栏  -->
<template>
  <div class="nav-wrap">
    <div class="column-wrap" v-for="(item, index) in list" :key="index">
      <router-link :to="item.path">
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
          text: "gltf模型",
          path: "/"
        },
        {
          img: "/images/nav/3D Models Coloring.jpg",
          text: "gltf模型颜色",
          path: "/modelColor"
        },
        {
          img: "/images/nav/3D Tiles BIM.jpg",
          text: "BIM模型",
          path: "/tilesBIM"
        },
        {
          img: "/images/nav/3D Tiles Adjust Height.jpg",
          text: "3dtiles高度调整",
          path: "/tilesHeight"
        },
        {
          img: "/images/nav/3D Tiles Batch Table Hierarchy.jpg",
          text: "3dtiles颜色批处理",
          path: "/tilesBatch"
        },
        {
          img: "/images/nav/3D Tiles Clipping Planes.jpg",
          text: "3dtiles平面裁剪",
          path: "/tilesClip"
        },
        {
          img: "/images/nav/3D Tiles Feature Picking.jpg",
          text: "3dtiles选中描边",
          path: "/tilesPick"
        },
        {
          img: "/images/nav/3D Tiles Feature Styling.jpg",
          text: "3dtiles样式修改",
          path: "/tilesStyle"
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
  text-align: left;
  .column-wrap {
    font-size: 16px;
    display: inline-block;
    text-align: center;
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
