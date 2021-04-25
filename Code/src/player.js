import * as THREE from "three";
import { Light } from "three";

export const player = (() => {
  class Player {
    constructor(params) {
      this.position_ = new THREE.Vector3(0, 0, 0);
      this.velocity_ = 0.0;
      this.mesh_ = new THREE.Mesh(
        new THREE.BoxBufferGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({
          color: 0x80ff80,
        })
      );
      this.params_ = params;
      this.gameOver_ = false;
      this.collider = new THREE.Box3();
      this.mesh_.castShadow = true;
      this.mesh_.receiveShadow = true;
      this.params_.scene.add(this.mesh_);
      this.playerBox = new THREE.Box3();
      this.InitInput_();
    }

    InitInput_() {
      this.keys_ = {
        spacebar: false,
      };
      this.odlKeys = { ...this.keys_ };

      document.addEventListener("keydown", (e) => this.OnKeyDown_(e), false);
      document.addEventListener("keyup", (e) => this.OnKeyUp_(e), false);
    }

    OnKeyDown_(event) {
      var e = event || window.event;
      var key = e.keyCode || e.which;
      switch (key) {
        case 32:
          this.keys_.spacebar = true;
          break;
      }
    }

    OnKeyUp_(event) {
      switch (event.keyCode) {
        case 32:
          this.keys_.spacebar = false;
          break;

        case 37 :
          if (this.position_.z < 6) {
            this.position_.z += 3
          }
          break;

        case 39:
          if (this.position_.z > 2 ) {
            this.position_.z -= 3
          }
        default:
          break;
      }
    }

    CheckCollisions_() {
      // Check collision 
      const colliders = this.params_.world.GetColliders_(); 
      this.playerBox.setFromObject(this.mesh_);
      for (let c of colliders) {
        const cur = c.collider;

        if (cur.intersectsBox(this.playerBox)) {
          this.gameOver_ = true;
        }
      }
    }

    Update(timeElapsed) {
      // Update for the jump, whith gravity
      if (this.keys_.spacebar && this.position_.y == 0.0) {
        this.velocity_ = 30;
      }

      const acceleration = -75 * timeElapsed;

      this.position_.y += timeElapsed * (this.velocity_ + acceleration * 0.5);
      this.position_.y = Math.max(this.position_.y, 0.0);

      this.velocity_ += acceleration;
      this.velocity_ = Math.max(this.velocity_, -100);
      this.mesh_.position.copy(this.position_);

      this.CheckCollisions_();
    }
  }

  return {
    Player: Player,
  };
})();
