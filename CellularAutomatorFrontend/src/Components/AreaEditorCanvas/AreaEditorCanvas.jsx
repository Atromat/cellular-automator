import { useEffect, useState, useRef } from 'react';

function AreaEditorCanvas({activeRuleSet, chosenRule, chosenPattern, setChosenPattern}) {

  const areaCanvasRef = useRef(null)

  const mapSize = 9;
  const mapCenter = Math.floor(mapSize/2);

  const [config, setConfig] = useState({
    tileSize: 30,
    hight: 270,
    width: 270,
    map: undefined,
    chosenPattern: undefined
  })

  useEffect(() => {
    const areaCanvas = areaCanvasRef.current;
    const context = areaCanvas.getContext('2d');

    areaCanvas.width = config.hight;
    areaCanvas.height = config.width;

    config.map = createEmptyMap(mapSize, mapSize);
    config.chosenPattern = chosenPattern;

    function handleCellClickEvent(e) {
      handleCellClick(e, areaCanvas, config.chosenPattern);
    }
    
    draw(context);

    areaCanvas.addEventListener('mousedown', handleCellClickEvent);
  
    return () => {
      areaCanvas.removeEventListener('mousedown', handleCellClickEvent);
    }
  }, [])

  useEffect(() => {
    config.chosenPattern = chosenPattern;
    setMapForRuleAndPattern(chosenRule.effectsCellType, chosenPattern);
    draw(getCanvasContext());
    console.log("Area-ban chosenPattern useEffect")
    console.log(chosenPattern)
  }, [chosenPattern])

  function getCanvasContext() {
    const areaCanvas = areaCanvasRef.current;
    return areaCanvas.getContext('2d');
  }
  
  function setMapForRuleAndPattern(cellTypeId, pattern) {
    resetMap();

    config.map[mapCenter][mapCenter] = cellTypeId;

    for (const coord of pattern.coordsRelativeToCell) {
      config.map[mapCenter + coord.r][mapCenter + coord.c] = "toBeChecked";
    }
  }

  function createEmptyMap(numberOfRows, numberOfColumns) {
    const map = [];

    for (let row = 0; row < numberOfRows; row++) {
      const rowArr = [];
      map.push(rowArr);
      for (let col = 0; col < numberOfColumns; col++) {
        if (row === mapCenter && col === mapCenter) {
          rowArr.push(chosenRule.effectsCellType);
        } else {
          rowArr.push(0);
        }
      }
    }

    return map;
  }

  function resetMap() {
    config.map = createEmptyMap(config.map.length, config.map[0].length);
  }

  function drawMap(ctx) {
    for (let y = 0; y < config.map.length; y++) {
      for (let x = 0; x < config.map[0].length; x++) {
        let tileX = x * config.tileSize;
        let tileY = y * config.tileSize;
        if (y >= 0 && x >= 0 && y < config.map.length && x < config.map[0].length) {
          if (config.map[y][x] === "toBeChecked") {
            const cellToDraw = activeRuleSet.cellTypes.find((cellType) => cellType.id === 0);
            ctx.fillStyle = cellToDraw.cellColor;
            ctx.fillRect(tileX, tileY, config.tileSize - 1, config.tileSize - 1);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#dece1d";
            ctx.strokeRect(tileX, tileY, config.tileSize - 1, config.tileSize - 1);
          } else {
            const cellToDraw = activeRuleSet.cellTypes.find((cellType) => cellType.id === config.map[y][x]);
            ctx.fillStyle = cellToDraw.cellColor;
            ctx.fillRect(tileX, tileY, config.tileSize - 1, config.tileSize - 1);
          }
        }
      }
    }
  }

  function draw(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    drawMap(ctx);
  }

  function handleCellClick(event, canvas, pattern) {
    event.preventDefault();

    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    let mapX = Math.floor(x / config.tileSize);
    let mapY = Math.floor(y / config.tileSize);

    if (mapX >= 0 && mapX < config.map[0].length && mapY >= 0 && mapY < config.map.length && !(mapX === mapCenter && mapY === mapCenter)) {
      if (config.map[mapY][mapX] === "toBeChecked") {
        config.map[mapY][mapX] = 0;
        const coordIndex = pattern.coordsRelativeToCell.findIndex(coord => coord.r === mapY - mapCenter && coord.c === mapX - mapCenter);
        pattern.coordsRelativeToCell.splice(coordIndex, 1);
        setChosenPattern({...pattern});
      } else {
        config.map[mapY][mapX] = "toBeChecked";
        pattern.coordsRelativeToCell.push({r: mapY - mapCenter, c: mapX - mapCenter});
        setChosenPattern({...pattern});
      }
    }

    draw(canvas.getContext('2d'));
  }

  return (
    <div>
      <canvas id="AreaEditorCanvas" ref={areaCanvasRef} />
    </div>
  )
}

export default AreaEditorCanvas