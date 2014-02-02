var Bullet = Class.extend({
  // requires two Vector3 denoting start and end
  init: function(world, from, to) {
    this.world = world;
    var BULLET_RADIUS = 3;

    var sphereGeometry = new THREE.SphereGeometry(BULLET_RADIUS, 8, 6);
    var material = new THREE.MeshBasicMaterial({
      color: 0x000000
    });
    this.mesh = new THREE.Mesh(sphereGeometry, material);
    this.mesh.position = from.clone();
    this.startPosition = from.clone();

    this.speed = 1000;
    this.damage = 20;

    this.maxDistance = 1000;

    this.direction = to.clone().sub(from).normalize();

  },

  update: function(delta) {
    var distance = new THREE.Vector3().subVectors(this.mesh.position, this.startPosition).length();

    // console.log("bullet update");
    var scaledDirection = new THREE.Vector3();
    scaledDirection.copy(this.direction).multiplyScalar(this.speed * delta);
    this.mesh.position.add(scaledDirection);

    if (distance > this.maxDistance) {
      this.world.removeBullet(this);
    }

    // TODO: once bullet reaches end position, then remove it from game world
  }
});
