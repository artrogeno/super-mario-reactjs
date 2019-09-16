import Entity from 'shared/utils/entity'
import Jump from 'shared/utils/traits/jump'
import Go from 'shared/utils/traits/go'
import { loadStriteSheet } from 'shared/utils/loaders'
import { createAnimation } from 'shared/utils/anime'

export const createMario = async () => {
  const sprite = await loadStriteSheet('mario')

  const mario = new Entity()
  mario.size.set(14, 16)

  mario.addTrait(new Go())
  mario.addTrait(new Jump())

  const runAnimation = createAnimation(['run-1', 'run-2', 'run-3'], 10)

  function routeFrame(marioSpec) {
    if (marioSpec.go.direction !== 0) {
      return runAnimation(marioSpec.go.distance)
    }
    return 'idle'
  }

  mario.draw = function drawMario(context) {
    sprite.draw(routeFrame(this), context, 0, 0, this.go.heading < 0)
  }

  return mario
}
