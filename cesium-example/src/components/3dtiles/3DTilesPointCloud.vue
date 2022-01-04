<!-- 加载点云 -->
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
    // 添加3dtiles
    const tileset = new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(16421)
    });
    this.viewer.scene.primitives.add(tileset);
    // 定位到初视角
    this.viewer.scene.camera.setView({
      // 位置
      destination: new Cesium.Cartesian3(
        4401744.644145314,
        225051.41078911052,
        4595420.374784433
      ),
      // 方向
      orientation: new Cesium.HeadingPitchRoll(
        5.646733805039757,
        -0.276607153839886,
        6.281110875400085
      )
    });
  },

  methods: {}
};
</script>
<style lang="less" scoped></style>
