import React, { useRef, useEffect } from 'react'

import { loadLevel } from 'shared/utils/loaders'
import { createBackgroundLayer, createSpriteLayer } from 'shared/utils/layers'
import { loadBackgroundSprites, loadMarioSprite} from 'shared/utils/sprites'
import { Compositor } from 'shared/utils/compositor'

import { SCREENS } from 'shared/constants'
import tiles from 'assets/images/tiles.png'
import characters from 'assets/images/characters.gif'

const Main = () => {
  const canvasRef = useRef(null)

  async function loadCanvas () {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const [marioSprite, backgroundSprites, level] = await Promise.all([
      loadMarioSprite(characters),
      loadBackgroundSprites(tiles),
      loadLevel('1-1')
    ])

    const compositor = new Compositor()

    const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites)
    compositor.layers.push(backgroundLayer)

    // test
    let pos = { x: 0, y: 0 }

    const spriteLayer = createSpriteLayer(marioSprite, pos)
    compositor.layers.push(spriteLayer)

    const update = () => {
      compositor.draw(context)
      pos.x += 2
      pos.y += 2
      requestAnimationFrame(update)
    }

    // update()

  }

  useEffect(() => {
    loadCanvas()
  })

  return (
    <canvas ref={canvasRef} width={SCREENS.WIDTH} height={SCREENS.HEIGHT}/>
  )
}

export default Main
