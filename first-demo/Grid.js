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

        // information about what's being selected
        this.highlightedTiles = null;
        this.currentMouseOverTile = null;
        this.characterBeingSelected = null;

        // create grid tiles
        this.tiles = new THREE.Object3D();
        this.tilesArray = null;

        this.drawGridSquares(width, length, tileSize);

        // initialize characters
        this.characters = new THREE.Object3D();
        this.numOfCharacters = 3;
        this.charactersOnMap = [];
        this.characterMeshes = [];

        this.characterFactory = new CharacterFactory();

        var scope = this;
        for (var i = 0; i < this.numOfCharacters; i++) {

            var charArgs = {
                world: scope
            };

            var character = this.characterFactory.createCharacter(charArgs);
            character.placeAtGridPos(i + 3, 4);
            this.markTileOccupiedByCharacter(i + 3, 4);

            this.charactersOnMap.push(character);
            this.characterMeshes.push(character.mesh);
            
            this.scene.add(character.mesh);
        }

        this.setControls();
        this.setupMouseMoveListener();
        this.setupMouseDownListener();
    },

    disableMouseMoveListener: function() {
        this.mouseMoveListenerActive = false;
    },

    enableMouseMoveListener: function() {
        this.mouseMoveListenerActive = true;
    },

    convertXPosToWorldX: function(tileXPos) {
        return -((this.gridWidth) / 2) + (tileXPos * this.tileSize);
    },

    convertZPosToWorldZ: function(tileZPos) {
        return -((this.gridLength / 2)) + (tileZPos * this.tileSize);
    },


    markCharacterAsSelected: function(character) {
        // deselect previous character if there was one
        if (this.characterBeingSelected) {
            if (this.characterBeingSelected != character) {
                this.characterBeingSelected.deselect();
            }
        }

        this.characterBeingSelected = character;

        // show character movement speed
        this.displayMovementArea(character);
    },

    markTileAsSelected: function(tile) {
        if (tile == this.currentMouseOverTile) {
            return;
        }

        if (this.currentMouseOverTile) {
            this.currentMouseOverTile.markAsNotSelected();
        }

        this.currentMouseOverTile = tile;
    },

    markTileOccupiedByCharacter: function(xPos, zPos) {
        var tile = this.getTileAtTilePos(xPos, zPos);
        if (tile) {
            tile.hasCharacter = true;
        }
    },

    markTileNotOccupiedByCharacter: function(xPos, zPos) {
        var tile = this.getTileAtTilePos(xPos, zPos);
        if (tile) {
            tile.hasCharacter = false;
        }
    },

    markTileOccupiedByObstacle: function() {

    },

    displayMovementArea: function(character) {
        // deselect any previously highlighted tiles
        if (this.currentMouseOverTile) {
            this.currentMouseOverTile.reset();
        }

        var characterMovementRange = character.getMovementRange();
        console.log("character movement range " + characterMovementRange);

        // console.log(character.getTileXPos() + " " + character.getTileZPos());
        console.log(character.xPos + " " + character.zPos);

        // highlight adjacent squares - collect all tiles from radius
        var tilesToHighlight = this.getTilesInArea(character, characterMovementRange);

        if (this.highlightedTiles) {
            this.highlightedTiles.forEach(function(tile) {
                tile.reset();
            });
        }

        tilesToHighlight.forEach(function(tile) {
            tile.markAsMovable();
            tile.setSelectable(true);
        });

        this.highlightedTiles = tilesToHighlight;
    },

    getTilesInArea: function(character, radius) {
        // DO A BFS here
        var tilesToHighlight = [];
        var startTile = this.getTileAtTilePos(character.getTileXPos(), character.getTileZPos());
        if (!startTile) return tilesToHighlight;

        startTile.isObstacle();
        var visited = new Array();
        var nodesInCurrentLevel = new Array();
        var nodesInNextLevel = new Array();
        tilesToHighlight.push(startTile);
        nodesInCurrentLevel.push(startTile);

        while (nodesInCurrentLevel.length > 0 && radius > 0) {
            var currentTile = nodesInCurrentLevel.pop();
            console.log("currentTile x:" + currentTile.xPos + " z:" + currentTile.zPos);

            var validNeighbors = this.getNeighborTiles(currentTile.xPos, currentTile.zPos);
            for (var i = 0; i < validNeighbors.length; i++) {
                var neighbor = validNeighbors[i];
                if (_.indexOf(visited, neighbor) == -1 && _.indexOf(nodesInNextLevel, neighbor)) {
                    console.log("print here 111 \n");
                    tilesToHighlight.push(neighbor);
                    nodesInNextLevel.push(neighbor);
                } else {
                    console.log("print here 222 \n");
                }
            }

            if (nodesInCurrentLevel.length == 0) {
                console.log("--------------------nodesInNextLevel   " + nodesInNextLevel);
                nodesInCurrentLevel = nodesInNextLevel;
                nodesInNextLevel = new Array();
                radius = radius - 1;
            }
            visited.push(currentTile);
        }

        return tilesToHighlight;
    },

    getNeighborTiles: function(originTileXPos, originTileZPos) {
        var tiles = [];

        tiles.push(this.getTileAtTilePos(originTileXPos - 1, originTileZPos));
        tiles.push(this.getTileAtTilePos(originTileXPos + 1, originTileZPos));
        tiles.push(this.getTileAtTilePos(originTileXPos, originTileZPos - 1));
        tiles.push(this.getTileAtTilePos(originTileXPos, originTileZPos + 1));

        tiles = _.filter(tiles, function(tile) {
            return (tile != null && !tile.isObstacle() && !tile.isCharacter());
        });

        console.log("length of neighbors 222 " + tiles.length);

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

    onMouseMove: function(event) {
        if (this.mouseMoveListenerActive == false) {
            return;
        }

        var scope = this;

        var projector = new THREE.Projector();
        var mouseVector = new THREE.Vector3();

        mouseVector.x = 2 * (event.clientX / window.innerWidth) - 1;
        mouseVector.y = 1 - 2 * (event.clientY / window.innerHeight);

        var raycaster = projector.pickingRay(mouseVector.clone(), scope.camera),
            intersects = raycaster.intersectObjects(scope.tiles.children);

        for (var i = 0; i < intersects.length; i++) {
            var intersection = intersects[i],
                obj = intersection.object.owner;

            obj.onMouseOver();
        }
    },

    setupMouseDownListener: function() {
        var scope = this;

        window.addEventListener('mousedown', function(event) {
            scope.onMouseDown(event);
        }, false);
    },

    onMouseDown: function(event) {
        var scope = this;

        var projector = new THREE.Projector();
        var mouseVector = new THREE.Vector3();

        mouseVector.x = 2 * (event.clientX / window.innerWidth) - 1;
        mouseVector.y = 1 - 2 * (event.clientY / window.innerHeight);

        var raycaster = projector.pickingRay(mouseVector.clone(), scope.camera);

        // recursively call intersects
        var intersects = raycaster.intersectObjects(scope.characterMeshes, true);
        var intersectsWithTiles = raycaster.intersectObjects(scope.tiles.children);

        // care about characters first, then tile intersects

        // needed so that you can't click on a character and have that result in an immediate movement
        // is there a better pattern for this - chain of event handlers?
        var continueHandlingIntersects = false;

        if (intersects.length > 0) {
            var clickedObject = intersects[0].object.owner;
            clickedObject.onSelect(scope);
        } else {
            continueHandlingIntersects = true;
        }

        if (continueHandlingIntersects) {
            if (intersectsWithTiles.length > 0) {
                var tileSelected = intersectsWithTiles[0].object.owner;
                var coordinate = tileSelected.onMouseOver();
                if (this.characterBeingSelected && coordinate) {
                    this.characterBeingSelected.setDirection(
                        new THREE.Vector3(coordinate.x - this.characterBeingSelected.getTileXPos(),
                            0,
                            coordinate.z - this.characterBeingSelected.getTileZPos()));
                    this.disableMouseMoveListener();

                    this.characterBeingSelected.enqueueMotion(function() {
                        console.log("Motion finished");
                        scope.enableMouseMoveListener();
                    });
                    // console.log("character is being moved to a new coordinate position \n");
                    // console.log("src X: "+this.characterBeingSelected.getTileXPos() +
                    //             " Z: "+ this.characterBeingSelected.getTileZPos());
                    // console.log("des X: "+coordinate.x +" Z: "+coordinate.z);
                }
            }
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
        this.tileFactory = new TileFactory(this, size);

        this.numberSquaresOnXAxis = width / size;
        this.numberSquaresOnZAxis = length / size;

        this.tilesArray = new Array(this.numberSquaresOnXAxis);
        for (var i = 0; i < this.numberSquaresOnXAxis; i++) {
            this.tilesArray[i] = new Array(this.numberSquaresOnZAxis);
        }

        for (var i = 0; i < this.numberSquaresOnXAxis; i++) {
            for (var j = 0; j < this.numberSquaresOnZAxis; j++) {
                var tile = this.tileFactory.createTile(i, j);

                var tileMesh = tile.mesh;

                tileMesh.position.x = this.convertXPosToWorldX(i);
                tileMesh.position.y = 0;
                tileMesh.position.z = this.convertZPosToWorldZ(j);
                tileMesh.rotation.x = -0.5 * Math.PI;

                this.tilesArray[i][j] = tile;

                this.tiles.add(tileMesh);
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
            character.dequeueMotion(this);
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
                scope.characterBeingSelected.setDirectionWithControl(controls);
                scope.characterBeingSelected.enqueueMotion();
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
                user.setDirectionWithControl(controls);
            }
        });
    },


});