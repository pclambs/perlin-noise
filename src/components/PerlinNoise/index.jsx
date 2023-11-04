import React, { useEffect, useRef } from 'react'
import p5, { Vector } from 'p5'
import './PerlinNoise.css'


const PerlinNoise = () => {
  const canvasRef = useRef()
  const Sketch = p5 => {
    const inc = 0.005
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
      }

      update() {
        this.vel.add(this.acc)
        this.vel.limit(this.maxspeed)
        this.pos.add(this.vel)
        this.acc.mult(0)
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

      show() {
        p5.stroke(0)
        p5.strokeWeight(4)
        p5.point(this.pos.x, this.pos.y)
      }

      edges() {
        if (this.pos.x > p5.width) this.pos.x = 0
        if (this.pos.x < 0) this.pos.x = p5.width
        if (this.pos.y > p5.height) this.pos.y = 0
        if (this.pos.y < 0) this.pos.y = p5.height
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

      for (let i = 0; i < 1000; i++) {
        particles.push(new Particle(p5));
      }
    }

    p5.draw = () => {
      p5.background(225)
      let yoff = 0
      for (let y = 0; y < rows; y++) {
        let xoff = 0
        for (let x = 0; x < cols; x++) {
          let index = x + y * cols
          let angle = p5.noise(xoff, yoff, zoff) * p5.TWO_PI * 1
          let v = p5.createVector(p5.cos(angle), p5.sin(angle))
          v.setMag(.1)
          flowField[index] = v
          xoff += inc
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
        particles[i].show()
        particles[i].edges()
      }

      fr.html(p5.floor(p5.frameRate()))
    }

    p5.windowResized = () => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
    }
  }

  useEffect(() => {
    const canvas = new p5(Sketch, canvasRef.current);
    return () => canvas.remove();
  }, [])
  

  return <div id="perlin-noise" />
}

export default PerlinNoise