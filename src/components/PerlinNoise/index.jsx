import React, { useEffect, useRef } from 'react'
import p5 from 'p5'
import './PerlinNoise.css'

const PerlinNoise = () => {
  const canvasRef = useRef()
  const Sketch = p5 => {
    const inc = .1
    const scl = 20
    let cols, rows
    let zoff = 0
    let fr
    
    class Particle {
      constructor(p5) {
        this.p5 = p5
        this.pos = p5.createVector(p5.random(p5.width), p5.random(p5.height))
        this.vel = p5.createVector(0,0)
        this.acc = p5.createVector(0,0)
        this.maxspeed = 4
        this.historySize = 10
        this.history = new Array(this.historySize)
        this.historyIndex = 0
      }
      
      update() {
        this.vel.add(this.acc)
        this.vel.limit(this.maxspeed)
        this.pos.add(this.vel)
        this.acc.mult(0)
        this.addHistory(this.pos)
      }

      follow(vectors) {
        let x = p5.floor(this.pos.x / scl) % cols
        let y = p5.floor(this.pos.y / scl) % rows
        x = p5.constrain(x, 0, cols - 1)
        y = p5.constrain(y, 0, rows - 1)
        let index = x + y * cols
        let force = vectors[index]
        this.applyForce(force)
      }

      applyForce(force) {
        this.acc.add(force)
      }

      edges() {
        let wrapped = false
      
        if (this.pos.x > p5.width) {
          this.pos.x = 0
          wrapped = true
        } else if (this.pos.x < 0) {
          this.pos.x = p5.width
          wrapped = true
        }
      
        if (this.pos.y > p5.height) {
          this.pos.y = 0
          wrapped = true
        } else if (this.pos.y < 0) {
          this.pos.y = p5.height
          wrapped = true
        }
      
        if (wrapped) {
          this.history[this.historyIndex] = undefined
          this.historyIndex = (this.historyIndex + 1) % this.historySize
        }
      }

      addHistory(position) {
        this.history[this.historyIndex] = position.copy()
        this.historyIndex = (this.historyIndex + 1) % this.historySize
      }
      
      show() {
        let maxOpacity = 100
        let minOpacity = 5

        this.p5.noFill()
        this.p5.strokeWeight(1)
        for (let i = this.historySize - 1; i >= 1; i--) {
          let index = (this.historyIndex - i + this.historySize) % this.historySize
          let pos = this.history[index]
          if (pos) {
            let opacity = p5.map(i, 0, this.historySize - 1, minOpacity, maxOpacity)
            let hue = p5.map(i, 0, this.historySize - 1, 0, 255) // change hue from start to end of trail
            this.p5.stroke(hue, 255, 255, opacity)
            let nextIndex = (index + 1) % this.historySize;
            let nextPos = this.history[nextIndex]
            if (nextPos) {
              let d = (pos.x - nextPos.x) ** 2 + (pos.y - nextPos.y) ** 2
              let threshold = (p5.width / 2) ** 2
              if (d < threshold) {
                this.p5.line(pos.x, pos.y, nextPos.x, nextPos.y)
              }
            }
          }
        }
      }
    }
    
    const particles = []
    let flowField = []

    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight)
      p5.colorMode(p5.HSB, 255)
      cols = p5.floor(p5.width / scl)
      rows = p5.floor(p5.height / scl)
      fr = p5.createP('')

      flowField = new Array(cols * rows)

      for (let i = 0; i < 10000; i++) {
        particles.push(new Particle(p5))
      }
      p5.background(10)
    }

    p5.draw = () => {
      let dTheta = p5.TWO_PI / cols
      let dPhi = p5.TWO_PI / rows
      let r = 10
      let R = 30

      let yoff = 0
      for (let y = 0; y < rows; y++) {
        let xoff = 0
        let phi = dPhi * y
        for (let x = 0; x < cols; x++) {
          let theta = dTheta * x

          // calculate 3d coords based on toros
          let sampleX = (R + r * p5.cos(phi)) * p5.cos(theta)
          let sampleY = (R + r * p5.cos(phi)) * p5.sin(theta)
          let sampleZ = r * p5.sin(phi)
          
          // sample Perlin noise using 3d coords
          let noiseValue = p5.noise(sampleX, sampleY, sampleZ)
          let angle = noiseValue * p5.TWO_PI * 4
          let v = p5.createVector(p5.cos(angle), p5.sin(angle))
          let index = x + y * cols
          flowField[index] = v
          v.setMag(2)
          
          // Uncomment to see the flow field vectors
          
          // p5.stroke(0, 50)
          // p5.strokeWeight(1)
          // p5.push()
          // p5.translate(x * scl, y * scl)
          // p5.rotate(v.heading())
          // p5.line(0, 0, scl, 0)
          // p5.pop()
          
          xoff += inc
        }
        yoff += inc
      }

      for (var i = 0; i < particles.length; i++) {
        particles[i].follow(flowField)
        particles[i].update()
        particles[i].edges()
        particles[i].show()
      }

      fr.html(p5.floor(p5.frameRate()))
    }
    p5.windowResized = () => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
    }
  }

  useEffect(() => {
    const canvas = new p5(Sketch, canvasRef.current)
    return () => canvas.remove()
  }, [])
  
  return <div ref={canvasRef} id="perlin-noise" />
}

export default PerlinNoise