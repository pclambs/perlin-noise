import React, { useEffect, useRef } from 'react'
import p5 from 'p5'
import './PerlinNoise.css'


const PerlinNoise = () => {
  const canvasRef = useRef()
  const Sketch = p5 => {
    const inc = .2
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
        this.maxspeed = 4
        this.historySize = 5
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
          this.history = new Array(this.historySize)
          this.historyIndex = 0
        }
      }

      addHistory(position) {
        this.history[this.historyIndex] = position.copy()
        this.historyIndex = (this.historyIndex + 1) % this.historySize
      }
      
      
      show() {
        p5.stroke(255, 5)
        this.p5.strokeWeight(1)
        this.p5.noFill()  
        p5.beginShape()
        for (let i = this.historyIndex, count = 0; count < this.historySize; i = (i + 1) % this.historySize, count++) {
          let pos = this.history[i]
          if (pos) {
            p5.vertex(pos.x, pos.y)
          }
        }
        this.p5.endShape()
      }
    }
    
    const particles = []

    let flowField = []

    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight)
      cols = p5.floor(p5.width / scl)
      rows = p5.floor(p5.height / scl)
      fr = p5.createP('')

      flowField = new Array(cols * rows)

      for (let i = 0; i < 10000; i++) {
        particles.push(new Particle(p5))
      }
      p5.background(51)
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
          v.setMag(20)
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