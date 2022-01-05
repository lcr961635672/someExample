<!-- 添加盒子实体 -->
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
    this.viewer = new Cesium.Viewer("cesiumContainer");
    //去除版权信息
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    // 添加盒子实体
    // 添加一个蓝色盒子
    this.viewer.entities.add({
      name: "Blue box",
      position: Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 300000.0),
      box: {
        dimensions: new Cesium.Cartesian3(400000, 300000, 500000), // 尺寸 该属性指定长方体的长度、宽度和高度
        material: Cesium.Color.BLUE // 设置颜色
      }
    });
    // 添加有黑色边框的红色盒子
    this.viewer.entities.add({
      name: "Red box with black outline",
      position: Cesium.Cartesian3.fromDegrees(-107.0, 40.0, 300000.0),
      box: {
        dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0), // 尺寸 该属性指定长方体的长度、宽度和高度
        material: Cesium.Color.RED.withAlpha(0.5), // 盒子填充色
        outline: true, // 开启边框
        outlineColor: Cesium.Color.BLACK // 边框色
      }
    });
    // 添加只有黄色边框的盒子
    this.viewer.entities.add({
      name: "Yellow box outline",
      position: Cesium.Cartesian3.fromDegrees(-100.0, 40.0, 300000.0),
      box: {
        dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0), // 尺寸 该属性指定长方体的长度、宽度和高度
        fill: false, // 不设置填充
        outline: true, // 开启边框
        outlineColor: Cesium.Color.YELLOW // 边框色
      }
    });
    this.viewer.zoomTo(this.viewer.entities);
  },

  methods: {}
};
</script>
<style lang="less" scoped></style>
