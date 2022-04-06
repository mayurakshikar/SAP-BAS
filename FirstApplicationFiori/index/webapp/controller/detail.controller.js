sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
    "sap/ui/core/UIComponent"
], function (Controller, History, UIComponent) {
	"use strict";

	return Controller.extend("index.index.controller.detail", {

        OnPress: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("detail");
        },
        
		onNavBack: function (oEvent) {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("overview", {}, true);
			}
        }

	});
});