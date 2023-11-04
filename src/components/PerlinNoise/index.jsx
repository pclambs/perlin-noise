import React, { useEffect, useRef } from 'react'
import p5 from 'p5'
import './PerlinNoise.css'


const PerlinNoise = () => {
  const canvasRef = useRef()
  const Sketch = p5 => {
    const inc = 0.005
    const scl = 10
    let cols, rows
    let zoff = 0
    let fr

    p5.setup = () => {
      p5.createCanvas(1000, 1000)
      // (p5.windowWidth, p5.windowHeight)
      cols = p5.floor(p5.width / scl)
      rows = p5.floor(p5.height / scl)
      fr = p5.createP('')
    }

    p5.draw = () => {
      p5.background(225)
      let yoff = 0
      for (let y = 0; y < rows; y++) {
        let xoff = 0
        for (let x = 0; x < cols; x++) {
          let angle = p5.noise(xoff, yoff, zoff) * p5.TWO_PI
          let v = p5.createVector(p5.cos(angle), p5.sin(angle))
          xoff += inc
          p5.stroke(0)
          p5.push()
          p5.translate(x * scl, y * scl)
          p5.rotate(v.heading())
          p5.line(0, 0, scl, 0)
          p5.pop()
        }
        yoff += inc
        zoff += 0.0001
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