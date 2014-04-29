// namespacing for colors
function Constants() {
	
};

// dark red, light blue, dark green, gold
Constants.TEAM_COLORS = [0x990000, 0x007A29, 0x0066CC, 0xD4A017, 0xFFCC66, 0x669900, 0x0099CC];

Constants.GLOW_COLORS = {green: new THREE.Color(0x66E066)};

Constants.BULLET_LEVEL = 15;

// used to listen for clock updates
Constants.TOPIC_DELTA = "delta";

Constants.HOTKEYS = ["q", "e", "space", "r", "t", "tab", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "ctrl", "shift", "command"];

Constants.ACTIVE_KEYBINDINGS = {};

// used to listen for camera position
Constants.TOPIC_CAMERA_POSITION = "cameraPosition";
Constants.TOPIC_CAMERA_ROTATION = "cameraRotation";

// used to refresh all materials for lighting recalculations
Constants.TOPIC_REFRESH_MATERIALS = "refreshMaterials";

var SENT_FROM_TUTORIAL = false;

var RIGHT_CLICK = 3;
var LEFT_CLICK = 1;

function Colors() {

}

// light-orange
Colors.EXPLOSION = 0xFF8929;

Constants.ORIGINAL_TILESIZE = 40;

function Hotkeys() {

}

Hotkeys.disableHotkeys = function() {

	// remove previous hotkey bindings
	_.forEach(Constants.HOTKEYS, function(hotkey) {
	    KeyboardJS.clear(hotkey);
	    // remove all bindings that use given key inside the combo
	    KeyboardJS.clear.key(hotkey);
	});
}

function Utils() {

}

Utils.deallocate = function(scene) {

	for (var i = 0; i < 8; i++) {
	    try {
	        if (scene) {
	            // TODO: need to dispose of the texture
	            scene.traverse(function(obj) {
	                // console.log(obj);
	                scene.remove(obj);

	                if (obj.geometry) {
	                    // console.log("dispose geometry");
	                    obj.geometry.dispose();
	                }

	                if (obj.material) {
	                    // console.log("dispose material");
	                    // console.log(obj.material.texture);
	                    if (obj.material.materials) {
	                        _.forEach(obj.material.materials, function(material) {
	                            material.dispose();
	                        });
	                    } else {
	                        obj.material.dispose();
	                    }
	                }

	                // dispose of textures
	                // TODO: deallocate textures
	            });
	        }
	    } catch (e) {
	        // not proud of this, but there are problems with traversing the scene and disposing of it the same way
	    }
	}
}

// scales to fit width
Utils.resize = function(mesh, size) {
	var boundingBox = mesh.geometry.computeBoundingBox();

	var boundingBox = mesh.geometry.boundingBox;
	var width = boundingBox.max.x - boundingBox.min.x;
	var height = boundingBox.max.y - boundingBox.min.y;
	var depth = boundingBox.max.z - boundingBox.min.z;

	var ratio = size / width;
	mesh.scale.set(ratio, ratio, ratio);
}

function Sounds() {

}

// Sounds.weapons = {};

Sounds['laser-shoot.mp3'] = new Howl({
  urls: ['laser-shoot.mp3'],
  volume: 0.4
});

Sounds['unit-select.mp3'] = new Howl({
    urls: ['unit-select.mp3'],
    volume: 0.4,
});

Sounds['tutorial-msg'] = new Howl({
    urls: ['tutorial-msg.mp3'],
    volume: 0.6,
});

Sounds['game-create'] = new Howl({
    urls: ['game-create.mp3'],
    volume: 0.6,
});

Sounds['game-start'] = new Howl({
    urls: ['game-start.mp3'],
    volume: 0.6,
});

Sounds['game-join'] = new Howl({
    urls: ['game-join.mp3'],
    volume: 0.6,
});



// used for tutorials
function Topic() {

}

Topic.CHARACTER_DEAD = "character.dead";
Topic.CHARACTER_SELECTED = "character.selected";
Topic.CHARACTER_MULTI_SELECTED = "character.multiSelect";
Topic.CHARACTER_SHOOT = "character.shoot";
Topic.CHARACTER_MOVE = "character.move";
Topic.CAMERA_PAN = "camera.pan";
Topic.CHARACTER_ROTATION = "character.lookAround";
Topic.ENTER_POINTERLOCK = "controls.enterPointerlock";

Topic.CHARACTER_DESELECTED = "character.deselected";
Topic.HOTKEY_ASSIGNED = "hotkey.assigned";

function LoaderCache() {

}


var JSONloader = new THREE.JSONLoader();

var modelNames = ['soldier-artilleryDetailed.js', 'soldier-artillery.js', 'soldier-regular.js', 'soldier-flamethrower.js', 'soldier-flamethrowerDetailed.js'];

_.forEach(modelNames, function(modelName) {
	
	JSONloader.load(modelName, function(geometry, materials) {
		LoaderCache[modelName] = {};
		LoaderCache[modelName]["geometry"] = geometry;
		LoaderCache[modelName]["materials"] = materials;
	});
});
