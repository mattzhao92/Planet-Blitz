var BULLET_RADIUS = 5;


var Bullet = Sprite.extend({
  // requires two Vector3 denoting start and end
  init: function(setupCmd, destroyCmd, cameraPosition, owner, from, to) {
    this._super(setupCmd, destroyCmd);

    this.radius = BULLET_RADIUS;

    var material = new THREE.ShaderMaterial({
      uniforms: {
        "c": {
          type: "f",
          value: 1.0
        },
        "p": {
          type: "f",
          value: 1.4
        },
        glowColor: {
          type: "c",
          value: new THREE.Color(0x82E6FA)
        },
        viewVector: {
          type: "v3",
          value: cameraPosition
        }
      },
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    var geometry = new THREE.SphereGeometry(BULLET_RADIUS, 12, 12);

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position = from.clone();
    this.startPosition = from.clone();

    this.speed = 500;
    this.damage = 20;

    this.maxDistance = 240;

    // alias to position
    this.position = this.mesh.position;
    this.direction = to.clone().sub(from).normalize();

    // store who shot the bullet
    this.owner = owner;

    this.active = true;
  },

  getPosition: function() {
    return this.position;
  },

  getRadius: function() {
    return BULLET_RADIUS;
  },

  destroy: function() {
    this._super();
    // this.active = false;
  },

  update: function(delta) {
    var distance = new THREE.Vector3().subVectors(this.mesh.position, this.startPosition).length();

    var scaledDirection = new THREE.Vector3();
    scaledDirection.copy(this.direction).multiplyScalar(this.speed * delta);
    this.mesh.position.add(scaledDirection);

    if (distance > this.maxDistance) {
      // this.destroy();
      // this.applySpriteCmd(this.destroyCmd);
      console.log("Bullet exceeded max distance, destroy");
      this.active = false;
    }
  },

  getRepr: function() {
    return this.mesh;
  }
});