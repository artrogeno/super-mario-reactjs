import React, { useRef, useEffect } from 'react'

import { loadLevel } from 'shared/utils/loaders'
import { createMario } from 'shared/utils/entities'
import { setupKeyboard } from 'shared/utils/input'
// import { createCollisionLayer, createCameraLayer } from 'shared/utils/layers'
// import { setupMouseControl } from 'shared/utils/debug'
import Camera from 'shared/utils/camera'
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

    const camera = new Camera()
    window.camera = camera

    level.entities.add(mario)

    // --- DEBUG START
    // level.composition.layers.push(
    //   createCollisionLayer(level),
    //   createCameraLayer(camera),
    // )
    // -- DEBUG END

    mario.pos.set(64, 64)

    const input = setupKeyboard(mario)
    input.listenTo(window)

    // --- DEBUG START
    // setupMouseControl(canvas, mario, camera)
    // -- DEBUG END

    const timer = new Timer(1 / 60)
    timer.update = function update(deltaTime) {
      level.update(deltaTime)

      if (mario.pos.x > 100) {
        camera.pos.x = mario.pos.x - 100
      }

      level.composition.draw(context, camera)
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
