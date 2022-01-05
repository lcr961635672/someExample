<!-- 北极DEM -->
<template>
  <div class="model-wrap">
    <div class="select-wrap">
      <a-select
        v-dark
        default-value="Denali"
        style="width: 150px"
        @change="handleChange"
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
          name: "Denali"
        },
        {
          name: "Anchorage Area"
        },
        {
          name: "Peaks"
        },
        {
          name: "Riverbed"
        }
      ]
    };
  },

  computed: {},

  mounted() {
    // 创建球
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      terrainProvider: new Cesium.CesiumTerrainProvider({
        url: Cesium.IonResource.fromAssetId(3956)
      })
    });
    // 视角定位
    this.handleChange("Denali");
  },

  methods: {
    // 视角定位
    handleChange(value) {
      switch (value) {
        case "Denali": // 德纳里峰
          this.viewer.scene.camera.flyTo({
            destination: Cesium.Cartesian3.fromRadians(
              -2.6399828792482234,
              1.0993550795541742,
              5795
            ),
            orientation: {
              heading: 3.8455,
              pitch: -0.4535,
              roll: 0.0
            }
          });
          break;
        case "Anchorage Area": // 安克雷奇市
          this.viewer.scene.camera.flyTo({
            destination: Cesium.Cartesian3.fromRadians(
              -2.610708034601548,
              1.0671172431736584,
              1900
            ),
            orientation: {
              heading: 4.6,
              pitch: -0.341,
              roll: 0.0
            }
          });
          break;
        case "Peaks": // 山顶
          this.viewer.scene.camera.flyTo({
            destination: Cesium.Cartesian3.fromRadians(
              -2.6928866820212813,
              1.072394255273859,
              3700
            ),
            orientation: {
              heading: 1.6308222948889464,
              pitch: -0.6473480165020193,
              roll: 0.0
            }
          });
          break;
        case "Riverbed": // 河床
          this.viewer.scene.camera.flyTo({
            destination: Cesium.Cartesian3.fromRadians(
              -2.6395623497608596,
              1.0976443174490356,
              2070
            ),
            orientation: {
              heading: 6.068794108659519,
              pitch: -0.08514161789475816,
              roll: 0.0
            }
          });
          break;
        default:
          break;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.select-wrap {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1;
}
</style>
