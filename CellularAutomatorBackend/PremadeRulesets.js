const gameOfLifeRuleset = {
  ruleSetName: 'Game Of Life',
  cellTypes: [
    {
      id: 0,
      cellType: 'dead',
      cellColor: '#000000'
    },
    {
      id: 1,
      cellType: 'alive',
      cellColor: '#23b03d'
    }
  ],
  rules: [
    {
      ruleName: 'underpopulation',
      effectsCellType: 1,
      patterns: [
        {
          name: "lesser than 2 alive",
          coordsRelativeToCell: [
            { r: -1, c: -1 },
            { r: -1, c: 0 },
            { r: -1, c: 1 },
            { r: 0, c: -1 },
            { r: 0, c: 1 },
            { r: 1, c: -1 },
            { r: 1, c: 0 },
            { r: 1, c: 1 },
          ],
          cellTypeToCheck: 1,
          operation: 'lesser',
          min: 0,
          max: 2
        }
      ],
      cellBecomes: 0
    },
    {
      ruleName: 'survive',
      effectsCellType: 1,
      patterns: [
        {
          name: "2 or 3 alive",
          coordsRelativeToCell: [
            { r: -1, c: -1 },
            { r: -1, c: 0 },
            { r: -1, c: 1 },
            { r: 0, c: -1 },
            { r: 0, c: 1 },
            { r: 1, c: -1 },
            { r: 1, c: 0 },
            { r: 1, c: 1 },
          ],
          cellTypeToCheck: 1,
          operation: 'between',
          min: 2,
          max: 3
        }
      ],
      cellBecomes: 1
    },
    {
      ruleName: 'overpopulation',
      effectsCellType: 1,
      patterns: [
        {
          name: "more than 3 alive",
          coordsRelativeToCell: [
            { r: -1, c: -1 },
            { r: -1, c: 0 },
            { r: -1, c: 1 },
            { r: 0, c: -1 },
            { r: 0, c: 1 },
            { r: 1, c: -1 },
            { r: 1, c: 0 },
            { r: 1, c: 1 },
          ],
          cellTypeToCheck: 1,
          operation: 'greater',
          min: 3,
          max: undefined
        }
      ],
      cellBecomes: 0
    },
    {
      ruleName: 'reproduction',
      effectsCellType: 0,
      patterns: [
        {
          name: "exactly 3 alive",
          coordsRelativeToCell: [
            { r: -1, c: -1 },
            { r: -1, c: 0 },
            { r: -1, c: 1 },
            { r: 0, c: -1 },
            { r: 0, c: 1 },
            { r: 1, c: -1 },
            { r: 1, c: 0 },
            { r: 1, c: 1 },
          ],
          cellTypeToCheck: 1,
          operation: 'equal',
          min: 3,
          max: 3
        }
      ],
      cellBecomes: 1
    }
  ]
}

const rule30Ruleset = {
  ruleSetName: 'Rule 30',
  cellTypes: [
    {
      id: 0,
      cellType: 'dead',
      cellColor: '#000000'
    },
    {
      id: 1,
      cellType: 'alive',
      cellColor: '#17a38e'
    }
  ],
  rules: [
    {
      ruleName: 'rule111',
      effectsCellType: 0,
      patterns: [
        {
          name: "111",
          coordsRelativeToCell: [
            { r: -1, c: -1 },
            { r: -1, c: 0 },
            { r: -1, c: 1 },
          ],
          cellTypeToCheck: 1,
          operation: 'equal',
          min: 3,
          max: 3
        }
      ],
      cellBecomes: 0
    },
    {
      ruleName: 'rule110',
      effectsCellType: 0,
      patterns: [
        {
          name: "110",
          coordsRelativeToCell: [
            { r: -1, c: -1 },
            { r: -1, c: 0 },
          ],
          cellTypeToCheck: 1,
          operation: 'equal',
          min: 2,
          max: 2
        }
      ],
      cellBecomes: 0
    },
    {
      ruleName: 'rule101',
      effectsCellType: 0,
      patterns: [
        {
          name: "101",
          coordsRelativeToCell: [
            { r: -1, c: -1 },
            { r: -1, c: 1 },
          ],
          cellTypeToCheck: 1,
          operation: 'equal',
          min: 2,
          max: 2
        }
      ],
      cellBecomes: 0
    },
    {
      ruleName: 'rule100',
      effectsCellType: 0,
      patterns: [
        {
          name: "100",
          coordsRelativeToCell: [
            { r: -1, c: -1 },
          ],
          cellTypeToCheck: 1,
          operation: 'equal',
          min: 1,
          max: 1
        }
      ],
      cellBecomes: 1
    },
    {
      ruleName: 'rule011',
      effectsCellType: 0,
      patterns: [
        {
          name: "011",
          coordsRelativeToCell: [
            { r: -1, c: 0 },
            { r: -1, c: 1 },
          ],
          cellTypeToCheck: 1,
          operation: 'equal',
          min: 2,
          max: 2
        }
      ],
      cellBecomes: 1
    },
    {
      ruleName: 'rule010',
      effectsCellType: 0,
      patterns: [
        {
          name: "010",
          coordsRelativeToCell: [
            { r: -1, c: 0 },
          ],
          cellTypeToCheck: 1,
          operation: 'equal',
          min: 1,
          max: 1
        }
      ],
      cellBecomes: 1
    },
    {
      ruleName: 'rule001',
      effectsCellType: 0,
      patterns: [
        {
          name: "001",
          coordsRelativeToCell: [
            { r: -1, c: 1 },
          ],
          cellTypeToCheck: 1,
          operation: 'equal',
          min: 1,
          max: 1
        }
      ],
      cellBecomes: 1
    },
  ]
}

module.exports = { gameOfLifeRuleset, rule30Ruleset };