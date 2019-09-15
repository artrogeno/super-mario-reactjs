import Level from 'shared/utils/level'
import { createBackgroundLayer, createSpriteLayer } from 'shared/utils/layers'
import { loadBackgroundSprites } from 'shared/utils/sprites'

import tiles from 'assets/images/tiles.png'

const loadFile = async (name) => {
  const result = await require(`../lavels/${name}.json`)
  return result
}

const createTiles = (level, backgrounds) => {
  backgrounds.forEach(background => {
    background.ranges.forEach(([x1, x2, y1, y2]) => {
      for (let x = x1; x < x2; x++) {
        for (let y = y1; y < y2; y++) {
          level.tiles.set(x, y, {
            name: background.tile,
          })
        }
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

export const loadLevel = async name => {
  const [levelSpec, backgroundSprites] = await Promise.all([
    loadFile(name),
    loadBackgroundSprites(tiles),
  ])

  const level = new Level()

  createTiles(level, levelSpec.backgrounds)

  const backgroundLayer = createBackgroundLayer(level, backgroundSprites)
  level.composition.layers.push(backgroundLayer)

  const spriteLayer = createSpriteLayer(level.entities)
  level.composition.layers.push(spriteLayer)

  return level
}
