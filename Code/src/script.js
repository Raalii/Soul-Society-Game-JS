import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { player } from "./player.js";
import { world } from "./world";

// Class of a basic World
class BasicWorld {
  constructor(level) {
    this.level_ = level;
    this._Initialize(); // When the class will be called, he  will launch the Initialize function
  }

  _Initialize() {
    // We define a new Canvas (WEBGL)
    this._threejs = new THREE.WebGLRenderer({ alpha: false, antialias: true }); // We activate the post processing for best renderer
    this._threejs.shadowMap.enabled = true; // We activate shadow
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap; // Specify type of shadow
    // Pixel Ratio and Size
    this._threejs.setPixelRatio(window.devicePixelRatio);
    this._threejs.setSize(window.innerWidth, window.innerHeight);
    this.gameOver_; // Variable will be used to check if the user have losed

    document.body.appendChild(this._threejs.domElement); // We add the WebGL to the HTML document

    // Responsive
    window.addEventListener(
      "resize",
      () => {
        this._OnWindowResize();
      },
      false
    );

    // Variable to init a normal camera
    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    this._camera.position.set(13.95, 6.19, -13.52); // Position of camera
    this._camera.rotation.set(0, 2, 0);

    // DEBUG CAMERA

    //   const PositionCamera = gui.addFolder("Position");

    //  PositionCamera.add(this._camera.position, "y").min(-10).max(10).step(0.01);
    //  PositionCamera.add(this._camera.position, "x").min(-10).max(20).step(0.01);
    //  PositionCamera.add(this._camera.position, "z").min(-20).max(0).step(0.01);

    //   const RotationCamera = gui.addFolder("Rotation");

    //   RotationCamera.add(this._camera.rotation, "y").min(-10).max(10).step(0.01);
    //   RotationCamera.add(this._camera.rotation, "x").min(-10).max(10).step(0.01);
    //   RotationCamera.add(this._camera.rotation, "z").min(-10).max(10).step(0.01);

    //   const controls = new OrbitControls(this._camera, this._threejs.domElement);
    //   controls.target.set(20, 0, 0);
    //   controls.update();

    // We init a scene to render the elements
    this._scene = new THREE.Scene();

    // We init a light (white), and specify fex parametters
    let light = new THREE.DirectionalLight(0xffffff);
    light.position.set(100, 100, 100);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.01;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 1.0;
    light.shadow.camera.far = 500;
    light.shadow.camera.left = 200;
    light.shadow.camera.right = -200;
    light.shadow.camera.top = 200;
    light.shadow.camera.bottom = -200;

    // We add to the scene the light
    this._scene.add(light);
    this._scene.background = new THREE.Color(0x3498db);
    this._scene.fog = new THREE.FogExp2(0x89b2eb, 0.00125);

    // We add a platform
    const plateform = new THREE.Mesh(
      new THREE.PlaneGeometry(10000, 10000, 1, 1),
      new THREE.MeshStandardMaterial({
        color: 0xf6f47f,
      })
    );
    plateform.position.y = -1;
    plateform.castShadow = false;
    plateform.receiveShadow = true;
    plateform.rotation.x = -Math.PI / 2;
    this._scene.add(plateform);

    // We init the world defined in world.js, and the players which are the cube
    this.world_ = new world.WorldManager(this._scene, this.level_);
    this.player_ = new player.Player({
      scene: this._scene,
      world: this.world_,
    });
    this.previousRAF_ = null; // That variable will be used to check the differences in milisecond, of the previous and actual RAF

    this._RAF(); // We call our game loop
  }

  // Function to resize the window (responsive)
  _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

  // The game loop function 
  _RAF() {
    // We use Request Animation Frame function
    this.gameOver_ = requestAnimationFrame((timeElapsed) => {
      if (this.previousRAF_ == null) {
        this.previousRAF_ = timeElapsed;
      }
      this._RAF();
      this._Step((timeElapsed - this.previousRAF_) / 1000.0);
      this._threejs.render(this._scene, this._camera);
      this.previousRAF_ = timeElapsed;
    });
  }

  _Step(timeElapsed) {
    this.player_.Update(timeElapsed); // We update the player positions
    this.world_.Update(timeElapsed); // We update the World (positions of blocks...)
    this.world_.UpdateScore(timeElapsed); // We also update the score
    if (this.player_.gameOver_) { // If the players have losed
      document.getElementById("container").style.display = "flex"; // We display th game over 
      cancelAnimationFrame(this.gameOver_); // And we stop the requestAnimationFrame
    }
  }
}

let Game = null;
let started = false;

// The menu and the event 
let elmt = document.getElementsByClassName("level1");
elmt[0].addEventListener("click", () => {
  if (started) {
    return;
  }
  started = true;
  document.getElementById("Home").style.display = "none";
  Game = new BasicWorld(1);
});
elmt[1].addEventListener("click", () => {
  if (started) {
    return;
  }
  started = true;
  document.getElementById("Home").style.display = "none";
  Game = new BasicWorld(2);
});
elmt[2].addEventListener("click", () => {
  if (started) {
    return;
  }
  started = true;
  document.getElementById("Home").style.display = "none";
  Game = new BasicWorld(3);
});
elmt[3].addEventListener("click", () => {
  if (started) {
    return;
  }
  started = true;
  document.getElementById("Home").style.display = "none";
  Game = new BasicWorld(4);
});
