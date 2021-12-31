<!-- 模型球 修改着色器 -->
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
          default-value="Globe View"
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
          name: "Globe View"
        },
        {
          name: "Show S2 Bounding Volumes"
        },
        {
          name: "Apply Style"
        },
        {
          name: "Apply Custom Shader"
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
      globe: false //必须隐藏球体，后面有加载3dtiles球体
    });
    //去除版权信息
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    this.scene = this.viewer.scene;
    // 定位初始化视角
    this.viewer.camera.flyTo({
      duration: 0, // 飞行时间
      // 目的地位置
      destination: new Cesium.Cartesian3(
        762079.3157173397,
        -28363749.882652905,
        19814354.842565004
      ),
      // 方向
      orientation: {
        direction: new Cesium.Cartesian3(
          -0.022007098944236157,
          0.819079900508189,
          -0.5732571885110153
        ),
        up: new Cesium.Cartesian3(
          -0.015396759850986286,
          0.5730503851893346,
          0.8193754913471885
        )
      },
      // 飞行动画
      easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT
    });
    // 添加模型球体
    this.add3dtilesGlobe();
    // 初始化事件
    this.initEvent();
    // 动态更新着色器
    this.shaderByTime();
  },

  methods: {
    // 根据时间动态更新自定义着色器
    shaderByTime() {
      // 自定义shader
      this.customShader = new Cesium.CustomShader({
        uniforms: {
          u_time: {
            type: Cesium.UniformType.FLOAT,
            value: 0
          }
        },
        fragmentShaderText: [
          "void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {",
          "  float featureId = floor(texture2D(FEATURE_ID_TEXTURE, FEATURE_ID_TEXCOORD).FEATURE_ID_CHANNEL * 255.0 + 0.5);",
          "  vec3 positionWC = fsInput.attributes.positionWC / 6.3e6;",
          "  if (featureId == 60.0) {",
          " // 类似FM调频，可以产生不规则间隔的波",
          "     float wave = sin(14.0 * positionWC.z -u_time);",
          "     wave = 0.5 + 0.5 * sin(10.0 * wave * positionWC.z -u_time);",
          "//混合过饱和版本的漫反射，形成闪烁的色带",
          "     material.diffuse = mix(material.diffuse, material.diffuse * 3.0, wave);",
          "   }",
          "}"
        ].join("\n")
      });
      const startTime = performance.now(); // 获取当前日期，精确到毫秒
      // 动态修改自定义着色器的u_time参数值
      const customShaderUpdate = () => {
        const elapsedTimeSeconds = (performance.now() - startTime) / 1000;
        this.customShader.setUniform("u_time", elapsedTimeSeconds);
      };
      // 注册 获取在场景更新之后和渲染场景之前立即引发的事件
      this.scene.postUpdate.addEventListener(() => {
        customShaderUpdate();
      });
    },
    // 添加3dtiles球体
    add3dtilesGlobe() {
      this.tileset = this.viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: Cesium.IonResource.fromAssetId(691510),
          maximumScreenSpaceError: 4
        })
      );
    },
    //初始化事件
    initEvent() {
      // 创建弹框面板
      const metadataOverlay = document.createElement("div");
      this.viewer.container.appendChild(metadataOverlay);
      metadataOverlay.className = "backdrop";
      metadataOverlay.style.display = "none";
      metadataOverlay.style.position = "absolute";
      metadataOverlay.style.bottom = "0";
      metadataOverlay.style.left = "0";
      metadataOverlay.style["pointer-events"] = "none";
      metadataOverlay.style.padding = "4px";
      metadataOverlay.style.backgroundColor = "#303030";
      metadataOverlay.style.color = "#fff";
      metadataOverlay.style.whiteSpace = "pre-line";
      metadataOverlay.style.fontSize = "16px";
      metadataOverlay.style.borderRadius = "4px";
      // 创建事件处理器
      const handler = new Cesium.ScreenSpaceEventHandler(this.scene.canvas);
      handler.setInputAction(movement => {
        if (this.showPick) {
          const feature = this.scene.pick(movement.endPosition);
          if (feature instanceof Cesium.Cesium3DTileFeature) {
            metadataOverlay.style.display = "block";
            metadataOverlay.style.bottom =
              this.viewer.canvas.clientHeight -
              movement.endPosition.y +
              90 +
              "px";
            metadataOverlay.style.left = movement.endPosition.x + "px";
            let tableHtmlScratch =
              "<table><thead><tr><th><tt>Property</tt></th><th><tt>Value</tt></th></tr></thead><tbody>";
            const propertyNames = feature.getPropertyNames();
            const length = propertyNames.length;
            for (let i = 0; i < length; ++i) {
              const propertyName = propertyNames[i];
              const propertyValue = feature.getProperty(propertyName);
              tableHtmlScratch +=
                "<tr><td><tt>" +
                propertyName +
                "</tt></td><td><tt>" +
                propertyValue +
                "</tt></td></tr>";
            }
            tableHtmlScratch += "</tbody></table>";
            metadataOverlay.innerHTML = tableHtmlScratch;
          } else {
            metadataOverlay.style.display = "none";
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    onChange(value) {
      switch (value) {
        case "Globe View":
          this.tileset.customShader = undefined;
          this.tileset.debugShowBoundingVolume = false;
          this.tileset.style = undefined;
          break;
        case "Show S2 Bounding Volumes":
          this.tileset.customShader = undefined;
          this.tileset.debugShowBoundingVolume = true;
          this.tileset.style = undefined;
          break;
        case "Apply Style":
          this.tileset.customShader = undefined;
          this.tileset.debugShowBoundingVolume = false;
          this.tileset.style = new Cesium.Cesium3DTileStyle({
            defines: {
              LandCoverColor: "rgb(${color}[0], ${color}[1], ${color}[2])"
            },
            color:
              "${LandCoverColor} === vec4(1.0) ? rgb(254,254,254) : ${LandCoverColor}"
          });
          break;
        case "Apply Custom Shader":
          this.tileset.customShader = this.customShader;
          this.tileset.debugShowBoundingVolume = false;
          this.tileset.style = undefined;
          break;

        default:
          break;
      }
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
