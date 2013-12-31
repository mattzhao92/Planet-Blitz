## Chapter 1
`
python -m SimpleHTTPServer
`

Essentials

* Scene variable is container used to store and keep track of all objects we want to render.
* Renderer: calculate how to render the scene

Materials that take light sources into account

* MeshLambertMaterial
* MeshPhongMaterial

Shadows: renderer.shadowMapEnabled

* plane.receiveShadow
* cube.castShadow
* spotLight.castShadow
    * Something

Animations

* Use requestAnimationFrame(animationFuncName)
`
function renderScene() {
    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
}
`

Looks very familiar to ballworld style. In render you're just adding to the position of the sphere.

dat.GUI: easily tweaking parameters in your code. Could be useful for debugging

"Anonymous JavaScript object"
`
var controls = new function() {
    this.rotationSpeed = 0.02;
    this.bouncingSpeed = 0.03;
}
// later on in render...
    cube.rotation.x += controls.rotationSpeed;
`

## Chapter 2: Scene

Functions in Javascript are first class objects

`
this.addCube = function() {
    // ... just like any other object method
}
`

Geometry + Material = Mesh

`
cube.name = "cube-" + scene.children.length;
// Use with Scene.getChildByName(name) to directly retrieve a specific object
`

Javascript useful functions:

* instanceOf
* console.log

THREE.Scene.traverse();

Geometry = Faces + Vertices

clone(): make copy of geometry and use it to make a different mesh

Mesh - translate: define where object should move to, relative to its current position. Set the translation and then translate

X, Y, Z - scale, position, rotation, translate

Vector is just a tuple of 3

Camera properties 

* fov: part of scene that can be seen from position of camera (humans 180 degrees; computer screen doesn't fill vision, so usually 60-90). Good default: 45
* near: define how close to the camera the library should render the scene. Set to small value to directly render everything from position of the camera

## Chapter 9: Animations and Moving the Camera

Animate objects by changing their rotation, scale, position, material, vertices, faces

Selecting objects:

* unprojectVector: convert clicked position on screen into coordinates in 3JS screen
* Use THREE.Raycaster object (from projector.pickingRay function): send out a ray into the world from the position we've clicked on the screen
* Use raycaster.intersectObjects

Q: is the ray casted from the camera?

Tween.js: easily define transition of property between two values (so that's how the camera works in XCOM!)
- Easing: how the value is changed over time
- Just tween it from a "sensible default" up top to the unit's line of sight to an enemy unit
- XCOM additional difficulty: having multiple levels (but is that handled by the camera position?)

<more tweening stuff and callbacks>

### Working with the camera

You create the controls and attach them to the camera

A variation of TrackBallControls could be useful for the game. Tweening the camera could be used to control the camera movement and make it smoother

http://0.0.0.0:8000/chapter-09/04-trackball-controls-camera.html

`
// first set controls of camera
var trackballControls = new THREE.TrackballCOntrols(camera);
trackballControls.rotateSpeed = 1.0;
trackballControls.zoomSpeed = 1.0;
trackballControls.panSpeed = 1.0;

// then update position the camera
var clock = new THREE.Clock();
function render() {
    var delta = clock.getDelta();
    trackBallControls.update(delta);
    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
}
`

TrackballControls: what we're going to use the most

RollControls: could be used to make a cool intro scene, XCOM style

PointerLockControls: upgraded version for FPS. See [here](http://stackoverflow.com/questions/12500874/three-js-first-person-controls)

Morph targets for animation over bones and skins

Use MorphAnimMesh
... skipped some more


