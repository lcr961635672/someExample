<!-- 3dtiles样式修改
示例说明：如何使用3dtiles样式语言来设置各个要素（如建筑物）的 样式
 -->
<template>
  <div class="model-wrap">
    <div class="panel-wrap">
      <div class="select-wrap">
        <a-select
          v-dark
          default-value="Color By Building Material"
          style="width: 250px; margin-right: 10px"
          size="small"
        >
          <a-select-option
            v-for="(item, index) in selectData"
            :value="item.name"
            :key="index"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
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
      selectData: [
        {
          name: "Color By Building Material"
        },
        {
          name: "Color By Distance To Selected Location"
        },
        {
          name: "Highlight Residential Buildings"
        },
        {
          name: "Show Office Buildings Only"
        },
        {
          name: "Show Apartment Buildings Only"
        }
      ]
    };
  },

  computed: {},

  mounted() {
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      terrainProvider: Cesium.createWorldTerrain() // 开启全球地形
    });
    //去除版权信息
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    // 注册事件处理器
    // const handler = new Cesium.ScreenSpaceEventHandler(
    //   this.viewer.scene.canvas
    // );
    // 添加3dtiles
    this.add3dtiles();
    // 设置初始化视角
    this.viewer.scene.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(-122.3472, 47.598, 370),
      orientation: {
        heading: Cesium.Math.toRadians(10),
        pitch: Cesium.Math.toRadians(-10)
      }
    });
  },

  methods: {
    // 添加3dtiles
    add3dtiles() {
      // 添加osm build
      this.osmBuildingsTileset = Cesium.createOsmBuildings();
      this.viewer.scene.primitives.add(this.osmBuildingsTileset);
    },
    changeStyle() {},
    getStyleByType(type) {
      let style = "";
      switch (type) {
        case "Color By Building Material":
          style = {
            defines: {
              material: "${feature['building: material']}"
            },
            color: {
              conditions: [
                ["${material} === null", "color('white')"],
                ["${material} === 'glass'", "color('skyblue', 0.5)"],
                ["${material} === 'concrete'", "color('grey')"],
                ["${material} === 'brick'", "color('indianred')"],
                ["${material} === 'stone'", "color('lightslategrey')"],
                ["${material} === 'metal'", "color('lightgrey')"],
                ["${material} === 'steel'", "color('lightsteelblue')"],
                ["true", "color('white')"] // 上述条件都不符合时，走这里
              ]
            }
          };
          break;
        case "Color By Distance To Selected Location":
          break;
        default:
          break;
      }
      return style;
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
}
</style>
