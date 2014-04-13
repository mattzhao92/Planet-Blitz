// namespacing for colors
function Constants() {
	
};

// dark red, light blue, dark green, gold
Constants.TEAM_COLORS = [0x990000, 0x007A29, 0x0066CC, 0xD4A017];

Constants.GLOW_COLORS = {green: new THREE.Color(0x66E066)};

Constants.BULLET_LEVEL = 15;

// used to listen for clock updates
Constants.TOPIC_DELTA = "delta";

Constants.HOTKEYS = ["q", "e", "space", "r", "t", "tab", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "ctrl", "command"];

Constants.ACTIVE_KEYBINDINGS = {};

// used to listen for camera position
Constants.TOPIC_CAMERA_POSITION = "cameraPosition";

Constants.TOPIC_CAMERA_ROTATION = "cameraRotation";

Constants.TOPIC_REFRESH_MATERIALS = "refreshMaterials";

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