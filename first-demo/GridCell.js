var GridCell = Class.extend({
	// Class constructor
    init: function (mesh) {
    	this.mesh = mesh;
    },

    getGrayness: function() {
    	return 3.0;
    },

    onMouseOver: function(scope) {
    	// console.log("mouse over");
    	this.mesh.material.color.setRGB(1.0, 0, 0);
    }
});

var TileFactory = Class.extend({
	init: function(tileSize) {
		this.tileGeom = new THREE.PlaneGeometry(tileSize, tileSize);
	}, 

	createTile: function() {
		var grayness = Math.random() * 0.5 + 0.25;
		var mat = new THREE.MeshBasicMaterial({overdraw: true});
		mat.color.setRGB( grayness, grayness, grayness );
		var tile = new THREE.Mesh(this.tileGeom, mat);
		tile.grayness = grayness;

		var gridCell = new GridCell(tile);
		_.extend(tile, gridCell);

		return tile;
	}

});