/* Game world */
var Grid = Class.extend({
    // Class constructor
    init: function(gameApp, tileSize, scene, camera, controls) {
        'use strict';

        var mapContent = GameInfo.mapContent;
        this.mapJson = JSON.parse(mapContent);
        this.gameApp = gameApp;

        this.gridWidth = this.mapJson.board.width;
        this.gridLength = this.mapJson.board.height;
        this.tileSize = this.mapJson.board.tileSize;
        this.scene = scene;
        this.camera = camera;
        this.controls = controls;

        // adjust control scheme - panning boundaries
        this.controls.cameraBoundaries.minX = -2400;
        this.controls.cameraBoundaries.maxX = 2400;

        this.controls.cameraBoundaries.minZ = -2400;
        this.controls.cameraBoundaries.maxZ = 2400;

        // information about what's being selected
        this.highlightedTiles = null;
        this.currentMouseOverTile = null;
        this.currentSelectedUnits = {};
        this.currentSelectedUnits[GameInfo.myTeamId] = [];

        // listeners and state
        this.mouseDownListenerActive = true;
        this.mouseOverListenerActive = true;

        this.gridHelper = new GridHelper(this.camera, this.controls);

        // create sprite factory        
        var scope = this;

        var sceneAddCmd = new SpriteCmd(function(sprite) {
            scope.scene.add(sprite.getRepr());
        });
        var sceneRemoveCmd = new SpriteCmd(function(sprite) {
            scope.scene.remove(sprite.getRepr());
        });
        this.spriteFactory = new SpriteFactory(this, sceneAddCmd, sceneRemoveCmd);
        
        this.tiles = new THREE.Object3D();
        this.tilesArray = null;

        // create grid tiles
        this.loadGround(this.mapJson);
        this.drawGridSquares(this.mapJson);

        // initialize characters
        this.setupCharacters(this.mapJson);
        this.setupObstacles(this.mapJson);

        this.resetInProgress = false;
        this.camera.position.x = 0;
        this.camera.position.y = 600;
        this.camera.position.z = 400;

        this.controls.reset();

        // nonessentials
        this.setupMouseMoveListener();
        this.setupMouseDownListener();
        this.setupMouseUpListener();

        this.setupHotkeys();

        this.unitCycle = 1;
        this.resetInProgress = false;

        this.hotkeys = [];
        this.hotkeyToUnitMap = {};
        this.setupMaterialRefresher();

        // group selection
        this.isDrawing = false;
        this.mousestartX = 0;
        this.mousestartY = 0;
        this.mouseSelectHappened = false;
    },

   drawGroupSelectionRectangle: function (mouseX, mouseY) {
        var canvas = document.createElement('canvas');
        this.canvas2d = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        if (this.bar) {
            this.scene.remove(this.bar);
        }

        var barTexture = new THREE.Texture(canvas);
        barTexture.needsUpdate = true;

        var healthBarMaterial = new THREE.SpriteMaterial({
            map: barTexture,
            useScreenCoordinates: true,
            alignment: THREE.SpriteAlignment.topLeft
        });

        this.bar = new THREE.Sprite(healthBarMaterial);

        this.canvas2d.beginPath();
        this.canvas2d.rect(0, 0, 10000, 10000);
        //canvas2d.rect(1000, 1000, -1000, -1000);
        this.canvas2d.fillStyle = "rgba(0, 255, 127, 0.1)";
        this.canvas2d.fill();

        this.bar.position.set(mouseX,mouseY,0);
        //bar.scale.set(100,100,1.0);
        this.scene.add(this.bar);
    },

    setupMaterialRefresher: function() {
        var scope = this;

        var subscriber = function(msg, data) {
            scope.refreshMaterials();
        }

        PubSub.subscribe(Constants.TOPIC_REFRESH_MATERIALS, subscriber);
    },

    refreshMaterials: function() {
        this.scene.traverse(function(object) {
            if (object instanceof THREE.Mesh) {
                if (object.material) {
                    var material = object.material;
                    material.needsUpdate = true;
                }
            }
        });
    },

    loadGround: function(mapJson) {
        var width = mapJson.board.width;
        var length = mapJson.board.height;
        var size = mapJson.board.tileSize;

        this.numberSquaresOnXAxis = width / size;
        this.numberSquaresOnZAxis = length / size;

        var texture = THREE.ImageUtils.loadTexture("gndTexture/" + mapJson.board.groundtexture);

        var groundMaterial = new THREE.MeshLambertMaterial({
            map: texture,
            side: THREE.DoubleSide
        });

        var ground = new THREE.Mesh(new THREE.PlaneGeometry(this.gridWidth, this.gridLength, this.gridWidth / 5, this.gridLength / 5), groundMaterial);
        ground.receiveShadow = true;

        ground.rotation.x = -0.5 * Math.PI;

        var Y_BUFFER = -0.5;
        // needed because otherwise tiles will overlay directly on the grid and will cause glitching during scrolling ("z fighting")
        ground.position.y = Y_BUFFER;
        // offset to fit grid drawing 
        ground.position.x -= mapJson.board.tileSize / 2;
        ground.position.z -= mapJson.board.tileSize / 2;

        this.scene.add(ground);
    },

    drawGridSquares: function(mapJson) {
        var width = mapJson.board.width;
        var length = mapJson.board.height;
        var size = mapJson.board.tileSize;

        this.tileFactory = new TileFactory(this, size);
        this.numberSquaresOnXAxis = width / size;
        this.numberSquaresOnZAxis = length / size;


        this.PFGrid = new PF.Grid(this.numberSquaresOnXAxis, this.numberSquaresOnZAxis);
        this.pathFinder = new PF.BreadthFirstFinder({allowDiagonal: false, dontCrossCorners: true});


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

        for (var i = 0; i < mapJson.tiles.length; i++) {
            var specialTile = JSON.parse(mapJson.tiles[i]);
            var xPos = specialTile.xPos;
            var zPos = specialTile.zPos;

            if (specialTile.hasCharacter) {
                this.markTileOccupiedByCharacter(xPos, zPos);
            }

            if (specialTile.hasObstacle) {
                this.markTileOccupiedByObstacle(xPos, zPos);
            }
        }

        this.scene.add(this.tiles);
    },

    setupObstacles: function(mapJson) {

        var obstacles = mapJson.obstacles;
        for (var i = 0; i < obstacles.length; i++) {
            var obj = JSON.parse(obstacles[i]);

            var obstacle = this.spriteFactory.createObstacle(obj.obstacleType);

            var objMesh = obstacle.getRepr();
            objMesh.position.x = this.convertXPosToWorldX(obj.xPos);
            objMesh.position.y = 20;
            objMesh.position.z = this.convertZPosToWorldZ(obj.zPos);

            obstacle.position = objMesh.position;

            this.scene.add(objMesh);
        }
    },

    setupCharacters: function(mapJson) {

        // reconstructing BlitzUnits here
        var units_in_teams = [];

        for (var i = 0; i < mapJson.units.length; i++) {
            var unit = JSON.parse(mapJson.units[i]);
            while (unit.teamId > units_in_teams.length - 1) {
                units_in_teams.push([]);
            }
            units_in_teams[unit.teamId].push(unit);
        }

        for (var team_index = 0; team_index < units_in_teams.length; team_index++) {

            for (var unit_index = 0; unit_index < units_in_teams[team_index].length; unit_index++) {

                var metaData = units_in_teams[team_index][unit_index];
                var character;

                var startX = metaData.xPos;
                var startY = metaData.zPos;

                switch (metaData["unitType"]) {
                    case "soldier":
                        character = this.spriteFactory.createSoldier(team_index, unit_index);
                        break;
                    case "artillery":
                        character = this.spriteFactory.createArtillerySoldier(team_index, unit_index);
                        break;
                    case "flamethrower":
                        character = this.spriteFactory.createFlamethrowerSoldier(team_index, unit_index);
                        break;
                    default:
                        console.log("Invalid unit type specified " + metaData["unitType"]);
                        break;
                }

                character.placeAtGridPos(startX, startY);
                character.getRepr().rotation.y = this.getUnitDegreesToRotate(team_index);
                this.markTileOccupiedByCharacter(startX, startY);
            }
        }

        // handle initial case where you need to publish the current initial angle of 0
        PubSub.publish(Constants.TOPIC_CAMERA_ROTATION, this.controls.currentAngle);
    },

    getCharacters: function() {
        return this.spriteFactory.getCharacters();
    },

    onGameStart: function() {
        if (this.getMyTeamCharacters().length > 0) {
            // focus camera on start position
            this.controls.focusOnPosition(this.getMyTeamCharacters()[0].mesh.position);
            this.getMyTeamCharacters()[0].onSelect();            
        }
    },

    onGameFinish: function() {
        console.log("onGameFinish");

        // remove all existing mouse listeners
        window.removeEventListener('mousemove', this.mouseMoveListener, false);
        window.removeEventListener('mouseup', this.mouseUpListener, false);
        window.removeEventListener('mousedown', this.mouseDownListener, false);

        // reset the pointerlock
        this.controls.releasePointerLock();

        // TODO: unbind mouse listeners from pointerlock
    },

    getMyTeamCharacters: function() {
        return _.filter(this.getCharacters(), function(character) {
            return character.team == GameInfo.myTeamId && character.active;
        });
    },

    setupHotkeys: function() {
        var scope = this;
        var unitNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

        // remove previous hotkey bindings
        _.forEach(Constants.HOTKEYS, function(hotkey) {
            KeyboardJS.clear(hotkey);
            // remove all bindings that use given key inside the combo
            KeyboardJS.clear.key(hotkey);
        });

        // dynamic hotkey mapping to characters
        unitNumbers.forEach(function(number) {
            var hotkey = number.toString();
            KeyboardJS.on("ctrl, command > " + hotkey,
                function(event, keysPressed, keyCombo) {
                    event.preventDefault();

                    var currentSelectedUnits = _.filter(scope.getCurrentSelectedUnits(), function(character) {
                        return (character != null && character.active);
                    });

                    if (currentSelectedUnits && currentSelectedUnits.length > 0) {

                        var previousKeybinding = scope.hotkeyToUnitMap[number];
                        if (previousKeybinding) {
                            previousKeybinding.clear();
                        }

                        // assign new hotkey number to this unit
                        var keyBinding = KeyboardJS.on(hotkey, function(event, keysPressed, keyCombo) {
                            for (var i = 0; i < scope.currentSelectedUnits[GameInfo.myTeamId].length; i++) {
                                scope.currentSelectedUnits[GameInfo.myTeamId][i].deselect();
                                i -= 1;
                            }
                            scope.currentSelectedUnits[GameInfo.myTeamId].length = 0;

                            if (currentSelectedUnits && currentSelectedUnits.length > 0) {
                                for (var i = 0; i < currentSelectedUnits.length; i++) {
                                    currentSelectedUnits[i].onSelect();
                                }
                            }
                        });

                        scope.hotkeyToUnitMap[number] = keyBinding;
                    }
                }
            );
        });

        
        KeyboardJS.on("ctrl, command",
            function(event, keysPressed, keyCombo) {
                event.preventDefault();
                scope.keyCommandDown = true;
            },

            function(event, keysPressed, keyCombo) {
                event.preventDefault();
                scope.keyCommandDown = false;
            }
        );


        // unit toggle - cycle forwards
        KeyboardJS.on("t, tab",
            function(event, keysPressed, keyCombo) {
                event.preventDefault();

                var myTeamCharacters = scope.getMyTeamCharacters();
                var characterSelected = myTeamCharacters[scope.unitCycle];

                // handle case where some characters have been killed in meantime
                if (scope.unitCycle >= myTeamCharacters.length) {
                    scope.unitCycle = 0;
                }

                for (var i = 0; i < scope.currentSelectedUnits[GameInfo.myTeamId].length; i++) {
                    scope.currentSelectedUnits[GameInfo.myTeamId][i].deselect();
                    i -= 1;
                }

                scope.currentSelectedUnits[GameInfo.myTeamId].length = 0;

                // need to cycle until the next "defined character". If character became dead, then the unitCycle concept ceases to become valid
                for (var i = scope.unitCycle; i < myTeamCharacters.length; i++) {
                    if (characterSelected !== undefined && characterSelected.active) {
                        characterSelected.onSelect();
                        break;
                    }
                    scope.unitCycle = i;
                }

                scope.unitCycle = (scope.unitCycle + 1) % myTeamCharacters.length;
            }
        );

        // unit toggle - cycle backwards
        KeyboardJS.on("r",
            function(event, keysPressed, keyCombo) {
                var myTeamCharacters = scope.getMyTeamCharacters();
                var characterSelected = myTeamCharacters[scope.unitCycle];
                if (characterSelected.active) {

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
                var characters = scope.getCurrentSelectedUnits();
                if (characters.length > 0 && character.active) {
                    scope.controls.focusOnPosition(characters[0].mesh.position);
                }
            }
        );

        // rudimentary camera rotation
        KeyboardJS.on("q",
            function(event, keysPressed, keyCombo) {
                scope.controls.rotateLeft(Math.PI / 30);
            }
        );

        KeyboardJS.on("e",
            function(event, keysPressed, keyCombo) {
                scope.controls.rotateRight(Math.PI / 30);
            }
        );

    },

    getUnitDegreesToRotate: function(team_id) {
        switch (team_id) {
            case 0:
                degreesToRotate = 0;
                break;
            case 1:
                degreesToRotate = Math.PI;
                break;
            case 2:
                degreesToRotate = Math.PI / 2;
                break;
            case 3:
                degreesToRotate = 3 * Math.PI / 2;
                break;
        }

        return degreesToRotate;
    },

    getCharacterById: function(team, id) {
        var characters = this.getCharacters();
        // search through characters
        for (var i = 0; i < characters.length; i++) {
            var character = characters[i];
            if (character.team == team && character.id == id) {
                return character;
            }
        }

        return null;
    },

    displayMessage: function(msg) {
        this.gameApp.displayMessage(msg);
    },

   silentlyRemoveCharacter: function(character) {
        // if the character was the currently selected unit, then reset tile state
        var selectedUnits = this.getCurrentSelectedUnits();
        if (character in selectedUnits) {
            // deselect character
            character.deselect();

            // deselect tiles if there were any
            character.highlightedTiles.forEach(function(tile) {
                tile.reset();
            });

            var index = this.currentSelectedUnits[GameInfo.myTeamId].indexOf(character);
            this.currentSelectedUnits[GameInfo.myTeamId].splice(index,1);
        }

        // mark tile position as available
        var xPos = character.getTileXPos();
        var zPos = character.getTileZPos();
        this.getTileAtTilePos(xPos, zPos).hasCharacter = false;

        character.destroy();
    },

    handleCharacterDead: function(character) {
        this.silentlyRemoveCharacter(character);
    },

    convertMeshXToXPos: function(meshX) {
        return Math.floor((meshX + this.gridWidth / 2) / this.tileSize);
    },

    convertMeshZToZPos: function(meshZ) {
        return Math.floor((meshZ + this.gridLength / 2) / this.tileSize);
    },

    convertXPosToWorldX: function(tileXPos) {
        return -((this.gridWidth) / 2) + (tileXPos * this.tileSize);
    },

    convertZPosToWorldZ: function(tileZPos) {
        return -((this.gridLength / 2)) + (tileZPos * this.tileSize);
    },

    markCharacterAsSelected: function(character) {
        this.currentSelectedUnits[GameInfo.myTeamId].push(character);
    },

    markCharacterAsNotSelected: function(character) {
    	var index = this.currentSelectedUnits[GameInfo.myTeamId].indexOf(character);
    	if (index > -1) {
    		this.currentSelectedUnits[GameInfo.myTeamId].splice(index, 1);
		}
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

    markTileOccupiedByObstacle: function(xPos, zPos) {
        var tile = this.getTileAtTilePos(xPos, zPos);
        if (tile) {
            tile.hasObstacle = true;

            this.setPFGridCellAccessibility(xPos, zPos, false);
        }
    },

    findPath: function(oldXPos, oldZPos, newXPos, newZPos) {
        return this.pathFinder.findPath(oldXPos, oldZPos, newXPos, newZPos, this.PFGrid.clone());
    },


    setPFGridCellAccessibility: function(x, z, hasObstacleOnCell) {
        this.PFGrid.setWalkableAt(x, z, hasObstacleOnCell);
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

    setupMouseMoveListener: function() {
        var scope = this;

        var listener = function(event) {
            scope.onMouseMove(event);
        }

        window.addEventListener('mousemove', listener, false);
        this.mouseMoveListener = listener;
    },

    setupMouseUpListener: function() {
        var scope = this;

        var listener = function(event) {
            if (scope.mouseDownListenerActive) {
                scope.onMouseUp(event);
            }
        }
        this.mouseUpListener = listener;
        window.addEventListener('mouseup', listener, false);


        var doubleListener = function(event) {
            if (scope.mouseDownListenerActive) {
                scope.onMouseDoubleClick(event);
            }
        }

        this.mouseDoubleClickListener = doubleListener;
        window.addEventListener('dblclick', doubleListener, false);
    },

    onMouseMove: function(event) {
        if (this.mouseMoveListenerActive == false) {
            return;
        }

        var mouseLocation = this.controls.getMousePosition();

        if (this.isDrawing && this.bar) {
            var mouseX = mouseLocation.x;
            var mouseY = mouseLocation.y;

            this.bar.scale.set(mouseX - this.mousestartX, mouseY - this.mousestartY, 1.0);


            this.mouseSelectHappened = true;
            return;
            //bar.position.set(e.clientX-50,e.clientY-50,0);           
        }

        // recursively call intersects
        var raycaster = this.gridHelper.getRaycaster();
        var intersectsWithTiles = raycaster.intersectObjects(this.tiles.children);

        for (var i = 0; i < intersectsWithTiles.length; i++) {
            var intersection = intersectsWithTiles[i];
            obj = intersection.object.owner;
            obj.onMouseOver();
        }

        var selectedUnits = this.getCurrentSelectedUnits();

        if (selectedUnits.length > 0) {
            var mouseLocation = this.gridHelper.getMouseProjectionOnGrid();
            for (var i = 0; i < selectedUnits.length; i++) {
                selectedUnits[i].onMouseMovement(mouseLocation);
            }
        }
    },

    setupMouseDownListener: function() {
        var scope = this;

        var listener = function(event) {
            if (scope.mouseDownListenerActive) {
                scope.onMouseDown(event);
            }
        }

        window.addEventListener('mousedown', listener, false);
        this.mouseDownListener = listener;
    },

    handleShootEvent: function() {
        var to = this.gridHelper.getMouseProjectionOnGrid();
        var selectedUnits = this.getCurrentSelectedUnits();

        for (var i = 0; i < selectedUnits.length; i++) {
            var from = selectedUnits[i].position.clone();
            selectedUnits[i].shoot(from, to, true);
        }
    },

    getCurrentSelectedUnits: function() {
        return this.currentSelectedUnits[GameInfo.myTeamId];
    },

    getCharactersInMeshRange: function(lowMeshX, lowMeshZ, highMeshX, highMeshZ) {
        var characters = this.getMyTeamCharacters();
        var charactersInRange = [];

        for (var i = 0; i < characters.length; i++) {
            var character = characters[i];
            var characterMeshPos = character.mesh.position;
            if (((lowMeshX-characterMeshPos.x) * (characterMeshPos.x - highMeshX) > 0)
            && ((lowMeshZ - characterMeshPos.z) * (characterMeshPos.z - highMeshZ) > 0)) {
                charactersInRange.push(character);
            }
        }
        return charactersInRange;
    },


    onMouseDoubleClick: function(event) {
        var RIGHT_CLICK = 3;
        var LEFT_CLICK = 1;

        var raycaster = this.gridHelper.getRaycaster();

        // recursively call intersects
        var characterMeshes = _.map(this.getCharacters(), function(character) {
            return character.getRepr();
        });

        var scope = this;
        var intersects = raycaster.intersectObjects(characterMeshes, true);
        var intersectsWithTiles = raycaster.intersectObjects(this.tiles.children);
        var unitIsCurrentlySelected = (this.getCurrentSelectedUnits().length > 0);

        if (intersects.length > 0) {
            var clickedObject = intersects[0].object.owner;
           
            var myTeamCharacters = scope.getMyTeamCharacters();

            for (var i = 0; i < scope.currentSelectedUnits[GameInfo.myTeamId].length; i++) {
                scope.currentSelectedUnits[GameInfo.myTeamId][i].deselect();
                i -= 1;
            }

            scope.currentSelectedUnits[GameInfo.myTeamId].length = 0;

            for (var i = 0; i < myTeamCharacters.length; i++) {
                var characterSelected = myTeamCharacters[i];
                if (characterSelected.modelName == clickedObject.modelName) {
                    characterSelected.onSelect();
                }
            }
        }
    },


    onMouseUp: function(event) {

    	var didSelect = false;

        if (this.isDrawing) {
            this.scene.remove(this.bar);
            this.bar = null;
            this.isDrawing = false;  
            var endPosOnGrid = this.gridHelper.getMouseProjectionOnGrid();
            var characters = this.getCharactersInMeshRange(this.startPosOnGrid.x, this.startPosOnGrid.z, endPosOnGrid.x, endPosOnGrid.z);
            
            if (characters.length > 0 && this.mouseSelectHappened) {

                if (!this.keyCommandDown) {
                    for (var i = 0; i < this.currentSelectedUnits[GameInfo.myTeamId].length; i++) {
                        this.currentSelectedUnits[GameInfo.myTeamId][i].deselect();
                        i -= 1;
                    }
                    this.currentSelectedUnits[GameInfo.myTeamId].length = 0;
                }

                for (var i = 0; i < characters.length; i++) {
                	didSelect = true;

                    characters[i].onSelect();
                }
            }
            this.mouseSelectHappened = false;
        }
 		var RIGHT_CLICK = 3;
        var LEFT_CLICK = 1;

        var raycaster = this.gridHelper.getRaycaster();

        // recursively call intersects
        var characterMeshes = _.map(this.getCharacters(), function(character) {
            return character.getRepr();
        });

        var intersects = raycaster.intersectObjects(characterMeshes, true);
        var intersectsWithTiles = raycaster.intersectObjects(this.tiles.children);
        var unitIsCurrentlySelected = (this.getCurrentSelectedUnits().length > 0);

       if (event.which == LEFT_CLICK) {

            if (intersects.length > 0) {
                var clickedObject = intersects[0].object.owner;
               
                 if (clickedObject instanceof Character) {

                    clickedObject.onSelect(true);
                    return;
           		 }
            } 
        }

        if (unitIsCurrentlySelected) {
        	if (!didSelect && event.which == LEFT_CLICK)
        		this.handleMoveCase(intersectsWithTiles);
            // fire on click
            if (event.which == RIGHT_CLICK) {
                this.handleShootEvent();
            }
        }
      
 
    },

    onMouseDown: function(event) {

        if (this.isDrawing == false) {
            this.isDrawing = true;

            var mouseLocation = this.controls.getMousePosition();

            this.mousestartX = mouseLocation.x;
            this.mousestartY = mouseLocation.y;

            this.startPosOnGrid = this.gridHelper.getMouseProjectionOnGrid();

            this.drawGroupSelectionRectangle(this.mousestartX, this.mousestartY);
            //return;
        }
    },

   handleMoveCase: function(intersectsWithTiles) {
        if (intersectsWithTiles.length > 0) {
            var tileSelected = intersectsWithTiles[0].object.owner;
            var coordinate = tileSelected.onMouseOver();

            var selectedUnits = this.getCurrentSelectedUnits();
            if (selectedUnits.length > 0 && coordinate) {

                _.forEach(selectedUnits, function(selectedUnit) {
                    var deltaX = coordinate.x - selectedUnit.getTileXPos();
                    var deltaZ = coordinate.z - selectedUnit.getTileZPos();

                    var unitMovedToDifferentSquare = !(deltaX == 0 && deltaZ == 0);

                    var moveDeltaX = coordinate.x - selectedUnit.destX;
                    var moveDeltaY = coordinate.z - selectedUnit.destZ;
                    var isNotAlreadyMovingToDestination = !(moveDeltaX == 0 && moveDeltaY == 0);

                    if (unitMovedToDifferentSquare && isNotAlreadyMovingToDestination) {
                        // transmit move over network
                        sendMoveMsg(selectedUnit.id,
                            coordinate.x, 0, coordinate.z);
                    }
                });
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
        var scope = this;
        this.spriteFactory.notifyAll(new SpriteCmd(
            function(sprite) {
                // TODO: extract the dispatcher from the esprite factory
                sprite.update(delta, scope.spriteFactory);
            }
        ));

        this.spriteFactory.updateCharactersContainer();
        this.spriteFactory.updateBulletsContainer();
    },

    syncGameState: function(state) {
        if (this.resetInProgress) return true;

        // This is usd to check ghosts.
        var liveChars = [];
        var liveStates = [];
        for (var t = 0; t < GameInfo.maxNumTeams; t++) {
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
            if (charToCheck != null && charToCheck.active) {
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
                    console.log('Inconsistent position, should be at ' + x + ' ' + z + ' but was at ' + dest.x + ' ' + dest.z);
                    charToCheck.placeAtGridPos(x, z);
                }
            }
        }

        var isStateGood = true;
        for (var t = 0; t < GameInfo.numOfTeams; t++) {
            for (var i = 0; i < this.numOfCharacters; i++) {
                var charToCheck = this.getCharacterById(t, i);
                if (charToCheck !== null && !liveStates[t][i] && charToCheck.active) {
                    console.log("Zombie character!");
                    // Server says dead but active locally.
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

    destroy: function() {
        console.log("Game destroy");
        this.onGameFinish();
        Utils.deallocate(this.scene);
    }
});