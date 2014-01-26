var GridCell = Class.extend({
	// Class constructor
    init: function (mesh, xPos, zPos) {
    	this.mesh = mesh;
    	this.xPos = xPos;
    	this.zPos = zPos;
    	this.isSelectable = false;
    },

    getGrayness: function() {
    	return 3.0;
    },

    setSelectable: function(isSelectable) {
    	this.isSelectable = isSelectable;
    },

    onMouseOver: function(scope) {
    	if (this.isSelectable) {
	    	// console.log("mouse over");
	    	this.mesh.material.color.setRGB(1.0, 0, 0);
	    	console.log(this.xPos + " " + this.zPos);
    	}
    },

    markAsMovable: function() {
    	this.mesh.material.color.setRGB(0, 1.0, 0);
    }
});

var TileFactory = Class.extend({
	init: function(tileSize) {
		this.tileGeom = new THREE.PlaneGeometry(tileSize, tileSize);
	}, 

	createTile: function(xPos, zPos) {

		var mat = new THREE.MeshBasicMaterial({overdraw: true});

		var grayness = Math.random() * 0.5 + 0.25;
		mat.color.setRGB( grayness, grayness, grayness );

		var tile = new THREE.Mesh(this.tileGeom, mat);
		tile.grayness = grayness;

		var gridCell = new GridCell(tile, xPos, zPos);
		_.extend(tile, gridCell);

		return tile;
	}

});