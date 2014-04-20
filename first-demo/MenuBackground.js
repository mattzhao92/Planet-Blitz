var MenuBackground = Class.extend({
	init: function(containerName) {
		console.log("Menu background created");
		// create a scene, that will hold all our elements such as objects, cameras and lights.
		this.scene = new THREE.Scene();

		// create a render and set the size
		this.renderer = new THREE.WebGLRenderer({antialias: true, maxLights: 20});
		this.renderer.setClearColor(0x000000);


		this.renderer.gammaInput = true;
		this.renderer.gammaOutput = true;
		this.clock = new THREE.Clock();

		this.renderer.setSize(window.innerWidth, window.innerHeight);

		// add the output of the renderer to the html element
		$(containerName).append(this.renderer.domElement);

		this.addSkybox();

		this.setupCamera();
		this.setupControls();

		// this.setupGround();
		this.setupPodium();

		this.addLighting();

		// begin animation loop
		this.animate();

		var scope = this;
		window.addEventListener( 'resize', function() {
		    scope.onWindowResize(); }, false );
	},

	setupGround: function() {
		var texture = THREE.ImageUtils.loadTexture("gndTexture/gnd-dirty.jpg");

		this.gridWidth = 400;
		this.gridLength = 400;

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
		ground.position.x -= this.gridWidth / 2;
		ground.position.z -= this.gridLength / 2;

		this.scene.add(ground);
	},

	setupPodium: function() {
		this.mesh = new THREE.Object3D();

		var d = new Date();
		var numSeconds = d.getSeconds();
		var characterModel;
		if (numSeconds % 3 == 0) {
			characterModel = "blendermodels/soldier-regular.js";
		} else if (numSeconds % 3 == 1) {
			characterModel = "blendermodels/soldier-artillery.js";
		} else {
			characterModel = "blendermodels/soldier-flamethrower.js";
		}
		this.loadFile(characterModel, this.mesh);
		this.scene.add(this.mesh);
	},

	addLighting: function() {
	    // really subtle ambient lighting
	    var ambientLight = new THREE.AmbientLight( 0x191919 );
	    this.scene.add( ambientLight );

	    // this.scene.remove( ambientLight );
	    // // sky color, ground color, intensity
	    // // var hemiLight = new THREE.HemisphereLight( 0x0000ff, 0xffffff, 0.3 ); 
	    // // this.scene.add(hemiLight);

	    // // a really bright light
	    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
	    directionalLight.position.x = 0;
	    directionalLight.position.y = 400;
	    directionalLight.position.z = 0;
	    this.scene.add( directionalLight );
	},

	addSkybox: function() {
	    var skyGeometry = new THREE.CubeGeometry( 4000, 4000, 4000 );
	    
	    // x +, x -, y + , y -, z +, z -
	    var filenames = [
	    'images/sky08_lf.jpg', 
	    'images/sky08_rt.jpg',
	    'images/sky08_up.jpg',
	    'images/sky08_dn.jpg',
	    'images/sky08_ft.jpg',
	    'images/sky08_bk.jpg'];

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

	    // create sprite factory
	    var scope = this;
	    scope.getTileSize = function() {
	    	return 200;
	    }
	    var sceneAddCmd = new SpriteCmd(function(sprite) {
	        scope.scene.add(sprite.getRepr());
	    });
	    var sceneRemoveCmd = new SpriteCmd(function(sprite) {
	        scope.scene.remove(sprite.getRepr());
	    });	

	    // add a character
	    this.spriteFactory = new SpriteFactory(this, sceneAddCmd, sceneRemoveCmd);
	},

	loadFile: function(filename, mesh) {

	  var fullFilename = filename;
	  var myloader = new THREE.JSONLoader();
	  var scope = this;
	  myloader.load(fullFilename, function(geometry, materials) {      
	        var combinedMaterials = new THREE.MeshFaceMaterial(materials);
	        scope.ext_file_mesh = new THREE.Mesh(geometry, combinedMaterials);
	        Utils.resize(scope.ext_file_mesh, 400);
	        mesh.add(scope.ext_file_mesh);
	  });
	},

	setupCamera: function() {
	    // create a camera, which defines where we're looking at
	    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 8000);
	    this.camera.position.x = 0;
	    this.camera.position.y = 300;
	    this.camera.position.z = 500;

	    var origin = new THREE.Vector3(0, 0, 0);
	    this.camera.lookAt(origin);
	},

	setupControls: function() {
		this.controls = new THREE.OrbitControls(this.camera, document.getElementById("background-3d"));
		this.controls.autoRotate = true;
		this.controls.autoRotateSpeed = 0.5;
		this.controls.maxDistance = 1500;
		this.controls.minDistance = 300;
	},

	update: function() {
	    var delta = this.clock.getDelta();
	    this.controls.update(delta);
	},

	animate: function() {
	    this.update();

	    // standard: render using requestAnimationFrame
	    var me = this;
	    window.requestAnimFrame(function() {
	        me.animate();
	    });

	    // render function - can optionally add shaders later
	    this.renderer.render(this.scene, this.camera);
	},

	onWindowResize: function() {

	    this.camera.aspect = window.innerWidth / window.innerHeight;
	    this.camera.updateProjectionMatrix();

	    this.renderer.setSize(window.innerWidth, window.innerHeight);

	    // could technically controls.resize here
	},

	destroy: function() {
		Utils.deallocate(this.scene);
	}

});