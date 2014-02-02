var Bullet = Class.extend({
  init: function() {
    var BULLET_RADIUS = 5;

    var sphereGeometry = new THREE.SphereGeometry(BULLET_RADIUS, 8, 6);
    var material = new THREE.MeshBasicMaterial({
      color: 0x000000
    });
    this.mesh = new THREE.Mesh(sphereGeometry, material);

    // this.direction = direction;
    this.direction = null;
    this.speed = 1000;
    this.damage = 20;

  },

  update: function(delta) {
    // console.log("bullet update");
    var scaledDirection = new THREE.Vector3();
    scaledDirection.copy(this.direction).multiplyScalar(this.speed * delta);
    this.position.add(scaledDirection);
    this.mesh.position.add(scaledDirection);
  }
});
