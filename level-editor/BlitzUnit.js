var Unit = Class.extend({

    init: function(type, color, opacity, size, teamId) {
        this.color = color;
        this.teamId = teamId;
        this.xPos = 0;
        this.zPos = 0;
        this.unitType = type;
        this.opacity = opacity;
        this.unitSize = size;
        this.initBoundBoxAndUnitMesh();
        this.setUnitSize(size);
    },

    toJson: function(unit) {
        if (unit == null)
            unit = this;
        exportObject = {'color': unit.color,
                        'teamId': unit.teamId,
                        'xPos': unit.xPos,
                        'zPos': unit.zPos,
                        'unitType': unit.unitType,
                        'opacity' : unit.opacity,
                        'unitSize' : unit.unitSize
        };
        return JSON.stringify(exportObject);
    },

    fromJson: function(jsonStr) {
        var jsonObject = JSON.parse(jsonStr);
        return new Unit(jsonObject.unitType, jsonObject.color, jsonObject.opacity, jsonObject.unitSize, jsonObject.teamId);
    },

    initBoundBoxAndUnitMesh: function() {
    	var size = Constants.ORIGINAL_TILESIZE;
    	var unit_bounding_cube = new THREE.CubeGeometry(size,size,size);
		var unit_bounding_cube_material = new THREE.MeshLambertMaterial({color : this.color, opacity: this.opacity, transparent:true});

		this.box_mesh = new THREE.Mesh( unit_bounding_cube, unit_bounding_cube_material );

		var path_to_mesh = "";
		
		switch(this.unitType)
		{
		case "soldier":
		  path_to_mesh = "blendermodels/soldier-regular.js";
		  break;
		case "artillery":
		  path_to_mesh = "blendermodels/soldier-artillery.js";
		  break;
		default:
		  path_to_mesh = "blendermodels/soldier-flamethrower.js";
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

    setUnitSize: function(newUnitSize) {
    	var scale = newUnitSize / Constants.ORIGINAL_TILESIZE;
    	if (newUnitSize != this.unitSize) {
    		this.box_mesh.scale.x = scale;
    		this.box_mesh.scale.y = scale;
    		this.box_mesh.scale.z = scale;
    		this.box_mesh.position.y = newUnitSize / 2;
    	}
    	this.unitSize = newUnitSize;
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
            // materials[0].color = scope.teamColor;
            // materials[1].color = scope.teamColor;
            // materials[10].color = scope.teamColor;

            var combinedMaterials = new THREE.MeshFaceMaterial(materials);
            scope.unit_mesh = new THREE.Mesh(geometry, combinedMaterials);

            // scale to correct width / height / depth
            geometry.computeBoundingBox();


            // TODO: should use this bounding box to compute correct scale
            var boundingBox = geometry.boundingBox;
            var width = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
            var height = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
            var depth = geometry.boundingBox.max.z - geometry.boundingBox.min.z;
            var size = Constants.ORIGINAL_TILESIZE;
            scope.unit_mesh.scale.set(size/10, size/10, size/10);
            
            box_mesh.add(scope.unit_mesh);
    	});
    },

    getUnitMesh: function() {
    	return this.box_mesh;
    }, 


    getUnitColor: function() {
        return this.color;
    },

    clone : function(opacity) {
        if (opacity == null)
            opacity = 0.0
    	var myclone = new Unit(this.unitType, this.color, opacity, this.unitSize, this.teamId);
        console.log("clone unit teamid "+this.teamId);
        return myclone;
    }

});
