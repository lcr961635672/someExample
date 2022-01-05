<!-- 蓝色大理石 图层  2004年7月来自美国宇航局的图像 -->
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
    new Cesium.Viewer("cesiumContainer", {
      imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 })
    });
  },

  methods: {}
};
</script>
<style lang="less" scoped></style>
