$(function () {

    var Editor = {};

    Editor = function(containerName) {
        // create a scene, that will hold all our elements such as objects, cameras and lights.
        this.scene = new THREE.Scene();

        // create a render and set the size
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // add the output of the renderer to the html element
        $(containerName).append(this.renderer.domElement);

        this.init(containerName);
    };

    Editor.prototype = {
        init: function(containerName) {
            this.GRID_WIDTH = 400;
            this.GRID_LENGTH = 400;

            // this.createGameConsole();
            // this.createScoreBoard();

            this.setupCamera();
            this.setupCameraControls();

            this.editorModel = this.initModel();

            this.setupGameWorld();
            this.addLighting();
            //this.addSkybox();

            // this.addControlGUI();

            // begin animation loop
            this.animate();

            var scope = this;
            window.addEventListener( 'resize', function() {
                scope.onWindowResize(); }, false );
        }, 

        setupCamera: function() {
            // create a camera, which defines where we're looking at
            this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 8000);
            this.camera.position.x = 0;
            this.camera.position.y = 600;
            this.camera.position.z = 400;

            var origin = new THREE.Vector3(0, 0, 0);
            this.camera.lookAt(origin);
        },

        addLighting: function() {
            // really subtle ambient lighting
            var ambientLight = new THREE.AmbientLight( 0x191919 );
            this.scene.add( ambientLight );

            // sky color, ground color, intensity
            // var hemiLight = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.6 ); 
            // this.scene.add(hemiLight);

            // a really bright light
            var directionalLight = new THREE.DirectionalLight( 0xffffff );
            directionalLight.position.x = 1;
            directionalLight.position.y = 1;
            directionalLight.position.z = 0.75;
            directionalLight.position.normalize();

            this.scene.add( directionalLight );
        },

        addSkybox: function() {
            var skyGeometry = new THREE.CubeGeometry( 4000, 4000, 4000 );
            
            // x +, x -, y + , y -, z +, z -
            var filenames = [
            '../assets/images/sky08_lf.jpg', 
            '../assets/images/sky08_rt.jpg',
            '../assets/images/sky08_up.jpg',
            '../assets/images/sky08_dn.jpg',
            '../assets/images/sky08_ft.jpg',
            '../assets/images/sky08_bk.jpg'];

            // imagePrefix + directions[i] + imageSuffix
            var materialArray = [];
            for (var i = 0; i < 6; i++)
                materialArray.push( new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture( filenames[i]),
                    side: THREE.BackSide
                }));
            var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
            var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
            this.scene.add( skyBox );
        },

        setupCameraControls: function() {
            this.clock = new THREE.Clock();
            var controls = new THREE.MapControls(this.camera, this.scene, document.getElementById("WebGL-output"));
            controls.panSpeed = 0.31;

            // ensure that camera can't rotate too far down or up
            controls.minPolarAngle = 0.3;
            controls.maxPolarAngle = 1.26;

            // set up control boundaries
            controls.minX = -this.GRID_WIDTH / 2;
            controls.maxX = this.GRID_WIDTH / 2;

            controls.minZ = -this.GRID_LENGTH / 2;
            controls.maxZ = this.GRID_LENGTH / 2;

            controls.minDistance = 240;
            controls.maxDistance = 2000;
            this.controls = controls;
        },

        addControlGUI: function() {
            //var gui = new dat.GUI();
        },

        setupGameWorld: function() {
            var squareSize = 40;
            //this.world = new Grid(this, 800, 800, squareSize, this.scene, this.camera, this.controls);
        },

        update: function() {
            //this.stats.update();

            var delta = this.clock.getDelta();
            this.controls.update(delta);

            PubSub.publishSync(Constants.TOPIC_DELTA, delta);
            
            // main game render loop
            this.editorModel.update(delta);
            //this.world.update(delta);
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

        initModel: function() {
            //var stats = new Stats();

            var editorModel = new EditorModel(this.scene, this.camera);
            // stats.setMode(0); // 0: fps, 1: ms

            // // Align top-left
            // stats.domElement.style.position = 'absolute';
            // stats.domElement.style.left = '9px';
            // stats.domElement.style.top = '10px';

            // $("#Stats-output").append(stats.domElement);

            //return stats;
            return editorModel;
        },

        createGameConsole: function() {
            var gameConsole = new GameConsole();
            $("#Stats-output").append(gameConsole.domElement);
            gameConsole.displayInitialMessage("Welcome to Planet Blitz! Fight to the death!");

            this.gameConsole = gameConsole;
        },


        createScoreBoard: function() {
            var scoreBoard = new ScoreBoard();
            $("#Stats-output").append(scoreBoard.domElement);
            var exampleData = [{'name' : 'matt', 'score': 2}, {'name' : 'anderson', 'score' : 5}];
            this.scoreBoard = scoreBoard;
        },


        // scores is expected to be a list of jsonObjects [{name: 'matt', score: 5}, ..]
        updateScoreBoard: function(listOfScores) {
            this.scoreBoard.setText(listOfScores);
        },


        displayMessage: function(msg) {
            this.gameConsole.append(msg);
        },

        onWindowResize: function() {

            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(window.innerWidth, window.innerHeight);

            // adjust camera controls
            this.controls.handleResize();
        },

        getWorld: function() {
            return this.world;
        },

        reset: function() {
            this.world.reset();
        }

    };

    var editor = new Editor("#WebGL-output");

});

