## Notes on three-js
- [Tutorial](http://www.creativebloq.com/3d/how-build-game-threejs-121310131)

> The key to the run loop is a relatively new browser feature called requestAnimationFrame(). Using this function, your code registers a callback to be called each time the browser is ready to draw the page. Where possible, your applications should use requestAnimationFrame() instead of the more traditional setTimeout(). It's been designed with rendering in mind, because the browser knows that all callbacks registered with this function are intended to be used for drawing and it can batch all the calls together with updates for the other visual elements on the page.

Elements
- Scene
- Renderer
- Camera
- Objects

Need proficiency with Javascript.
WebGL is probably best because it has GPU support (frees up CPU to do other things)

==12/24==
## [Creating a scene](http://threejs.org/docs/index.html#Manual/Introduction/Creating_a_scene)
- Camera
 - Field of view
 - Aspect ratio: width of element / height
 - Near and far clipping plane: only objects within this range will get rendered

Making an object
- Material: colors it
- Mesh: object that takes a geometry and applies a material to it

Made a simple rotating cube

## [Another getting started tutorial](http://www.aerotwist.com/tutorials/getting-started-with-three-js/)

Concepts of lighting (different shaders) - need to read up on this

Materials
- Basic
- Lambert
- Phong

Need to modify following if you changed an object - notify renderer that something changed (otherwise three.js caches it)
// so that it allow updates
sphere.geometry.dynamic = true;

// changes to the vertices
sphere.geometry.verticesNeedUpdate = true;

// changes to the normals
sphere.geometry.normalsNeedUpdate = true;

##[Three JS examples](http://threejs.org/examples/#webgl_interactive_voxelpainter)

- [Interactive voxel painter](http://threejs.org/examples/#webgl_interactive_voxelpainter): possible idea for making levels
- [Point lights](http://threejs.org/examples/#webgl_lights_pointlights2) - so cool
- Animation - keyframe
- [WebGL materials](http://threejs.org/examples/#webgl_materials)

## Learning three.js book

X-axis increase left to right
Z-axis increases from back to front
Y-axis increases upward

Chrome script editor - breakpoints

http://stackoverflow.com/questions/7956442/detect-clicked-object-in-three-js

We want a grid-based system
http://mrdoob.github.io/three.js/examples/#misc_controls_transform

http://stackoverflow.com/questions/11093084/fill-three-js-scene-with-a-grid

## Simple examples

http://stemkoski.github.io/Three.js/

Placing things on a grid (aka Chess)
view-source:http://schteppe.github.io/ammo.js-demos/demos/ChessDemo/

