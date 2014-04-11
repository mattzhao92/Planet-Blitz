var EditorModel = Class.extend({

	init: function(scene, camera) {
		this.scene = scene;
		this.camera = camera;
		this.map_width = 1600;
		this.map_height = 400;
		this.map_tileSize = Constants.ORIGINAL_TILESIZE; //used accroos EditorControls.js and BlitzUnit.js
		this.originalScale = this.map_tileSize;

		this.new_width = this.map_width;
		this.new_height = this.map_height;
		this.new_tileSize = this.map_tileSize;
		this.mapTileMeshes = new THREE.Object3D();

		// Editor State
		this.currentSelectedTeamId = 0;
		this.currentSelectedHexColor = '0xc300ff';
		this.unitcards_in_teams = [];
		this.obstacle_cards = [];
		this.powerup_cards = [];
		this.last_display_units = [];
		this.last_display_obstacles = [];
		this.last_display_powerups = [];
		this.created_units = [];
		this.created_obstacles = [];
		this.created_powerups = [];
		this.current_unit_prototype = null;
		this.current_obstacle_prototype = null;
		this.current_powerup_prototype = null;
		this.isShiftDown = false;
		this.currentSelectedObstacle = "Rock";
		this.currentSelectedPowerUp = "PowerUp";
		this.currentVirtualObjectType = "VirtualUnit"; // Other types are VirtualObstacle, VirtualPowerHouse

		// Virtual Object
		this.normalMatrix = new THREE.Matrix3();
		this.tmpVec = new THREE.Vector3();
		this.voxelPosition = new THREE.Vector3();
		this.virtualUnit = new Unit("soldier", 0x33CCFF, 0.5, this.map_tileSize, -1);
		this.virtualUnitMesh = this.virtualUnit.getUnitMesh();
		this.virtualUnitMesh.position.x += this.map_tileSize / 2;
		this.virtualUnitMesh.position.z += this.map_tileSize / 2;
		this.scene.add(this.virtualUnitMesh);


		this.virtualObstacle = new Obstacle("rock", 0.5, this.map_tileSize);
		this.virtualObstacleMesh = this.virtualObstacle.getMesh();
		this.virtualObstacleMesh.position.x += this.map_tileSize / 2;
		this.virtualObstacleMesh.position.z += this.map_tileSize / 2;


		this.virtualPowerUp = new Obstacle("powerup-health", 0.5, this.map_tileSize);
		this.virtualPowerUpMesh = this.virtualPowerUp.getMesh();
		this.virtualPowerUpMesh.position.x += this.map_tileSize / 2;
		this.virtualPowerUpMesh.position.z += this.map_tileSize / 2;

		this.id_base = 0;

		// keyboard input
		this.projector = new THREE.Projector();
		this.mouse2D = new THREE.Vector3(0, 10000, 0.5);

		var scope = this;
		window.addEventListener('mousemove', function(event) {
			scope.onDocumentMouseMove(event);
		}, false);
		window.addEventListener('mousedown', function(event) {
			scope.onDocumentMouseDown(event);
		}, false);
		window.addEventListener('keydown', function(event) {
			scope.onDocumentKeyDown(event);
		}, false);
		window.addEventListener('keyup', function(event) {
			scope.onDocumentKeyUp(event);
		}, false);

		this.gui = new dat.GUI();

		var parameters = {
			height: '800',
			width: '800',
			tileSize: '40',
			color: "#ffff00",
			Team: "",
			Obstacle: "",
			PowerUp: "",
			groundtexture: "Supernova.jpg"
		};
		this.parameters = parameters;
		var scope = this;

		// Board Folder, editor width, height and tile size of the board

		var boardFolder = this.gui.addFolder('Board size');
		var boardHeight = boardFolder.add(parameters, 'height').name('Y Tiles').listen();
		boardHeight.setValue('' + this.map_height / Constants.ORIGINAL_TILESIZE);
		boardHeight.onChange(function(value) {
			scope.new_height = parseInt(value) * Constants.ORIGINAL_TILESIZE;;
		});

		var boardWidth = boardFolder.add(parameters, 'width').name('X Tiles').listen();
		boardWidth.setValue('' + this.map_width / Constants.ORIGINAL_TILESIZE);
		boardWidth.onChange(function(value) {
			scope.new_width = parseInt(value) * Constants.ORIGINAL_TILESIZE;
		});


		var updateBoardCtl = {
			color: "#ffff00",
			onChange: function() {
				scope.onBoardSizeChange(scope.new_width, scope.new_height, scope.new_tileSize);
			}
		};

		var updateBoardBtn = boardFolder.add(updateBoardCtl, 'onChange').name("Resize Board");
		boardFolder.open();


		// Obstacle Folder, select an obstacle
		var obstacleFolder = this.gui.addFolder('Add obstacle');
		var listOfObstacles = ['Rock'];

		var selectObstacleGUI = obstacleFolder.add(parameters, 'Obstacle', listOfObstacles);
		var scope = this;
		selectObstacleGUI.onChange(function(value) {
			scope.currentSelectedObstacle = value;
		});

		var selectObstacleCtl = {
			color: "#ffff00",
			onChange: function() {
				scope.onObstacleSelection(scope.currentSelectedObstacle);
			}
		};

		var selectObstacleBtn = obstacleFolder.add(selectObstacleCtl, 'onChange').name("Select Obstacle");
		obstacleFolder.open();


		// powerup Folder, select a powerup
		var powerupFolder = this.gui.addFolder('Add powerup');
		var listOfPowerUps = ['powerup-health'];

		var selectPowerUPGui = powerupFolder.add(parameters, 'PowerUp', listOfPowerUps);
		var scope = this;
		selectPowerUPGui.onChange(function(value) {
			scope.currentSelectedPowerUp = value;
		});

		var selectPowerUpCtl = {
			color: "#ffff00",
			onChange: function() {
				scope.onPowerUpSelection(scope.currentSelectedPowerUp);
			}
		};

		var selectPowerUpBtn = powerupFolder.add(selectPowerUpCtl, 'onChange').name("Select PowerUp");
		powerupFolder.open();

		var selectTeamFolder = this.gui.addFolder('Add unit / team');
		var listOfTeams = ['Team0'];
		var TeamCount = 0;

		var selectTeamGUI = selectTeamFolder.add(parameters, 'Team', listOfTeams);
		var scope = this;
		selectTeamGUI.onChange(function(value) {
			scope.currentSelectedTeamId = parseInt(value.substring(4));
			scope.onTeamSelection(scope.currentSelectedTeamId);
		});

		var selectTeamCtl = {
			color: "#ffff00",
			onChange: function() {
				scope.onTeamSelection(scope.currentSelectedTeamId);
			}
		};

		var selectTeamBtn = selectTeamFolder.add(selectTeamCtl, 'onChange').name("Select Team");
		selectTeamFolder.open();

		var addTeamParams = {
			color: "#ffff00",
			onCreate: function() {
				selectTeamFolder.remove(selectTeamGUI);
				TeamCount++;
				listOfTeams.push("Team" + TeamCount);
				selectTeamGUI = selectTeamFolder.add(parameters, 'Team', listOfTeams);
				selectTeamGUI.onChange(function(value) {
					scope.currentSelectedTeamId = parseInt(value.substring(4));
					scope.onTeamSelection(scope.currentSelectedTeamId);
				});
			}
		};

		var addTeamFolder = this.gui.addFolder('Add a Team');
		var teamColor = addTeamFolder.addColor(parameters, 'color').name('Team Color').listen();
		teamColor.setValue('#c300ff');
		teamColor.onChange(function(value) {
			scope.currentSelectedHexColor = value.replace("#", "0x");
		});

		var newTeamId = addTeamFolder.add(addTeamParams, 'onCreate').name("Team Create");
		var newTeamIdCount = 1;
		newTeamId.onChange(function() {
			scope.onTeamCreation(newTeamIdCount);
			newTeamIdCount = newTeamIdCount + 1;
		});
		//addTeamFolder.open();



		var groundtextureFolder = this.gui.addFolder('Ground texture');
		var selectgroundtextureInput = groundtextureFolder.add(parameters, 'groundtexture');
		var selectgroundtextureCtl = {
			onChange: function() {
				scope.loadGround(parameters.groundtexture);
			}
		};

		var selectgroundtextureBtn = groundtextureFolder.add(selectgroundtextureCtl, 'onChange').name("Select ground texture");

		var cleargroundtextureCtl = {
			onChange: function() {
				scope.clearGround();
			}
		};

		var cleargroundtextureBtn = groundtextureFolder.add(cleargroundtextureCtl, 'onChange').name("Clear ground texture");

		groundtextureFolder.open();

		// Import and Export
		var exportCtl = {
			onChange: function() {
				scope.exportJson();
			}
		};

		var exportBtn = this.gui.add(exportCtl, 'onChange').name("Export to JSON");


		this.onTeamCreation(0);
		this.onTeamSelection(0);

		this.onObstacleCreation("Rock");
		this.onPowerupCreation("powerup-health");

		this.drawGridSquares(this.map_width, this.map_height, this.map_tileSize);
	},

	pickMapJson: function() {
		var newElem = document.createElement('input');
		newElem.setAttribute("id", "files");
		newElem.setAttribute("type", "file");
		newElem.setAttribute("name", "files[]");

		//document.createElement('files')`.addEventListener('change', handleFileSelect, false);
		function handleFileSelect(evt) {
			var files = evt.target.files; // FileList object

			// Loop through the FileList and render image files as thumbnails.
			for (var i = 0, f; f = files[i]; i++) {

				var reader = new FileReader();

				// Closure to capture the file information.
				reader.onload = (function(theFile) {
					return function(e) {
						// Render thumbnail.
						console.log(e.target.result);
					};
				})(f);
				// Read in the image file as a data URL.
				reader.readAsText(f);
			}
		}

		newElem.addEventListener('change', handleFileSelect, false);
		console.log(newElem);
		debugger;
		newElem.onchange.apply(newElem);
	},

	getTileSize: function() {
		return this.map_tileSize;
	},

	getWidth: function() {
		return this.map_width;
	},

	getHeight: function() {
		return this.map_height;
	},

	clearGround: function() {
		if (this.lastground) {
			this.scene.remove(this.lastground);
		}
	},

	loadGround: function(groundtexture) {
		this.clearGround();
		var texture = THREE.ImageUtils.loadTexture("gndTexture/" + groundtexture);

		var groundMaterial = new THREE.MeshLambertMaterial({
			map: texture
		});

		this.lastground = new THREE.Mesh(new THREE.PlaneGeometry(this.map_width, this.map_height), groundMaterial);
		this.lastground.rotation.x = -0.5 * Math.PI;

		var Y_BUFFER = -0.5;
		// needed because otherwise tiles will overlay directly on the grid and will cause glitching during scrolling ("z fighting")
		this.lastground.position.y = Y_BUFFER;
		// offset to fit grid drawing 
		//ground.position.x -= this.map_tileSize / 2;
		//ground.position.z -= this.map_tileSize / 2;

		this.scene.add(this.lastground);
	},

	onBoardSizeChange: function(width, height, tile_size) {
		if (this.map_width != width || this.map_height != height || tile_size != this.map_tileSize) {
			var old_map_tileSize = this.map_tileSize;

			this.map_width = width;
			this.map_height = height;
			this.map_tileSize = tile_size;

			if (this.line != null) {
				this.scene.remove(this.mapTileMeshes);
				this.scene.remove(this.line);
				this.drawGridSquares(width, height, tile_size);

			}
			//update virtualUnitMesh
			// figure which units are still in scope and reposition units

			var scale = 1.0 * tile_size / this.originalScale;

			this.virtualUnitMesh.scale.x = scale;
			this.virtualUnitMesh.scale.y = scale;
			this.virtualUnitMesh.scale.z = scale;

			if (this.current_unit_prototype)
				this.current_unit_prototype.setUnitSize(this.map_tileSize);

			if (this.current_obstacle_prototype)
				this.current_obstacle_prototype.setSize(this.map_tileSize);

			if (this.current_obstacle_prototype)
				this.current_obstacle_prototype.setSize(this.map_tileSize);



			var new_units = [];
			var xLeftBoundary = 0;
			var xRightBoundary = this.map_width / (this.map_tileSize);
			var zLeftBoundary = 0
			var zRightBoundary = this.map_height / (this.map_tileSize);

			for (var i = 0; i < this.created_units.length; i++) {
				// check whether the units are still in scope 

				var xPos = this.created_units[i].getXPos();
				var zPos = this.created_units[i].getZPos();

				if (xLeftBoundary < xPos && xPos < xRightBoundary &&
					zLeftBoundary < zPos && zPos < zRightBoundary) {
					this.created_units[i].setUnitSize(this.map_tileSize);
					new_units.push(this.created_units[i]);
					var unit_mesh = this.created_units[i].getUnitMesh();
					var tile = this.tilesArray[xPos][zPos];
					tile.onPlaceUnit(this.created_units[i]);
					unit_mesh.position.x = this.convertXPosToWorldX(xPos);
					unit_mesh.position.z = this.convertZPosToWorldZ(zPos);
				} else {
					this.scene.remove(this.created_units[i].getUnitMesh());
				}
			}

			this.created_units = new_units;

			// repostion obstacles
			var new_obstacles = [];

			for (var i = 0; i < this.created_obstacles.length; i++) {
				// check whether the units are still in scope 

				var xPos = this.created_obstacles[i].getXPos();
				var zPos = this.created_obstacles[i].getZPos();

				if (xLeftBoundary < xPos && xPos < xRightBoundary &&
					zLeftBoundary < zPos && zPos < zRightBoundary) {
					this.created_obstacles[i].setSize(this.map_tileSize);
					new_obstacles.push(this.created_obstacles[i]);
					var obstacle_mesh = this.created_obstacles[i].getMesh();
					var tile = this.tilesArray[xPos][zPos];
					tile.onPlaceObstacle(this.created_obstacles[i]);
					obstacle_mesh.position.x = this.convertXPosToWorldX(xPos);
					obstacle_mesh.position.z = this.convertZPosToWorldZ(zPos);
				} else {
					this.scene.remove(this.created_obstacles[i].getMesh());
				}
			}

			var powerups = [];

			for (var i = 0; i < this.created_powerups.length; i++) {
				// check whether the units are still in scope 

				var xPos = this.created_powerups[i].getXPos();
				var zPos = this.created_powerups[i].getZPos();

				if (xLeftBoundary < xPos && xPos < xRightBoundary &&
					zLeftBoundary < zPos && zPos < zRightBoundary) {
					this.created_powerups[i].setSize(this.map_tileSize);
					new_obstacles.push(this.created_powerups[i]);
					var obstacle_mesh = this.created_powerups[i].getMesh();
					var tile = this.tilesArray[xPos][zPos];
					tile.onPlaceObstacle(this.created_powerups[i]);
					obstacle_mesh.position.x = this.convertXPosToWorldX(xPos);
					obstacle_mesh.position.z = this.convertZPosToWorldZ(zPos);
				} else {
					this.scene.remove(this.created_powerups[i].getMesh());
				}
			}

			// TODO: reassign the unit id numbers
		}
	},

	update: function() {
		this.raycaster = this.projector.pickingRay(this.mouse2D.clone(), this.camera);

		var intersects = this.raycaster.intersectObjects(this.mapTileMeshes.children);

		if (intersects.length > 0) {
			intersector = this.getRealIntersector(intersects);
			if (intersector) {
				this.setVirtualMeshPosition(intersector);
				switch (this.currentVirtualObjectType) {
					case "VirtualUnit":
						this.virtualUnitMesh.position = this.voxelPosition;
						break;
					case "VirtualObstacle":
						this.virtualObstacleMesh.position = this.voxelPosition;
						break;
					case "VirtualPowerUp":
						this.virtualPowerUpMesh.position = this.voxelPosition;
						break;
					default:
						break;
				}
			}
		}

		//console.log("update " + currentVirtualObjectType);
	},

	drawGridSquares: function(width, height, size) {
		var tileFactory = new EditorCellFactory(this);
		this.mapTileMeshes = new THREE.Object3D();

		var numberSquaresOnXAxis = width / size;
		var numberSquaresOnZAxis = height / size;

		this.tilesArray = new Array(numberSquaresOnXAxis);
		for (var i = 0; i < numberSquaresOnXAxis; i++) {
			this.tilesArray[i] = new Array(this.numberSquaresOnZAxis);
		}

		for (var i = 0; i < numberSquaresOnXAxis; i++) {
			for (var j = 0; j < numberSquaresOnZAxis; j++) {
				var tile = tileFactory.createTile(i, j);

				var tileMesh = tile.getTileMesh();
				this.tilesArray[i][j] = tile;
				this.mapTileMeshes.add(tileMesh);
			}
		}
		this.scene.add(this.mapTileMeshes);

		var geometry = new THREE.Geometry();

		for (var i = -height / 2; i <= height / 2; i += size) {
			geometry.vertices.push(new THREE.Vector3(-width / 2, 0, i));
			geometry.vertices.push(new THREE.Vector3(width / 2, 0, i));
		}

		for (var i = -width / 2; i <= width / 2; i += size) {
			geometry.vertices.push(new THREE.Vector3(i, 0, -height / 2));
			geometry.vertices.push(new THREE.Vector3(i, 0, height / 2));
		}

		var material = new THREE.LineBasicMaterial({
			color: 0x000000,
			opacity: 0.5,
			transparent: false
		});

		this.line = new THREE.Line(geometry, material);
		this.line.type = THREE.LinePieces;
		this.scene.add(this.line);
	},

	updateVirtualUnitMesh: function(unit) {
		this.scene.remove(this.virtualUnitMesh);
		console.log("updateVirtualUnitMesh ");
		this.virtualUnit = unit.clone(0.5);
		this.current_unit_prototype = unit;
		this.virtualUnitMesh = this.virtualUnit.getUnitMesh();
		this.virtualUnitMesh.material.color.setHex(unit.getUnitColor());
		this.scene.add(this.virtualUnitMesh);
	},

	clearUnitCards: function() {
		for (var i = 0; i < this.last_display_units.length; i++) {
			var unit_mesh = this.last_display_units[i];
			this.scene.remove(unit_mesh);
		}
	},

	clearObstacleCards: function() {
		for (var i = 0; i < this.last_display_obstacles.length; i++) {
			var obstacle_mesh = this.last_display_obstacles[i];
			this.scene.remove(obstacle_mesh);
		}
	},


	//TODO
	clearPowerUpCards: function() {
		for (var i = 0; i < this.last_display_powerups.length; i++) {
			var obstacle_mesh = this.last_display_powerups[i];
			this.scene.remove(obstacle_mesh);
		}
	},

	redrawUnitCards: function(units) {
		this.clearUnitCards();
		this.clearObstacleCards();
		this.clearPowerUpCards();

		var unitcardSize = units[0].getCardSize();
		var mesh_x = unitcardSize;

		for (var i = 0; i < units.length; i++) {
			var unit_mesh = units[i].getCardMesh();
			unit_mesh.position.set(mesh_x, window.innerHeight - unitcardSize, 0);
			unit_mesh.scale.set(unitcardSize, unitcardSize, 1.0);
			mesh_x += (unitcardSize * 1.1);
			this.scene.add(unit_mesh);
			this.last_display_units.push(unit_mesh);
		}
	},

	redrawObstacleCards: function() {
		this.clearUnitCards();
		this.clearObstacleCards();
		this.clearPowerUpCards();

		var obstacleCardSize = this.obstacle_cards[0].getCardSize();
		var mesh_x = obstacleCardSize;

		for (var i = 0; i < this.obstacle_cards.length; i++) {
			var obj_mesh = this.obstacle_cards[i].getCardMesh();
			obj_mesh.position.set(mesh_x, window.innerHeight - obstacleCardSize, 0);
			obj_mesh.scale.set(obstacleCardSize, obstacleCardSize, 1.0);
			mesh_x += (obstacleCardSize * 1.1);
			this.scene.add(obj_mesh);
			this.last_display_obstacles.push(obj_mesh);
		}
	},

	redrawPowerUpCards: function() {
		this.clearUnitCards();
		this.clearObstacleCards();
		this.clearPowerUpCards();

		var obstacleCardSize = this.powerup_cards[0].getCardSize();
		var mesh_x = obstacleCardSize;

		for (var i = 0; i < this.powerup_cards.length; i++) {
			var obj_mesh = this.powerup_cards[i].getCardMesh();
			obj_mesh.position.set(mesh_x, window.innerHeight - obstacleCardSize, 0);
			obj_mesh.scale.set(obstacleCardSize, obstacleCardSize, 1.0);
			mesh_x += (obstacleCardSize * 1.1);
			this.scene.add(obj_mesh);
			this.last_display_powerups.push(obj_mesh);
		}
	},

	// called when we switch from diplaying a list of unit cards to a list of obstacle cards or vice versa

	updateVirtualObject: function(futureType) {
		var objectToRemove = null;
		switch (this.currentVirtualObjectType) {
			case "VirtualUnit":
				objectToRemove = this.virtualUnitMesh;
				this.clearUnitCards();
				break;
			case "VirtualObstacle":
				objectToRemove = this.virtualObstacleMesh;
				this.clearObstacleCards();
				break;
			case "VirtualPowerUp":
				objectToRemove = this.virtualPowerUpMesh;
				this.clearPowerUpCards();
				break;
			default:
				break;
		}

		if (objectToRemove != null) {
			this.scene.remove(objectToRemove);
		}

		switch (futureType) {
			case "VirtualUnit":
				this.scene.add(this.virtualUnitMesh);
				break;
			case "VirtualObstacle":
				this.scene.add(this.virtualObstacleMesh);
				break;
			case "VirtualPowerUp":
				this.scene.add(this.virtualPowerUpMesh);
				break;
			default:
				break;
		}
	},

	getUnitsInTeam: function(teamId) {
		console.log("size of unitcards_in_teams " + this.unitcards_in_teams.length);
		console.log("selcted team id " + teamId);
		console.log("size of the selected team " + this.unitcards_in_teams[teamId].length);
		return this.unitcards_in_teams[teamId];
	},

	onTeamSelection: function(teamId) {
		console.log("onTeamSelection " + teamId);
		var unit_cards = this.getUnitsInTeam(teamId);
		this.updateVirtualUnitMesh(unit_cards[0].unit);
		this.current_unit_prototype = unit_cards[0].unit;
		this.updateVirtualObject("VirtualUnit");
		this.currentVirtualObjectType = "VirtualUnit";
		this.redrawUnitCards(unit_cards);
	},

	onObstacleSelection: function(obstacle) {
		console.log("onObstacleSelection " + obstacle);
		this.current_obstacle_prototype = this.obstacle_cards[0].obstacle; //TODO : use an actual index
		this.updateVirtualObject("VirtualObstacle");
		this.currentVirtualObjectType = "VirtualObstacle";
		this.redrawObstacleCards();
	},

	onPowerUpSelection: function(powerup) {
		console.log("onPowerUpSelection " + powerup);
		this.current_powerup_prototype = this.powerup_cards[0].obstacle; //TODO : use an actual index
		this.updateVirtualObject("VirtualPowerUp");
		this.currentVirtualObjectType = "VirtualPowerUp";
		this.redrawPowerUpCards();
	},

	onTeamCreation: function(teamId) {
		//adding default units to the unitcards_in_teams
		var new_unit_cards = [];
		var unitcardSize = 80;

		var soldier_unit_prototype = new Unit('soldier', this.currentSelectedHexColor, 0.0, this.map_tileSize, teamId);
		var artillery_unit_prototype = new Unit('artillery', this.currentSelectedHexColor, 0.0, this.map_tileSize, teamId);
		var flamethrower_unit_prototype = new Unit('flamethrower', this.currentSelectedHexColor, 0.0, this.map_tileSize, teamId);
		var new_unit_card = new UnitCard(soldier_unit_prototype, unitcardSize, 'soldier-regular.png');
		var new_unit_card2 = new UnitCard(artillery_unit_prototype, unitcardSize, 'soldier-artillery.png');
		var new_unit_card3 = new UnitCard(flamethrower_unit_prototype, unitcardSize, 'soldier-flamethrower.png');
		new_unit_cards.push(new_unit_card);
		new_unit_cards.push(new_unit_card2);
		new_unit_cards.push(new_unit_card3);
		this.unitcards_in_teams.push(new_unit_cards);
	},


	onObstacleCreation: function(obstacleName) {
		console.log('onObstacleCreation ' + obstacleName);
		var new_obstacle_prototype = new Obstacle(obstacleName, 0.0, this.map_tileSize);
		var obstacleCardSize = 80;
		var new_obstacle_card = new ObstacleCard(new_obstacle_prototype, 80, "rock.png");
		this.obstacle_cards.push(new_obstacle_card);
	},

	onPowerupCreation: function(obstacleName) {
		console.log('onPowerupCreation ' + obstacleName);
		var new_obstacle_prototype = new Obstacle(obstacleName, 0.0, this.map_tileSize);
		var obstacleCardSize = 80;
		var new_obstacle_card = new ObstacleCard(new_obstacle_prototype, 80, "crate.png");
		this.powerup_cards.push(new_obstacle_card);
	},

	setVirtualMeshPosition: function(intersector) {

		if (intersector.face === null) {
			console.log(intersector)
		}

		this.normalMatrix.getNormalMatrix(intersector.object.matrixWorld);

		this.tmpVec.copy(intersector.face.normal);
		this.tmpVec.applyMatrix3(this.normalMatrix).normalize();

		this.voxelPosition.addVectors(intersector.point, this.tmpVec);
		var size = this.map_tileSize;
		this.voxelPosition.x = Math.floor((this.voxelPosition.x - this.map_width / 2) / size) * size + this.map_width / 2 + size / 2;
		this.voxelPosition.y = Math.floor(this.voxelPosition.y / size) * size + size / 2;
		this.voxelPosition.z = Math.floor((this.voxelPosition.z - this.map_height / 2) / size) * size + this.map_height / 2 + size / 2;
	},

	onDocumentMouseMove: function(event) {
		//event.preventDefault();
		this.mouse2D.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse2D.y = -(event.clientY / window.innerHeight) * 2 + 1;

		// detecting intersects on screen manually

		for (var i = 0; i < this.last_display_units.length; i++) {
			this.last_display_units[i].owner.onMouseOverFinished();
		}

		for (var i = 0; i < this.last_display_units.length; i++) {
			var mesh_pos = this.last_display_units[i].position;
			var cardsize = this.last_display_units[i].owner.getCardSize() / 2;
			if (Math.abs(mesh_pos.x - event.clientX) < cardsize &&
				Math.abs(mesh_pos.y - event.clientY) < cardsize) {
				this.last_display_units[i].owner.onMouseOver();
			}
		}
	},

	getRealIntersector: function(intersects) {

		for (var i = 0; i < intersects.length; i++) {

			intersector = intersects[i];

			if (intersector.object != this.virtualUnitMesh &&
				intersector.object != this.virtualObstacleMesh &&
				intersector.object != this.virtualPowerUpMesh) {

				return intersector;

			}
		}
		return null;
	},


	rotateMesh: function(rotateMe, angle) {
		rotateMe.rotation.y = angle;
	},

	onDocumentKeyDown: function(event) {
		var rotateMe = null;
		switch (this.currentVirtualObjectType) {
			case "VirtualUnit":
				rotateMe = this.virtualUnitMesh;
				break;
			case "VirtualObstacle":
				rotateMe = this.virtualObstacleMesh;
				break;
			case "VirtualPowerUp":
				rotateMe = this.virtualPowerUpMesh;
				break;
			default:
				break;
		}

		switch (event.keyCode) {

			case 16:
				this.isShiftDown = true;
				break;
			case 17:
				this.isCtrlDown = true;
				break;
			case 37:
				this.rotateMesh(rotateMe, -0.5 * Math.PI);
				break; //left
			case 38:
				this.rotateMesh(rotateMe, 1 * Math.PI);
				break; //up
			case 39:
				this.rotateMesh(rotateMe, 0.5 * Math.PI);
				break; //right
			case 40:
				this.rotateMesh(rotateMe, 0);
				break; //down
		}
	},

	download: function(filename, text) {
		var pom = document.createElement('a');
		pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		pom.setAttribute('download', filename);
		pom.click();
	},

	exportJson: function() {

		var numberSquaresOnXAxis = this.map_width / this.map_tileSize;
		var numberSquaresOnZAxis = this.map_height / this.map_tileSize;

		var units = [];
		var obstacles = [];
		var tiles = [];
		for (var i = 0; i < numberSquaresOnXAxis; i++) {
			for (var j = 0; j < numberSquaresOnZAxis; j++) {
				var tile = this.tilesArray[i][j];
				if (tile.hasCharacter || tile.hasObstacle) {
					tiles.push(tile.toJson());
				}
				if (tile.hasCharacter) {
					units.push(tile.unit.toJson());
				} else if (tile.hasObstacle) {
					obstacles.push(tile.obstacle.toJson());
				}

			}
		}

		exportJson = {
			'units': units,
			'obstacles': obstacles,
			'tiles': tiles,
			'board': {
				'width': this.map_width,
				'height': this.map_height,
				'tileSize': this.map_tileSize,
				'groundtexture': this.parameters.groundtexture
			}
		};
		var output = JSON.stringify({
			obj: JSON.stringify(exportJson)
		});
		console.log(output);
		this.download('test.txt', output);
	},

	onDocumentKeyUp: function(event) {

		switch (event.keyCode) {

			case 16:
				isShiftDown = false;
				break;
			case 17:
				isCtrlDown = false;
				break;

		}
	},

	convertXPosToWorldX: function(tileXPos) {
		return -((this.map_width) / 2) + (tileXPos * this.map_tileSize) + this.map_tileSize / 2;
	},

	convertZPosToWorldZ: function(tileZPos) {
		return -((this.map_height / 2)) + (tileZPos * this.map_tileSize) + this.map_tileSize / 2;
	},

	convertMeshXToCoordinateX: function(meshX) {
		return (meshX + ((this.map_width) / 2) - this.map_tileSize / 2) / this.map_tileSize;
	},

	convertMeshZToCoordinateZ: function(meshZ) {
		return (meshZ + ((this.map_height) / 2) - this.map_tileSize / 2) / this.map_tileSize;
	},

	onDocumentMouseDown: function(event) {
		var intersects = this.raycaster.intersectObjects(this.mapTileMeshes.children);
		var intersector;
		if (intersects.length > 0) {

			intersector = this.getRealIntersector(intersects);

			// delete cube
			if (this.isShiftDown) {
				if (true) {
					this.scene.remove(intersector.object);
					//this.created_units.splice( this.created_unit_meshes.indexOf( intersector.object ), 1 );
				}
			} else {
				switch (this.currentVirtualObjectType) {
					case "VirtualUnit":

						this.setVirtualMeshPosition(intersector);
						var new_unit = this.current_unit_prototype.clone();
						var new_unit_mesh = new_unit.getUnitMesh();
						new_unit_mesh.position.copy(this.voxelPosition);
						new_unit_mesh.rotation.y = this.virtualUnitMesh.rotation.y;

						new_unit.setXPos(this.convertMeshXToCoordinateX(this.voxelPosition.x));
						new_unit.setZPos(this.convertMeshZToCoordinateZ(this.voxelPosition.z));

						var scope = this;
						intersector.object.owner.onPlaceUnit(new_unit, function() {
							scope.scene.add(new_unit_mesh);
							scope.created_units.push(new_unit);
						});
						break;
					case "VirtualObstacle":
						this.setVirtualMeshPosition(intersector);
						var new_obstacle = this.current_obstacle_prototype.clone();
						var new_obstacle_mesh = new_obstacle.getMesh();
						new_obstacle_mesh.position.copy(this.voxelPosition);
						new_obstacle_mesh.rotation.y = this.virtualObstacleMesh.rotation.y;

						new_obstacle.setXPos(this.convertMeshXToCoordinateX(this.voxelPosition.x));
						new_obstacle.setZPos(this.convertMeshZToCoordinateZ(this.voxelPosition.z));

						var scope = this;
						intersector.object.owner.onPlaceObstacle(new_obstacle, function() {
							scope.scene.add(new_obstacle_mesh);
							scope.created_obstacles.push(new_obstacle);
						});
						break;

					case "VirtualPowerUp":
						this.setVirtualMeshPosition(intersector);
						var new_obstacle = this.current_powerup_prototype.clone();
						var new_obstacle_mesh = new_obstacle.getMesh();
						new_obstacle_mesh.position.copy(this.voxelPosition);
						new_obstacle_mesh.rotation.y = this.virtualPowerUpMesh.rotation.y;

						new_obstacle.setXPos(this.convertMeshXToCoordinateX(this.voxelPosition.x));
						new_obstacle.setZPos(this.convertMeshZToCoordinateZ(this.voxelPosition.z));

						var scope = this;
						intersector.object.owner.onPlaceObstacle(new_obstacle, function() {
							scope.scene.add(new_obstacle_mesh);
							scope.created_powerups.push(new_obstacle);
						});
						break;
					default:
						break;
				}
			}

		}

		var scope = this;

		switch (this.currentVirtualObjectType) {
			case "VirtualUnit":

				for (var i = 0; i < this.last_display_units.length; i++) {
					var mesh_pos = this.last_display_units[i].position;
					var cardsize = this.last_display_units[i].owner.getCardSize() / 2;
					if (Math.abs(mesh_pos.x - event.clientX) < cardsize &&
						Math.abs(mesh_pos.y - event.clientY) < cardsize) {
						scope.last_display_units[i].owner.onMouseClicked(scope.last_display_units, function(unit) {
							scope.updateVirtualUnitMesh(unit);
						});
					}
				}
				break;
			case "VirtualObstacle":

				break;
			default:
				break;
		}
	}
});