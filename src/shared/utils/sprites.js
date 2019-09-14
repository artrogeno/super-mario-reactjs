import SpriteSheet from 'shared/utils/spritesheet'
import { loadImage } from 'shared/utils/loaders'

export const loadBackgroundSprites = async tiles => {
  const image = await loadImage(tiles)
  const sprites = new SpriteSheet(image, 16, 16)
  sprites.defineTile('ground', 0, 0)
  sprites.defineTile('sky', 3, 23)
  return sprites
}

export const loadMarioSprite = async characters => {
  const image = await loadImage(characters)
  const sprites = new SpriteSheet(image, 16, 16)
  sprites.define('idle', 276, 44, 16, 16)
  return sprites
}

