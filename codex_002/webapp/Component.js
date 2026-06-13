sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
  "use strict";

  return UIComponent.extend("request.management.Component", {
    metadata: {
      manifest: "json"
    },

    init: function () {
      UIComponent.prototype.init.apply(this, arguments);

      var oModel = new JSONModel();
      var sStored = window.localStorage.getItem("request.management.requests");

      if (sStored) {
        oModel.setData(JSON.parse(sStored));
      } else {
        oModel.loadData("mockdata/requests.json", null, false);
      }

      this.setModel(oModel, "requests");
      this.getRouter().initialize();
    },

    saveRequests: function () {
      var oModel = this.getModel("requests");
      window.localStorage.setItem(
        "request.management.requests",
        JSON.stringify(oModel.getData())
      );
    }
  });
});
