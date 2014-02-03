var BlitzLoader = Class.extend({
	init: function() {
		this.DEFAULT_PATH = "blendermodels/"

		this.loader = new THREE.JSONLoader();
	},

	loadFile: function(filename, onLoad) {
		var scope = this;

		var fullFilename = this.DEFAULT_PATH + filename;

		this.loader.load(fullFilename, function(geometry, materials) {
		    // scope.handle(geometry, materials);
			var combinedMaterials = new THREE.MeshFaceMaterial(materials);
			mesh = new THREE.Mesh(geometry, combinedMaterials);

			onLoad(mesh);
		});
	},


});