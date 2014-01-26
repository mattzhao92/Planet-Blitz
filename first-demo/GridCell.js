var GridCell = Class.extend({
	// Class constructor
    init: function (mesh, grayness, xPos, zPos) {
    	this.mesh = mesh;
    	this.xPos = xPos;
    	this.zPos = zPos;
    	this.grayness = grayness;
    	this.isSelectable = false;
    },

    getGrayness: function() {
    	return 3.0;
    },

    reset: function() {
    	// reset color
    	// this.mesh.material.color.setRGB(1, 1, 1);
    	this.mesh.material.color.setRGB(this.grayness, this.grayness, this.grayness);
  		this.isSelectable = false;
    },

    setSelectable: function(isSelectable) {
    	this.isSelectable = isSelectable;
    },

    onMouseOver: function(scope) {
    	if (this.isSelectable) {
	    	// console.log("mouse over");
	    	this.mesh.material.color.setRGB(1.0, 0, 0);
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

		var gridCell = new GridCell(tile, grayness, xPos, zPos);
		_.extend(tile, gridCell);

		return tile;
	}

});