<!-- 添加arcgis发布的地图服务 -->
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
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url:
          "https://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/"
      })
    });
  },

  methods: {}
};
</script>
<style lang="less" scoped></style>
