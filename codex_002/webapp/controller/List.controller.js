sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/json/JSONModel"
], function (Controller, Filter, FilterOperator, JSONModel) {
  "use strict";

  return Controller.extend("request.management.controller.List", {
    onInit: function () {
      this.getView().setModel(new JSONModel({
        requestNo: "",
        status: "",
        content: "",
        applicant: "",
        approver: ""
      }), "filters");
    },

    onSearch: function () {
      var oFilters = this.getView().getModel("filters").getData();
      var aFilters = [];

      [
        ["requestNo", "requestNo"],
        ["content", "content"],
        ["applicant", "applicant"],
        ["approver", "approver"]
      ].forEach(function (aField) {
        var sValue = (oFilters[aField[0]] || "").trim();
        if (sValue) {
          aFilters.push(new Filter(aField[1], FilterOperator.Contains, sValue));
        }
      });

      if (oFilters.status) {
        aFilters.push(new Filter("status", FilterOperator.EQ, oFilters.status));
      }

      this.byId("requestsTable").getBinding("items").filter(aFilters);
    },

    onCreate: function () {
      this.getOwnerComponent().getRouter().navTo("new");
    },

    onItemPress: function (oEvent) {
      var oContext = oEvent.getParameter("listItem").getBindingContext("requests");
      var sRequestNo = oContext.getProperty("requestNo");
      this.getOwnerComponent().getRouter().navTo("detail", {
        requestId: encodeURIComponent(sRequestNo)
      });
    },

    formatStatusText: function (sStatus) {
      return {
        "00": "新規",
        "01": "承認済",
        "02": "却下"
      }[sStatus] || sStatus;
    },

    formatStatusState: function (sStatus) {
      return {
        "00": "Information",
        "01": "Success",
        "02": "Error"
      }[sStatus] || "None";
    }
  });
});
