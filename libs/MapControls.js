/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author pc123 / http://github.com/pc123
 */

THREE.MapControls = function ( object, scene, domElement ) {

    // needed to add mouse cursor to scene
    this.scene = scene;

    this.object = object;
    this.domElement = ( domElement !== undefined ) ? domElement : document;
    // console.log(this.domElement);

    // API

    this.enabled = true;

    this.target = new THREE.Vector3();

    this.userZoom = true;
    this.userZoomSpeed = 1.0;

    this.userRotate = true;
    this.userRotateSpeed = 1.0;

    this.userPan = true;
    this.userPanSpeed = 2.9;

    this.autoRotate = false;
    this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

    this.minPolarAngle = 0; // radians
    this.maxPolarAngle = Math.PI; // radians

    this.minDistance = 0;
    this.maxDistance = Infinity;

    // WASD mappings
    this.keys = {LEFT: 65, UP: 87, RIGHT: 68, DOWN: 83};

    // internals

    var scope = this;

    var EPS = 0.000001;
    var PIXELS_PER_ROUND = 1800;

    var rotateStart = new THREE.Vector2();
    var rotateEnd = new THREE.Vector2();
    var rotateDelta = new THREE.Vector2();

    var zoomStart = new THREE.Vector2();
    var zoomEnd = new THREE.Vector2();
    var zoomDelta = new THREE.Vector2();

    var phiDelta = 0;
    var thetaDelta = 0;
    var scale = 1.20;

    var lastPosition = new THREE.Vector3();

    var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2 };
    var state = STATE.NONE;


    // merged in from trackball controls
    this.screen = { width: window.innerWidth, height: window.innerHeight, offsetLeft: 0, offsetTop: 0, top: 0, left: 0};

    var SCREEN_MARGIN = 10;

    this.mouseBounds = {minX: SCREEN_MARGIN, minY: SCREEN_MARGIN, maxX: scope.screen.width - SCREEN_MARGIN, maxY: scope.screen.height - SCREEN_MARGIN};

    // can put in resize logic later
    this.radius = ( this.screen.width + this.screen.height ) / 4;

    _eye = new THREE.Vector3();

    var _this = this;
    this.dynamicDampingFactor = 0.15;
    this.panSpeed = 0.35;

    // camera boundary settings
    this.minX = -Infinity;
    this.maxX = Infinity;
    this.minZ = -Infinity;
    this.maxZ = Infinity;

    // for smooth scrolling
    this.velocityX = 0.0;
    this.velocityZ = 0.0;

    this.mouseVector = new THREE.Vector2(0, 0);

    // used for when scrolling with mouse
    this.INITIAL_CAMERA_VELOCITY = 6.5;
    this.MAX_CAMERA_VELOCITY = 12;

    this.MAP_SCROLL_ACCELERATION = 18;
    this.DECELERATION = 15;

    this.enableTraditionalMouseDrag = false;

    // events
    var changeEvent = { type: 'change' };

    var _panStart = new THREE.Vector2();
    var _panEnd = new THREE.Vector2();

    // make sure this arbitrary mouse position is slightl
    var ARBITRARY_MOUSE_POS = 50;
    this.mousePosition = {x: ARBITRARY_MOUSE_POS, y: ARBITRARY_MOUSE_POS};

    this.CURSOR_IMAGE_PATH = "images/cursor.png";

    this.currentAngle = 0;

    this.focusOnPosition = function(newPosition) {
        // figure out offset of camera from target

        // target vs camera.position
        var vectorOffset = this.object.position.clone().sub(this.target);
        this.target = newPosition.clone();
        this.object.position = this.target.clone().add(vectorOffset);
    },

    this.handleResize = function () {
        if ( this.domElement === document ) {
            this.screen.left = 0;
            this.screen.top = 0;
            this.screen.width = window.innerWidth;
            this.screen.height = window.innerHeight;
        } else {
            this.screen = this.domElement.getBoundingClientRect();
        }

        // update the mouse boundaries in response to screen size changing
        this.mouseBounds = {minX: SCREEN_MARGIN, minY: SCREEN_MARGIN, maxX: scope.screen.width - SCREEN_MARGIN, maxY: scope.screen.height - SCREEN_MARGIN};

    };

    this.resetMousePosition = function() {
        scope.mousePosition.x = ARBITRARY_MOUSE_POS;
        scope.mousePosition.y = ARBITRARY_MOUSE_POS;
    }

    this.handleEvent = function ( event ) {

        if ( typeof this[ event.type ] == 'function' ) {

            this[ event.type ]( event );

        }

    };

    this.getMouseProjectionOnBall = function ( clientX, clientY ) {

        var mouseOnBall = new THREE.Vector3(
            ( clientX - _this.screen.width * 0.5 - _this.screen.left ) / (_this.screen.width*.5),
            ( _this.screen.height * 0.5 + _this.screen.top - clientY ) / (_this.screen.height*.5),
            0.0
        );

        var length = mouseOnBall.length();

        if ( _this.noRoll ) {

            if ( length < Math.SQRT1_2 ) {

                mouseOnBall.z = Math.sqrt( 1.0 - length*length );

            } else {

                mouseOnBall.z = .5 / length;
                
            }

        } else if ( length > 1.0 ) {

            mouseOnBall.normalize();

        } else {

            mouseOnBall.z = Math.sqrt( 1.0 - length * length );

        }

        _eye.copy( _this.object.position ).sub( _this.target );

        var projection = _this.object.up.clone().setLength( mouseOnBall.y );
        projection.add( _this.object.up.clone().cross( _eye ).setLength( mouseOnBall.x ) );
        projection.add( _eye.setLength( mouseOnBall.z ) );

        return projection;

    };

    this.handleEvent = function ( event ) {

        if ( typeof this[ event.type ] == 'function' ) {

            this[ event.type ]( event );

        }

    };

    this.rotateLeft = function ( angle ) {

        if ( angle === undefined ) {

            angle = getAutoRotationAngle();

        }

        var quaternion = new THREE.Quaternion();
        var axis = (new THREE.Vector3()).crossVectors(rotateStart, rotateEnd).normalize();
        quaternion.setFromAxisAngle(axis, -angle);
        _eye.applyQuaternion(quaternion);
        // _this.object.up.applyQuaternion(quaternion);

        // console.log(_eye);
        // console.log(scope.object.rotation.y);
        // console.log(Math.cos(scope.object.rotation.y) * 40);

        // console.log(theta);

        thetaDelta -= angle;
        this.currentAngle += thetaDelta;
        // console.log(this.currentAngle);

        PubSub.publish(Constants.TOPIC_CAMERA_ROTATION, this.currentAngle);


    };

    this.getMouseOnScreen = function ( clientX, clientY ) {

        var result = new THREE.Vector2(
            ( clientX - _this.screen.left ) / _this.screen.width,
            ( clientY - _this.screen.top ) / _this.screen.height
        );

        return result;

    };

    this.rotateRight = function ( angle, rotateStart, rotateEnd) {

        if ( angle === undefined ) {

            angle = getAutoRotationAngle();

        }

        thetaDelta += angle;
        this.currentAngle += thetaDelta;
        PubSub.publish(Constants.TOPIC_CAMERA_ROTATION, this.currentAngle);

    };

    this.rotateUp = function ( angle, rotateStart, rotateEnd ) {

        if ( angle === undefined ) {

            angle = getAutoRotationAngle();

        }

        phiDelta -= angle;

    };

    this.rotateDown = function ( angle ) {

        if ( angle === undefined ) {

            angle = getAutoRotationAngle();

        }

        phiDelta += angle;

    };

    this.zoomIn = function ( zoomScale ) {

        if ( zoomScale === undefined ) {

            zoomScale = getZoomScale();

        }

        scale /= zoomScale;
    };

    this.zoomOut = function ( zoomScale ) {

        if ( zoomScale === undefined ) {

            zoomScale = getZoomScale();

        }

        scale *= zoomScale;
    };

    this.pan = function () {

        var mouseChange = _panEnd.clone().sub(_panStart );

        if ( mouseChange.lengthSq() > 0.00000001) {
            
            mouseChange.multiplyScalar(_this.panSpeed * _eye.length());

            var distance = _eye.clone();
            distance = distance.cross(this.object.up).setLength(mouseChange.x);

            var unitZVector = new THREE.Vector3(0, 0, -1);
            // transform the unit z vector into camera's local space
            distance.add(unitZVector.transformDirection(this.object.matrix).setLength(mouseChange.y));
            // prevent camera from getting closer to grid
            distance.y = 0;

            // experimental checking of camera boundaries while panning
            // enforce camera boundaries when panning
            // var newZ = distance.z + this.object.position.z;
            // var newX = distance.x + this.object.position.x;

            // // console.log(newX + " " + newZ);

            // var verticalFOV = this.object.fov * ( Math.PI / 180);

            // var fieldOfVisionHeight = 2 * Math.tan(verticalFOV / 2) * _eye.length();

            // var aspect = this.screen.width / this.screen.height;
            // var fieldOfVisionWidth = fieldOfVisionHeight * aspect;

            // var widthMargin = fieldOfVisionWidth / 4;
            // var heightMargin = fieldOfVisionHeight / 4;

            // // if (newZ - heightMargin > this.maxZ || newZ + heightMargin < this.minZ) {
            // //     distance.z = 0;
            // //     _panStart.z = _panEnd.z;
            // // }

            // if (newX - widthMargin > this.maxX || newX + widthMargin < this.minX) {
            //     distance.x = 0;
            //     _panStart.x = _panStart.x;
            // }

            this.object.position.add( distance );
            this.target.add( distance );

            _panStart.add(mouseChange.subVectors(_panEnd, _panStart).multiplyScalar(_this.dynamicDampingFactor));

            // console.log("viewable width " + width);

            // otherwise, end the pan
        }
    };

    this.updateMouseVector = function() {
        var xDiff = this.screen.width / 2 - scope.mousePosition.x ;
        // multiply by 2 because of wide-screen format
        var yDiff = (this.screen.height / 2 - scope.mousePosition.y) * 2;

        scope.mouseVector.x = xDiff;
        scope.mouseVector.y = yDiff;
        scope.mouseVector.normalize();

        var X_DEAD_RANGE = 0.23;
        var Y_DEAD_RANGE = 0.15;

        // if vector is within certain range, simply ignore it and re-normalize
        if (-X_DEAD_RANGE < scope.mouseVector.x && scope.mouseVector.x < X_DEAD_RANGE) {
            scope.mouseVector.x = 0;
        }

        if (-Y_DEAD_RANGE < scope.mouseVector.y && scope.mouseVector.y < Y_DEAD_RANGE) {
            scope.mouseVector.y = 0;
        }
    }

    this.scrollCameraLeft = function(delta) {
        scope.velocityX = Math.max(scope.velocityX, scope.INITIAL_CAMERA_VELOCITY);
        scope.velocityX += scope.MAP_SCROLL_ACCELERATION * delta;
        scope.addZCameraScrollComponent(delta);
    };

    this.addZCameraScrollComponent = function(delta) {
        // add the secondary "y" component (up / down motion)
        if (scope.mouseVector.y < 0) {
            scope.velocityZ = Math.min(scope.velocityZ, 0.8 * scope.INITIAL_CAMERA_VELOCITY * scope.mouseVector.y);
            scope.velocityZ += scope.MAP_SCROLL_ACCELERATION * delta * scope.mouseVector.y;
        } else {
            scope.velocityZ = Math.max(scope.velocityZ, 0.8 * scope.INITIAL_CAMERA_VELOCITY * scope.mouseVector.y);
            scope.velocityZ += scope.MAP_SCROLL_ACCELERATION * delta * scope.mouseVector.y;
        }
    };

    this.addXCameraScrollComponent = function(delta) {
        if (scope.mouseVector.x < 0) {
            scope.velocityX = Math.min(scope.velocityX, 0.8 * scope.INITIAL_CAMERA_VELOCITY * scope.mouseVector.x);
            scope.velocityX -= scope.MAP_SCROLL_ACCELERATION * delta;

        } else {
            scope.velocityX = Math.max(scope.velocityX, 0.8 * scope.INITIAL_CAMERA_VELOCITY * scope.mouseVector.x);
            scope.velocityX += scope.MAP_SCROLL_ACCELERATION * delta * scope.mouseVector.x;
        }
    }

    this.scrollCameraRight = function(delta) {
        scope.velocityX = Math.min(scope.velocityX, -scope.INITIAL_CAMERA_VELOCITY);
        scope.velocityX -= scope.MAP_SCROLL_ACCELERATION * delta;

        scope.addZCameraScrollComponent(delta);
    };

    this.scrollCameraUp = function(delta) {
        scope.velocityZ = Math.max(scope.velocityZ, scope.INITIAL_CAMERA_VELOCITY);
        scope.velocityZ += scope.MAP_SCROLL_ACCELERATION * delta;

        scope.addXCameraScrollComponent(delta);
    };

    this.scrollCameraDown = function(delta) {
        scope.velocityZ = Math.min(scope.velocityZ, -scope.INITIAL_CAMERA_VELOCITY);
        scope.velocityZ -= scope.MAP_SCROLL_ACCELERATION * delta;

        scope.addXCameraScrollComponent(delta);
    };

    this.checkIfMouseAtScreenEdge = function() {
        return (scope.mousePosition.x == scope.mouseBounds.minX) || 
            (scope.mousePosition.x == scope.mouseBounds.maxX) || 
            (scope.mousePosition.y == scope.mouseBounds.minY) ||
            (scope.mousePosition.y == scope.mouseBounds.maxY);
    }

    this.updateCameraFromVelocity = function(delta) {

        // recalculate mouse vector
        if (scope.checkIfMouseAtScreenEdge()) {
            scope.updateMouseVector();
        }

        // keep on applying velocity if mouse is on edges of screen
        if (scope.mousePosition.x == scope.mouseBounds.minX) {
            scope.scrollCameraLeft(delta);
        } else if (scope.mousePosition.x == scope.mouseBounds.maxX) {
            scope.scrollCameraRight(delta);
        }

        if (scope.mousePosition.y == scope.mouseBounds.minY) {
            scope.scrollCameraUp(delta);
        } else if (scope.mousePosition.y == scope.mouseBounds.maxY) {
            scope.scrollCameraDown(delta);
        }

        // enforce max velocity restriction
        var cameraVelocity = new THREE.Vector2(scope.velocityX, scope.velocityZ);

        if (cameraVelocity.length() > scope.MAX_CAMERA_VELOCITY) {
            cameraVelocity.setLength(scope.MAX_CAMERA_VELOCITY);
        }

        // update camera position based on velocity
        scope.velocityX = cameraVelocity.x;
        scope.velocityZ = cameraVelocity.y;

        var distance = _eye.clone();
        distance = distance.cross(this.object.up).setLength(scope.velocityX);

        var unitZVector = new THREE.Vector3(0, 0, -1);
        // transform the unit z vector into camera's local space
        distance.add(unitZVector.transformDirection(this.object.matrix).setLength(scope.velocityZ));
        // prevent camera from getting closer to grid
        distance.y = 0;

        this.object.position.add( distance );
        this.target.add( distance );

        // don't apply deceleration if the velocity was about 0 to begin with
        if (Math.abs(scope.velocityX) < scope.DECELERATION * delta) {
            scope.velocityX = 0;
        } else if (scope.velocityX > 0) {
            scope.velocityX -= scope.DECELERATION * delta;
        } else if (scope.velocityX < 0) {
            scope.velocityX += scope.DECELERATION * delta;
        }
        
        if (Math.abs(scope.velocityZ) < scope.DECELERATION * delta) {
            scope.velocityZ = 0;
        } else if (scope.velocityZ > 0) {
            // case: going farther up into map
            scope.velocityZ -= scope.DECELERATION * delta;
        } else if (scope.velocityZ < 0) {
            // case: camera coming towards user
            scope.velocityZ += scope.DECELERATION * delta;
        }
    };

    this.update = function (delta) {
        _eye.subVectors(_this.object.position, this.target);
        _this.updateCameraFromVelocity(delta);
        _this.pan();

        var position = this.object.position;
        var offset = position.clone().sub( this.target );

        // angle from z-axis around y-axis

        var theta = Math.atan2( offset.x, offset.z );

        // angle from y-axis

        var phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );

        if ( this.autoRotate ) {

            this.rotateLeft( getAutoRotationAngle() );

        }

        theta += thetaDelta;
        
        phi += phiDelta;            

        // restrict phi to be between desired limits
        phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, phi ) );

        // restrict phi to be betwee EPS and PI-EPS
        phi = Math.max( EPS, Math.min( Math.PI - EPS, phi ) );

        var radius = offset.length() * scale;

        // restrict radius to be between desired limits
        radius = Math.max( this.minDistance, Math.min( this.maxDistance, radius ) );

        offset.x = radius * Math.sin( phi ) * Math.sin( theta );
        offset.y = radius * Math.cos( phi );
        offset.z = radius * Math.sin( phi ) * Math.cos( theta );

        position.copy( this.target ).add( offset );

        this.object.lookAt( this.target );

        thetaDelta = 0;
        phiDelta = 0;
        scale = 1;

        if ( lastPosition.distanceTo( this.object.position ) > 0 ) {

            this.dispatchEvent( changeEvent );

            lastPosition.copy( this.object.position );
        }

        // PubSub.publish(Constants.TOPIC_CAMERA_POSITION, this.object.position);

        // calculating field of view - width and height
        // var verticalFOV = this.object.fov * ( Math.PI / 180);

        // var height = 2 * Math.tan(verticalFOV / 2) * _eye.length();

        // var aspect = this.screen.width / this.screen.height;
        // // calculated 
        // var width = height * aspect;

        // console.log("viewable width " + width);
    };


    function getAutoRotationAngle() {

        return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

    }

    function getZoomScale() {

        return Math.pow( 0.95, scope.userZoomSpeed );

    }

    function onMouseDown( event ) {

        if ( scope.enabled === false ) return;
        if ( scope.userRotate === false ) return;

        event.preventDefault();

        // quick hack
        // event.clientX = scope.mousePosition.x;
        // event.clientY = scope.mousePosition.y;

        // console.log(event.clientX);
        // console.log(event.clientY);

        // console.log(scope.mousePosition);

        if ( event.button === 0 ) {

            state = STATE.PAN;

            _panStart = _panEnd = _this.getMouseOnScreen(event.clientX, event.clientY);

        } else if ( event.button === 1 ) {

            state = STATE.ZOOM;

            zoomStart.set( event.clientX, event.clientY );

        } else if ( event.button === 2 ) {
         
            state = STATE.ROTATE;

            rotateStart.set( event.clientX, event.clientY );

        }

        if (scope.enableTraditionalMouseDrag) {
            document.addEventListener( 'mousemove', onMouseMove, false );
            document.addEventListener( 'mouseup', onMouseUp, false );
        }
    }

    function onMouseMove( event ) {

        if ( scope.enabled === false ) return;

        event.preventDefault();
        event.stopPropagation();

        // // quick hack
        // event.clientX = scope.mousePosition.x;
        // event.clientY = scope.mousePosition.y;

        if ( state === STATE.ROTATE ) {

            rotateEnd.set( event.clientX, event.clientY );
            rotateDelta.subVectors( rotateEnd, rotateStart );

            scope.rotateLeft( 2 * Math.PI * rotateDelta.x / PIXELS_PER_ROUND * scope.userRotateSpeed, rotateStart, rotateEnd);
            scope.rotateUp( 2 * Math.PI * rotateDelta.y / PIXELS_PER_ROUND * scope.userRotateSpeed, rotateStart, rotateEnd);

            rotateStart.copy( rotateEnd );

        } else if ( state === STATE.ZOOM ) {

            zoomEnd.set( event.clientX, event.clientY );
            zoomDelta.subVectors( zoomEnd, zoomStart );

            if ( zoomDelta.y > 0 ) {

                scope.zoomIn();

            } else {

                scope.zoomOut();

            }

            zoomStart.copy( zoomEnd );

        } else if ( state === STATE.PAN ) {

            var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            _panEnd = _this.getMouseOnScreen(event.clientX, event.clientY);

        }

    }

    function onMouseUp( event ) {

        if ( scope.enabled === false ) return;
        if ( scope.userRotate === false ) return;

        if (scope.enableTraditionalMouseDrag) {
            document.removeEventListener( 'mousemove', onMouseMove, false );
            document.removeEventListener( 'mouseup', onMouseUp, false );
        }

        state = STATE.NONE;

    }

    function onMouseWheel( event ) {

        if ( scope.enabled === false ) return;
        if ( scope.userZoom === false ) return;

        var delta = 0;

        if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

            delta = event.wheelDelta;

        } else if ( event.detail ) { // Firefox

            delta = - event.detail;

        }

        if ( delta > 0 ) {

            scope.zoomOut();

        } else {

            scope.zoomIn();

        }
    }

    this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
    this.domElement.addEventListener( 'mousedown', onMouseDown, false );
    this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
    // for firefox
    this.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); 

    // TODO: remove this hardcoding
    var containerName = "#WebGL-output";

    $(containerName).click(
        function() {
            PL.requestPointerLock(document.body,
                // on pointerlock enable
                function(event) {
                    scope.handleResize();
                    document.addEventListener("mousemove", moveCallback, false);
                }, 
                // on pointerlock disable
                function(event) {
                    document.removeEventListener("mousemove", moveCallback, false);
                    scope.resetMousePosition();
                }, 
                // on error
                function(event) {
                    console.log("Error: could not obtain pointerlock");
                });
        }
    );

    this.releasePointerLock = function() {
        // Ask the browser to release the pointer
        document.exitPointerLock = document.exitPointerLock ||
                       document.mozExitPointerLock ||
                       document.webkitExitPointerLock;
        document.exitPointerLock();

        this.currentAngle = 0;
    }

    this.reset = function() {
    }

    function calculateInitialMousePosition(canvas, event) {
        var x = new Number();
        var y = new Number();

        if (event.x != undefined && event.y != undefined) {
            x = event.x;
            y = event.y;
        } else {
            // handle for firefox
            x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;

        return {
            x: x,
            y: y
        };
    }

    function moveCallback(event) {
        // calculate initial position
        var canvas = $(containerName).get()[0];

        if (scope.mousePosition.x == ARBITRARY_MOUSE_POS && scope.mousePosition.y == ARBITRARY_MOUSE_POS) {
            scope.mousePosition = calculateInitialMousePosition(canvas, event);
        }

        var movementX = event.movementX;
        var movementY = event.movementY;

        // update mouse position
        scope.mousePosition.x += event.movementX;
        scope.mousePosition.y += event.movementY;

        // limit boundaries of mouse
        if (scope.mousePosition.x < scope.mouseBounds.minX) {
            scope.mousePosition.x = scope.mouseBounds.minX;
        } else if (scope.mousePosition.x > scope.mouseBounds.maxX) {
            scope.mousePosition.x = scope.mouseBounds.maxX;
        }

        if (scope.mousePosition.y < scope.mouseBounds.minY) {
            scope.mousePosition.y = scope.mouseBounds.minY;
        } else if (scope.mousePosition.y > scope.mouseBounds.maxY) {
            scope.mousePosition.y = scope.mouseBounds.maxY;
        }

        scope.drawMouseCursor();
    }

    this.drawMouseCursor = function() {
        this.mouseSprite.position.set(scope.mousePosition.x, scope.mousePosition.y, 0);
    }

    this.setupMouseCursor = function() {
        var cursorTexture = THREE.ImageUtils.loadTexture(this.CURSOR_IMAGE_PATH);

        // suggested- alignment: THREE.SpriteAlignment.center  for targeting-style icon
        //            alignment: THREE.SpriteAlignment.topLeft for cursor-pointer style icon
        var cursorMaterial = new THREE.SpriteMaterial({
            map: cursorTexture,
            useScreenCoordinates: true,
            // alignment: THREE.SpriteAlignment.center
            alignment: THREE.SpriteAlignment.topLeft
        });
        this.mouseSprite = new THREE.Sprite(cursorMaterial);
        this.mouseSprite.scale.set(40, 40, 1.0);
        this.mouseSprite.position.set(this.mousePosition.x, this.mousePosition.y, 0);
        this.scene.add(this.mouseSprite);
    }

    this.getMousePosition = function() {
        return scope.mousePosition;
    }

    // set up mouse sprite for mouse cursor display
    this.mouseSprite = null;
    this.setupMouseCursor();

    // create synthetic events - allow mouse click with "corrected" mouse position (from pointerlock) on HTML DOM elements to occur correctly
    document.addEventListener("click", function(e) {
        if (e._isSynthetic)
            return;
        // send a synthetic click
        var ee = document.createEvent("MouseEvents");
        ee._isSynthetic = true;
        x = scope.mousePosition.x;
        y = scope.mousePosition.y;
        ee.initMouseEvent("click", true, true, null, 1,
            x + e.screenX - e.clientX,
            y + e.screenY - e.clientY,
            x,
            y);
        var target = document.elementFromPoint(x, y);
        if (target) {
            target.dispatchEvent(ee);
        }
    });

    this.handleResize();
};

THREE.MapControls.prototype = Object.create( THREE.EventDispatcher.prototype );