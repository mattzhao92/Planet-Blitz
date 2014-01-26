/* 
 * Grid
 * constructor input args : {d_x, d_y, square_size}
 */
var Grid = Class.extend({
    // Class constructor
    init: function(width, length, tileSize, scene, camera) {
        'use strict';

        this.gridWidth = width;
        this.gridLength = length;
        this.tileSize = tileSize;
        this.scene = scene;
        this.camera = camera;

        // create grid tiles
        this.tiles = new THREE.Object3D();
        this.tilesArray = null;
        
        this.drawGridSquares(width, length, tileSize);

        // initialize characters
        this.characters = new THREE.Object3D();
        this.numOfCharacters = 3;
        this.charactersOnMap = [];

        this.characterFactory = new CharacterFactory();

        var scope = this;
        for (var i = 0; i < this.numOfCharacters; i++) {

            var charArgs = {
                world: scope
            };

            var character = this.characterFactory.createCharacter(charArgs);
            character.placeAtGridPos(i + 3, 4);
            this.charactersOnMap.push(character);

            this.scene.add(character);
        }

        this.characterBeingSelected = null;

        this.setControls();
        this.setupMouseMoveListener();
        this.setupMouseDownListener();
    },

    convertXPosToWorldX: function(tileXPos) {
        return -((this.gridWidth)/2) + (tileXPos * this.tileSize);
    },

    convertZPosToWorldZ: function(tileZPos) {
        return -((this.gridLength/2)) + (tileZPos * this.tileSize);
    },

    markCharacterAsSelected: function(character) {
        // deselect previous character if there was one
        if (this.characterBeingSelected) {
            this.characterBeingSelected.deselect();
        }

        this.characterBeingSelected = character;

        // show character movement speed
        this.displayMovementArea(character);
    },

    displayMovementArea: function(character) {
        var characterMovementRange = character.getMovementRange();

        // highlight adjacent squares - collect all tiles from radius
        var tilesToHighlight = this.getTilesInArea(character.getTileXPos(), character.getTileZPos(), characterMovementRange);

        tilesToHighlight.forEach(function(tile) {
            tile.markAsMovable();
        });
    },

    getTilesInArea: function(originTileXPos, originTileZPos, radius) {

        // return some collection of tiles
        var tiles = [this.getTileAtTilePos(0, 1), this.getTileAtTilePos(0, 2), this.getTileAtTilePos(0, 3)];
        return tiles;
    },

    deselectAll: function() {
        this.charactersOnMap.forEach(function(character) {
            character.deselect();
        });
    },

    setupMouseMoveListener: function() {
        var scope = this;

        window.addEventListener('mousemove', function(event) {
            scope.onMouseMove(event);
        }, false);
    },

    setupMouseDownListener: function() {
        var scope = this;

        window.addEventListener('mousedown', function(event) {
            scope.onMouseDown(event);
        }, false);
    },

    onMouseMove: function(event) {
        var scope = this;

        var projector = new THREE.Projector();
        var mouseVector = new THREE.Vector3();

        mouseVector.x = 2 * (event.clientX / window.innerWidth) - 1;
        mouseVector.y = 1 - 2 * (event.clientY / window.innerHeight);

        var raycaster = projector.pickingRay(mouseVector.clone(), scope.camera),
            intersects = raycaster.intersectObjects(scope.tiles.children);

        scope.tiles.children.forEach(function(tile) {
            tile.material.color.setRGB(tile.grayness, tile.grayness, tile.grayness);
        });

        for (var i = 0; i < intersects.length; i++) {
            var intersection = intersects[i],
                obj = intersection.object;

            obj.onMouseOver();
        }
    },

    getTileAtTilePos: function(xPos, zPos) {
        // TODO: better error handling here?
        if (xPos < 0 || zPos < 0) {
            return null;
        }
        if (xPos >= this.numberSquaresOnXAxis || zPos >= this.numberSquaresOnZAxis) {
            return null;
        }

        return this.tilesArray[xPos][zPos];
    },

    drawGridSquares: function(width, length, size) {
        this.tileFactory = new TileFactory(size);

        this.numberSquaresOnXAxis = width / size;
        this.numberSquaresOnZAxis = length / size;

        this.tilesArray = new Array(this.numberSquaresOnXAxis);
        for (var i = 0; i < this.numberSquaresOnXAxis; i++) {
            this.tilesArray[i] = new Array(this.numberSquaresOnZAxis);
        }

        for (var i = 0; i < this.numberSquaresOnXAxis; i++) {
            for (var j = 0; j < this.numberSquaresOnZAxis; j++) {
                var tile = this.tileFactory.createTile(i, j);

                tile.position.x = this.convertXPosToWorldX(i);
                tile.position.y = 0;
                tile.position.z = this.convertZPosToWorldZ(j);
                tile.rotation.x = -0.5 * Math.PI;

                this.tilesArray[i][j] = tile;

                this.tiles.add(tile);
            }
        }

        this.scene.add(this.tiles);
    },

    getNumberSquaresOnXAxis: function() {
        return this.numberSquaresOnXAxis;
    },

    getNumberSquaresOnZAxis: function() {
        return this.numberSquaresOnZAxis;
    },


    hasObstacleAtCell: function(args) {

    },

    hasCharacterAtCell: function(args) {

    },

    isCellOutOfBounds: function(args) {

    },

    motion: function(args) {
        for (var i = 0; i < this.charactersOnMap.length; i++) {
            var character = this.charactersOnMap[i];
            character.dequeueMotion();
        }
    },

    onMouseDown: function(event) {
        var scope = this;

        var projector = new THREE.Projector();
        var mouseVector = new THREE.Vector3();

        mouseVector.x = 2 * (event.clientX / window.innerWidth) - 1;
        mouseVector.y = 1 - 2 * (event.clientY / window.innerHeight);

        var raycaster = projector.pickingRay(mouseVector.clone(), scope.camera);

        // recursively call intersects
        var intersects = raycaster.intersectObjects(scope.charactersOnMap, true);

        console.log("intersect length is  " + intersects.length + "  " + scope.charactersOnMap);
        if (intersects.length > 0) {
            var firstIntersect = intersects[0];
            firstIntersect.object.onSelect(scope);
        }
    },

    // Event handlers
    setControls: function() {
        'use strict';
        // Within jQuery's methods, we won't be able to access "this"
        var scope = this;
        var user = this.characterBeingSelected;
        var controls = {
            left: false,
            up: false,
            right: false,
            down: false
        };
        // When the user presses a key 
        jQuery(document).keydown(function(e) {
            var prevent = true;
            // Update the state of the attached control to "true"
            switch (e.keyCode) {
                case 37:
                    controls.right = true;
                    break;
                case 38:
                    controls.down = true;
                    break;
                case 39:
                    controls.left = true;
                    break;
                case 40:
                    controls.up = true;
                    break;
                default:
                    prevent = false;
            }
            // Avoid the browser to react unexpectedly
            if (prevent) {
                e.preventDefault();
            } else {
                return;
            }
            // Update the character's direction
            if (scope.characterBeingSelected) {
                console.log("enqueueMotion ---------- ");
                scope.characterBeingSelected.enqueueMotion();
                scope.characterBeingSelected.setDirection(controls);
            }
        });
        // When the user releases a key
        jQuery(document).keyup(function(e) {
            var prevent = true;
            // Update the state of the attached control to "false"
            switch (e.keyCode) {
                case 37:
                    controls.right = false;
                    break;
                case 38:
                controls.down = false;
                break;
                case 39:
                    controls.left = false;
                    break;
                case 40:
                    controls.up = false;
                    break;
                default:
                    prevent = false;
            }
            // Avoid the browser to react unexpectedly
            if (prevent) {
                e.preventDefault();
            } else {
                return;
            }
            // Update the character's direction
            if (user) {
                user.setDirection(controls);
            }
        });
    // On resize
    jQuery(window).resize(function() {
        // Redefine the size of the renderer
        //basicScene.setAspect();
    });

},


});