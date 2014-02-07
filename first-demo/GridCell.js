var GridCell = Class.extend({
    // Class constructor
    init: function(world, mesh, grayness, xPos, zPos) {
        this.world = world;
        this.mesh = mesh;
        this.xPos = xPos;
        this.zPos = zPos;
        this.grayness = grayness;

        this.isSelectable = false;
        this.isMovable = false;

        this.hasObstacle = false;
        this.hasCharacter = false;
    },

    isObstacle: function() {
        return this.hasObstacle;
    },

    isCharacter: function() {
        return this.hasCharacter;
    },

    setHasCharacter: function(hasCharacterOnMe) {
        this.hasCharacter = hasCharacterOnMe;
    },

    getGrayness: function() {
        return this.grayness;
    },

    reset: function() {
        // reset color
        // this.mesh.material.color.setRGB(1, 1, 1);
        this.mesh.material.color.setRGB(this.grayness, this.grayness, this.grayness);
        this.isSelectable = false;
        this.isMovable = false;
    },

    markAsNotSelected: function() {
        if (this.isMovable) {
            this.mesh.material.color.setRGB(0, 1.0, 0);
        }
    },

    setSelectable: function(isSelectable) {
        this.isSelectable = isSelectable;
    },

    setMovable: function(isMovable) {
        this.isMovable = isMovable;
    },

    onMouseOver: function(scope) {
        if (this.isSelectable) {
            // console.log("mouse over");
            this.mesh.material.color.setRGB(1.0, 0, 0);
            this.world.markTileAsSelected(this);
            return {
                x: this.xPos,
                z: this.zPos
            };
        }
        return null;
    },

    markAsMovable: function() {
        if (this.isMovable) {
            this.mesh.material.color.setRGB(0, 1.0, 0);
        }
    },

    markAsRoadMap: function() {
        if (this.isMovable) {
            this.mesh.material.color.setRGB(3.0, 3.0, 0);
        }
    }
});

var TileFactory = Class.extend({
    init: function(world, tileSize) {
        this.tileGeom = new THREE.PlaneGeometry(tileSize, tileSize);
        this.world = world;
    },

    createTile: function(xPos, zPos) {

        var mat = new THREE.MeshLambertMaterial({
            overdraw: true
        });

        var grayness = Math.random() * 0.5 + 0.25;
        mat.color.setRGB(grayness, grayness, grayness);

        var tile = new THREE.Mesh(this.tileGeom, mat);

        var gridCell = new GridCell(this.world, tile, grayness, xPos, zPos);
        tile.owner = gridCell;

        return gridCell;
    }

});