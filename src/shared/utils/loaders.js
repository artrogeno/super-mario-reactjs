import Level from 'shared/utils/level'
import SpriteSheet from 'shared/utils/spritesheet'
import { createBackgroundLayer, createSpriteLayer } from 'shared/utils/layers'
import { createAnimation } from 'shared/utils/anime'

const loadLavel = async (name) => {
  const result = await require(`../lavels/${name}.json`)
  return result
}

const createTiles = (level, backgrounds) => {
  function applyRange(background, xStart, xLen, yStart, yLen) {
    const xEnd = xStart + xLen
    const yEnd = yStart + yLen
    for (let x = xStart; x < xEnd; x++) {
      for (let y = yStart; y < yEnd; y++) {
        level.tiles.set(x, y, {
          name: background.tile,
          type: background.type,
        })
      }
    }
  }

  backgrounds.forEach(background => {
    background.ranges.forEach(range => {
      if (range.length === 4) {
        const [xStart, xLen, yStart, yLen] = range
        applyRange(background, xStart, xLen, yStart, yLen)
      } else if (range.length === 3) {
        const [xStart, xLen, yStart] = range
        applyRange(background, xStart, xLen, yStart, 1)
      } else if (range.length === 2) {
        const [xStart, yStart] = range
        applyRange(background, xStart, 1, yStart, 1)
      }
    })
  })
}

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

export const loadLevel = async name => {
  const loadLevelSpec = await loadLavel(name)
  const [levelSpec, backgroundSprites] = await Promise.all([
    loadLevelSpec,
    loadStriteSheet(loadLevelSpec.spriteSheet),
  ])

  const level = new Level()

  createTiles(level, levelSpec.backgrounds)

  const backgroundLayer = createBackgroundLayer(level, backgroundSprites)
  level.composition.layers.push(backgroundLayer)

  const spriteLayer = createSpriteLayer(level.entities)
  level.composition.layers.push(spriteLayer)

  return level
}
