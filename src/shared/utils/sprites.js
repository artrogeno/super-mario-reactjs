import SpriteSheet from 'shared/utils/spritesheet'
import { loadImage } from 'shared/utils/loaders'

export const loadMarioSprite = async characters => {
  const image = await loadImage(characters)
  const sprites = new SpriteSheet(image, 16, 16)
  sprites.define('idle', 276, 44, 16, 16)
  return sprites
}
