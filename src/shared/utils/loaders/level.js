import { Matrix } from 'shared/utils/math'
import Level from 'shared/utils/level'
import { createBackgroundLayer, createSpriteLayer } from 'shared/utils/layers'
import { loadStriteSheet } from 'shared/utils/loader'

const loadLavel = async (name) => {
  const result = await require(`../../lavels/${name}.json`)
  return result
}

function* expendSpan(xStart, xLen, yStart, yLen) {
  const xEnd = xStart + xLen
  const yEnd = yStart + yLen
  for (let x = xStart; x < xEnd; x++) {
    for (let y = yStart; y < yEnd; y++) {
      yield { x, y }
    }
  }
}

function expendRange(range) {
  if (range.length === 4) {
    const [xStart, xLen, yStart, yLen] = range
    return expendSpan(xStart, xLen, yStart, yLen)
  }
  if (range.length === 3) {
    const [xStart, xLen, yStart] = range
    return expendSpan(xStart, xLen, yStart, 1)
  }
  if (range.length === 2) {
    const [xStart, yStart] = range
    return expendSpan(xStart, 1, yStart, 1)
  }
}

function* expendRanges(ranges) {
  // eslint-disable-next-line
  for (const range of ranges) {
    // eslint-disable-next-line
    for (const item of expendRange(range)) {
      yield item
    }
  }
}

function expendTiles(tiles, patterns) {
  const expendedTiles = []

  function walkTiles(tilesSpec, offsetX, offsetY) {
    // eslint-disable-next-line
    for (const tile of tilesSpec) {
      // eslint-disable-next-line
      for (const { x, y } of expendRanges(tile.ranges)) {
        const derivedX = x + offsetX
        const derivedY = y + offsetY
        if (tile.pattern) {
          const { tiles: _tiles } = patterns[tile.pattern]
          walkTiles(_tiles, derivedX, derivedY)
        } else {
          expendedTiles.push({
            tile, x: derivedX, y: derivedY,
          })
        }
      }
    }
  }

  walkTiles(tiles, 0, 0)

  return expendedTiles
}

function createCollisionGrid(tiles, patterns) {
  const grid = new Matrix()
  // eslint-disable-next-line
  for (const tileSpec of expendTiles(tiles, patterns)) {
    const { tile, x, y } = tileSpec
    grid.set(x, y, { type: tile.type })
  }

  return grid
}

function createBackgroundGrid(tiles, patterns) {
  const grid = new Matrix()
  // eslint-disable-next-line
  for (const tileSpec of expendTiles(tiles, patterns)) {
    const { tile, x, y } = tileSpec
    grid.set(x, y, { name: tile.name })
  }

  return grid
}

export const loadLevel = async name => {
  const loadLevelSpec = await loadLavel(name)
  const [levelSpec, backgroundSprites] = await Promise.all([
    loadLevelSpec,
    loadStriteSheet(loadLevelSpec.spriteSheet),
  ])

  const level = new Level()

  const mergedTitles = levelSpec.layers.reduce((mergedTitlesItem, levelSpecItem) => (
    mergedTitlesItem.concat(levelSpecItem.tiles)
  ), [])
  const collisionGrid = createCollisionGrid(mergedTitles, levelSpec.patterns)
  level.setCollisionGrid(collisionGrid)

  levelSpec.layers.forEach(layer => {
    const backgroundGrid = createBackgroundGrid(layer.tiles, levelSpec.patterns)
    const backgroundLayer = createBackgroundLayer(level, backgroundGrid, backgroundSprites)
    level.composition.layers.push(backgroundLayer)
  })

  const spriteLayer = createSpriteLayer(level.entities)
  level.composition.layers.push(spriteLayer)

  return level
}
