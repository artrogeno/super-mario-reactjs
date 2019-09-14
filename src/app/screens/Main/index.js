import React, { useRef, useEffect } from 'react'

import { loadLevel } from 'shared/utils/loaders'
import { createBackgroundLayer, createSpriteLayer } from 'shared/utils/layers'
import { loadBackgroundSprites } from 'shared/utils/sprites'
import { createMario } from 'shared/utils/entities'
import { Compositor } from 'shared/utils/compositor'
import Timer from 'shared/utils/timer'

import { SCREENS } from 'shared/constants'
import tiles from 'assets/images/tiles.png'



const Main = () => {
  const canvasRef = useRef(null)

  async function loadCanvas () {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const [mario, backgroundSprites, level] = await Promise.all([
      createMario(),
      loadBackgroundSprites(tiles),
      loadLevel('1-1')
    ])

    const compositor = new Compositor()

    const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites)
    compositor.layers.push(backgroundLayer)

    // test
    let gravity = 30
    mario.position.set(64, 180)
    mario.velocity.set(200, -600)

    const spriteLayer = createSpriteLayer(mario)
    compositor.layers.push(spriteLayer)

    const timer = new Timer(1/60)

    timer.update = function update(deltaTime) {
      compositor.draw(context)
      mario.update( deltaTime )
      mario.velocity.y += gravity
    }

    timer.start()

  }

  useEffect(() => {
    loadCanvas()
  })

  return (
    <canvas ref={canvasRef} width={SCREENS.WIDTH} height={SCREENS.HEIGHT}/>
  )
}

export default Main
