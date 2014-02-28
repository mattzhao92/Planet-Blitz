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

        this.gridHelper = new GridHelper(this.camera, this.controls);

        // initialize characters
        this.setupCharacters();

        // bullet info
        this.bullets = [];

        this.setupMouseMoveListener();
        this.setupMouseDownListener();
        this.setupHotkeys();

        this.unitCycle = 0;
        this.hotKeysDisabled = true;
        this.resetInProgress = false;
    },

    onGameStart: function() {
        this.enableHotKeys();
        for (var tm = GameInfo.numOfTeams; tm < 4; tm++) {
          for (var i = 0; i < this.numOfCharacters; i++) {
            this.silentlyRemoveCharacter(this.getCharacterById(tm, i));
          }
        }

        console.log("Team id "+ GameInfo.myTeamId);

        var teamJoinMessage;
        switch (GameInfo.myTeamId) {
            case 0:
                teamJoinMessage = "You spawned at top";
                break;
            case 1:
                teamJoinMessage = "You spawned at bottom";
                break;
            case 2:
                teamJoinMessage = "You spawned at left";
                break;
            case 3:
                teamJoinMessage = "You spawned at right";
                break;
        }

        this.displayMessage(teamJoinMessage);

        // focus camera on start position (TODO: hardcoded)
        this.controls.focusOnPosition(this.getMyTeamCharacters()[0].mesh.position);
    },

    onGameFinish: function() {
        console.log("Game finish called");
        this.controls.reset();
    },

    getMyTeamCharacters: function() {
        return this.characterList[GameInfo.myTeamId];
    },

    disableHotKeys: function() {
        this.hotKeysDisabled = true;
    },

    enableHotKeys: function() {
        this.hotKeysDisabled = false;
    },

    setupHotkeys: function() {
        var scope = this;
        var unitNumbers = [1, 2, 3];

        unitNumbers.forEach(function(number) {
            var hotkey = number.toString();
            KeyboardJS.on(hotkey, 
                function(event, keysPressed, keyCombo) {
                    if (scope.hotKeysDisabled) return;
                    // TODO: replace this with a more readable line. Also, need to account for out of index errors when units get killed
                    var characterSelected = scope.getMyTeamCharacters()[parseInt(keyCombo) - 1];
                    if (characterSelected) {
                        characterSelected.onSelect();
                    }
                }
            );
        });

        // unit toggle - cycle forwards
        KeyboardJS.on("t", 
            function(event, keysPressed, keyCombo) {
                if (scope.hotKeysDisabled) return;

                var myTeamCharacters = scope.getMyTeamCharacters();
                var characterSelected = myTeamCharacters[scope.unitCycle];
                if (characterSelected) {
                    characterSelected.onSelect();
                }
                scope.unitCycle = (scope.unitCycle + 1) % myTeamCharacters.length;
            }
        );

        // unit toggle - cycle backwards
        KeyboardJS.on("r", 
            function(event, keysPressed, keyCombo) {
                if (scope.hotKeysDisabled) return;

                var myTeamCharacters = scope.getMyTeamCharacters();
                var characterSelected = myTeamCharacters[scope.unitCycle];
                if (characterSelected) {
                    characterSelected.onSelect();
                }
                if (scope.unitCycle == 0) {
                    scope.unitCycle = myTeamCharacters.length - 1;
                } else {
                    scope.unitCycle -= 1;
                }
            }
        );

        // focus camera on unit
        KeyboardJS.on("space", 
            function(event, keysPressed, keyCombo) {
                if (scope.hotKeysDisabled) return;

                var character = scope.getCurrentSelectedUnit();
                if (character) {
                    scope.controls.focusOnPosition(character.mesh.position);
                }
            }
        );

        // rudimentary camera rotation
        KeyboardJS.on("q", 
            function (event, keysPressed, keyCombo) {
                if (scope.hotKeysDisabled) return;

                scope.controls.rotateLeft(Math.PI/30);
            }
        );

        KeyboardJS.on("e", 
            function (event, keysPressed, keyCombo) {
                if (scope.hotKeysDisabled) return;

                scope.controls.rotateRight(Math.PI/30);
            }
        );

    },

    setupCharacters: function() {
        this.characters = new THREE.Object3D();
        this.numOfCharacters = 3;
        // The row position.
        this.teamStartPos = [1, 18, 1, 18];
        this.characterMeshes = [];
        this.characterList = new Array();

        this.characterFactory = new CharacterFactory();

        // Sequence number for synchornization.
        this.seq = 0;

        var scope = this;

        for (var team_id = 0; team_id < 4; team_id++) {
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
    },

    getCharacterById: function(team, id) {
        return this.characterList[team][id];
    },

    displayMessage: function(msg) {
        this.gameApp.displayMessage(msg);
    },

    silentlyRemoveCharacter: function(character) {
        // if the character was the currently selected unit, then reset tile state
        if (this.getCurrentSelectedUnit() == character) {
            // deselect character
            character.deselect();

            // deselect tiles.
            character.highlightedTiles.forEach(function(tile) {
                tile.reset();
            });
          
            this.currentSelectedUnits[GameInfo.myTeamId] = null;
        }

        // mark dead.
        character.alive = false;
        // mark tile position as available
        var xPos = character.getTileXPos();
        var zPos = character.getTileZPos();
        this.getTileAtTilePos(xPos, zPos).hasCharacter = false;

        // remove character mesh from list of active meshes
        var index = this.characterMeshes.indexOf(character.mesh);
        if (index > -1) {
            this.characterMeshes.splice(index, 1);
            // remove object from scene
            character.onDead();
        }
    },

    handleCharacterDead: function(character) {
        this.displayMessage("A robot was destroyed!");

        this.silentlyRemoveCharacter(character);
    },

    handleBulletDestroy: function(bullet) {
        // todo: remove bullet from scene
        var index = this.bullets.indexOf(bullet);
        if (index > -1) {
            this.bullets.splice(index, 1);
            this.scene.remove(bullet.mesh);
        }
    },

    convertXPosToWorldX: function(tileXPos) {
        return -((this.gridWidth) / 2) + (tileXPos * this.tileSize);
    },

    convertZPosToWorldZ: function(tileZPos) {
        return -((this.gridLength / 2)) + (tileZPos * this.tileSize);
    },

    markCharacterAsSelected: function(character) {
        // deselect previous character if there was one
        if (this.getCurrentSelectedUnit()) {
            if (this.getCurrentSelectedUnit() != character) {
                this.getCurrentSelectedUnit().deselect();
            }
        }

        this.currentSelectedUnits[GameInfo.myTeamId] = character;

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

        this.deselectHighlightedTiles();

        var characterMovementRange = character.getMovementRange();

        // highlight adjacent squares - collect all tiles from radius
        var tilesToHighlight = this.getTilesInArea(character, characterMovementRange);

        if (character.isCharacterInRoute == false && character.isCoolDown == false) {
            this.highlightTiles(tilesToHighlight);
        }
    },

    deselectHighlightedTiles: function() {
        // deselect tiles.
        if (this.highlightedTiles) {
            this.highlightedTiles.forEach(function(tile) {
                tile.reset();
            });
        }
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

        // recursively call intersects
        var raycaster = this.gridHelper.getRaycaster();
        var intersectsWithTiles = raycaster.intersectObjects(this.tiles.children);

        for (var i = 0; i < intersectsWithTiles.length; i++) {
            var intersection = intersectsWithTiles[i];
            obj = intersection.object.owner;
            obj.onMouseOver();
        }

        if (this.getCurrentSelectedUnit()) {
            var from = this.getCurrentSelectedUnit().mesh.position.clone();
            var to = this.gridHelper.getMouseProjectionOnGrid();

            this.getCurrentSelectedUnit().snapToDirection(new THREE.Vector3(to.x - from.x, to.y - from.y, to.z - from.z));
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

    handleShootEvent: function() {
        var to = this.gridHelper.getMouseProjectionOnGrid();
        this.getCurrentSelectedUnit().shoot(to);
    },

    getCurrentSelectedUnit: function() {
        return this.currentSelectedUnits[GameInfo.myTeamId];
    },

    onMouseDown: function(event) {
        var RIGHT_CLICK = 3;
        var LEFT_CLICK = 1;

        var raycaster = this.gridHelper.getRaycaster();

        // recursively call intersects
        var intersects = raycaster.intersectObjects(this.characterMeshes, true);
        var intersectsWithTiles = raycaster.intersectObjects(this.tiles.children);
        var unitIsCurrentlySelected = (this.getCurrentSelectedUnit() != null);

        if (unitIsCurrentlySelected) {
            // fire on click
            if (event.which == RIGHT_CLICK) {
                this.handleShootEvent();
            }
        }

        // move on click
        if (event.which == LEFT_CLICK) {
            // care about characters first, then tile intersects
            var continueClickHandler = false;

            if (intersects.length > 0) {
                var clickedObject = intersects[0].object.owner;

                // done so that you can click on a tile behind a character easily
                if (clickedObject != this.getCurrentSelectedUnit()) {
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

            if (this.getCurrentSelectedUnit() && coordinate) {
                var deltaX = coordinate.x - this.getCurrentSelectedUnit().getTileXPos();
                var deltaY = 0;
                var deltaZ = coordinate.z - this.getCurrentSelectedUnit().getTileZPos();

                var unitMovedToDifferentSquare = !(deltaX == 0 && deltaZ == 0);

                if (unitMovedToDifferentSquare) {
                    // this.getCurrentSelectedUnit().setDirection(
                    //     new THREE.Vector3(deltaX, deltaY, deltaZ));

                    // Put the network communication here.
                    if (this.getCurrentSelectedUnit().isCoolDown == 0) {
                        sendMoveMsg(this.getCurrentSelectedUnit().id,
                            deltaX, deltaY, deltaZ);

                        if (!GameInfo.netMode) {
                            this.currentSelectedUnits[GameInfo.myTeamId].enqueueMotion();
                        }
                    }
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

        var ground = new THREE.Mesh(new THREE.PlaneGeometry(this.gridWidth, this.gridLength), groundMaterial);
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

    update: function(delta) {
        // update characters
        this.updateCharacters(delta);

        // update bullet movements
        this.updateBullets(delta);
    },

    updateCharacters: function(delta) {
        for (var i = 0; i < this.characterMeshes.length; i++) {
            var character = this.characterMeshes[i].owner;
            character.update(delta);
        }
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
                if (GameInfo.netMode) {
                    if (bullet.owner.team == GameInfo.myTeamId) {
                        sendHitMsg(character.team, character.id);
                    }
                } else {
                    character.applyDamage(30);
                }
                // Send the server hit message.
                break;
            }
        }
    },

    syncGameState: function(state, seq) {
        if (this.resetInProgress) return true;
        // Old seq, discard it.
        if (seq < this.seq) {
            return false;
        }
        this.seq = seq;
        // This is usd to check ghosts.
        var liveChars = new Array();
        var liveStates = new Array();
        for (var t = 0; t < GameInfo.numOfTeams; t++) {
            liveStates.push(new Array());
            for (var i = 0; i < this.numOfCharacters; i++) {
                liveStates[t].push(false);
            }
        }
        // First check the correctness of each position.
        for (var t = 0; t < state.length; t++) {
            var teamId = parseInt(state[t][State.team]);
            var index = parseInt(state[t][State.index]);
            var x = parseInt(state[t][State.X]);
            var z = parseInt(state[t][State.Z]);
            var health = parseInt(state[t][State.health]);
            // Character to check.
            var charToCheck = this.getCharacterById(teamId, index);
            liveStates[teamId][index] = true;
            if (charToCheck.alive) {
                // Sync the health.
                charToCheck.health = health;
                var dest;
                if (charToCheck.isInRoute()) {
                    dest = charToCheck.getDestination();
                } else {
                    dest = charToCheck.getCurrentPosition();
                }
                if (dest.x != x || dest.z != z) {
                    // Inconsistent with auth state, adjust position.
                    console.log("Inconsi pos ");
                    charToCheck.placeAtGridPos(x, z);
                }
            }
        }

        var isStateGood = true;
        for (var t = 0; t < GameInfo.numOfTeams; t++) {
            for (var i = 0; i < this.numOfCharacters; i++) {
                var charToCheck = this.getCharacterById(t, i);
                if (!liveStates[t][i] && charToCheck.alive) {
                    console.log("Zombie character!");
                    // Server says dead but alive locally.
                    this.handleCharacterDead(charToCheck);
                    isStateGood = false;
                }
            }
        }
        return isStateGood;
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

    reset: function() {
        console.log("reset function is called ");
        for (var i = 0; i < this.characterList.length; i++) {
            for (var j = 0; j < this.characterList[i].length; j++) {
                this.characterList[i][j].onDead();
            }
        }

        this.tiles = new THREE.Object3D();
        this.tilesArray = null;

        this.loadGround();
        this.drawGridSquares(this.gridWidth, this.gridLength, this.tileSize);

        this.gridHelper = new GridHelper(this.camera, this.controls);

        // initialize characters
        this.setupCharacters();
        this.resetInProgress = false;
    },
});
