import SpriteSheet from 'shared/utils/spritesheet'
import { createAnimation } from 'shared/utils/anime'

export const loadImage = async url => {
  const result = await new Promise(resolve => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.src = url
  })
  return result
}

export const loadStriteSheet = async (name) => {
  const sheetSpec = await require(`../sprites/${name}.json`)
  const [sheet, image] = await Promise.all([
    sheetSpec,
    loadImage(sheetSpec.imageUrl),
  ])

  const sprites = new SpriteSheet(image, sheet.tileW, sheet.tileH)

  if (sheet.tiles) {
    sheet.tiles.forEach(tileSpec => {
      sprites.defineTile(tileSpec.name, tileSpec.index[0], tileSpec.index[1])
    })
  }

  if (sheet.frames) {
    sheet.frames.forEach(frameSpec => {
      sprites.define(frameSpec.name, ...frameSpec.rect)
    })
  }

  if (sheet.animations) {
    sheet.animations.forEach(animateSpec => {
      const animation = createAnimation(animateSpec.frames, animateSpec.frameLen)
      sprites.defineAnimation(animateSpec.name, animation)
    })
  }

  return sprites
}
