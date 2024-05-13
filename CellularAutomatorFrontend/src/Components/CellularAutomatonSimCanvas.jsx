import { useRef, useEffect, useState } from 'react';
import './CellularAutomatonSimCanvas.css';

function CellularAutomatonSimCanvas() {

  const [config, setConfig] = useState({
    win: {
      width: 100,
      height: 100
    },
    keys: {
      37: {
        x: -5,
        y: 0,
        a: false
      },
      38: {
        x: 0,
        y: -5,
        a: false
      },
      39: {
        x: 5,
        y: 0,
        a: false
      },
      40: {
        x: 0,
        y: 5,
        a: false
      }
    },
    viewport: {x: 0, y: 0, moving: false},
    tileSize: 64
  });

  const [map, setMap] = useState(
    [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
      [1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]
  );

  const canvasRef = useRef(null)
  
  useEffect(() => {
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let animationFrameId;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    console.log(`context.canvas.clientHeight: ${context.canvas.clientHeight}`);
    console.log(`context.canvas.clientWidth: ${context.canvas.clientWidth}`);

    function handleCellClickEvent(e) {
        handleCellClick(canvas, e);
    }
    
    document.addEventListener('mousedown', handleCellClickEvent);
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('wheel', handleMouseWheel);
    
    const render = () => {
      draw(context);
      animationFrameId = window.requestAnimationFrame(render);
    }

    render();
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      document.removeEventListener('mousedown', handleCellClickEvent);
      window.removeEventListener('resize', onWindowResize);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('wheel', handleMouseWheel);
    }
  }, [])

  function drawMap(ctx) {
    let x_min = Math.floor(config.viewport.x / config.tileSize);
    let y_min = Math.floor(config.viewport.y / config.tileSize);
    let x_max = Math.ceil((config.viewport.x + ctx.canvas.clientWidth) / config.tileSize);
    let y_max = Math.ceil((config.viewport.y + ctx.canvas.clientHeight) / config.tileSize);

/*
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        let tileX = x * config.tileSize - config.viewport.x;
        let tileY = y * config.tileSize - config.viewport.y;
        if (map[y][x] === 1) {
          ctx.fillStyle = '#AFE1AF';
          ctx.fillRect(tileX, tileY, config.tileSize - 1, config.tileSize - 1);
        }
      }
    }
*/
    for (let y = y_min; y < y_max; y++) {
      for (let x = x_min; x < x_max; x++) {
        let tileX = x * config.tileSize - config.viewport.x;
        let tileY = y * config.tileSize - config.viewport.y;
        if (y >= 0 && x >= 0 && y < map.length && x < map[0].length && map[y][x] === 1) {
          ctx.fillStyle = '#AFE1AF';
          ctx.fillRect(tileX, tileY, config.tileSize - 1, config.tileSize - 1);
        }
      }
    }
  }

  function draw(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    //resizeCanvasToDisplaySize(ctx.canvas);
    if (config.viewport.moving = true) {
      moveViewport();
    }
    drawMap(ctx);
  }

  function moveViewport() {
    for (let key in config.keys) {
      if (config.keys[key].a) {
        if (config.keys[key].x != 0) {
          config.viewport.x += config.keys[key].x;
        }

        if (config.keys[key].y != 0) {
          config.viewport.y += config.keys[key].y;
        }
      }
    }
  }

  /*
  //old way
  function resizeCanvasToDisplaySize(canvas) {
    //const { width, height } = canvas.getBoundingClientRect();
    const width  = canvas.clientWidth;
    const height = canvas.clientHeight;
    config.win.width = width;
    config.win.height = height;

    if (canvas.width !== width) {
      //console.log(`context.canvas.getBoundingClientRect.height: ${canvas.getBoundingClientRect().height}`);
      console.log(`canvas.width: ${canvas.width} !== Rect.width: ${canvas.getBoundingClientRect().width}`);
      canvas.width = width;
      //canvas.height = height;
      //return true;
    }

    if (canvas.height !== height) {
      console.log(`canvas.height: ${canvas.height} !== Rect.height: ${canvas.getBoundingClientRect().height}`);
      console.log(`canvas.height: ${canvas.height} !== canvas.clientHeight: ${canvas.clientHeight}`);
      canvas.height = height;
    }

    //return false
  }
  */

  function onWindowResize() {
    if (canvasRef && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }
  }

  function handleKeyDown(event) {
    event.preventDefault();
    if (event.keyCode >= 37 && event.keyCode <= 40) {
      config.viewport.moving = true;

      for (let key in config.keys) {
        if (key == event.keyCode) {
          config.keys[key].a = true;
        }
      }
    }
  }

  function handleKeyUp(event) {
    event.preventDefault();
    if (event.keyCode >= 37 && event.keyCode <= 40) {
      config.viewport.moving = false;

      for (let key in config.keys) {
          if (key == event.keyCode) {
            config.keys[key].a = false;
          }
      }
    }
  }

  function handleCellClick(canvas, event) {
    event.preventDefault();
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    console.log(`x: ${x} y: ${y}`);
    let mapX = Math.floor((x + config.viewport.x) / config.tileSize);
    let mapY = Math.floor((y + config.viewport.y) / config.tileSize);

    console.log(`mapX: ${mapX} mapY: ${mapY} value: ${map[mapY][mapX]}`);

    if (map[mapY][mapX] === 0) {
      map[mapY][mapX] = 1;
    } else {
      map[mapY][mapX] = 0;
    }
    
    console.log(`mapX: ${mapX} mapY: ${mapY} value: ${map[mapY][mapX]}`);
    //map[mapY][mapX] = 666;
    console.log(map)
  }

  function handleMouseWheel(event) {
    //event.preventDefault();

    if (event.deltaY > 0) {
      config.tileSize--;
    }

    if (event.deltaY < 0) {
      config.tileSize++;
    }
  }

  return (
    <canvas id="CellularAutomatonSimCanvas" ref={canvasRef} />
  )
}

export default CellularAutomatonSimCanvas