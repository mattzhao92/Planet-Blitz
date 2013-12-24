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
Following: http://threejs.org/docs/index.html#Manual/Introduction/Creating_a_scene
- Camera
 - Field of view
 - Aspect ratio: width of element / height
 - Near and far clipping plane: only objects within this range will get rendered

Making an object
- Material: colors it
- Mesh: object that takes a geometry and applies a material to it

