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
      id: 0,
      ruleName: 'underpopulation',
      effectsCellType: 1,
      patterns: [
        {
          id: 0,
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
      id: 1,
      ruleName: 'survive',
      effectsCellType: 1,
      patterns: [
        {
          id: 1,
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
      id: 2,
      ruleName: 'overpopulation',
      effectsCellType: 1,
      patterns: [
        {
          id: 2,
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
      id: 3,
      ruleName: 'reproduction',
      effectsCellType: 0,
      patterns: [
        {
          id: 3,
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
      id: 0,
      ruleName: 'rule111',
      effectsCellType: 0,
      patterns: [
        {
          id: 0,
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
      id: 1,
      ruleName: 'rule110',
      effectsCellType: 0,
      patterns: [
        {
          id: 0,
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
      id: 2,
      ruleName: 'rule101',
      effectsCellType: 0,
      patterns: [
        {
          id: 2,
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
      id: 3,
      ruleName: 'rule100',
      effectsCellType: 0,
      patterns: [
        {
          id: 3,
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
      id: 4,
      ruleName: 'rule011',
      effectsCellType: 0,
      patterns: [
        {
          id: 4,
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
      id: 5,
      ruleName: 'rule010',
      effectsCellType: 0,
      patterns: [
        {
          id: 5,
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
      id: 6,
      ruleName: 'rule001',
      effectsCellType: 0,
      patterns: [
        {
          id: 6,
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

export { gameOfLifeRuleset, rule30Ruleset };