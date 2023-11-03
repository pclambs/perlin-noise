import React, { useEffect, useRef } from 'react'
import p5 from 'p5'
import './PerlinNoise.css'

const PerlinNoise = () => {
const canvasRef = useRef()

  const Sketch = p5 => {
    let xoff1 = 0
    let xoff2 = 10000

    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight)
    }

    p5.draw = () => {
      p5.background(51)
      let x = p5.map(p5.noise(xoff1), 0, 1, 0, p5.width)
      let y = p5.map(p5.noise(xoff2), 0, 1, 0, p5.height)

      xoff1 += 0.01
      xoff2 += 0.01

      p5.ellipse(x, y, 24, 24)
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