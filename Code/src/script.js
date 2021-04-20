import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { player } from "./player.js";
import { world } from "./world";
import { Scene } from "three";

// const gui = new dat.GUI();

// Class of a basic World
class BasicWorldDemo {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    this._threejs = new THREE.WebGLRenderer({alpha : true});
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(window.devicePixelRatio);
    this._threejs.setSize(window.innerWidth, window.innerHeight);
    this.gameOver_;

    document.body.appendChild(this._threejs.domElement);

    window.addEventListener(
      "resize",
      () => {
        this._OnWindowResize();
      },
      false
    );

    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    this._camera.position.set(13.95, 6.19, -13.52)
    this._camera.rotation.set(0, 2, 0)


    // const PositionCamera = gui.addFolder("Position");

    // PositionCamera.add(this._camera.position, "y").min(-10).max(10).step(0.01);
    // PositionCamera.add(this._camera.position, "x").min(-10).max(20).step(0.01);
    // PositionCamera.add(this._camera.position, "z").min(-20).max(0).step(0.01);
    
    // const RotationCamera = gui.addFolder("Rotation");

    // RotationCamera.add(this._camera.rotation, "y").min(-10).max(10).step(0.01);
    // RotationCamera.add(this._camera.rotation, "x").min(-10).max(10).step(0.01);
    // RotationCamera.add(this._camera.rotation, "z").min(-10).max(10).step(0.01);



    this._scene = new THREE.Scene();

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
    this._scene.add(light); 

    // const controls = new OrbitControls(this._camera, this._threejs.domElement);
    // controls.target.set(20, 0, 0);
    // controls.update();

    // const loader = new THREE.TextureLoader();
    // const bgTexture = loader.load('../static/ressources/PlantMap/jpg/skyboxBack.jpg');
    // this._scene.background = bgTexture;

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(20000, 20000, 1, 1),
      new THREE.MeshStandardMaterial({
        color: 0xff6666,
      })
    );

    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.position.y = -0.8;
    plane.rotation.x = -Math.PI / 2;
    this._scene.add(plane);

    this.world_ = new world.WorldManager(this._scene);
    this.player_ = new player.Player({
      scene: this._scene,
      world: this.world_,
    });
    this.previousRAF_ = null;

    this._RAF();
  }

  _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

  _RAF() {
    this.gameOver_ = requestAnimationFrame((t) => {
      if (this.previousRAF_ == null) {
        this.previousRAF_ = t;
      }
      this._RAF();
      this._Step((t - this.previousRAF_) / 1000.0);
      this._threejs.render(this._scene, this._camera);
      this.previousRAF_ = t;
    });
  }

  _Step(timeElapsed) {
    this.player_.Update(timeElapsed);
    this.world_.Update(timeElapsed);
    this.world_.UpdateScore(timeElapsed);
    if (this.player_.gameOver_) {
      document.getElementById("container").style.display = "flex";
      cancelAnimationFrame(this.gameOver_);
    }
  }
}

let _APP = null;

window.addEventListener("DOMContentLoaded", () => {
  _APP = new BasicWorldDemo();
});
