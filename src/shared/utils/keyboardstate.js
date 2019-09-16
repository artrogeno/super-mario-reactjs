import { KEYS } from '../constants'

export default class KeyboardState {
  constructor() {
    // Holds the current state of a give key
    this.keyStates = new Map()

    // Holds the callback function for a key code
    this.keyMap = new Map()
  }


  addMapping(code, callback) {
    this.keyMap.set(code, callback)
  }

  handleEvent(event) {
    const { code } = event

    // Did not have key mapped
    if (!this.keyMap.has(code)) return

    event.preventDefault()

    const keyState = event.type === 'keydown' ? KEYS.PRESSED : KEYS.RELEASED

    if (this.keyStates.get(code) === keyState) return

    this.keyStates.set(code, keyState)

    this.keyMap.get(code)(keyState)
  }

  listenTo(window) {
    ['keydown', 'keyup'].forEach(eventName => {
      window.addEventListener(eventName, event => {
        this.handleEvent(event)
      })
    })
  }
}
