const scrollingElement = document.scrollingElement || document.documentElement

module.exports = class Stickie {
  constructor (node) {
    this._node = node
    this._pad = document.createElement('span')
    this._stuck = false
    this._fixed = false
    this._transitionPoint = 0

    this._recalc = this._recalc.bind(this)
    this._check = this._check.bind(this)
    this._resizePad = this._resizePad.bind(this)

    this._node.parentElement.insertBefore(this._pad, this._node)
  }

  stick () {
    if (this._stuck) {
      return
    }

    this._stuck = true

    global.addEventListener('resize', this._recalc, true)
    this._recalc()

    global.addEventListener('scroll', this._check, true)
    this._check()
  }

  unstick () {
    if (!this._stuck) {
      return
    }

    this._stuck = false

    global.removeEventListener('resize', this._recalc, true)

    global.removeEventListener('scroll', this._check, true)

    this._unstick()
  }

  _recalc () {
    this._transitionPoint = this._pad.offsetTop
    // calculate this from the node's original position and size
    this._nodeLeft = 'auto'
    this._nodeWidth = '100%'
  }

  _check () {
    if (scrollingElement.scrollTop < this._transitionPoint) {
      this._unstick()
    } else {
      this._stick()
    }
  }

  _stick () {
    if (this._fixed) {
      return
    }

    this._fixed = true

    this._node.style.position = 'fixed'
    this._node.style.top = '0'
    this._node.style.left = this._nodeLeft
    this._node.style.width = this._nodeWidth

    this._pad.style.display = 'block'

    global.addEventListener('resize', this._resizePad, true)
    this._resizePad()
  }

  _unstick () {
    if (!this._fixed) {
      return
    }

    this._fixed = false

    this._node.style.removeProperty('position')
    this._node.style.removeProperty('top')
    this._node.style.removeProperty('left')
    this._node.style.removeProperty('width')

    this._pad.style.removeProperty('display')
    this._pad.style.removeProperty('height')

    global.removeEventListener('resize', this._resizePad, true)
  }

  _resizePad () {
    this._pad.style.height = this._node.offsetHeight + 'px'
  }
}
