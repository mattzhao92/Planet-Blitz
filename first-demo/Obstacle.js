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
      // var obstacle_bounding_cube = new THREE.CubeGeometry(size,size,size);
      // var obstacle_bounding_cube_material = new THREE.MeshLambertMaterial({opacity: this.opacity, transparent:true});

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

           // scale to correct width / height / depth
            geometry.computeBoundingBox();

            // use bounding box to scale model correctly to the character size
            var boundingBox = geometry.boundingBox;
            var width = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
            var height = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
            var depth = geometry.boundingBox.max.z - geometry.boundingBox.min.z;

            var ratio = Constants.ORIGINAL_TILESIZE / width;
            scope.obstacle_mesh.scale.set(ratio, ratio, ratio);

            
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
