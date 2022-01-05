<!-- 环境光遮蔽
Ambient Occlusion简称AO，中文没有太确定的叫法，一般译作环境光遮蔽。
百度百科上对AO的解释是这样的：AO是来描绘物体和物体相交或靠近的时候遮挡周围漫反射光线的效果，
可以解决或改善漏光、飘和阴影不实等问题，解决或改善场景中缝隙、褶皱与墙角、
角线以及细小物体等的表现不清晰问题，综合改善细节尤其是暗部阴影，增强空间的层次感、真实感，
同时加强和改善画面明暗对比，增强画面的艺术性。AO简单来说就是根据周围物体对光线的遮挡程度，
改变明暗效果-->
<template>
  <div class="model-wrap">
    <div class="panel-wrap">
      <a-checkbox
        v-dark
        size="small"
        v-model="viewModel.show"
        @change="updatePostProcess"
      >
        Ambient Occlusion
      </a-checkbox>
      <a-checkbox
        v-dark
        size="small"
        v-model="viewModel.ambientOcclusionOnly"
        @change="updatePostProcess"
      >
        Ambient Occlusion Only
      </a-checkbox>
      <div class="row">
        <div class="name">Intensity：</div>
        <div class="value">
          <a-slider
            size="small"
            style="width: 120px;vertical-align: middle;"
            :min="0"
            :max="10"
            :step="1"
            v-model="viewModel.intensity"
            @change="updatePostProcess"
          />
          <a-input
            size="small"
            v-model="viewModel.intensity"
            style="width: 40px"
          />
        </div>
      </div>
      <div class="row">
        <div class="name">Length Cap：</div>
        <div class="value">
          <a-slider
            size="small"
            style="width: 120px;vertical-align: middle;"
            :min="0"
            :max="1"
            :step="0.01"
            v-model="viewModel.lengthCap"
            @change="updatePostProcess"
          />
          <a-input
            size="small"
            v-model="viewModel.lengthCap"
            style="width: 40px"
          />
        </div>
      </div>
      <div class="row">
        <div class="name">Step Size：</div>
        <div class="value">
          <a-slider
            size="small"
            style="width: 120px;vertical-align: middle;"
            :min="0"
            :max="10"
            :step="0.01"
            v-model="viewModel.stepSize"
            @change="updatePostProcess"
          />
          <a-input
            size="small"
            v-model="viewModel.stepSize"
            style="width: 40px"
          />
        </div>
      </div>
      <div class="row">
        <div class="name">Bias：</div>
        <div class="value">
          <a-slider
            size="small"
            style="width: 120px;vertical-align: middle;"
            :min="0"
            :max="1"
            :step="0.01"
            v-model="viewModel.bias"
            @change="updatePostProcess"
          />
          <a-input size="small" v-model="viewModel.bias" style="width: 40px" />
        </div>
      </div>
      <div class="row">
        <div class="name">Blur Step Size：</div>
        <div class="value">
          <a-slider
            size="small"
            style="width: 120px;vertical-align: middle;"
            :min="0"
            :max="4"
            :step="0.01"
            v-model="viewModel.blurStepSize"
            @change="updatePostProcess"
          />
          <a-input
            size="small"
            v-model="viewModel.blurStepSize"
            style="width: 40px"
          />
        </div>
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
      viewModel: {
        show: true,
        ambientOcclusionOnly: false,
        intensity: 3.0,
        bias: 0.1,
        lengthCap: 0.03,
        stepSize: 1.0,
        blurStepSize: 0.86
      }
    };
  },

  computed: {},

  mounted() {
    // 创建球
    this.viewer = new Cesium.Viewer("cesiumContainer");
    //去除版权信息
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    // 判断浏览器是否支持环境光遮蔽
    if (
      !Cesium.PostProcessStageLibrary.isAmbientOcclusionSupported(
        this.viewer.scene
      )
    ) {
      window.alert("当前浏览器不支持环境光遮挡后期处理");
    }
    // 添加3dtiles
    this.add3dtiles();
    // 初始化视角定位
    const camera = this.viewer.scene.camera;
    camera.position = new Cesium.Cartesian3(
      1234127.2294710164,
      -5086011.666443127,
      3633337.0413351045
    );
    camera.direction = new Cesium.Cartesian3(
      -0.5310064396211631,
      -0.30299013818088416,
      -0.7913464078682514
    );
    camera.right = new Cesium.Cartesian3(
      -0.8468592075426076,
      0.1574051185945647,
      0.507989282604011
    );
    camera.up = Cesium.Cartesian3.cross(
      camera.right,
      camera.direction,
      new Cesium.Cartesian3()
    );
    // 更新环境光遮蔽参数
    this.updatePostProcess();
  },

  methods: {
    // 添加3dtiles模型
    add3dtiles() {
      this.tileset = new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(8564)
      });
      this.tileset.readyPromise
        .then(tileset => {
          this.viewer.scene.primitives.add(tileset);
        })
        .otherwise(err => {
          console.log(err);
        });
    },
    updatePostProcess() {
      const ambientOcclusion = this.viewer.scene.postProcessStages
        .ambientOcclusion;
      ambientOcclusion.enabled =
        Boolean(this.viewModel.show) ||
        Boolean(this.viewModel.ambientOcclusionOnly);
      ambientOcclusion.uniforms.ambientOcclusionOnly = Boolean(
        this.viewModel.ambientOcclusionOnly
      );
      ambientOcclusion.uniforms.intensity = Number(this.viewModel.intensity);
      ambientOcclusion.uniforms.bias = Number(this.viewModel.bias);
      ambientOcclusion.uniforms.lengthCap = Number(this.viewModel.lengthCap);
      ambientOcclusion.uniforms.stepSize = Number(this.viewModel.stepSize);
      ambientOcclusion.uniforms.blurStepSize = Number(
        this.viewModel.blurStepSize
      );
    }
  }
};
</script>
<style lang="less" scoped>
.panel-wrap {
  z-index: 1;
  width: 330px;
  height: 270px;
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(42, 42, 42, 0.8);
  padding: 4px;
  border-radius: 4px;
  color: #fff;
  text-align: left;
  padding: 8px;
  font-size: 12px;
  .row {
    margin: 5px 0;
    .name {
      width: 120px;
    }
    div {
      display: inline-block;
    }
  }
}
</style>
