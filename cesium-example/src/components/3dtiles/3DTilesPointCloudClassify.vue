<!-- 点云分类 -->
<template>
  <div><div id="cesiumContainer"></div></div>
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
    this.add3dtiles();
    // 设置初始视角
    this.viewer.scene.camera.setView({
      destination: new Cesium.Cartesian3(
        4401744.644145314,
        225051.41078911052,
        4595420.374784433
      ),
      orientation: new Cesium.HeadingPitchRoll(
        5.646733805039757,
        -0.276607153839886,
        6.281110875400085
      )
    });
    // 初始化事件
    this.initEvent();
  },

  methods: {
    initEvent() {
      // 高亮变量
      const highlighted = {
        feature: undefined,
        originalColor: new Cesium.Color()
      };
      this.viewer.screenSpaceEventHandler.setInputAction(movement => {
        if (Cesium.defined(highlighted.feature)) {
          highlighted.feature.color = highlighted.originalColor;
          highlighted.feature = undefined;
        }
        // 选中一个feature元素
        const pickedFeature = this.viewer.scene.pick(movement.endPosition);
        if (!Cesium.defined(pickedFeature)) {
          return;
        }
        // 高亮当前选中的feature
        highlighted.feature = pickedFeature;
        Cesium.Color.clone(pickedFeature.color, highlighted.originalColor);
        pickedFeature.color = Cesium.Color.YELLOW.withAlpha(0.5);
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    add3dtiles() {
      this.tileset = new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(16421)
      });
      this.viewer.scene.primitives.add(this.tileset);
      // 添加分类单体
      const classificationTileset = new Cesium.Cesium3DTileset({
        url: "/data/3dtiles/PointCloud/tileset.json",
        classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
      });
      this.viewer.scene.primitives.add(classificationTileset);
      classificationTileset.style = new Cesium.Cesium3DTileStyle({
        color: {
          conditions: [
            ["${id} === 'roof1'", "color('#004FFF', 0.5)"],
            ["${id} === 'towerBottom1'", "color('#33BB66', 0.5)"],
            ["${id} === 'towerTop1'", "color('#0099AA', 0.5)"],
            ["${id} === 'roof2'", "color('#004FFF', 0.5)"],
            ["${id} === 'tower3'", "color('#FF8833', 0.5)"],
            ["${id} === 'tower4'", "color('#FFAA22', 0.5)"],
            ["true", "color('#FFFF00', 0.5)"]
          ]
        }
      });
    }
  }
};
</script>
<style lang="less" scoped></style>
