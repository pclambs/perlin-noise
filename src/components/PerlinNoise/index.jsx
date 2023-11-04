import React, { useEffect, useRef } from 'react'
import p5 from 'p5'
import './PerlinNoise.css'

const PerlinNoise = () => {
  const canvasRef = useRef()
  const Sketch = p5 => {
    const inc = .1
    const scl = 10
    let cols, rows
    let zoff = 0
    let fr
    
    class Particle {
      constructor(p5) {
        this.p5 = p5
        this.pos = p5.createVector(p5.random(p5.width), p5.random(p5.height))
        this.vel = p5.createVector(0,0)
        this.acc = p5.createVector(0,0)
        this.maxspeed = 2
        this.historySize = 15
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
        let x = p5.floor(this.pos.x / scl)
        let y = p5.floor(this.pos.y / scl)
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
          for (let i = 0; i < this.historySize; i++) {
            if (this.history[i] !== undefined) {
              this.history[i].x = this.pos.x
              this.history[i].y = this.pos.y
            }
          }
        }
      }

      addHistory(position) {
        this.history[this.historyIndex] = position.copy()
        this.historyIndex = (this.historyIndex + 1) % this.historySize
      }
      
      show() {
        // let hue = p5.map(this.pos.x, 0, p5.width, 0, 255)

        let maxOpacity = 100
        let minOpacity = 5

        this.p5.noFill()  
        for (let i = this.historySize - 1; i >= 1; i--) {
          let index = (this.historyIndex -1) % this.historySize
          let pos = this.history[index]
          if (pos) {
            let opacity = p5.map(i, 0, this.historySize-1, minOpacity, maxOpacity)
            let hue = p5.map(i, 0, this.historySize-1, 0, 255) // change hue from start to end of trail

            this.p5.stroke(hue, 255, 255, opacity)
            this.p5.strokeWeight(1)

            if (i === this.historySize - 1) {
              p5.beginShape()
              p5.vertex(pos.x, pos.y)
            } else {
              let nextPos = this.history[(index + 1) % this.historySize]
              if (nextPos) {
                p5.vertex(nextPos.x, nextPos.y)
              }
            }

          }
        }
        this.p5.endShape()
      }
    }
    
    const particles = []
    let flowField = []

    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight)
      p5.colorMode(p5.HSB, 255)
      cols = p5.floor(p5.width / scl) + 1
      rows = p5.floor(p5.height / scl) + 1
      fr = p5.createP('')

      flowField = new Array(cols * rows)

      for (let i = 0; i < 10000; i++) {
        particles.push(new Particle(p5))
      }
      p5.background(10)
    }

    p5.draw = () => {
      let yoff = 0
      for (let y = 0; y < rows; y++) {
        let xoff = 0
        for (let x = 0; x < cols; x++) {
          let index = x + y * cols
          let angle = p5.noise(xoff, yoff, zoff) * p5.TWO_PI * 2
          let v = p5.createVector(p5.cos(angle), p5.sin(angle))
          flowField[index] = v
          v.setMag(1)
          xoff += inc

          // Uncomment to see the flow field vectors

          // p5.stroke(0, 50)
          // p5.strokeWeight(1)
          // p5.push()
          // p5.translate(x * scl, y * scl)
          // p5.rotate(v.heading())
          // p5.line(0, 0, scl, 0)
          // p5.pop()
        }
        yoff += inc
        zoff += 0.0001
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