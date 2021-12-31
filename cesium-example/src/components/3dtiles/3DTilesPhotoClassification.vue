<!-- 3dtiles 测量分类 涉及到一些模型着色器 -->
<template>
  <div class="model-wrap">
    <div class="panel-wrap">
      <div class="box">
        <a-checkbox v-dark v-model="showPick">
          启用拾取
        </a-checkbox>
      </div>
      <div class="select-wrap">
        <a-select
          v-dark
          default-value="Photogrammetry"
          style="width: 190px; margin-right: 10px"
          size="small"
          @change="onChange"
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
      showPick: true,
      selectData: [
        {
          name: "Photogrammetry"
        },
        {
          name: "Show Classification"
        },
        {
          name: "Translucent Windows"
        },
        {
          name: "Stylized PBR Materials"
        },
        {
          name: "Golden Touch"
        }
      ]
    };
  },

  computed: {},

  mounted() {
    // 这句话特别重要，如果要写自定义着色器 就需要加这句话
    Cesium.ExperimentalFeatures.enableModelExperimental = true;
    // 创建球
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      terrainProvider: Cesium.createWorldTerrain(), // 添加全球地形
      infoBox: false,
      orderIndependentTranslucency: false // 获取场景是否启用了与顺序无关的半透明
    });
    //去除版权信息
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    // 设置时间，这个时间点显的模型亮些
    this.viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(
      "2021-11-09T20:27:37.016064475348684937Z"
    );
    this.scene = this.viewer.scene;
    // 添加3dtiles
    this.add3dtiles();
    // 设置初始视角
    this.viewer.camera.flyTo({
      destination: new Cesium.Cartesian3(
        -2703640.80485846,
        -4261161.990345464,
        3887439.511104276
      ),
      orientation: new Cesium.HeadingPitchRoll(
        0.22426651143535548,
        -0.2624145362506527,
        0.000006972977223185239
      )
    });
    //定义shader变量
    this.shaders();
    // 初始化事件
    this.initEvent();
  },

  methods: {
    // 初始化事件
    initEvent() {
      //设置显示的弹窗面板
      const nameOverlay = document.createElement("div");
      this.viewer.container.appendChild(nameOverlay);
      nameOverlay.className = "backdrop";
      nameOverlay.style.display = "none";
      nameOverlay.style.position = "absolute";
      nameOverlay.style.bottom = "0";
      nameOverlay.style.left = "0";
      nameOverlay.style["pointer-events"] = "none";
      nameOverlay.style.padding = "4px";
      nameOverlay.style.backgroundColor = "black";
      nameOverlay.style.color = "#fff";
      nameOverlay.style.whiteSpace = "pre-line";
      nameOverlay.style.fontSize = "12px";
      // 定义鼠标移动事件处理器
      const handler = new Cesium.ScreenSpaceEventHandler(this.scene.canvas);
      //鼠标移动事件，选中模型显示特定属性信息
      handler.setInputAction(movement => {
        if (this.showPick) {
          const pickedObject = this.scene.pick(movement.endPosition);
          if (pickedObject instanceof Cesium.Cesium3DTileFeature) {
            nameOverlay.style.display = "block";
            nameOverlay.style.bottom =
              this.viewer.canvas.clientHeight -
              movement.endPosition.y +
              90 +
              "px";
            nameOverlay.style.left = movement.endPosition.x + "px";
            const message = `Component: ${pickedObject.getProperty(
              "component"
            )}\nFeature ID:${pickedObject._batchId}`;
            nameOverlay.textContent = message;
          } else {
            nameOverlay.style.display = "none";
          }
        } else {
          nameOverlay.style.display = "none";
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      // 定义鼠标左键单击处理器
      const clickHandler = new Cesium.ScreenSpaceEventHandler(
        this.scene.canvas
      );
      clickHandler.setInputAction(movement => {
        if (this.showPick) {
          const pickedObject = this.scene.pick(movement.position);
          // 如果有选中feature 并且有_bathId
          if (
            Cesium.defined(pickedObject) &&
            Cesium.defined(pickedObject._batchId)
          ) {
            // 当下拉框选中Golden Touch，鼠标左键单击后修改feature的shader
            this.selectFeatureShader.setUniform(
              // 更新着色器
              "u_selectedFeature",
              pickedObject._batchId
            );
          } else {
            // 重置着色器
            this.selectFeatureShader.setUniform("u_selectedFeature", 12);
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    // 添加3dtiles
    add3dtiles() {
      this.tileset = new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(666297)
      });
      // 平移量
      const translation = new Cesium.Cartesian3(
        -1.398521324920626,
        0.7823052871729486,
        0.7015244410592609
      );
      // 模型平移
      this.tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
      this.tileset.maximumScreenSpaceError = 8.0; // 屏幕出错率，默认16，越小越精细加载
      this.scene.pickTranslucentDepth = true; // 使用深度缓冲区拾取半透明几何体
      this.scene.light.intensity = 7.0; // 设置场景亮度
      this.scene.primitives.add(this.tileset); //添加3dtiles
      this.viewer.zoomTo(this.tileset); // 定位到模型
    },
    onChange(value) {
      switch (value) {
        // 模型默认样式
        case "Photogrammetry":
          this.default();
          break;
        // 属性单体化
        case "Show Classification":
          this.showClassification();
          break;
        // 窗户半透明
        case "Translucent Windows":
          this.translucentWindows();
          break;
        //pbr材料
        case "Stylized PBR Materials":
          this.pbrMaterials();
          break;
        // 点金数
        case "Golden Touch":
          this.goldenTouch();
          break;
        default:
          break;
      }
    },
    // 定义所需要的shader对象
    shaders() {
      // 空片元着色器
      const emptyFragmentShader =
        "void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial) {}";
      // 模型默认着色器
      this.unlitShader = new Cesium.CustomShader({
        // CustomShader 自定义着色器
        lightingModel: Cesium.LightingModel.UNLIT, // 照明模式：UNLIT 为不使用照明
        fragmentShaderText: emptyFragmentShader // 片元着色器内容
      });
      // 窗户半透明shader
      this.translucentWindowsShader = new Cesium.CustomShader({
        lightingModel: Cesium.LightingModel.UNLIT, // 不使用照明
        isTranslucent: true, //模型渲染为半透明
        fragmentShaderText: [
          "const float WINDOW = 0.0;",
          "const float SKYLIGHT = 4.0;",
          "const float TOTAL_FEATURES = 12.0;",
          "",
          "void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {",
          "// 注意:这将公开着色器的内部细节。如果在某个地方将其添加到fsInput中会更好。。。",
          " float featureId = floor(texture2D(FEATURE_ID_TEXTURE, FEATURE_ID_TEXCOORD).FEATURE_ID_CHANNEL * 255.0 + 0.5);",
          "",
          " if (featureId == WINDOW || featureId == SKYLIGHT) {",
          "    material.alpha = 0.4;",
          "    material.roughness = 0.1;",
          "  }",
          "}"
        ].join("\n")
      });
      // 金属材料shader
      this.materialShader = new Cesium.CustomShader({
        lightingModel: Cesium.PBR, //PBR金属粗糙度和PBR镜面光泽度
        isTranslucent: true, // 启用半透明
        fragmentShaderText: [
          "const float WINDOW = 0.0;",
          "const float FRAME = 1.0;",
          "const float WALL = 2.0;",
          "const float ROOF = 3.0;",
          "const float SKYLIGHT = 4.0;",
          "const float AIR_CONDITIONER_WHITE = 5.0;",
          "const float AIR_CONDITIONER_BLACK = 6.0;",
          "const float AIR_CONDITIONER_TALL = 7.0;",
          "const float CLOCK = 8.0;",
          "const float PILLARS = 9.0;",
          "const float STREET_LIGHT = 10.0;",
          "const float TRAFFIC_LIGHT = 11.0;",
          "",
          "void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {",
          "  // NOTE: This is exposing internal details of the shader. It would be better if this was added to fsInput somewhere...",
          "  float featureId = floor(texture2D(FEATURE_ID_TEXTURE, FEATURE_ID_TEXCOORD).FEATURE_ID_CHANNEL * 255.0 + 0.5);",
          "",
          "  if (featureId == CLOCK) {",
          "    // Shiny brass",
          "    material.specular = vec3(0.98, 0.90, 0.59);",
          "    material.roughness = 0.3;",
          "  } else if (",
          "    featureId == STREET_LIGHT ||",
          "    featureId == AIR_CONDITIONER_BLACK ||",
          "    featureId == AIR_CONDITIONER_WHITE ||",
          "    featureId == AIR_CONDITIONER_TALL ||",
          "    featureId == ROOF",
          "  ) {",
          "    // dull aluminum",
          "    material.specular = vec3(0.91, 0.92, 0.92);",
          "    material.roughness = 0.5;",
          "  } else if (featureId == WINDOW || featureId == SKYLIGHT) {",
          "    // make translucent, but also set an orange emissive color so it looks like",
          "    // it's lit from inside",
          "    material.emissive = vec3(1.0, 0.3, 0.0);",
          "    material.alpha = 0.5;",
          "  } else if (featureId == WALL || featureId == FRAME || featureId == PILLARS) {",
          "    // paint the walls and pillars white to contrast the brass clock",
          "    material.diffuse = mix(material.diffuse, vec3(1.0), 0.8);",
          "    material.roughness = 0.9;",
          "  } else {",
          "    // brighten everything else",
          "    material.diffuse += 0.05;",
          "    material.roughness = 0.9;",
          "  }",
          "}"
        ].join("\n")
      });
      const NOTHING_SELECTED = 12;
      // 选中的shader
      this.selectFeatureShader = new Cesium.CustomShader({
        uniforms: {
          u_selectedFeature: {
            type: Cesium.UniformType.FLOAT,
            value: NOTHING_SELECTED
          }
        },
        lightingModel: Cesium.LightingModel.PBR,
        fragmentShaderText: [
          "const float NOTHING_SELECTED = 12.0;",
          "void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {",
          "  float featureId = floor(texture2D(FEATURE_ID_TEXTURE, FEATURE_ID_TEXCOORD).FEATURE_ID_CHANNEL * 255.0 + 0.5);",
          "",
          "  if(u_selectedFeature < NOTHING_SELECTED && featureId == u_selectedFeature) {",
          "    material.specular = vec3(1.0, 0.85, 0.57);",
          "    material.roughness = 0.3;",
          "  }",
          "}"
        ].join("\n")
      });
    },
    // 模型默认样式
    default() {
      this.tileset.style = undefined;
      this.tileset.customShader = this.unlitShader;
      this.tileset.colorBlendMode = Cesium.Cesium3DTileColorBlendMode.HIGHLIGHT;
      this.tileset.colorBlendAmount = 0.5;
    },
    // 属性单体化
    showClassification() {
      this.default(); // 先把模型shader初始化
      this.tileset.style = new Cesium.Cesium3DTileStyle({
        color: "color(${color})"
      });
      this.tileset.colorBlendMode = Cesium.Cesium3DTileColorBlendMode.MIX; // 颜色设置为混合模式
    },
    // 窗户半透明
    translucentWindows() {
      this.default();
      this.tileset.customShader = this.translucentWindowsShader;
    },
    //pbr材料
    pbrMaterials() {
      this.default();
      this.tileset.customShader = this.materialShader;
    },
    // 点金数
    goldenTouch() {
      this.default();
      this.tileset.customShader = this.selectFeatureShader;
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
  .select-wrap {
    display: inline-block;
  }
}
</style>
