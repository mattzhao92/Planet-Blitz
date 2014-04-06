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

		// begin animation loop
		this.animate();

		var scope = this;
		window.addEventListener( 'resize', function() {
		    scope.onWindowResize(); }, false );

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

	setupControls: function() {
		this.controls = new THREE.OrbitControls(this.camera, document.getElementById("background-3d"));
		this.controls.autoRotate = true;
		this.controls.autoRotateSpeed = 0.5;
	},

	update: function() {
	    var delta = this.clock.getDelta();
	    this.controls.update(delta);

	    // PubSub.publish(Constants.TOPIC_DELTA, delta);
	    
	    // main game render loop
	    // this.world.update(delta);
	    

	    // update with delta

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
	}

});