<!--  -->
<template>
  <div class="model-wrap">
    <div class="panel-wrap">
      <div class="select-wrap">
        <a-select
          v-dark
          default-value="Overview"
          style="width: 150px; margin-right: 10px"
          size="small"
          @change="changeLocation"
        >
          <a-select-option
            v-for="(item, index) in locationData"
            :value="item.name"
            :key="index"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </div>
      <div class="select-wrap">
        <a-select
          v-dark
          default-value="No style"
          style="width: 200px; margin-right: 10px"
          size="small"
          @change="changeStyle"
        >
          <a-select-option
            v-for="(item, index) in styleData"
            :value="item.name"
            :key="index"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
        <a-checkbox v-dark v-model="showPickTerrain">
          启用地形拾取
        </a-checkbox>
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
      showPickTerrain: true,
      locationData: [
        {
          name: "Overview"
        },
        {
          name: "Airport"
        },
        {
          name: "Crater"
        },
        {
          name: "Port"
        }
      ],
      styleData: [
        {
          name: "No style"
        },
        {
          name: "Style buildings based on height"
        },
        {
          name: "Style terrain based on materials"
        }
      ],
      cameraTransforms: {}
    };
  },

  computed: {},

  mounted() {
    // 启用地形拾取标志
    Cesium.ExperimentalFeatures.enableModelExperimental = true;
    // 创建球
    this.viewer = new Cesium.Viewer("cesiumContainer");
    //去除版权信息
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    // 时间设置
    this.viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(
      "2021-11-09T07:27:37.016064475348684937Z"
    );
    this.scene = this.viewer.scene;
    this.scene.light.intensity = 7.0; // 设置场景中灯光强度值，最小为0，没有最大值
    // 设置各视角变量值
    this.cameraTransforms = {
      tileset: {
        destination: new Cesium.Cartesian3(
          4397999.822774582,
          4404502.67774069,
          1397782.4709840622
        ),
        direction: new Cesium.Cartesian3(
          -0.29335588497705106,
          -0.6066709587467911,
          0.7388454997917905
        ),
        up: new Cesium.Cartesian3(
          0.6240972421637774,
          0.46391380837591956,
          0.6287182283994301
        )
      },
      airport: {
        destination: new Cesium.Cartesian3(
          4394719.151490939,
          4402317.401942875,
          1406608.6602404779
        ),
        direction: new Cesium.Cartesian3(
          0.4146699515908668,
          -0.8887814163588482,
          0.1952342828060377
        ),
        up: new Cesium.Cartesian3(
          0.8415067525520951,
          0.4561872920946922,
          0.28941240460723
        )
      },
      crater: {
        destination: new Cesium.Cartesian3(
          4398179.160380196,
          4402518.469409466,
          1399161.7612076725
        ),
        direction: new Cesium.Cartesian3(
          -0.2800903637088597,
          -0.6348021519070498,
          0.7201219452923355
        ),
        up: new Cesium.Cartesian3(
          0.6319189548885261,
          0.4427783126727723,
          0.6361020360596605
        )
      },
      port: {
        destination: new Cesium.Cartesian3(
          4399698.85724341,
          4399019.639078034,
          1405153.7766045567
        ),
        direction: new Cesium.Cartesian3(
          -0.5651458936543287,
          0.17696574231117793,
          -0.8057873447342694
        ),
        up: new Cesium.Cartesian3(
          0.4886488937394081,
          0.8587605935024302,
          -0.15411846642958343
        )
      }
    };
    // 添加部分地形数据 格式为3dtiles
    this.terrainTileset = this.add3dtiles(667809);
    // 添加建筑物模型
    this.buildingsTileset = this.add3dtiles(666747, 12);
    // 当建筑物模型加载完后
    this.buildingsTileset.readyPromise.then(() => {
      // 飞到对应的视角处
      this.flyCameraTo(this.cameraTransforms.tileset);
    });
    // 初始化注册事件
    this.initEvent();
  },

  methods: {
    initEvent() {
      const handler = new Cesium.ScreenSpaceEventHandler(this.scene.canvas);
      // 弹框面板
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
      // 设置鼠标移动高亮变量
      const highlighted = {
        feature: undefined,
        originalColor: new Cesium.Color()
      };
      // 设置鼠标点击选中变量
      const selected = {
        feature: undefined,
        originalColor: new Cesium.Color()
      };
      // 鼠标移动事件
      handler.setInputAction(movement => {
        // 如果开启了地形拾取
        if (this.showPickTerrain) {
          // 清空上次的鼠标移动高亮
          if (Cesium.defined(highlighted.feature)) {
            highlighted.feature.color = highlighted.originalColor;
            highlighted.feature = undefined;
          }
          // 获取选中的feature元素
          const feature = this.scene.pick(movement.endPosition);
          // feature是否为Cesium3DTileFeature类型
          const featurePicked = feature instanceof Cesium.Cesium3DTileFeature;
          // 如果是Cesium3DTileFeature类型并且有属性substrates，则选中的为地形
          const isTerrainFeature =
            featurePicked && feature.hasProperty("substrates");
          // 如果是Cesium3DTileFeature类型并且有属性HGT，则选中的为建筑物模型
          const isBuildingFeature = featurePicked && feature.getProperty("HGT");
          // 如果选中地形，显示信息提示框
          if (isTerrainFeature) {
            metadataOverlay.style.display = "block";
            metadataOverlay.style.bottom =
              this.viewer.canvas.clientHeight - movement.endPosition.y + "px";
            metadataOverlay.style.left = movement.endPosition.x + "px";
            let tableHtmlScratch =
              "<table><thead><tr><td>Material:</td><th><tt>" +
              feature.getProperty("name") +
              "</tt></tr></thead><tbody>";

            let materialsScratch = feature.getProperty("substrates");
            let weightsScratch = feature.getProperty("weights");
            tableHtmlScratch +=
              "<tr><td colspan='2' style='text-align: center;'><b>Substrates</b></td></tr>";

            for (let i = 0; i < materialsScratch.length; i++) {
              tableHtmlScratch +=
                "<tr><td><tt>" +
                materialsScratch[i].slice(3) +
                "</tt></td><td style='text-align: right;'><tt>" +
                weightsScratch[i] +
                "%</tt></td></tr>";
            }
            tableHtmlScratch += "</tbody></table>";
            metadataOverlay.innerHTML = tableHtmlScratch;
          } else {
            metadataOverlay.style.display = "none"; // 没选中地形则隐藏提示框
          }
          // 如果选中建筑物模型
          if (isBuildingFeature) {
            //  如果当前选中的feature元素，不是上次单击选中的元素，则高亮当前选中的feature
            if (feature !== selected.feature) {
              highlighted.feature = feature;
              Cesium.Color.clone(feature.color, highlighted.originalColor);
              feature.color = Cesium.Color.MAGENTA;
            }
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      // 鼠标左键单击事件
      handler.setInputAction(movement => {
        // 如果之前鼠标单击有高亮选中feature，则清除上次高亮
        if (Cesium.defined(selected.feature)) {
          selected.feature.color = selected.originalColor;
          selected.feature = undefined;
        }
        // 获取选中的feature
        const feature = this.scene.pick(movement.position);
        const featurePicked = feature instanceof Cesium.Cesium3DTileFeature;
        // 如果是Cesium3DTileFeature类型并且有属性HGT，则选中的为建筑物模型
        const isBuildingFeature = featurePicked && feature.getProperty("HGT");
        // 如果是建筑物模型
        if (isBuildingFeature) {
          // 如果当前选中的feature跟上次一样，则返回
          if (selected.feature === feature) {
            return;
          }
          selected.feature = feature;
          // 当前鼠标点击的feature，跟鼠标移动高亮选中的feature相等，则清空鼠标移动的高亮
          if (feature === highlighted.feature) {
            Cesium.Color.clone(
              highlighted.originalColor,
              selected.originalColor
            );
            highlighted.feature = undefined;
          } else {
            Cesium.Color.clone(feature.color, selected.originalColor);
          }
          feature.color = Cesium.Color.LIME;
          let tableHtmlScratch = "<table class='cesium-infoBox-defaultTable'>";
          tableHtmlScratch +=
            "<tr><th>Property Name</th><th>ID</th><th>Type</th><th>Value</th></tr><tbody>";
          const metadataClass = feature.content.batchTable._propertyTable.class;
          const propertyNames = feature.getPropertyNames();
          const length = propertyNames.length;
          for (let i = 0; i < length; ++i) {
            const propertyName = propertyNames[i];

            // Skip these properties, since they are always empty.
            if (
              propertyName === "APID" ||
              propertyName === "FACC" ||
              propertyName === "RWID"
            ) {
              continue;
            }

            const propertyValue = feature.getProperty(propertyName);
            const property = metadataClass.properties[propertyName];

            tableHtmlScratch +=
              "<tr style='font-family: monospace;' title='" +
              property.description +
              "'><th>" +
              property.name +
              "</th><th><b>" +
              property.id +
              "</b></th><td>" +
              property.componentType +
              "</td><td>" +
              propertyValue +
              "</td></tr>";
          }
          tableHtmlScratch +=
            "<tr><th colspan='4'><i style='font-size:10px'>Hover on a row for description</i></th></tr></tbody></table>";
          this.viewer.selectedEntity.description = tableHtmlScratch;
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      // 此代码目的是 如果你之前有显示的地形弹框，如果鼠标移动到右侧infoBox面板上时，隐藏地形弹框
      const infoBoxContainer = document
        .getElementsByClassName("cesium-viewer-infoBoxContainer")
        .item(0);
      infoBoxContainer.onmouseover = function() {
        metadataOverlay.style.display = "none";
      };
    },
    // 根据属性修改模型style样式
    changeStyle(value) {
      switch (value) {
        case "No style":
          this.buildingsTileset.style = undefined;
          this.terrainTileset.style = undefined;
          break;
        case "Style buildings based on height":
          this.buildingsTileset.style = new Cesium.Cesium3DTileStyle({
            color: {
              conditions: [
                ["${HGT} !== undefined && ${HGT} < 5", "color('#f5fd2d')"],
                [
                  "${HGT} !== undefined && ${HGT} >= 5 && ${HGT} < 10",
                  "color('#d3a34a')"
                ],
                [
                  "${HGT} !== undefined && ${HGT} >= 10 && ${HGT} < 15",
                  "color('#947e75')"
                ],
                [
                  "${HGT} !== undefined && ${HGT} >= 15 && ${HGT} < 20",
                  "color('#565a9f')"
                ],
                ["${HGT} !== undefined && ${HGT} > 20", "color('#223bc3')"],
                ["true", "color('white')"]
              ]
            }
          });
          break;
        case "Style terrain based on materials":
          this.buildingsTileset.style = undefined;
          this.terrainTileset.style = new Cesium.Cesium3DTileStyle({
            color: {
              conditions: [
                ["${name} === 'OCEAN'", "color('#436d9d')"],
                ["${name} === 'LAKE'", "color('#3987c9')"],
                ["${name} === 'CALCAREOUS'", "color('#BBB6B1')"],
                ["${name} === 'GRASS'", "color('#567d46')"],
                ["${name} === 'FOREST'", "color('green')"],
                ["${name} === 'CITY'", "color('lightgray')"],
                ["${name} === 'ASPHALTROAD'", "color('#434343')"],
                ["${name} === 'ASPHALT'", "color('#463d39')"],
                ["${name} === 'CONCRETE'", "color('#b9b4ab')"],
                ["${name} === 'DRYGROUND'", "color('#9B7653')"],
                ["${name} === 'WETGROUND'", "color('#5a4332')"],
                ["${name} === 'SAND'", "color('gold')"],
                ["true", "color('#9B7653')"]
              ]
            }
          });
          break;
        default:
          break;
      }
    },
    // 飞行定位视角
    flyCameraTo(cameraTransform) {
      this.viewer.camera.flyTo({
        destination: cameraTransform.destination,
        orientation: {
          direction: cameraTransform.direction,
          up: cameraTransform.up
        },
        easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT
      });
    },
    // 添加3dtiles  根据id去添加
    add3dtiles(id, err = 16) {
      const tileset = this.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: Cesium.IonResource.fromAssetId(id),
          maximumScreenSpaceError: err
        })
      );
      return tileset;
    },
    //改变视角
    changeLocation(e) {
      console.log(e);
      const value = e.toLowerCase();
      this.flyCameraTo(this.cameraTransforms[value]);
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
  background: rgba(42, 42, 42, 0.8);
  padding: 4px;
  border-radius: 4px;
  color: #fff;
  text-align: left;
  .select-wrap {
    display: inline-block;
  }
}
</style>
