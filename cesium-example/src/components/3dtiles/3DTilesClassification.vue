<!-- 3dtiles模型分类 -->
<template>
  <div class="model-wrap">
    <div class="panel-wrap">
      <div class="box">
        <a-checkbox v-dark v-model="showClassify" @change="onChange">
          开启分类
        </a-checkbox>
      </div>
    </div>
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
/* global Cesium */
export default {
  components: {},

  data() {
    return {
      showClassify: true
    };
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
    // 添加分类模型
    this.classificationTileset = new Cesium.Cesium3DTileset({
      url: "/data/3dtiles/Photogrammetry/tileset.json",
      classificationType: Cesium.ClassificationType.CESIUM_3D_TILE // 仅仅模型被分类即 此分类模型会附着在模型上
    });
    this.classificationTileset.style = new Cesium.Cesium3DTileStyle({
      color: "rgba(255, 0, 0, 0.5)"
    });
    this.viewer.scene.primitives.add(this.classificationTileset);
    // 添加模型 不分类
    this.nonClassificationTileset = new Cesium.Cesium3DTileset({
      url: "/data/3dtiles/Photogrammetry/tileset.json",
      show: false
    });
    this.viewer.scene.primitives.add(this.nonClassificationTileset);
  },

  methods: {
    onChange() {
      this.classificationTileset.show = this.showClassify;
      this.nonClassificationTileset.style = new Cesium.Cesium3DTileStyle({
        color: "rgba(255, 0, 0, 0.5)"
      });
      this.nonClassificationTileset.show = !this.showClassify;
    }
  }
};
</script>
<style lang="less" scoped>
.panel-wrap {
  z-index: 1;
  position: fixed;
  top: 20px;
  left: 20px;
  .box {
    display: inline-block;
    border-radius: 4px;
    background: rgba(42, 42, 42, 0.8);
    padding: 5px;
    margin-right: 10px;
  }
}
</style>
