sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, JSONModel) {
		"use strict";

		return Controller.extend("index.index.controller.View1", {
            OnPress: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("detail");
		},
			onInit: function () {
                var oData={
                    recipient:{
                        name: ""                        
                    }
                };
            var oModel = new JSONModel(oData);
			this.getView().setModel(oModel);
			}
		});
	});
