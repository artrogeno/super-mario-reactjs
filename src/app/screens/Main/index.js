import React, { useRef, useEffect } from 'react'

import { loadLevel } from 'shared/utils/loaders'
import { createBackgroundLayer, createSpriteLayer } from 'shared/utils/layers'
import { loadBackgroundSprites } from 'shared/utils/sprites'
import { createMario } from 'shared/utils/entities'
import { Compositor } from 'shared/utils/compositor'
import Timer from 'shared/utils/timer'
import Keyboard from 'shared/utils/keyboardstate'

import { SCREENS } from 'shared/constants'
import tiles from 'assets/images/tiles.png'

const Main = () => {
  const canvasRef = useRef(null)

  async function loadCanvas() {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const [mario, backgroundSprites, level] = await Promise.all([
      createMario(),
      loadBackgroundSprites(tiles),
      loadLevel('1-1'),
    ])

    const compositor = new Compositor()

    const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites)
    compositor.layers.push(backgroundLayer)

    const gravity = 2000
    mario.pos.set(64, 180)
    // mario.vel.set(200, -600)

    const SPACE = 32
    const input = new Keyboard()
    input.addMapping(SPACE, keyState => {
      if (keyState) {
        mario.jump.start()
      } else {
        mario.jump.cancel()
      }
    })
    input.listenTo(window)

    const spriteLayer = createSpriteLayer(mario)
    compositor.layers.push(spriteLayer)

    const timer = new Timer(1 / 60)
    timer.update = function update(deltaTime) {
      mario.update(deltaTime)

      compositor.draw(context)

      mario.vel.y += gravity * deltaTime
    }

    // timer.start()
  }

  useEffect(() => {
    loadCanvas()
  })

  return (
    <canvas ref={canvasRef} width={SCREENS.WIDTH} height={SCREENS.HEIGHT} />
  )
}

export default Main
