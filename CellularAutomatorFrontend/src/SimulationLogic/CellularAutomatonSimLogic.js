function applyRulesToMap(ruleSet, map) {
  const newMap = structuredClone(map);

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      newMap[row][col] = applyRulesToCell(row, col, ruleSet, map);
    }
  }

  return newMap;
}

function applyRulesToCell(row, col, ruleSet, map) {
  for (const rule of ruleSet.rules) {
    if (map[row][col] === rule.effectsCellType && doPatternsFit(row, col, rule.patterns, map)) {
      return rule.cellBecomes;
    }
  }

  return map[row][col];
}

function doPatternsFit(row, col, patterns, map) {
  for (const pattern of patterns) {
    if (!doesPatternFit(row, col, pattern, map)) {
      return false;
    }
  }

  return true;
}

function doesPatternFit(row, col, pattern, map) {
  let amountOfCells = 0;

  for (const coordRelToCell of pattern.coordsRelativeToCell) {
    const rowToCheck = row + coordRelToCell.r;
    const columnToCheck = col + coordRelToCell.c;

    if (isCoordInMap(rowToCheck, columnToCheck, map) && map[rowToCheck][columnToCheck] === pattern.cellTypeToCheck) {
      amountOfCells++;
    }
  }

  return applyOperation(pattern.operation, amountOfCells, pattern.min, pattern.max);
}

function isCoordInMap(row, column, map) {
  return row >= 0 && row < map.length && column >= 0 && column < map[row].length
}

function applyOperation(operation, amount, min, max) {
  switch (operation) {
    case 'equal':
      return amount === min;
    case 'lesser':
      return amount < max;
    case 'greater':
      return amount > min;
    case 'between':
      return amount >= min && amount <= max;
  
    default:
      return false;
  }
}

export default applyRulesToMap;