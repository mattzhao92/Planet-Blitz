var GridCell = Class.extend({
    // Class constructor
    init: function(model, tileMesh, xPos, zPos) {
        this.model = model;
        this.tileMesh = tileMesh;
        this.xPos = xPos;
        this.zPos = zPos;
        this.hasCharacter = false;
        this.hasObstacle = false;

        this.isSelectable = false;
        this.isMovable = false;

        this.unit = null;
        this.obstacle = null;
        this.highlight("GREEN");
    },

    toJson: function(unit) {
        if (unit == null)
            unit = this;
        exportObject = {'xPos': unit.color,
                        'zPos': unit.teamId,
                        'hasCharacter': this.hasCharacter,
                        'hasObstacle':  this.hasObstacle
        };
        return JSON.stringify(exportObject);
    },

    getXPos: function() {
    	return this.xPos;
    },

    getZPos: function() {
    	return this.zPos;
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

    reset: function() {
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
        this.tileMesh.material.opacity = 0.35;
        var rgb;

        if (color.indexOf("0x") == 0) {
            this.tileMesh.material.color.setHex(color);
        } else {
            switch (color) {
                case "GREEN":
                    rgb = [0.1, 1.0, 0.1];
                    break;
                case "YELLOW":
                    rgb = [3.0, 3.0, 0];
                    break;
                case "RED": 
                    rgb = [1.0, 0, 0];
                    break;
                default:
                    
                    break;
            }
            this.tileMesh.material.color.setRGB(rgb[0], rgb[1], rgb[2]);
        }
    },

    onPlaceUnit: function(unit, callback) {
        if (this.hasCharacter == false && this.hasObstacle == false) {
            this.highlight(unit.getUnitColor());
            this.hasCharacter = true;
            this.unit = unit;
            if (callback)
            	callback();
        }
    },


    onPlaceObstacle: function(obstacle, callback) {
        if (this.hasCharacter == false && this.hasObstacle == false) {
            this.highlight('0xffffff');
            this.hasObstacle = true;
            this.obstacle = obstacle;
            if (callback)
            	callback();
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
            // this.highlight("RED");
            this.highlight("YELLOW");
            this.model.markTileAsSelected(this);
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
    init: function(model) {
        this.map_tileSize = model.getTileSize();
        this.map_width = model.getWidth();
        this.map_height = model.getHeight();
        this.tileGeom = new THREE.PlaneGeometry(this.map_tileSize, this.map_tileSize);
        this.model = model;
    },

    createTile: function(xPos, zPos) {
        var mat = new THREE.MeshLambertMaterial({
            overdraw: true,
            transparent: true
        });

        var tile = new THREE.Mesh(this.tileGeom, mat);

        var gridCell = new GridCell(this.model, tile, xPos, zPos);
        tile.owner = gridCell;

        var tileMesh = gridCell.getTileMesh();

        tileMesh.position.x = this.model.convertXPosToWorldX(xPos);
        tileMesh.position.y = 0;
        tileMesh.position.z = this.model.convertZPosToWorldZ(zPos);
        tileMesh.rotation.x = -0.5 * Math.PI;
        tileMesh.visible = true;

        return gridCell;
    }

});
