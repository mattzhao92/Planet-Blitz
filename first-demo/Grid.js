/* 
 * Grid
 * constructor input args : {d_x, d_y, square_size}
 */
    var Grid = Class.extend({
        // Class constructor
        init: function (width, length, squareSize, camera) {
            'use strict';
            // Set the "world" modelisation object
            this.cubes = new THREE.Object3D();
            this.characters = new THREE.Object3D();

            this.planeGeometry = new THREE.PlaneGeometry(width, length);

            this.numOfCharacters = 1;
            this.currentlySelectedUsers = [];

            this.squareSize = squareSize;

            for (var i = 0; i < this.numOfCharacters; i++) {
                this.currentlySelectedUser = new Character({
                     color: 0x7A43B6
                });
                this.currentlySelectedUsers.push(this.currentlySelectedUser);
                this.characters = this.currentlySelectedUser.mesh;
            }

            //console.log("000 characters length "+this.characters.children.length);

            this.drawGridSquares(this.squareSize);
            this.camera = camera;
        },



        drawGridSquares: function(size) {
            var geom = new THREE.PlaneGeometry(size, size);

            var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

            this.numberSquaresOnXAxis = this.planeGeometry.width/size;
            this.numberSquaresOnZAxis = this.planeGeometry.height/size;

            for (var j = 0 ; j < this.numberSquaresOnZAxis; j++) {
                for (var i = 0 ; i < this.numberSquaresOnXAxis; i++) {

                    var grayness = Math.random() * 0.5 + 0.25;
                    var mat = new THREE.MeshBasicMaterial({overdraw: true});
                    var cube = new THREE.Mesh( geom, mat );
                            
                    mat.color.setRGB( grayness, grayness, grayness );
                    cube.grayness = grayness;

                    cube.position.x =- ((this.planeGeometry.width)/2)+2+(i*size);
                    cube.position.y = 1;
                    cube.position.z =- ((this.planeGeometry.height)/2)+2+(j*size);
                    cube.rotation.x = -0.5 * Math.PI;

                    console.log("cube x : " + cube.position.x + " cube z : " + cube.position.z);

                    this.cubes.add(cube);
                }
            }
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
            // move the selected character to new location
            // if (this.selectedCharacter) {
            //     this.selectedCharacter = null;
            //     this.selectedCharacter.motion();
            //     this.selectedCharacter = null;
            // }
            this.currentlySelectedUser.motion();
        },

         // Event handlers
        setControls: function () {
            'use strict';
            // Within jQuery's methods, we won't be able to access "this"
            var user = this.currentlySelectedUser;
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
                if (user) {
                    user.setDirection(controls);
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

                    var raycaster = projector.pickingRay( mouseVector.clone(), scope.camera ),
                         intersects = raycaster.intersectObjects(scope.characters.children );

                    console.log("number of intersects " + intersects.length);
                    scope.characters.children.forEach(function (character) {
                            console.log(character);
                            //character.material.color.setRGB(10,0,0);
                    });

                }, false );
        },

    });
