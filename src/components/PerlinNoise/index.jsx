import React, { useEffect, useRef } from 'react'
import p5 from 'p5'
import './PerlinNoise.css'

const PerlinNoise = () => {
const canvasRef = useRef()

  const Sketch = p5 => {
    const inc = 0.002

    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight)
      p5.pixelDensity(1)
    }

    p5.draw = () => {
      let yoff = 0
      
      p5.loadPixels()
      for (let y = 0; y < p5.height; y++) {
        let xoff = 0
        for (let x = 0; x < p5.width; x++) {
          let index = (x + y * p5.width) * 4
          let r = p5.noise(xoff, yoff) * 255
          p5.pixels[index + 0] = r
          p5.pixels[index + 1] = r
          p5.pixels[index + 2] = r
          p5.pixels[index + 3] = 255

          xoff += inc
        }
        yoff += inc
      }
      p5.noiseDetail(12, .5)
      p5.updatePixels()

      // start += inc

      // p5.noLoop()

      // let x = p5.map(p5.noise(xoff1), 0, 1, 0, p5.width)
      // let y = p5.map(p5.noise(xoff2), 0, 1, 0, p5.height)

      // xoff1 += 0.01
      // xoff2 += 0.01

      // p5.ellipse(x, y, 24, 24)
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