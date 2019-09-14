import Entity from 'shared/utils/entity'
import { loadMarioSprite } from 'shared/utils/sprites'
import characters from 'assets/images/characters.gif'

export const createMario = async () => {
  const sprite = await loadMarioSprite(characters)

  const mario = new Entity()
    // mario.position.set(64, 180)
    // mario.velocity.set(2, -10)

    mario.draw = function drawMario(context) {
      sprite.draw('idle', context, this.position.x, this.position.y)
    }

    mario.update = function updateMario(deltaTime) {
      this.position.x += this.velocity.x * deltaTime
      this.position.y += this.velocity.y * deltaTime
    }

    return mario
}
