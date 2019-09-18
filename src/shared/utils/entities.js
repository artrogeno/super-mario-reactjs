import Entity from 'shared/utils/entity'
import Jump from 'shared/utils/traits/jump'
import Go from 'shared/utils/traits/go'
import { loadStriteSheet } from 'shared/utils/loader'
import { createAnimation } from 'shared/utils/anime'

const SLOW_DRAG = 1 / 1000
const FAST_DRAG = 1 / 5000

export async function createMario() {
  const sprite = await loadStriteSheet('mario')

  const mario = new Entity()
  mario.size.set(14, 16)

  mario.addTrait(new Go())
  mario.go.dragFactor = SLOW_DRAG


  mario.addTrait(new Jump())

  mario.turbo = function setTurboState(turboOn) {
    this.go.dragFactor = turboOn ? FAST_DRAG : SLOW_DRAG
  }

  const runAnimation = createAnimation(['run-1', 'run-2', 'run-3'], 6)

  function routeFrame(marioSpec) {
    if (marioSpec.jump.falling < 0) {
      return 'jump'
    }
    if (marioSpec.go.distance > 0) {
      if ((marioSpec.vel.x > 0 && marioSpec.go.direction < 0)
          || (marioSpec.vel.x < 0 && marioSpec.go.direction > 0)) {
        return 'break'
      }
      return runAnimation(marioSpec.go.distance)
    }
    return 'idle'
  }

  mario.draw = function drawMario(context) {
    sprite.draw(routeFrame(this), context, 0, 0, this.go.heading < 0)
  }

  return mario
}
