<!-- 3dtiles 地形上分类 -->
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
      terrainProvider: Cesium.createWorldTerrain() // 创建全球地形
    });
    // 获取搜索类
    const geocoder = this.viewer.geocoder.viewModel;
    geocoder.searchText = "Vienna"; // 设置搜索文本
    geocoder.search(); // 执行搜索操作
    // 添加3dtiles
    this.tileset = new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(5737)
    });
    this.viewer.scene.primitives.add(this.tileset);
    // 设置3dtiles颜色
    this.tileset.style = new Cesium.Cesium3DTileStyle({
      color: "rgba(255, 255, 255, 0.5)"
    });
    // 注册鼠标事件
    this.initEvent();
  },

  methods: {
    initEvent() {
      // 定义高亮变量
      const highlighted = {
        feature: undefined,
        originalColor: new Cesium.Color()
      };
      // 鼠标移动事件
      this.viewer.screenSpaceEventHandler.setInputAction(movement => {
        if (Cesium.defined(highlighted.feature)) {
          highlighted.feature.color = highlighted.originalColor;
          highlighted.feature = undefined;
        }
        const pickedFeature = this.viewer.scene.pick(movement.endPosition);
        if (!Cesium.defined(pickedFeature)) {
          return;
        }
        // 高亮当前选中的feature
        highlighted.feature = pickedFeature;
        Cesium.Color.clone(pickedFeature.color, highlighted.originalColor);
        pickedFeature.color = Cesium.Color.YELLOW;
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
  }
};
</script>
<style lang="less" scoped></style>
