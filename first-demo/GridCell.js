var GridCell = Class.extend({
    // Class constructor
    init: function(world, tileMesh, grayness, xPos, zPos) {
        this.world = world;
        this.tileMesh = tileMesh;
        this.xPos = xPos;
        this.zPos = zPos;
        this.grayness = grayness;

        this.isSelectable = false;
        this.isMovable = false;

        this.hasObstacle = false;
        this.hasCharacter = false;
    },

    getTileMesh: function() {
        return this.tileMesh;
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
        this.tileMesh.material.color.setRGB(this.grayness, this.grayness, this.grayness);
        this.isSelectable = false;
        this.isMovable = false;
        this.tileMesh.visible = false;
    },

    markAsNotSelected: function() {
        if (this.isMovable) {
            this.highlight("GREEN");
        }
    },

    highlight: function(color) {

        this.tileMesh.visible = true;
        this.tileMesh.material.opacity = 0.3;
        var rgb;
        switch (color) {
            case "GREEN":
                rgb = [0, 1.0, 0];
                break;
            case "YELLOW":
                rgb = [3.0, 3.0, 0];
                break;
            case "RED": 
                rgb = [1.0, 0, 0];
                break;
            default:
                console.log("Invalid color specified");
                break;
        }

        this.tileMesh.material.color.setRGB(rgb[0], rgb[1], rgb[2]);
    },

    setSelectable: function(isSelectable) {
        this.isSelectable = isSelectable;
    },

    setMovable: function(isMovable) {
        this.isMovable = isMovable;
    },

    onMouseOver: function(scope) {
        if (this.isSelectable) {
            this.highlight("RED");
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
            this.highlight("GREEN");
        }
    },

    markAsRoadMap: function() {
        this.highlight("YELLOW");
    }
});

var TileFactory = Class.extend({
    init: function(world, tileSize) {
        this.tileGeom = new THREE.PlaneGeometry(tileSize, tileSize);
        this.world = world;
    },

    createTile: function(xPos, zPos) {

        var mat = new THREE.MeshLambertMaterial({
            overdraw: true,
            transparent: true
        });

        var grayness = Math.random() * 0.5 + 0.25;
        mat.color.setRGB(grayness, grayness, grayness);

        var tile = new THREE.Mesh(this.tileGeom, mat);

        var gridCell = new GridCell(this.world, tile, grayness, xPos, zPos);
        tile.owner = gridCell;

        var tileMesh = gridCell.getTileMesh();

        tileMesh.position.x = this.world.convertXPosToWorldX(xPos);
        tileMesh.position.y = 0;
        tileMesh.position.z = this.world.convertZPosToWorldZ(zPos);
        tileMesh.rotation.x = -0.5 * Math.PI;

        tileMesh.visible = false;

        return gridCell;
    }

});