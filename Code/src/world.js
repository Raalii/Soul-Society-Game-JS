import * as THREE from "three";

export const world = (() => {
  const START_POS = -100;
  const SEPARATION_DISTANCE = 20;
  class WorldObject {
    constructor(params, size, color) {
      this.mesh_ = new THREE.Mesh(
        new THREE.BoxBufferGeometry(1, size, 2),
        new THREE.MeshStandardMaterial({
          color: color,
        })
      );
      params.add(this.mesh_);
      this.position = new THREE.Vector3();
      this.collider = new THREE.Box3();
    }

    UpdateCollider_() {
      this.collider.setFromObject(this.mesh_);
    }

    Update(timeElapsed) {
      this.mesh_.position.copy(this.position);
      this.UpdateCollider_();
    }
  }

  class WorldManager {
    constructor(params) {
      this.objects_ = [];
      this.unused_ = [];
      this.speed_ = 10;
      this.params_ = params;
      this.score_ = 0
      this.meshHeight_ = 1
      this.color_ = [0xff1a00, 0x7d3c98, 0x2e4053, 0xe67e22, 0x2ecc71]
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
      const obj = new WorldObject(this.params_, this.meshHeight_, this.color_[this.rand_int(0, 4)]);
      obj.position.x = START_POS;
      this.objects_.push(obj);
    }

    MaybeSpawn_() {
      const closest = this.LastObjectPosition_();
      if (Math.abs(START_POS - closest) > SEPARATION_DISTANCE) {
        this.SpawnObj_();
      }
    }


    rand_int(a, b) {
      return Math.round(Math.random() * (b - a) + a);
    }

    UpdateScore(timeElapsed) {
      this.score_ += timeElapsed * 10
      this.meshHeight_ = this.rand_int(1, 7)
      if (this.score_ > 200 && this.score_ < 400) {
        this.speed_ = 16
      } else if (this.score_ > 400 && this.score_ < 800) {
        this.speed_ = 22
      } else if (this.score_ > 800 && this.score_ < 1000) {
        this.speed_ = 26
      } else if (this.score_ > 1200) {
        this.speed_ = 30
      }
      const scoreText = Math.round(this.score_).toLocaleString(
        'en-US', {minimumIntegerDigits: 5, useGrouping: false});

      document.querySelector('.score').textContent = scoreText;

      
    }

    Update(timeElapsed) {
      this.MaybeSpawn_();

      const invisible = [];
      const visible = [];

      for (let obj of this.objects_) {
        obj.position.x += timeElapsed * this.speed_;

        if (obj.position.x > 20) {
          invisible.push(obj);
          obj.mesh_.visible = false;
        } else {
          visible.push(obj);
        }

        obj.Update(timeElapsed);
      }

      this.objects_ = visible;
      this.unused_.push(...invisible);
    }
  }

  return {
    WorldManager: WorldManager,
  };
})();
