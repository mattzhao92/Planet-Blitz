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
    	var obstacle_bounding_cube = new THREE.CubeGeometry(size,size,size);
		  var obstacle_bounding_cube_material = new THREE.MeshLambertMaterial({opacity: this.opacity, transparent:true});

      var material = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('blendertextures/crate.png')
      });

      var materials = [material,material,material,material,material,material];

      this.box_mesh = new THREE.Mesh(new THREE.CubeGeometry(40, 40, 40, 1, 1, 1), new THREE.MeshFaceMaterial(materials))

		// var path_to_mesh = "";
		
		// switch(this.obstacleType)
		// {
		// case "rock":
		//   path_to_mesh = "blendermodels/rock.js";
		//   break;
		// case "powerup-health":
		//   path_to_mesh = "blendermodels/powerup-health.js"
		//   break;
		// default:
		//   path_to_mesh = "blendermodels/rock.js";
		//   break;
		// }
  //       this.loadFile(path_to_mesh, this.box_mesh);
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


        var combinedMaterials = new THREE.MeshNormalMaterial();
        scope.obstacle_mesh = new THREE.Mesh(new THREE.CubeGeometry(40, 40, 40), combinedMaterials);
        var size = Constants.ORIGINAL_TILESIZE;
        scope.obstacle_mesh.scale.set(size/10, size/10, size/10);
        
        box_mesh.add(scope.obstacle_mesh);

		// myloader.load(fullFilename, function(geometry, materials) {
  //           // var combinedMaterials;
  //           // if (fullFilename == "blendermodels/rock.js") {
  //           //     combinedMaterials = new THREE.MeshNormalMaterial();
  //           //     scope.obstacle_mesh = new THREE.Mesh(new THREE.CubeGeometry(40, 40, 40), combinedMaterials);
  //           // } else {
  //           //     combinedMaterials = new THREE.MeshFaceMaterial(materials);
  //           //     scope.obstacle_mesh = new THREE.Mesh(geometry, combinedMaterials);
  //           // }

  //           var ombinedMaterials = new THREE.MeshNormalMaterial();
  //           scope.obstacle_mesh = new THREE.Mesh(new THREE.CubeGeometry(40, 40, 40), combinedMaterials);

  //           // scale to correct width / height / depth
  //           geometry.computeBoundingBox();

  //           // TODO: should use this bounding box to compute correct scale
  //           var boundingBox = geometry.boundingBox;
  //           var width = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
  //           var height = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
  //           var depth = geometry.boundingBox.max.z - geometry.boundingBox.min.z;
  //           var size = Constants.ORIGINAL_TILESIZE;
  //           scope.obstacle_mesh.scale.set(size/10, size/10, size/10);
            
  //           box_mesh.add(scope.obstacle_mesh);
  //   	});
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
