sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Element",

    "sap/m/Column",
    "sap/m/Label",
    "sap/m/ColumnListItem",
    "sap/m/Text"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageToast, Element, Column, Label, ColumnListItem, Text) {
        "use strict";

        return Controller.extend("ns.uploadsite.controller.View", {
            onInit: function () {

                // this.localModel = new JSONModel();
                // this.getView().setModel(this.localModel, "localModel");

                //changed 7/2/2021

                var oModel = new JSONModel();
                this.getView().setModel(oModel);
                var itemModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(itemModel, "itemModel");
                var columnModel = new JSONModel();
                this.getView().setModel(columnModel, "columnModel");

            },

            onSelectionChange: function () {
                var oSegmentedButton = this.byId('_IDGenSegmentedButton1'),
                    oSelectedItemId = oSegmentedButton.getSelectedItem(),
                    oSelectedItem = Element.registry.get(oSelectedItemId);
                // MessageToast.show(oSelectedItem.getText());

                if (oSelectedItem.getText() == "Upload") {

                    // create dialog lazily
                    if (!this.pDialog) {
                        this.pDialog = this.loadFragment({
                            name: "ns.uploadsite.view.UploadFile"
                        });
                    }
                    this.pDialog.then(function (oDialog) {
                        oDialog.open();
                    });         

                } else if (oSelectedItem.getText() == "View") {

                    // get the path to the JSON file
                    // var sPath = jQuery.sap.getModulePath("ns.uploadsite", "/model/sitedata.json");

                    // // initialize the model with the JSON file
                    // var siteModel = new JSONModel(sPath);

                    // // var tabData = this.getView().byId("oTable");

                    // // set the model to the view
                    // this.getView().setModel(siteModel, "sitedata.json");
                    // tabData.setModel(siteModel, "site");
                    
                    MessageToast.show("View Data");
                }
            },

            onCloseDialog: function () {
                this.byId("id_FileUploader").clear();
                this.byId("UploadFile").close();
            },

            onUpload: function (e) {

                // var oFileUploader = this.byId("id_FileUploader");
                //     oFileUploader.checkFileReadable().then(function () {
                //         oFileUploader.upload();
                //     }, function (error) {
                //         MessageToast.show("The file cannot be read. It may have changed.");
                //     }).then(function () {
                //         oFileUploader.clear();
                //     });

                this._import(e.getParameter("files") && e.getParameter("files")[0]);
                this.byId("id_FileUploader").clear();
                this.byId("UploadFile").close();
            },

            _import: function (file) {
                var that = this;
                var excelData = {};
                if (file && window.FileReader) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var data = e.target.result;
                        var workbook = XLSX.read(data, {
                            type: 'binary'
                        });
                        workbook.SheetNames.forEach(function (sheetName) {
                            // Here is your object for every sheet in workbook
                            excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName], {defval: ""});

                        });

                        //changed 7/2/2021

                        that.getView().getModel("itemModel").setData(excelData);
                        that.getView().getModel("itemModel").refresh(true);
                        that.generateTable();

                        // Setting the data to the local model 
                        // that.localModel.setData({
                        //     items: excelData
                        // });
                        // that.localModel.refresh(true);
                    };
                    reader.onerror = function (ex) {
                        console.log(ex);
                    };
                    reader.readAsBinaryString(file);
                }
            },

            generateTable: function(){
                var that = this;
                var oTable = that.getView().byId("oTable");
                var oModel = that.getView().getModel("itemModel");
                var oModelData = oModel.getProperty("/");
                var oColumns = Object.keys(oModelData[0]);
                var oColumnNames = [];
                $.each(oColumns, function (i, value) {
                    oColumnNames.push({
                        Text: oColumns[i]
                    });
                });
                var columnmodel = that.getView().getModel("columnModel");
                columnmodel.setProperty("/", oColumnNames);
                var oTemplate = new Column({
                    header: new Label({
                        text: "{columnModel>Text}"
                    })
                });
                oTable.bindAggregation("columns", "columnModel>/", oTemplate);
                var oItemTemplate = new ColumnListItem();
                var oTableHeaders = oTable.getColumns();
                $.each(oTableHeaders, function (j, value) {
                    var oHeaderName = oTableHeaders[j].getHeader().getText();
                    oItemTemplate.addCell(new Text({
                        text: "{itemModel>" + oHeaderName + "}"
                    }));
                });
                oTable.bindAggregation("items", {
                    path: "itemModel>/",
                    template: oItemTemplate
                });

            }

        });
    });
