sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",		//for search bar
    "sap/ui/model/FilterOperator", //for search bar
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/core/library"

],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller, Filter, FilterOperator, Fragment, MessageToast, coreLibrary) {
        "use strict";
        
        var ValueState = coreLibrary.ValueState;
    
        return Controller.extend("ns.createbank.controller.View1", {

            onInit: function () {

            },

            // onFilterCountry: function (oEvent) {

                // // build filter array
                // var aFilter = [];
                // var sQuery = oEvent.getParameter("query");
                // var sQuery = oEvent.getSource().getValue();
                // if (sQuery && sQuery.length > 0) {
                // 	aFilter.push(new Filter("CountryCode", FilterOperator.Contains, sQuery));
                // }
                // // filter binding
                // var oList = this.byId("bList");
                // var oBinding = oList.getBinding("items");
                // oBinding.filter(aFilter);        

            // },

            onFilterBank: function (oEvent) {

                var oView = this.getView();
                var oInput1 = oView.byId("idComboBox1").getValue();
                var oInput2 = oView.byId("idComboBox2").getValue();
                var filter1 = new sap.ui.model.Filter("CountryCode", FilterOperator.Contains, oInput1);
                var filter2 = new sap.ui.model.Filter("BankCode", FilterOperator.Contains, oInput2);

                // filter binding
                var oList = this.byId("bList");
                var oBinding = oList.getBinding("items");
                // oBinding.filter(aFilter); 
                oBinding.filter([filter1, filter2]);

            },

            onCreateNew : function(){
            
            var oView = this.getView();
			var oDialog = oView.byId("createNew");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "ns.createbank.view.createNew", this);
                oView.addDependent(oDialog);
			}
			oDialog.open();
        },

            onCreateDialog : function () {
                var msg = "Bank Added";
                MessageToast.show(msg);
                this.byId("createNew").close();

            },

            onCloseDialog : function () {
                // note: We don't need to chain to the pDialog promise, since this event-handler
                // is only called from within the loaded dialog itself.
                this.byId("createNew").close();
            },

            handleChange: function (oEvent) {
			var oValidatedComboBox = oEvent.getSource(),
				sSelectedKey = oValidatedComboBox.getSelectedKey(),
				sValue = oValidatedComboBox.getValue();

			if (!sSelectedKey && sValue) {
				oValidatedComboBox.setValueState(ValueState.Error);
				oValidatedComboBox.setValueStateText("Please enter a valid value!");
			} else {
				oValidatedComboBox.setValueState(ValueState.None);
			    }
            },
        
            comboBoxMapping: function(oEvent) {
                
                        this.getView().byId("idComboBox2").getBinding("items").filter([
                            new sap.ui.model.Filter(
                                "CountryCode", 
                                FilterOperator.EQ, 
                                oEvent.getParameter("selectedItem").getKey())  
                        ]);
            }
		});
	});
