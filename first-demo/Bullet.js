var Bullet = Class.extend({
  // requires two Vector3 denoting start and end
  init: function(from, to) {
    var BULLET_RADIUS = 5;

    var sphereGeometry = new THREE.SphereGeometry(BULLET_RADIUS, 8, 6);
    var material = new THREE.MeshBasicMaterial({
      color: 0x000000
    });
    this.mesh = new THREE.Mesh(sphereGeometry, material);
    this.mesh.position = from.clone();

    // this.direction = direction;
    this.direction = null;
    this.speed = 1000;
    this.damage = 20;

    this.direction = to.clone().sub(from).normalize();

  },

  update: function(delta) {
    // console.log("bullet update");
    var scaledDirection = new THREE.Vector3();
    scaledDirection.copy(this.direction).multiplyScalar(this.speed * delta);
    this.mesh.position.add(scaledDirection);
  }
});
