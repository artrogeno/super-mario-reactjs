import { KEYS } from '../constants'

export default class KeyboardState {
  constructor() {
    // Holds the current state of a give key
    this.keyStates = new Map()

    // Holds the callback function for a key code
    this.keyMap = new Map()
  }


  addMapping(keyCode, callback) {
    this.keyMap.set(keyCode, callback)
  }

  handleEvent(event) {
    const { keyCode } = event

    // Did not have key mapped
    if (!this.keyMap.has(keyCode)) return

    event.preventDefault()

    const keyState = event.type === 'keydown' ? KEYS.PRESSED : KEYS.RELEASED

    if (this.keyStates.get(keyCode) === keyState) return

    this.keyStates.set(keyCode, keyState)
    console.log(this.keyStates)

    this.keyMap.get(keyCode)(keyState)
  }

  listenTo(window) {
    ['keydown', 'keyup'].forEach(eventName => {
      window.addEventListener(eventName, event => {
        this.handleEvent(event)
      })
    })
  }
}
