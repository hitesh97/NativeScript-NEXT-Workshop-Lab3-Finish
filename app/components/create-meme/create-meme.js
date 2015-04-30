var createMemeViewModel = require("./view-model").viewModel;

var _page;

exports.loaded = function(args) {
	_page = args.object;
	_page.bindingContext = createMemeViewModel;
};

exports.navigatedTo = function(args) {
	//grab the image from the navigation context.
	var selectedImage = _page.navigationContext;
	createMemeViewModel.prepareNewMeme(selectedImage);
};