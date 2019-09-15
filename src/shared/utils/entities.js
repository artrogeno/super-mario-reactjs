import Entity from 'shared/utils/entity'
// import Velocity from 'shared/utils/traits/velocity'
import Jump from 'shared/utils/traits/jump'
import Go from 'shared/utils/traits/go'
import { loadMarioSprite } from 'shared/utils/sprites'
import characters from 'assets/images/characters.gif'

export const createMario = async () => {
  const sprite = await loadMarioSprite(characters)

  const mario = new Entity()
  mario.size.set(14, 16)

  mario.addTrait(new Go())
  mario.addTrait(new Jump())
  // mario.addTrait(new Velocity())

  mario.draw = function drawMario(context) {
    sprite.draw('idle', context, this.pos.x, this.pos.y)
  }

  return mario
}
