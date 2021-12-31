<!-- 一个模型 -->
<template>
  <div>
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
/* global Cesium */
export default {
  components: {},

  data() {
    return {};
  },

  computed: {},

  mounted() {
    // 创建球
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      terrainProvider: Cesium.createWorldTerrain() // 加载全球地形
    });
    //去除版权信息
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    // 添加3dtiles模型
    const tileset = new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(40866)
    });
    this.viewer.scene.primitives.add(tileset);
    this.viewer.zoomTo(tileset); // 定位至模型
  },

  methods: {}
};
</script>
<style lang="less" scoped></style>
