var Obstacle = Class.extend({

    init: function(type, opacity, size) {
        this.xPos = 0;
        this.zPos = 0;
        this.obstacleSize = size;
        this.obstacleType = type;
        this.opacity = opacity;
        this.initBoundBoxAndMesh();
        this.setSize(size);
    },

    toJson: function(obstacle) {
        if (obstacle == null)
            obstacle = this;
        exportObject = {'xPos': obstacle.xPos,
                        'zPos': obstacle.zPos,
                        'obstacleType': obstacle.obstacleType,
                        'obstacleSize' : obstacle.obstacleSize
        };
        return JSON.stringify(exportObject);
    },

    fromJson: function(jsonStr) {
        var jsonObject = JSON.parse(jsonStr);
        var new_obstacle = new Obstacle(jsonObject.obstacleType, 0.0, jsonObject.obstacleSize);
        new_obstacle.xPos = jsonObject.xPos;
        new_obstacle.zPos = jsonObject.zPos;
        return new_obstacle;
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
        case "powerup-health":
          path_to_mesh = "blendermodels/powerup-health.js"
          break;
        case "crate":
          path_to_mesh = "blendermodels/obstacle-exCrate.js";
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

    setSize: function(newSize) {
    	var scale = newSize / Constants.ORIGINAL_TILESIZE;
    	if (newSize != this.obstacleSize) {
    		this.box_mesh.scale.x = scale;
    		this.box_mesh.scale.y = scale;
    		this.box_mesh.scale.z = scale;
    		this.box_mesh.position.y = newSize / 2;
    	}
    	this.obstacleSize = newSize;
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
            Utils.resize(scope.obstacle_mesh, Constants.ORIGINAL_TILESIZE / 2);
            box_mesh.add(scope.obstacle_mesh);
      });
    },

    getMesh: function() {
    	return this.box_mesh;
    }, 

    clone : function() {
    	return new Obstacle(this.obstacleType, 0.0, this.obstacleSize);
    }

});
