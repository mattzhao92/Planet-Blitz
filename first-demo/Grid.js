/* Game world */
var Grid = Class.extend({
    // Class constructor
    init: function(gameApp, width, length, tileSize, scene, camera, controls) {
        'use strict';

        this.gameApp = gameApp;

        this.GROUND_TEXTURE = "images/Supernova.jpg"

        this.gridWidth = width;
        this.gridLength = length;
        this.tileSize = tileSize;
        this.scene = scene;
        this.camera = camera;
        this.controls = controls;

        // information about what's being selected
        this.highlightedTiles = null;
        this.currentMouseOverTile = null;
        this.currentSelectedUnits = new Array();

        // listeners and state
        this.mouseDownListenerActive = true;
        this.mouseOverListenerActive = true;

        // create grid tiles
        this.tiles = new THREE.Object3D();
        this.tilesArray = null;

        this.loadGround();
        this.drawGridSquares(width, length, tileSize);

        // initialize characters
        this.characters = new THREE.Object3D();
        this.numOfCharacters = 3;
        // The row position.
        this.teamStartPos = [1, 18, 1, 18];
        this.characterMeshes = [];
        this.characterList = new Array();
        this.characterFactory = new CharacterFactory();

        var scope = this;
        for (var team_id = 0; team_id < numOfTeams; team_id++) {
          this.characterList.push(new Array());
          this.currentSelectedUnits.push(null);
          for (var i = 0; i < this.numOfCharacters; i++) {
              var charArgs = {
                  world: scope,
                  team: team_id,
                  characterSize: scope.tileSize / 2
              };
              var character = this.characterFactory.createCharacter(charArgs);
              var startX, startY;
              if (team_id < 2) {
                startX = i + 9;
                startY = this.teamStartPos[team_id];
              } else {
                startX = this.teamStartPos[team_id];
                startY = i + 9;
              }
              character.placeAtGridPos(startX, startY);
              this.markTileOccupiedByCharacter(startX, startY);
              character.setID(i);
              this.characterList[team_id].push(character);
              this.characterMeshes.push(character.mesh);
              this.scene.add(character.mesh);
          }
        }
        // bullet info
        this.bullets = [];


        this.setupMouseMoveListener();
        this.setupMouseDownListener();
    },

    getCharacterById: function(team, id) {
        return this.characterList[team][id];
    },

    displayMessage: function(msg) {
        this.gameApp.displayMessage(msg);
    },

    handleCharacterDead: function(character) {
        this.displayMessage("A robot was destroyed!");

        // if the character was the currently selected unit, then reset tile state
        if (this.currentSelectedUnits[myTeamId] == character) {
            // deselect character
            character.deselect();

            // deselect tiles.
            character.highlightedTiles.forEach(function(tile) {
                tile.reset();
            });
            this.currentSelectedUnits[myTeamId] = null;
        }

        // mark tile position as available
        var xPos = character.getTileXPos();
        var zPos = character.getTileZPos();
        this.getTileAtTilePos(xPos, zPos).hasCharacter = false;


        // remove character mesh from list of active meshes
        var index = this.characterMeshes.indexOf(character.mesh);
        if (index > -1) {
            this.characterMeshes.splice(index, 1);
            // remove object form scene
            character.onDead();
        }
    },

    handleBulletDestroy: function(bullet) {
        // todo: remove bullet from scene
        var index = this.bullets.indexOf(bullet);
        if (index > -1) {
            this.bullets.splice(index, 1);
            this.scene.remove(bullet.mesh);            
        }
    },

    disableMouseDownListener: function() {
        this.mouseDownListenerActive = false;
    },

    enableMouseDownListener: function() {
        this.mouseDownListenerActive = true;
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
        if (this.currentSelectedUnits[myTeamId]) {
            if (this.currentSelectedUnits[myTeamId] != character) {
                this.currentSelectedUnits[myTeamId].deselect();
            }
        }

        this.currentSelectedUnits[myTeamId] = character;

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
            this.setPFGridCellAccessibility(xPos, zPos, false);
        }
    },

    markTileNotOccupiedByCharacter: function(xPos, zPos) {
        var tile = this.getTileAtTilePos(xPos, zPos);
        if (tile) {
            tile.hasCharacter = false;
            tile.setHasCharacter(false);
            this.setPFGridCellAccessibility(xPos, zPos, true);
        }
    },

    markTileOccupiedByObstacle: function() {

    },


    findPath: function(oldXPos, oldZPos, newXPos, newZPos) {
        return this.pathFinder.findPath(oldXPos, oldZPos, newXPos, newZPos, this.PFGrid.clone());
    },

    displayMovementArea: function(character) {
        // deselect any previously highlighted tiles
        if (this.currentMouseOverTile) {
            this.currentMouseOverTile.reset();
        }

        // deselect tiles.
        if (this.highlightedTiles) {
            this.highlightedTiles.forEach(function(tile) {
                tile.reset();
            });
        }

        var characterMovementRange = character.getMovementRange();

        // highlight adjacent squares - collect all tiles from radius
        var tilesToHighlight = this.getTilesInArea(character, characterMovementRange);
        character.highlightedTiles = tilesToHighlight;
        this.highlightTiles(tilesToHighlight);
    },

    highlightTiles: function(tilesToHighlight) {

        tilesToHighlight.forEach(function(tile) {
            tile.setSelectable(true);
            tile.setMovable(true);
            tile.markAsMovable();
        });
        this.highlightedTiles = tilesToHighlight;
    },

    setPFGridCellAccessibility: function(x, z, hasObstacleOnCell) {
        this.PFGrid.setWalkableAt(x, z, hasObstacleOnCell);
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

            var validNeighbors = this.getNeighborTiles(currentTile.xPos, currentTile.zPos);
            for (var i = 0; i < validNeighbors.length; i++) {
                var neighbor = validNeighbors[i];
                if (_.indexOf(visited, neighbor) == -1 && _.indexOf(nodesInNextLevel, neighbor) == -1) {
                    tilesToHighlight.push(neighbor);
                    nodesInNextLevel.push(neighbor);
                }
            }

            if (nodesInCurrentLevel.length == 0) {
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
        return tiles;
    },

    deselectAll: function() {
        this.characterMeshes.forEach(function(characterMesh) {
            characterMesh.owner.deselect();
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

        var mousePosition = this.controls.getMousePosition();

        mouseVector.x = 2 * (mousePosition.x / window.innerWidth) - 1;
        mouseVector.y = 1 - 2 * (mousePosition.y / window.innerHeight);

        var raycaster = projector.pickingRay(mouseVector.clone(), this.camera);

        // recursively call intersects
        var intersectsWithTiles = raycaster.intersectObjects(this.tiles.children);
        var isFiringWithinGrid = intersectsWithTiles.length > 0;

        var to;
        if (isFiringWithinGrid) {
            var tileSelected = intersectsWithTiles[0].object.owner;

            // determine exact point of intersection with tile
            to = intersectsWithTiles[0].point;
        } else {
            // experimental - be able to fire at points outside of space
            var vector = new THREE.Vector3(mouseVector.x, mouseVector.y, 0.5);
            projector.unprojectVector(vector, this.camera);
            var dir = vector.sub(this.camera.position).normalize();

            // calculate distance to the plane
            var distance = - this.camera.position.y / dir.y;
            var pos = this.camera.position.clone().add(dir.multiplyScalar(distance));

            to = pos;
        }

        if (this.currentSelectedUnits[myTeamId]) {
            var from = this.currentSelectedUnits[myTeamId].mesh.position.clone();
            this.currentSelectedUnits[myTeamId].rotate2(new THREE.Vector3(to.x-from.x, to.y-from.y, to.z-from.z));
        }
    },

    setupMouseDownListener: function() {
        var scope = this;

        window.addEventListener('mousedown', function(event) {
            if (scope.mouseDownListenerActive) {
                scope.onMouseDown(event);
            }
        }, false);
    },

    shootBullet: function(owner, from, to) {
        // don't shoot a bullet in-place
        if (from.x == to.x && from.z == to.z) {
            return;
        }

        var bullet = new Bullet(this, owner, from, to);
        this.bullets.push(bullet);
        this.scene.add(bullet.mesh);
    },


    handleShootEvent: function(projector, mouseVector, intersectsWithTiles) {
        var from = this.currentSelectedUnits[myTeamId].mesh.position.clone();
        var to;

        var isFiringWithinGrid = intersectsWithTiles.length > 0;
        if (isFiringWithinGrid) {
            var tileSelected = intersectsWithTiles[0].object.owner;

            // determine exact point of intersection with tile
            to = intersectsWithTiles[0].point;
        } else {
            // experimental - be able to fire at points outside of space
            var vector = new THREE.Vector3(mouseVector.x, mouseVector.y, 0.5);
            projector.unprojectVector(vector, this.camera);
            var dir = vector.sub(this.camera.position).normalize();

            // calculate distance to the plane
            var distance = - this.camera.position.y / dir.y;
            var pos = this.camera.position.clone().add(dir.multiplyScalar(distance));

            to = pos;
        }

        // keep bullet level
        to.y = 15;
        from.y = 15;

        // shoot a bullet because you can
        if (this.currentSelectedUnits[myTeamId].canShoot()) {
            sendShootMsg(this.currentSelectedUnits[myTeamId].id, from, to);
            this.shootBullet(this.currentSelectedUnits[myTeamId], from, to);
            this.currentSelectedUnits[myTeamId].onShoot(from, to);
        }
    },

    onMouseDown: function(event) {
        var RIGHT_CLICK = 3;
        var LEFT_CLICK = 1;

        var projector = new THREE.Projector();
        var mouseVector = new THREE.Vector3();

        var mousePosition = this.controls.getMousePosition();

        mouseVector.x = 2 * (mousePosition.x / window.innerWidth) - 1;
        mouseVector.y = 1 - 2 * (mousePosition.y / window.innerHeight);

        var raycaster = projector.pickingRay(mouseVector.clone(), this.camera);

        // recursively call intersects
        var intersects = raycaster.intersectObjects(this.characterMeshes, true);
        var intersectsWithTiles = raycaster.intersectObjects(this.tiles.children);

        var unitIsCurrentlySelected = (this.currentSelectedUnits[myTeamId] != null);
        if (unitIsCurrentlySelected) {
            // fire on click
            if (event.which == RIGHT_CLICK) {
                this.handleShootEvent(projector, mouseVector, intersectsWithTiles);
            }
        }

        // move on click
        if (event.which == LEFT_CLICK) {
            // care about characters first, then tile intersects
            var continueClickHandler = false;

            if (intersects.length > 0) {
                var clickedObject = intersects[0].object.owner;

                // done so that you can click on a tile behind a character easily
                if (clickedObject != this.currentSelectedUnits[myTeamId]) {
                    clickedObject.onSelect();
                } else {
                    continueClickHandler = true;
                }
            } else {
                continueClickHandler = true;
            }

            // case where unit is moving
            if (continueClickHandler) {
                this.handleMoveCase(intersectsWithTiles);
            }
        }
    },

    handleMoveCase: function(intersectsWithTiles) {
        if (intersectsWithTiles.length > 0) {
            var tileSelected = intersectsWithTiles[0].object.owner;
            var coordinate = tileSelected.onMouseOver();
            if (this.currentSelectedUnits[myTeamId] && coordinate) {
                var deltaX = coordinate.x - this.currentSelectedUnits[myTeamId].getTileXPos();
                var deltaY = 0;
                var deltaZ = coordinate.z - this.currentSelectedUnits[myTeamId].getTileZPos();

                var unitMovedToDifferentSquare = !(deltaX == 0 && deltaZ == 0);

                if (unitMovedToDifferentSquare) {
                    this.currentSelectedUnits[myTeamId].setDirection(
                        new THREE.Vector3(deltaX, deltaY, deltaZ));

                    // Put the network communication here.
                    sendMoveMsg(this.currentSelectedUnits[myTeamId].id,
                        deltaX, deltaY, deltaZ);

                    this.currentSelectedUnits[myTeamId].enqueueMotion(function() {
                        this.allowCharacterMovement = true;
                    });
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

    loadGround: function() {
        var texture = THREE.ImageUtils.loadTexture(this.GROUND_TEXTURE);

        var groundMaterial = new THREE.MeshLambertMaterial({
            color: 0xffffff, 
            map: texture
        });

        var ground = new THREE.Mesh(new THREE.PlaneGeometry(this.gridWidth, this.gridLength), groundMaterial
            );
        ground.rotation.x = -0.5 * Math.PI;

        var Y_BUFFER = -0.5;
        // needed because otherwise tiles will overlay directly on the grid and will cause glitching during scrolling ("z fighting")
        ground.position.y = Y_BUFFER;
        // offset to fit grid drawing 
        ground.position.x -= this.tileSize / 2;
        ground.position.z -= this.tileSize / 2;

        this.scene.add(ground);
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
                
                var tileMesh = tile.getTileMesh();
                this.tilesArray[i][j] = tile;

                this.tiles.add(tileMesh);
            }
        }

        this.PFGrid = new PF.Grid(this.numberSquaresOnXAxis, this.numberSquaresOnZAxis);
        this.pathFinder = new PF.AStarFinder();

        this.scene.add(this.tiles);
    },

    getTileSize: function() {
        return this.tileSize;
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

    update: function(delta) {
        // update character movements
        for (var i = 0; i < this.characterMeshes.length; i++) {
            var character = this.characterMeshes[i].owner;
            character.update(delta);
        }

        // update bullet movements
        this.updateBullets(delta);
    },

    updateBullets: function(delta) {
        for (var i = 0; i < this.bullets.length; i++) {
            var bullet = this.bullets[i];
            bullet.update(delta);
            this.checkBulletCollision(bullet, i);   
        }
    },

    checkOverlap: function(obj1, obj2) {
        var combinedRadius = obj1.getRadius() + obj2.getRadius();
        return combinedRadius * combinedRadius >= obj1.position.distanceToSquared(obj2.position);
    },

    checkBulletCollision: function(bullet, bulletIndex) {
        for (var i = 0; i < this.characterMeshes.length; i++) {
            var character = this.characterMeshes[i].owner;
            // also need to check for bullet team here
            if (character.team != bullet.owner.team && this.checkOverlap(bullet, character)) {
                this.handleBulletDestroy(bullet);
                character.applyDamage(30);
                break;
            }
        }
    }
});
