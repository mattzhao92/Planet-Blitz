/* 
 * Grid
 * constructor input args : {d_x, d_y, square_size}
 */
    var Grid = Class.extend({
        // Class constructor
        init: function (width, length, squareSize, scene, camera) {
            'use strict';

            this.gridWidth = width;
            this.gridLength = length;

            this.scene = scene;
            this.camera = camera;

            // Set the "world" modelisation object
            this.tiles = new THREE.Object3D();
            this.drawGridSquares(width, length, squareSize);

            this.characters = new THREE.Object3D();
            this.numOfCharacters = 3;
            this.charactersOnMap = [];
            
            this.squareSize = squareSize;

            this.characterFactory = new CharacterFactory();

            var scope = this;
            for (var i = 0; i < this.numOfCharacters; i++) {

                var charArgs = {
                    color: 0x7A43B6, 
                    position : {x : -((width)/2)+2+((i+3)*this.squareSize), 
                    y : 5, 
                    world: scope}};

                var character = this.characterFactory.createCharacter(charArgs);
                this.charactersOnMap.push(character);
                
                // console.log("added character " + character.mesh);
                this.scene.add(character);
            }

            this.characterBeingSelected = null;

            this.setControls();
            this.setupMouseMoveListener();
        },

        deselectAll: function() {
            this.charactersOnMap.forEach(function (character) {
                character.deselect();
            });
        },

        setupMouseMoveListener: function() {
            var scope = this;

            window.addEventListener( 'mousemove', 
                function(event) {

                    var projector = new THREE.Projector();
                    var mouseVector = new THREE.Vector3();
        
                    mouseVector.x = 2 * (event.clientX / window.innerWidth) - 1;
                    mouseVector.y = 1 - 2 * ( event.clientY / window.innerHeight );

                    var raycaster = projector.pickingRay( mouseVector.clone(), scope.camera ),
                        intersects = raycaster.intersectObjects( scope.tiles.children );

                    scope.tiles.children.forEach(function( tile ) {
                        tile.material.color.setRGB( tile.grayness, tile.grayness, tile.grayness );
                    });
                    
                    for( var i = 0; i < intersects.length; i++ ) {
                        var intersection = intersects[ i ],
                            obj = intersection.object;

                        obj.onMouseOver();
                    }
                }, false );
        },

        getWorldPosition: function() {
            // get world position of a grid

        },

        drawGridSquares: function(width, length, size) {
            this.tileFactory = new TileFactory(size);

            this.numberSquaresOnXAxis = width/size;
            this.numberSquaresOnZAxis = length/size;

            for (var j = 0 ; j < this.numberSquaresOnZAxis; j++) {
                for (var i = 0 ; i < this.numberSquaresOnXAxis; i++) {

                    var tile = this.tileFactory.createTile();

                    tile.position.x =- ((width)/2) + (i * size);
                    tile.position.y = 0;
                    tile.position.z =- ((length)/2) + (j * size);
                    tile.rotation.x = -0.5 * Math.PI;

                    this.tiles.add(tile);
                }
            }

            this.scene.add(this.tiles);
        },

        getNumberSquaresOnXAxis: function () {
            return this.numberSquaresOnXAxis;
        },

        getNumberSquaresOnZAxis: function () {
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

         // Event handlers
        setControls: function () {
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
            jQuery(document).keydown(function (e) {
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
                } else {
                    console.log("BAD BAD BAD ");
                }
            });
            // When the user releases a key
            jQuery(document).keyup(function (e) {
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
            jQuery(window).resize(function () {
                // Redefine the size of the renderer
                //basicScene.setAspect();
            });

            var scope = this;
                window.addEventListener( 'mousedown', 
                    function(event) {

                        var projector = new THREE.Projector();
                        var mouseVector = new THREE.Vector3();
            
                        mouseVector.x = 2 * (event.clientX / window.innerWidth) - 1;
                        mouseVector.y = 1 - 2 * ( event.clientY / window.innerHeight );

                        var raycaster = projector.pickingRay( mouseVector.clone(), scope.camera );

                        // recursively call intersects
                        var intersects = raycaster.intersectObjects(scope.charactersOnMap, true);

                        console.log("intersect length is  "+ intersects.length+ "  "+ scope.charactersOnMap);
                        if (intersects.length > 0) {
                            var firstIntersect = intersects[0];
                            firstIntersect.object.onSelect();

                            // alternate graphical effect on selection
                            // firstIntersect.object.material.emissive.setHex(0xff0000);

                            // for (var i = 0; i < scope.charactersOnMap.length; i++) {
                            //     if (cellX == scope.charactersOnMap[i].atCell.x && 
                            //         cellY == scope.charactersOnMap[i].atCell.y) {
                            //         if (scope.characterBeingSelected != null && 
                            //             scope.characterBeingSelected != scope.charactersOnMap[i]) {
                            //             console.log("to differnt color")
                            //             scope.characterBeingSelected.mesh.children[0].material.color.setRGB(1, 1, 1);
                            //         }
                            //         scope.characterBeingSelected = scope.charactersOnMap[i];
                            //         if (scope.characterBeingSelected) {
                            //             console.log("scope.characterBeingSelected isnt null \n");

                            //         } else {
                            //             console.log("null \n");
                            //         }
                            //         break;
                            //     }
                            // }
                        }

                    }, false );
            },


    });
