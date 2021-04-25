import * as THREE from "three";

export const world = (() => {
  const START_POS = -100;
  let SEPARATION_DISTANCE;
  // The class of the block which represent the obstacles 
  class WorldObject {
    constructor(params, size, color) {
      // We initialize a block
      this.mesh_ = new THREE.Mesh(
        new THREE.BoxBufferGeometry(1, size, 2),
        new THREE.MeshStandardMaterial({
          color: color,
        })
      );
      // And we add to the scene the new Block
      params.add(this.mesh_);
      // The position are in 3D
      this.position = new THREE.Vector3();
      this.collider = new THREE.Box3();
    }

    UpdateCollider_() {
      this.collider.setFromObject(this.mesh_);
    }

    Update() {
      // Update position and check collision
      this.mesh_.position.copy(this.position);
      this.UpdateCollider_();
    }
  }

  class WorldManager {
    constructor(params, level) {
      this.level_ = level
      this.objects_ = [];
      this.speed_ = 10;
      this.params_ = params;
      this.score_ = 0;
      this.meshHeight_ = 1;
      this.color_ = [0xff1a00, 0x7d3c98, 0x2e4053, 0xe67e22, 0x2ecc71];
      this.Initialize_();
    }

    Initialize_() {
      // We check the level selectionend by the user and define the possible distance between the blocks
      switch (this.level_) {
        case 3:
          SEPARATION_DISTANCE = 15;
          break;
        case 4:
          SEPARATION_DISTANCE = 10;
          break;
        default:
          SEPARATION_DISTANCE = 20;
          break;
      }
    }

    GetColliders_() {
      return this.objects_;
    }

    LastObjectPosition_() {
      if (this.objects_.length == 0) {
        return SEPARATION_DISTANCE;
      }

      return this.objects_[this.objects_.length - 1].position.x;
    }

    SpawnObj_() {
      // That spawn three block on the three column
      for (let index = 0; index < 9; index += 3) {
        // New object
        const obj = new WorldObject(
          this.params_,
          this.meshHeight_,
          this.color_[this.randInt(0, 4)]
        );
        // define positions
        obj.position.x = START_POS - this.randInt(1, SEPARATION_DISTANCE);
        obj.position.z = index;
        this.objects_.push(obj);
      }
    }

    MaybeSpawn_() {
      // Check if the distances between the last Object permite to create blocks 
      const closest = this.LastObjectPosition_();
      if (Math.abs(START_POS - closest) > SEPARATION_DISTANCE) {
        this.SpawnObj_();
      }
    }

    randInt(a, b) {
      // The equivalent of python function randint
      return Math.round(Math.random() * (b - a) + a);
    }

    UpdateScore(timeElapsed) {
      // funciton which update score
      this.score_ += timeElapsed * 10;
      this.meshHeight_ = this.randInt(1, 7);
      const scoreText = Math.round(this.score_).toLocaleString("en-US", {
        minimumIntegerDigits: 5,
        useGrouping: false,
      });

      document.querySelector(".score").textContent = scoreText;
    }

    UpdateDifficulties() {
      // According to the level, the speed will be increase differently
      switch (this.level_) {
        case 1:
          this.speed_ = 10
          if (this.score_ > 400 && this.score_ < 1000) {
            this.speed_ = 16 
          } else if (this.score_ > 1000) {
            this.speed_ = 24
          }
          break;
        case 2:
          if (this.score_ < 300) {
            this.speed_ += 0.01
          } else {
            this.speed_ += 0.001
          }
          break;
        case 3:
          if (this.score_ < 400) {
            this.speed_ += 0.01
          } else {
            this.speed_ += 0.002
          }
          break;
        case 4:
          if (this.score_ < 300) {
            this.speed_ += 0.015
          } else {
            this.speed_ += 0.005
          }
          break;
        default:
          break;
      }
    }

    Update(timeElapsed) {
      this.MaybeSpawn_();

      const visible = [];

      for (let obj of this.objects_) {
        obj.position.x += timeElapsed * this.speed_;

        if (obj.position.x > 20) {
          obj.mesh_.visible = false;
        } else {
          visible.push(obj);
        }

        obj.Update(timeElapsed);
      }

      this.objects_ = visible;
      this.UpdateDifficulties();
    }
  }

  return {
    WorldManager: WorldManager,
  };
})();
