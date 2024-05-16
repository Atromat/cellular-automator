import { useRef, useEffect, useState } from 'react';
import './CellularAutomatonSimCanvas.css';
import applyRulesToMap from '../SimulationLogic/CellularAutomatonSimLogic';

function CellularAutomatonSimCanvas({ isSimulationStopped, activeRuleSet, rulesetDetailsOpen }) {

  const [mapSize, setMapSize] = useState({amountOfTilesY: 10, amountOfTilesX: 10});
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
    tileSize: 30,
    map: createEmptyMap(mapSize.amountOfTilesY, mapSize.amountOfTilesX),
    previousMapCalcTime: Date.now(),
    timeBetweenMapCalc: 300,
    isSimStopped: true,
    activeRuleSet: undefined
  });

  const canvasRef = useRef(null)
  
  useEffect(() => {
    config.activeRuleSet = activeRuleSet;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let animationFrameId;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    function handleCellClickEvent(e) {
        handleCellClick(canvas, e);
    }
    
    canvas.addEventListener('mousedown', handleCellClickEvent);
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('wheel', handleMouseWheel);
    
    const render = () => {
      if (!config.isSimStopped && (Date.now() - config.previousMapCalcTime) > config.timeBetweenMapCalc) {
        config.map = applyRulesToMap(config.activeRuleSet, config.map);
        config.previousMapCalcTime = Date.now();
      }

      draw(context);
      animationFrameId = window.requestAnimationFrame(render);
    }

    render();
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousedown', handleCellClickEvent);
      window.removeEventListener('resize', onWindowResize);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('wheel', handleMouseWheel);
    }
  }, [])

  useEffect(() => {
    config.isSimStopped = isSimulationStopped;
  }, [isSimulationStopped])

  useEffect(() => {
    config.activeRuleSet = activeRuleSet;
    resetMap();
  }, [activeRuleSet])

  useEffect(() => {
      onWindowResize();
  }, [rulesetDetailsOpen])

  function createEmptyMap(numberOfRows, numberOfColumns) {
    const map = [];

    for (let row = 0; row < numberOfRows; row++) {
      const rowArr = [];
      map.push(rowArr);
      for (let col = 0; col < numberOfColumns; col++) {
        rowArr.push(0);
      }
    }

    return map;
  }

  function resetMap() {
    config.map = createEmptyMap(config.map.length, config.map[0].length);
  }

  function drawMap(ctx) {
    let x_min = Math.floor(config.viewport.x / config.tileSize);
    let y_min = Math.floor(config.viewport.y / config.tileSize);
    let x_max = Math.ceil((config.viewport.x + ctx.canvas.clientWidth) / config.tileSize);
    let y_max = Math.ceil((config.viewport.y + ctx.canvas.clientHeight) / config.tileSize);

    for (let y = y_min; y < y_max; y++) {
      for (let x = x_min; x < x_max; x++) {
        let tileX = x * config.tileSize - config.viewport.x;
        let tileY = y * config.tileSize - config.viewport.y;
        if (y >= 0 && x >= 0 && y < config.map.length && x < config.map[0].length) {
          ctx.fillStyle = config.activeRuleSet.cellTypes.find((cellType) => cellType.id === config.map[y][x]).cellColor;
          ctx.fillRect(tileX, tileY, config.tileSize - 1, config.tileSize - 1);
        }
      }
    }
  }

  function drawBorder(ctx) {
    ctx.lineWidth = 2;
    ctx.strokeStyle="#FF0000";
    ctx.strokeRect(-config.viewport.x, -config.viewport.y, config.map[0].length * config.tileSize, config.map.length * config.tileSize);
  }

  function draw(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    //resizeCanvasToDisplaySize(ctx.canvas);
    if (config.viewport.moving = true) {
      moveViewport();
    }

    drawMap(ctx);
    drawBorder(ctx);
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
  //ask a mentor about this
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
      canvas.width = 1;
      canvas.height = 1;
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
    let mapX = Math.floor((x + config.viewport.x) / config.tileSize);
    let mapY = Math.floor((y + config.viewport.y) / config.tileSize);

    if (mapX >= 0 && mapX < config.map[0].length && mapY >= 0 && mapY < config.map.length) {
      if (config.map[mapY][mapX] === 0) {
        config.map[mapY][mapX] = 1;
      } else {
        config.map[mapY][mapX] = 0;
      }
    }
  }

  function handleMouseWheel(event) {
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