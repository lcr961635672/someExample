<!-- 点云的一些参数配置 -->
<template>
  <div class="model-wrap">
    <div class="panel-wrap">
      <a-select
        v-dark
        style="width: 120px"
        size="small"
        default-value="St. Helens"
        @change="onChange"
      >
        <a-select-option
          v-for="(item, index) in selectData"
          :value="item"
          :key="index"
        >
          {{ item }}
        </a-select-option>
      </a-select>
      <div class="row">
        <div class="name">最大屏幕空间错误：</div>
        <div class="value">
          <a-slider
            size="small"
            style="width: 120px;vertical-align: middle;"
            :min="0"
            :max="64"
            :step="0.1"
            v-model="viewModel.maximumScreenSpaceError"
            @change="changeAllParams"
          />
          <a-input
            size="small"
            v-model="viewModel.maximumScreenSpaceError"
            style="width: 40px"
          />
        </div>
      </div>
      <div class="model-color">
        <div class="title">稀薄化</div>
        <div class="content">
          <div class="row">
            <div class="name">几何误差大小：</div>
            <div class="value">
              <a-slider
                size="small"
                style="width: 120px;vertical-align: middle;"
                :min="0"
                :max="2"
                :step="0.1"
                v-model="viewModel.geometricErrorScale"
                @change="changeAllParams"
              />
              <a-input
                size="small"
                v-model="viewModel.geometricErrorScale"
                style="width: 40px"
              />
            </div>
          </div>
          <div class="row">
            <div class="name">最大衰减：</div>
            <div class="value">
              <a-slider
                size="small"
                style="width: 120px;vertical-align: middle;"
                :min="0"
                :max="32"
                :step="1"
                v-model="viewModel.maximumAttenuation"
                @change="changeAllParams"
              />
              <a-input
                size="small"
                v-model="viewModel.maximumAttenuation"
                style="width: 40px"
              />
            </div>
          </div>
          <div class="row">
            <div class="name">分辨率：</div>
            <div class="value">
              <a-slider
                size="small"
                style="width: 120px;vertical-align: middle;"
                :min="0"
                :max="10"
                :step="0.01"
                v-model="viewModel.baseResolution"
                @change="changeAllParams"
              />
              <a-input
                size="small"
                v-model="viewModel.baseResolution"
                style="width: 40px"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="model-Silhouette">
        <div class="title">眼罩照明</div>
        <div class="content">
          <div class="row">
            <div class="name">眼罩照明强度：</div>
            <div class="value">
              <a-slider
                size="small"
                :min="0"
                :max="10"
                :step="0.1"
                style="width: 120px;vertical-align: middle;"
                v-model="viewModel.eyeDomeLightingStrength"
                @change="changeAllParams"
              />
              <a-input
                size="small"
                v-model="viewModel.eyeDomeLightingStrength"
                style="width: 40px"
              />
            </div>
          </div>
          <div class="row">
            <div class="name">眼罩照明半径：</div>
            <div class="value">
              <a-slider
                size="small"
                style="width: 120px;vertical-align: middle;"
                :min="0"
                :max="10"
                :step="0.1"
                v-model="viewModel.eyeDomeLightingRadius"
                @change="changeAllParams"
              />
              <a-input
                size="small"
                v-model="viewModel.eyeDomeLightingRadius"
                style="width: 40px"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <a-checkbox
          v-dark
          v-model="viewModel.attenuation"
          @change="changeAttenuation"
        >
          开启衰减
        </a-checkbox>
        <a-checkbox
          v-dark
          v-model="viewModel.eyeDomeLighting"
          @change="changeLighting"
        >
          开启眼罩照明
        </a-checkbox>
      </div>
    </div>
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
/* global  Cesium*/
export default {
  components: {},

  data() {
    return {
      selectData: ["St. Helens", "Church"],
      viewModel: {
        maximumScreenSpaceError: 16,
        geometricErrorScale: 1.0,
        maximumAttenuation: 0,
        baseResolution: 0,
        eyeDomeLightingStrength: 1.0,
        eyeDomeLightingRadius: 1.0,
        attenuation: true,
        eyeDomeLighting: true
      }
    };
  },

  computed: {},

  mounted() {
    // 创建球
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      terrainProvider: Cesium.createWorldTerrain() // 加载全球地形
    });
    this.scene = this.viewer.scene;
    //去除版权信息
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    // 判断浏览器是否支持点云着色
    if (!Cesium.PointCloudShading.isSupported(this.scene)) {
      window.alert("浏览器不支持点云着色");
    }
    // 设置两个模型的视角参数值
    this.viewParams();
    // 加载3dtiles
    this.load3dtiles(5713);
    //初始化定位视角
    this.viewer.scene.camera.setView(this.stHelensView);
  },

  methods: {
    // 模型下拉框值改变方法
    onChange(value) {
      if (value === "St. Helens") {
        this.load3dtiles(5713); // 加载模型
        this.viewer.scene.camera.setView(this.stHelensView); // 定位视角
      } else {
        this.load3dtiles(16421); // 加载模型
        this.viewer.scene.camera.setView(this.churchView); // 定位视角
      }
    },
    // 添加3dtiles
    load3dtiles(id) {
      let tileset = new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(id)
      });
      this.tileset = tileset;
      this.scene.primitives.add(tileset);
      // 重置参数值
      this.viewModel.maximumScreenSpaceError = 16.0;
      this.viewModel.maximumAttenuation = undefined;
      this.viewModel.baseResolution = undefined;
      this.viewModel.geometricErrorScale = 1.0;
      this.viewModel.attenuation = true;
      this.viewModel.eyeDomeLighting = true;
      this.viewModel.eyeDomeLightingRadius = 1.0;
      this.viewModel.eyeDomeLightingStrength = 1.0;
      this.changeAllParams();
    },
    // 所有参数改变修改对应的模型参数
    changeAllParams() {
      this.tileset.maximumScreenSpaceError = this.viewModel.maximumScreenSpaceError;
      this.tileset.pointCloudShading.maximumAttenuation = this.viewModel.maximumAttenuation;
      this.tileset.pointCloudShading.baseResolution = this.viewModel.baseResolution;
      this.tileset.pointCloudShading.geometricErrorScale = this.viewModel.geometricErrorScale;
      this.tileset.pointCloudShading.eyeDomeLightingStrength = this.viewModel.eyeDomeLightingStrength;
      this.tileset.pointCloudShading.eyeDomeLightingRadius = this.viewModel.eyeDomeLightingRadius;
      this.tileset.pointCloudShading.attenuation = this.viewModel.attenuation;
      this.tileset.pointCloudShading.eyeDomeLighting = this.viewModel.eyeDomeLighting;
    },
    // 是否开启衰减
    changeAttenuation() {
      this.tileset.pointCloudShading.attenuation = this.viewModel.attenuation;
    },
    // 是否开启光照
    changeLighting() {
      this.tileset.pointCloudShading.eyeDomeLighting = this.viewModel.eyeDomeLighting;
    },
    // 定义两个模型的视角参数
    viewParams() {
      this.stHelensView = {
        destination: Cesium.Cartesian3.fromRadians(
          -2.1344873183780484,
          0.8071380277370774,
          5743.394497982162
        ),
        orientation: new Cesium.HeadingPitchRoll.fromDegrees(
          112.99596671210358,
          -21.34390550872461,
          0.0716951918898415
        ),
        endTransform: Cesium.Matrix4.IDENTITY
      };
      this.churchView = {
        destination: Cesium.Cartesian3.fromRadians(
          4401744.644145314,
          225051.41078911052,
          4595420.374784433
        ),
        orientation: new Cesium.HeadingPitchRoll.fromDegrees(
          5.646733805039757,
          -0.276607153839886,
          6.281110875400085
        ),
        endTransform: Cesium.Matrix4.IDENTITY
      };
    }
  }
};
</script>
<style lang="less" scoped>
.panel-wrap {
  z-index: 1;
  width: 330px;
  height: 365px;
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
