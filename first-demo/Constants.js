// namespacing for colors
function Constants() {
	
};

// dark red, light blue, dark green, gold
Constants.TEAM_COLORS = [0x990000, 0x007A29, 0x0066CC, 0xD4A017];

Constants.GLOW_COLORS = {green: new THREE.Color(0x66E066)};

Constants.BULLET_LEVEL = 15;

// used to listen for clock updates
Constants.TOPIC_DELTA = "delta";

// used to listen for camera position
Constants.TOPIC_CAMERA_POSITION = "cameraPosition";

Constants.TOPIC_CAMERA_ROTATION = "cameraRotation";
