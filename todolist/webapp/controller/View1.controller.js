sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/DisplayListItem"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, DisplayListItem) {
        "use strict";

        var aTasks = {};
        // var notes ;

        return Controller.extend("todolist.controller.View1", {
            onInit: function () {
                
                this._loadTasks();
			    this._populateList();

                // notes = this.byId("textarea");               
                // notes.setEnabled(false);
            },

            tabSelected: function (oEvt){
                var oLabel = this.byId('labelId');
			    var oTab = oEvt.getParameter('item');
                var sFilterId = oEvt.getParameter("selectedKey");
			    switch (sFilterId) {
				case "notes":
                    // notes.setEnabled(true);
					// notes.setValue("//write your notes here");
					break;
				case "todo":
                    // notes.setEnabled(false);
					break;
				default:
					// notes.setValue();
					break;
			}
            },

            onLiveChangeAddTask: function (oEvent) {
                var oButtonAddTask = this.getView().byId("buttonAddTask");
                oButtonAddTask.setEnabled(!!oEvent.getParameter("value"));
                
            },
            
            onPressAddTask: function (oEvent) {
                var oInputAddTask = this.getView().byId("inputAddTask");
                var oButtonAddTask = this.getView().byId("buttonAddTask");
                
                var sTaskDescription = oInputAddTask.getValue();
                
                if (sTaskDescription) {
                    var task = this._addTask(sTaskDescription);
                    
                    this._createListItem(task);
                    oInputAddTask.setValue("");
                    
                    oButtonAddTask.setEnabled(false);
                }
            },
            
            onDeleteItem: function (oEvent) {
                this._deleteListItem(oEvent.getParameter("listItem"));
            },
            _addTask: function (sTaskDescription) {
                var id = Date.now();
                aTasks[id] = {id: id, t: sTaskDescription};
                
                this._saveTasks();
                return aTasks[id];
            },
            
            _deleteTask: function (id) {
                delete aTasks[id];
                this._saveTasks();
            },
            
            _loadTasks: function() {
                var json = localStorage.getItem("tasks");
                
                try {
                    aTasks = JSON.parse(json) || {};
                } catch (e) {
                    jQuery.sap.log.error(e.message);
                }
            },
            
            _saveTasks: function() {
                localStorage.setItem("tasks", JSON.stringify(aTasks));
            },
            _populateList: function() {
                for (var id in aTasks) {
                    this._createListItem(aTasks[id]);
                }
            },
            
            _createListItem: function(mTask) {
                var oListTodo = this.getView().byId("listTodo");
                
                var listItem = new DisplayListItem({label: mTask.t}).data("id", mTask.id);
                
                oListTodo.addAggregation("items", listItem);
            },
            
            _deleteListItem: function (oListItem) {
                var oListTodo = this.getView().byId("listTodo");
                var id = oListItem.data("id");
                
                oListTodo.removeAggregation("items", oListItem);
                this._deleteTask(id);
                this._addToTaskDone(id); // added new
            },

            //added new
            _addToTaskDone:function(sTaskDescription){
                var task = this._addTask(sTaskDescription);
                    
                this._createListItemDone(task);
            },

            _createListItemDone: function(mTask) {
                var oListDone = this.getView().byId("listDone");
                
                var listItem = new DisplayListItem({label: mTask.t}).data("id", mTask.id);
                
                oListDone.addAggregation("items", listItem);
            }
        });
    });
