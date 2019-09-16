import { Vect } from 'shared/utils/math'

export default class Camera {
  constructor() {
    this.pos = new Vect(0, 0)
    this.size = new Vect(256, 224)
  }
}
