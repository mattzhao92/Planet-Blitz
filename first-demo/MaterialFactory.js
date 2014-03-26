var MaterialFactory = Class.extend({
	init: function() {
		this.setupTransparentGlowMaterial();
	},

	setupTransparentGlowMaterial: function() {
		var originPosition = new THREE.Vector3(0, 0, 0);

		this.transparentGlowMaterial = new THREE.ShaderMaterial({
		  uniforms: {
		    "c": {
		      type: "f",
		      value: 1.0
		    },
		    "p": {
		      type: "f",
		      value: 1.4
		    },
		    glowColor: {
		      type: "c",
		      value: new THREE.Color(0x82E6FA)
		    },
		    viewVector: {
		      type: "v3",
		      value: originPosition
		    }
		  },
		  vertexShader: document.getElementById('vertexShader').textContent,
		  fragmentShader: document.getElementById('fragmentShader').textContent,
		  side: THREE.FrontSide,
		  blending: THREE.AdditiveBlending,
		  transparent: true
		}); 
	},

	createTransparentGlowMaterial: function(cameraPosition) {
		var material = this.transparentGlowMaterial.clone();
		material.uniforms['viewVector'].value = cameraPosition;
		return material;
	}
});
