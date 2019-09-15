import React, { useRef, useEffect } from 'react'

import { loadLevel } from 'shared/utils/loaders'
import { createMario } from 'shared/utils/entities'
import { setupKeyboard } from 'shared/utils/input'
import Timer from 'shared/utils/timer'

import { SCREENS } from 'shared/constants'

const Main = () => {
  const canvasRef = useRef(null)

  async function loadCanvas() {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const [mario, level] = await Promise.all([
      createMario(),
      loadLevel('1-1'),
    ])

    mario.pos.set(64, 64)

    level.entities.add(mario)

    const input = setupKeyboard(mario)
    input.listenTo(window)

    const timer = new Timer(1 / 60)
    timer.update = function update(deltaTime) {
      level.update(deltaTime)

      level.composition.draw(context)
    }
    timer.start()
  }

  useEffect(() => {
    loadCanvas()
  })

  return (
    <canvas ref={canvasRef} width={SCREENS.WIDTH} height={SCREENS.HEIGHT} />
  )
}

export default Main
