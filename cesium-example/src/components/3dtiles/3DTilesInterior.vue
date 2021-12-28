<!-- 3dtiles内部查看 -->
<template>
  <div class="model-wrap">
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
    this.viewer = new Cesium.Viewer("cesiumContainer");
    //去除版权信息
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    // 添加3dtiles
    this.add3dtiles();
  },

  methods: {
    add3dtiles() {
      const tileset = new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(125737)
      });
      this.viewer.scene.primitives.add(tileset);

      const initialPosition = new Cesium.Cartesian3(
        -1111583.3721328347,
        -5855888.151574568,
        2262561.444696748
      );
      const initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(
        100.0,
        -15.0,
        0.0
      );
      this.viewer.scene.camera.setView({
        destination: initialPosition,
        orientation: initialOrientation,
        endTransform: Cesium.Matrix4.IDENTITY
      });
    }
  }
};
</script>
<style lang="less" scoped></style>
