sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, MessageBox) {
  "use strict";

  var DEFAULT_APPROVER = "佐藤 花子";

  return Controller.extend("request.management.controller.Detail", {
    onInit: function () {
      this.getView().setModel(new JSONModel({
        isNew: false,
        editable: false,
        request: {}
      }), "detail");

      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("new").attachPatternMatched(this._onNewMatched, this);
      oRouter.getRoute("detail").attachPatternMatched(this._onDetailMatched, this);
    },

    _onNewMatched: function () {
      this.getView().getModel("detail").setData({
        isNew: true,
        editable: true,
        request: {
          requestNo: this._createNextRequestNo(),
          status: "00",
          content: "",
          applicant: "",
          approver: ""
        }
      });
    },

    _onDetailMatched: function (oEvent) {
      var sRequestNo = decodeURIComponent(oEvent.getParameter("arguments").requestId);
      var aRequests = this.getOwnerComponent().getModel("requests").getProperty("/requests") || [];
      var oRequest = aRequests.find(function (oItem) {
        return oItem.requestNo === sRequestNo;
      });

      if (!oRequest) {
        MessageBox.error("対象の申請が見つかりません。", {
          onClose: this.onNavBack.bind(this)
        });
        return;
      }

      this.getView().getModel("detail").setData({
        isNew: false,
        editable: false,
        request: Object.assign({}, oRequest)
      });
    },

    onEdit: function () {
      this.getView().getModel("detail").setProperty("/editable", true);
    },

    onSave: function () {
      var oDetailModel = this.getView().getModel("detail");
      var oData = oDetailModel.getData();
      var oRequest = Object.assign({}, oData.request);
      var sValidation = this._validate(oRequest, oData.isNew);

      if (sValidation) {
        MessageBox.error(sValidation);
        return;
      }

      if (!oRequest.approver) {
        oRequest.approver = DEFAULT_APPROVER;
      }

      var oRequestsModel = this.getOwnerComponent().getModel("requests");
      var aRequests = oRequestsModel.getProperty("/requests") || [];
      var iIndex = aRequests.findIndex(function (oItem) {
        return oItem.requestNo === oRequest.requestNo;
      });

      if (oData.isNew) {
        aRequests.unshift(oRequest);
      } else {
        aRequests[iIndex] = oRequest;
      }

      oRequestsModel.setProperty("/requests", aRequests);
      this.getOwnerComponent().saveRequests();
      oDetailModel.setData({
        isNew: false,
        editable: false,
        request: Object.assign({}, oRequest)
      });

      MessageToast.show("保存しました。");
      this.getOwnerComponent().getRouter().navTo("detail", {
        requestId: encodeURIComponent(oRequest.requestNo)
      }, true);
    },

    onApprove: function () {
      this._setStatus("01", "承認しました。");
    },

    onReject: function () {
      this._setStatus("02", "却下しました。");
    },

    onNavBack: function () {
      this.getOwnerComponent().getRouter().navTo("list");
    },

    _setStatus: function (sStatus, sMessage) {
      var oDetailModel = this.getView().getModel("detail");
      oDetailModel.setProperty("/request/status", sStatus);
      oDetailModel.setProperty("/editable", true);
      this.onSave();
      MessageToast.show(sMessage);
    },

    _validate: function (oRequest, bIsNew) {
      if (!oRequest.requestNo || !oRequest.requestNo.trim()) {
        return "申請番号を入力してください。";
      }
      if (!oRequest.status) {
        return "ステータスを選択してください。";
      }
      if (!oRequest.content || !oRequest.content.trim()) {
        return "申請内容を入力してください。";
      }
      if (!oRequest.applicant || !oRequest.applicant.trim()) {
        return "申請者を入力してください。";
      }

      if (bIsNew) {
        var aRequests = this.getOwnerComponent().getModel("requests").getProperty("/requests") || [];
        var bDuplicate = aRequests.some(function (oItem) {
          return oItem.requestNo === oRequest.requestNo;
        });
        if (bDuplicate) {
          return "同じ申請番号が既に存在します。";
        }
      }

      return "";
    },

    _createNextRequestNo: function () {
      var aRequests = this.getOwnerComponent().getModel("requests").getProperty("/requests") || [];
      var iMax = aRequests.reduce(function (iCurrentMax, oItem) {
        var aMatch = /REQ-2026-(\d+)/.exec(oItem.requestNo || "");
        return aMatch ? Math.max(iCurrentMax, Number(aMatch[1])) : iCurrentMax;
      }, 0);

      return "REQ-2026-" + String(iMax + 1).padStart(4, "0");
    }
  });
});
