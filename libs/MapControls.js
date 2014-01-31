/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author pc123 / http://github.com/pc123
 */

THREE.MapControls = function ( object, domElement ) {

    this.object = object;
    this.domElement = ( domElement !== undefined ) ? domElement : document;

    // API

    this.enabled = true;

    this.center = new THREE.Vector3();

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

    this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

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
    var scale = 1;

    var lastPosition = new THREE.Vector3();

    var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2 };
    var state = STATE.NONE;


    // merged in from trackball controls
    this.screen = { width: window.innerWidth, height: window.innerHeight, offsetLeft: 0, offsetTop: 0, top: 0, left: 0};

    // can put in resize logic later
    this.radius = ( this.screen.width + this.screen.height ) / 4;

    _eye = new THREE.Vector3();

    var _this = this;
    this.dynamicDampingFactor = 0.15;
    this.panSpeed = 0.35;


    // events

    var changeEvent = { type: 'change' };

    var _panStart = new THREE.Vector2();
    var _panEnd = new THREE.Vector2();

    this.handleResize = function () {
        if ( this.domElement === document ) {

            this.screen.left = 0;
            this.screen.top = 0;
            this.screen.width = window.innerWidth;
            this.screen.height = window.innerHeight;

        } else {

            this.screen = this.domElement.getBoundingClientRect();

        }

    };


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


        thetaDelta -= angle;

    };

    this.getMouseOnScreen = function ( clientX, clientY ) {

        var result = new THREE.Vector2(
            ( clientX - _this.screen.left ) / _this.screen.width,
            ( clientY - _this.screen.top ) / _this.screen.height
        );
        // console.log("getMouseOnScreen (%4f, %4f)", result.x, result.y);

        // console.log("%d, %d", _this.screen.left, _this.screen.top);
        // console.log("%d, %d", _this.screen.width, _this.screen.height);

        return result;

    };

    this.rotateRight = function ( angle, rotateStart, rotateEnd) {

        if ( angle === undefined ) {

            angle = getAutoRotationAngle();

        }


        thetaDelta += angle;

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
            // console.log("panStart %f, %f", _panStart.x, _panStart.y);
            // console.log("panEnd %f, %f", _panEnd.x, _panEnd.y);

            mouseChange.multiplyScalar(_this.panSpeed * _eye.length());

            var distance = _eye.clone();
            distance = distance.cross(this.object.up).setLength(mouseChange.x);

            var unitZVector = new THREE.Vector3(0, 0, -1);
            // transform the unit z vector into camera's local space
            distance.add(unitZVector.transformDirection(this.object.matrix).setLength(mouseChange.y));
            // prevent camera from getting closer to grid
            distance.y = 0;

            this.object.position.add( distance );
            this.center.add( distance );

            _panStart.add(mouseChange.subVectors(_panEnd, _panStart).multiplyScalar(_this.dynamicDampingFactor));
        }
    };

    this.update = function () {
        _eye.subVectors(_this.object.position, this.center);
        _this.pan();

        var position = this.object.position;
        var offset = position.clone().sub( this.center );

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

        position.copy( this.center ).add( offset );

        this.object.lookAt( this.center );

        thetaDelta = 0;
        phiDelta = 0;
        scale = 1;

        if ( lastPosition.distanceTo( this.object.position ) > 0 ) {

            this.dispatchEvent( changeEvent );

            lastPosition.copy( this.object.position );

        }

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

        if ( event.button === 0 ) {

            state = STATE.PAN;

            _panStart = _panEnd = _this.getMouseOnScreen(event.clientX, event.clientY);
            // console.log("Set pan start and end (%d, %d)", _panStart, _panEnd);

        } else if ( event.button === 1 ) {

            state = STATE.ZOOM;

            zoomStart.set( event.clientX, event.clientY );

        } else if ( event.button === 2 ) {
         
            state = STATE.ROTATE;

            rotateStart.set( event.clientX, event.clientY );

        }

        document.addEventListener( 'mousemove', onMouseMove, false );
        document.addEventListener( 'mouseup', onMouseUp, false );

    }

    function onMouseMove( event ) {

        if ( scope.enabled === false ) return;

        event.preventDefault();
        event.stopPropagation();

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

            // scope.pan( new THREE.Vector3( - movementX, 0, -movementY ) );

            // _panEnd = _this.getMouseOnScreen(movementX, movementY);
            _panEnd = _this.getMouseOnScreen(event.clientX, event.clientY);

        }

    }

    function onMouseUp( event ) {

        if ( scope.enabled === false ) return;
        if ( scope.userRotate === false ) return;

        document.removeEventListener( 'mousemove', onMouseMove, false );
        document.removeEventListener( 'mouseup', onMouseUp, false );

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

    function onKeyDown( event ) {

        if ( scope.enabled === false ) return;
        if ( scope.userPan === false ) return;

        switch ( event.keyCode ) {

            case scope.keys.UP:
                _panEnd = _panStart.clone().add(new THREE.Vector3(0, 0.04, 0));
                break;
            case scope.keys.BOTTOM:
                _panEnd = _panStart.clone().add(new THREE.Vector3(0, -0.04, 0));
                break;
            case scope.keys.LEFT:
                _panEnd = _panStart.clone().add(new THREE.Vector3(0.04, 0, 0));
                break;
            case scope.keys.RIGHT:
                _panEnd = _panStart.clone().add(new THREE.Vector3(-0.04, 0, 0));
                break;
        }
    }


    function onKeyUp( event ) {


    }


    this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
    this.domElement.addEventListener( 'mousedown', onMouseDown, false );
    this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
    this.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox
    // this.domElement.addEventListener( 'keydown', onKeyDown, false );

    window.addEventListener('keydown', onKeyDown, false);
    // window.addEventListener('keydown', onKeyUp, false);

    this.handleResize();
};

THREE.MapControls.prototype = Object.create( THREE.EventDispatcher.prototype );