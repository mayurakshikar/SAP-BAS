sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Column",
    "sap/m/Label",
    "sap/m/ColumnListItem",
    "sap/m/Text"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Column, Label, ColumnListItem, Text) {
        "use strict";

        return Controller.extend("ns.uploadsitedata.controller.View", {
            onInit: function () {
                var that = this;
                var oModel = new JSONModel();
                that.getView().setModel(oModel);

                var sampleModel = new sap.ui.model.json.JSONModel();
                that.getView().setModel(sampleModel, "sampleModel");

                var columnModel = new JSONModel();
                that.getView().setModel(columnModel, "columnModel");
            },

            onhandleUpload: function (oEvent) {
                var that = this;
                var oFileUploader = that.getView().byId("FileUploaderid");
                var oFile = oFileUploader.getFocusDomRef().files[0];
                //To check the File type of uploaded File.
                // if (oFile.type === "application/vnd.ms-excel") {
                    //To call the CSV File Function
                //     that.typeCsv();
                // }
                // else {
                    
                //To call the XLSX File Function
                    that.typeXLSX();
                    
                // }
            },


            typeXLSX: function () {
                var that = this;
                var oFileUploader = that.getView().byId("FileUploaderid");
                var file = oFileUploader.getFocusDomRef().files[0];
                var excelData = {};
                if (file && window.FileReader) {
                    var reader = new FileReader();
                    reader.onload = function (evt) {
                        var data = evt.target.result;
                        var workbook = XLSX.read(data, {
                            type: 'binary'
                        });
                        workbook.SheetNames.forEach(function (sheetName) {
                            excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName],{defval: ""});
                        });
                        that.getView().getModel("sampleModel").setData(excelData);
                        that.getView().getModel("sampleModel").refresh(true);
                        that.generateTablexlsx();
                    };
                    reader.onerror = function (ex) {
                        console.log(ex);
                    };
                    reader.readAsBinaryString(file);
                }
                this.getView().byId("FileUploaderid").clear();
            },
            /*Function to create the table Dynamically for xlsx file*/
            generateTablexlsx: function () {
                var that = this;
                var oTable = that.getView().byId("Tableid");
                var oModel = that.getView().getModel("sampleModel");
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
                        text: "{sampleModel>" + oHeaderName + "}"
                    }));
                });
                oTable.bindAggregation("items", {
                    path: "sampleModel>/",
                    template: oItemTemplate
                });

                
            }

        });
    });
