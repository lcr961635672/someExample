import Vue from "vue";
import Router from "vue-router";
import gltfModel from "./components/model/3DModels.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "3DModels",
      component: gltfModel
    },
    {
      path: "/modelColor",
      name: "3D Models Coloring",
      component: () => import("./components/model/3DModelsColoring.vue")
    },
    {
      path: "/tilesBIM",
      name: "3D Tiles BIM",
      component: () => import("./components/3dtiles/3DtilesBIM.vue")
    },
    {
      path: "/tilesHeight",
      name: "3D Tiles Adjust Height",
      component: () => import("./components/3dtiles/3DTilesAdjustHeight.vue")
    },
    {
      path: "/tilesBatch",
      name: "3D Tiles Batch Table Hierarchy",
      component: () =>
        import("./components/3dtiles/3DTilesBatchTableHierarchy.vue")
    },
    {
      path: "/tilesClip",
      name: "3D Tiles Clipping Planes",
      component: () => import("./components/3dtiles/3DTilesClippingPlanes.vue")
    },
    {
      path: "/tilesPick",
      name: "3D Tiles Feature Picking",
      component: () => import("./components/3dtiles/3DTilesPick.vue")
    },
    {
      path: "/tilesStyle",
      name: "3D Tiles Feature Styling",
      component: () => import("./components/3dtiles/3DTilesStyle.vue")
    },
    {
      path: "/tilesFormats",
      name: "3D Tiles Formats",
      component: () => import("./components/3dtiles/3DTilesFormats.vue")
    },
    {
      path: "/tilesInspector",
      name: "3D Tiles Inspector",
      component: () => import("./components/3dtiles/3DTilesInspector.vue")
    },
    {
      path: "/tilesInteractivity",
      name: "3D Tiles Interactivity",
      component: () => import("./components/3dtiles/3DTilesInteractivity.vue")
    },
    {
      path: "/tilesInterior",
      name: "3D Tiles Interior",
      component: () => import("./components/3dtiles/3DTilesInterior.vue")
    },
    {
      path: "/tilesYemen",
      name: "3D Tiles Next CDB Yemen",
      component: () => import("./components/3dtiles/3DTilesYemen.vue")
    },
    {
      path: "/tilesPhotoClassification",
      name: "3D Tiles Next Photogrammetry Classification",
      component: () =>
        import("./components/3dtiles/3DTilesPhotoClassification.vue")
    }
  ]
});
