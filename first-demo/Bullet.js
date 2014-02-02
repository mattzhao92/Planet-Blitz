var BULLET_RADIUS = 10;


var Bullet = Class.extend({
  generateLaserBodyCanvas: function() {
    // init canvas
    var canvas  = document.createElement( 'canvas' );
    var context = canvas.getContext( '2d' );
    canvas.width  = 1;
    canvas.height = 64;
    // set gradient
    var gradient  = context.createLinearGradient(0, 0, canvas.width, canvas.height);    
    gradient.addColorStop( 0  , 'rgba(  0,  0,  0,0.1)' );
    gradient.addColorStop( 0.1, 'rgba(160,160,160,0.3)' );
    gradient.addColorStop( 0.5, 'rgba(255,255,255,0.5)' );
    gradient.addColorStop( 0.9, 'rgba(160,160,160,0.3)' );
    gradient.addColorStop( 1.0, 'rgba(  0,  0,  0,0.1)' );
    // fill the rectangle
    context.fillStyle = gradient;
    context.fillRect(0,0, canvas.width, canvas.height);
    // return the just built canvas 
    return canvas;  
  },

  // requires two Vector3 denoting start and end
  init: function(world, owner, from, to) {

    this.radius = BULLET_RADIUS;
    this.world = world;

    // var material = new THREE.ShaderMaterial( 
    // {
    //     uniforms: 
    //   { 
    //     "c":   { type: "f", value: 1.0 },
    //     "p":   { type: "f", value: 1.4 },
    //     glowColor: { type: "c", value: new THREE.Color(0x82E6FA) },
    //     viewVector: { type: "v3", value: world.camera.position }
    //   },
    //   vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
    //   fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
    //   side: THREE.FrontSide,
    //   blending: THREE.AdditiveBlending,
    //   transparent: true
    // }   );

  var canvas  = this.generateLaserBodyCanvas()
  var texture = new THREE.Texture( canvas );
  texture.needsUpdate = true;

      
  var material  = new THREE.MeshBasicMaterial({
    map   : texture,
    blending  : THREE.AdditiveBlending,
    color   : 0x4444aa,
    side    : THREE.DoubleSide,
    depthWrite  : false,
    transparent : true
  })


    // var geometry = new THREE.SphereGeometry(BULLET_RADIUS, 8, 6);

    var object3d  = new THREE.Object3D();
    var geometry  = new THREE.PlaneGeometry(5, 3)
    var nPlanes = 16;
    for(var i = 0; i < nPlanes; i++) {
      var mesh  = new THREE.Mesh(geometry, material);
      mesh.position.x = 1/2;
      mesh.rotation.x = i/nPlanes * Math.PI;
      object3d.add(mesh);
    }

    // var material = new THREE.MeshBasicMaterial({
    //   color: 0x000000
    // });
    // this.mesh = new THREE.Mesh(sphereGeometry, material);
    this.mesh = object3d;
    this.mesh.position = from.clone();
    this.startPosition = from.clone();

    this.speed = 500;
    this.damage = 20;

    this.maxDistance = 1000;

    // alias to position
    this.position = this.mesh.position;
    this.direction = to.clone().sub(from).normalize();

    // store who shot the bullet
    this.owner = owner;
  },

  getPosition: function() {
    return this.position;
  },

  getRadius: function() {
    return BULLET_RADIUS;
  },

  update: function(delta) {
    var distance = new THREE.Vector3().subVectors(this.mesh.position, this.startPosition).length();

    var scaledDirection = new THREE.Vector3();
    scaledDirection.copy(this.direction).multiplyScalar(this.speed * delta);
    this.mesh.position.add(scaledDirection);

    if (distance > this.maxDistance) {
      this.world.handleBulletDestroy(this);
    }
  }
});

// var BulletFactory = Class.extend({
//   init: function(world) {
//     this.world = world;

//     // this.BULLET_RADIUS = 3;
//     var BULLET_RADIUS = 3;
//     this.bulletGeometry = new THREE.SphereGeometry(BULLET_RADIUS, 8, 6);
//   },

//   createBullet: function(from, to) {
//     return new Bullet(this.world, from, to);
//   }

// })