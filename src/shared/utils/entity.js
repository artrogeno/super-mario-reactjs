import { Vect } from './math'

export default class Entity {
  constructor() {
    this.position = new Vect(0, 0);
    this.velocity = new Vect(0, 0);
  }
}
