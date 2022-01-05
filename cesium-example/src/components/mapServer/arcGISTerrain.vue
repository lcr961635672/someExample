<!-- arcgis 切片高程地形 -->
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
    new Cesium.Viewer("cesiumContainer", {
      // 加载地形   发布在ArcGIS Server上的瓦片地形服务
      terrainProvider: new Cesium.ArcGISTiledElevationTerrainProvider({
        url:
          "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
      })
    });
  },

  methods: {}
};
</script>
<style lang="less" scoped></style>
