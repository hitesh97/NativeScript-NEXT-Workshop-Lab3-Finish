//---MODULE IMPORTS---//
var imageManipulation = require("../image-manipulation/image-manipulation");
var localStorage = require("../../shared/local-storage/local-storage");
var socialShare = require("../social-share/social-share");
var utilities = require("../../shared/utilities");
var dialogsModule = require("ui/dialogs");
var analyticsMonitor = require("../../shared/analytics");

var observable = require("data/observable");
var viewModel = new observable.Observable();

//--- VIEW MODEL METHOD PLACEHOLDERS ---//
//Prepare New Meme  
viewModel.prepareNewMeme = function(selectedImage) {
	this.selectedImage = selectedImage;

	this.set("topText", "");
	this.set("bottomText", "");
	this.set("fontSize", 40);
	this.set("isBlackText", false);
	this.set("memeImage", selectedImage);

	this.uniqueImageName = utilities.generateUUID() + ".png";
};

//Refresh Meme
viewModel.refreshMeme = function () {
	try {
		var image = imageManipulation.addText(viewModel.selectedImage, viewModel.topText, viewModel.bottomText, viewModel.fontSize, viewModel.isBlackText);
		viewModel.set("memeImage", image);
	} catch (exception) {
		analyticsMonitor.trackException(exception, 'Failed Refreshing Meme Image');
	}
};

//Save Locally
viewModel.saveLocally = function() {
	analyticsMonitor.trackFeature("CreateMeme.SaveLocally");
	this.refreshMeme();
	var saved = localStorage.saveLocally(this.uniqueImageName, this.memeImage);

	if (!saved) {
		console.log("New meme not saved....");
	} else {
		var options = {
			title: "Meme Saved",
			message: "Congratulations, Meme Saved!",
			okButtonText: "OK"
		};

		dialogsModule.alert(options);
	}
}

//Share
viewModel.share = function() {
	analyticsMonitor.trackFeature("CreateMeme.Share");
	socialShare.share(this.memeImage);
}

//---EVENT HANDLER---//
viewModel.addEventListener(observable.Observable.propertyChangeEvent, function(changes) {
	//skip if memeImage changes
	if (changes.propertyName === "memeImage") {
		return;
	}
	
	//Call refresh meme, but make sure it doesn't get called more often than every 200ms
	viewModel.refreshMeme();
});

//This is how to expose the viewModel in the module
exports.viewModel = viewModel;