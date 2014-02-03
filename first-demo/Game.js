$(function () {

    var App = {};

    App = function(containerName) {
        // create a scene, that will hold all our elements such as objects, cameras and lights.
        this.scene = new THREE.Scene();

        // create a render and set the size
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // add the output of the renderer to the html element
        $(containerName).append(this.renderer.domElement);

        this.init();
    };

    App.prototype = {
        init: function() {

            this.stats = this.initStats();

            this.setupCamera();
            this.setupCameraControls();

            this.setupGameWorld();
            this.addLighting();

            this.addControlGUI();

            // begin animation loop
            this.animate();

            var scope = this;
            window.addEventListener( 'resize', function() {
                scope.onWindowResize() }, false );
        }, 

        setupCamera: function() {
            // create a camera, which defines where we're looking at
            this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
            this.camera.position.x = 0;
            this.camera.position.y = 150;
            this.camera.position.z = 270;

            var origin = new THREE.Vector3(0, 0, 0);
            this.camera.lookAt(origin);
        },

        addLighting: function() {
            var ambientLight = new THREE.AmbientLight( 0x404040 );
            this.scene.add( ambientLight );

            var directionalLight = new THREE.DirectionalLight( 0xffffff );
            directionalLight.position.x = 1;
            directionalLight.position.y = 1;
            directionalLight.position.z = 0.75;
            directionalLight.position.normalize();
            this.scene.add( directionalLight );

            var directionalLight = new THREE.DirectionalLight( 0x808080 );
            directionalLight.position.x = - 1;
            directionalLight.position.y = 1;
            directionalLight.position.z = - 0.75;
            directionalLight.position.normalize();
            this.scene.add( directionalLight );
        },

        setupCameraControls: function() {
            this.clock = new THREE.Clock();
            var controls = new THREE.MapControls(this.camera, document.getElementById("WebGL-output"));
            controls.panSpeed = .31;

            // ensure that camera can't rotate too far down or up
            controls.minPolarAngle = 0.3;
            controls.maxPolarAngle = 1.26;

            this.controls = controls;
        },

        addControlGUI: function() {
            var gui = new dat.GUI();
        },

        setupGameWorld: function() {
            var squareSize = 40;
            this.world = new Grid(400, 400, squareSize, this.scene, this.camera);
        },

        update: function() {
            TWEEN.update();
            this.stats.update();

            var delta = this.clock.getDelta();
            this.controls.update(delta);
            
            // main game render loop
            this.world.update(delta);
        },

        animate: function() {
            this.update();

            // standard: render using requestAnimationFrame
            var me = this;
            requestAnimationFrame(function() {
                me.animate();
            });

            // render function - can optionally add shaders later
            this.renderer.render(this.scene, this.camera);
        }, 

        initStats: function() {
            var stats = new Stats();

            stats.setMode(0); // 0: fps, 1: ms

            // Align top-left
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = '0px';
            stats.domElement.style.top = '0px';

            $("#Stats-output").append( stats.domElement );

            return stats;
        }, 

        onWindowResize: function() {

            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize( window.innerWidth, window.innerHeight );

            // adjust camera controls
            this.controls.handleResize();
        },

				getWorld: function() {
						return this.world;
				}

    };

    var app = new App("#WebGL-output");
    var MAPGAME = app;
		game = app;

});

