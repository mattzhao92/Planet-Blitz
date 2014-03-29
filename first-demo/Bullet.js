var Bullet = Sprite.extend({
  init: function(setupCmd, destroyCmd, args) {
    this._super(setupCmd, destroyCmd);

    // cameraPosition, owner, from, to

    this.radius = args.radius;
    this.mesh = args.mesh;
    this.damage = args.damage;
    this.speed = args.speed;
    this.range = args.range;

    // store who shot the bullet
    this.owner = args.owner;

    // are this many clones really needed?
    this.from = (args.from).clone();
    this.to = (args.to).clone();

    // rest of setup, now that arguments are initialized
    this.mesh.position = this.from.clone();
    this.startPosition = this.from.clone();

    this.direction = (args.to).clone().sub(this.from).normalize();

    this.interactStrategy = new ApplyDamageStrategy(this.damage);

    var light = new THREE.PointLight(0x33CCFF, 3.0, 150);
    this.mesh.add(light);

    // update scene
    PubSub.publish(Constants.TOPIC_REFRESH_MATERIALS, null);

    var moveStrategy = new StraightLineUpdateStrategy(this.direction, this.speed);
    var expireStrategy = new ExpireUpdateStrategy(this.startPosition, this.range);
    this.updateStrategy = new MultiUpdateStrategy([moveStrategy, expireStrategy]);

    var sound = new Howl({
      urls: [args.sound]
    }).play();

  },

  getPosition: function() {
    return this.getRepr().position;
  },

  getRadius: function() {
    return this.radius;
  },

  getRepr: function() {
    return this.mesh;
  }
});