<!-- 加载一些glb跟gltf小模型 -->
<template>
  <div class="model-wrap">
    <div class="select-wrap">
      <a-select
        default-value="lucy"
        style="width: 120px"
        @change="handleChange"
      >
        <a-select-option value="jack">
          Jack
        </a-select-option>
        <a-select-option value="lucy">
          Lucy
        </a-select-option>
        <a-select-option value="disabled" disabled>
          Disabled
        </a-select-option>
        <a-select-option value="Yiminghe">
          yiminghe
        </a-select-option>
      </a-select>
      <a-select default-value="lucy" style="width: 120px" disabled>
        <a-select-option value="lucy">
          Lucy
        </a-select-option>
      </a-select>
      <a-select default-value="lucy" style="width: 120px" loading>
        <a-select-option value="lucy">
          Lucy
        </a-select-option>
      </a-select>
    </div>
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
/* global  Cesium*/

export default {
  components: {},

  data() {
    return {};
  },

  computed: {},

  mounted() {
    new Cesium.Viewer("cesiumContainer", {
      infoBox: false,
      selectionIndicator: false,
      shadows: true,
      shouldAnimate: true
    });
  },

  methods: {}
};
</script>
<style lang="less" scoped></style>
