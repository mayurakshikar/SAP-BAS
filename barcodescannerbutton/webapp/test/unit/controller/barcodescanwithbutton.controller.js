/*global QUnit*/

sap.ui.define([
	"ns/barcodescannerbutton/controller/barcodescanwithbutton.controller"
], function (Controller) {
	"use strict";

	QUnit.module("barcodescanwithbutton Controller");

	QUnit.test("I should test the barcodescanwithbutton controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
