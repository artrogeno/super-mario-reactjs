import Keyboard from 'shared/utils/keyboardstate'

export function setupKeyboard(mario) {
  const input = new Keyboard()

  input.addMapping('ArrowUp', keyState => {
    if (keyState) {
      mario.jump.start()
    } else {
      mario.jump.cancel()
    }
  })

  input.addMapping('Space', keyState => {
    mario.turbo(keyState)
  })

  input.addMapping('ArrowRight', keyState => {
    mario.go.direction += keyState ? 1 : -1
  })

  input.addMapping('ArrowRight', keyState => {
    mario.go.direction += keyState ? 1 : -1
  })

  input.addMapping('ArrowLeft', keyState => {
    mario.go.direction += keyState ? -1 : 1
  })

  return input
}
