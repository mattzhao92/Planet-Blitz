var Obstacle = Sprite.extend({

    init: function(setupCmd, destroyCmd, modelName, opacity, size) {
        this._super(setupCmd, destroyCmd);

        this.xPos = 0;
        this.zPos = 0;
        this.obstacleSize = size;
        this.obstacleType = modelName;
        this.opacity = opacity;
        this.initBoundBoxAndMesh();
    },

    initBoundBoxAndMesh: function() {
    	var size = Constants.ORIGINAL_TILESIZE;

      this.box_mesh = new THREE.Object3D();
      var path_to_mesh = "blendermodels/rock.js";

      switch(this.obstacleType)
      {
        case "rock":
          path_to_mesh = "blendermodels/rock.js";
          break;
        case "crate":
          path_to_mesh = "blendermodels/obstacle-exCrate.js";
          break;
        case "powerup-health":
          path_to_mesh = "blendermodels/powerup-health.js"
          break;
        default:
          path_to_mesh = "blendermodels/rock.js";
          break;
      }

      this.loadFile(path_to_mesh, this.box_mesh);

    },

    setXPos: function(xPos) {
    	this.xPos = xPos;
    },

    setZPos: function(zPos) {
    	this.zPos = zPos;
    },

    getXPos: function() {
    	return this.xPos;
    },

    getZPos: function() {
    	return this.zPos;
    },


    loadFile: function(filename, box_mesh) {

      var fullFilename = filename;
      var myloader = new THREE.JSONLoader();
      var scope = this;
      myloader.load(fullFilename, function(geometry, materials) {      
            var combinedMaterials = new THREE.MeshFaceMaterial(materials);
            scope.obstacle_mesh = new THREE.Mesh(geometry, combinedMaterials);

            Utils.resize(scope.obstacle_mesh, Constants.ORIGINAL_TILESIZE);
            box_mesh.add(scope.obstacle_mesh);
      });
    },

    getRepr: function() {
        return this.box_mesh;
    },

    update: function() {

    },

    getRadius: function() {
      return this.obstacleSize/2;
    }

});
