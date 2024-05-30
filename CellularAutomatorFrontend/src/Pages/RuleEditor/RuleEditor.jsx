import { useState } from 'react';
import CellularAutomatonSimCanvas from '../../Components';
import './RuleEditor.css';
import { gameOfLifeRuleset, rule30Ruleset } from '../../SimulationLogic/PremadeRulesets';
import CellTypeEditorContainer from '../../Components/CellTypeEditorContainer/CellTypeEditorContainer';

function RuleEditor() {
  const [isSimulationStopped, setIsSimulationStopped] = useState(true);
  const [activeRuleSet, setActiveRuleSet] = useState(gameOfLifeRuleset);
  const [chosenRule, setChosenRule] = useState(gameOfLifeRuleset.rules[0]);
  const [chosenCellType, setChosenCellType] = useState(undefined);
  const [resetClicked, setResetClicked] = useState(0);
  const [timeBetweenCalculatingMapTurns, setTimeBetweenCalculatingMapTurns] = useState(400);
  const [rowCount, setRowCount] = useState(80);
  const [columnCount, setColumnCount] = useState(120);

  function stopOrStartSimulation(event) {
    setIsSimulationStopped(!isSimulationStopped);
  }

  function handleResetClick(event) {
    setResetClicked(resetClicked + 1);
  }

  function handleClickDropdownElemRuleset(event, ruleset) {
    event.preventDefault();
    setActiveRuleSet(ruleset);
    setChosenRule(ruleset.rules[0]);
  }

  function handleClickDropdownElemRule(event, rule) {
    event.preventDefault();
    setChosenRule(rule);
  }

  function parseAndSetStateInputNumber(event, setStateCallBack) {
    const timeInput = parseInt(event.target.value);
    if (!isNaN(timeInput)) {
      setStateCallBack(timeInput);
    }
  }

  function changeCellTypeColor(event, id) {
    const cellType = activeRuleSet.cellTypes.find(cellType => cellType.id === id);
    cellType.cellColor = event.target.value;
  }

  function handleClickDropdownElemCellType(event, cellType) {
    setChosenCellType(cellType);
  }

  function addCellType(cellType) {
    const newCellType = {
      id: activeRuleSet.cellTypes.reduce((maxCellTypeID, cellType) => Math.max(maxCellTypeID, cellType.id), 0) + 1,
      cellType: cellType.cellType,
      cellColor: cellType.cellColor
    }

    activeRuleSet.cellTypes.push(newCellType);
  }

  function editCellType(cellType) {
    const cellTypeToEdit = activeRuleSet.cellTypes.find(cellT => cellT.id === cellType.id);
    cellTypeToEdit.cellColor = cellType.cellColor;
    cellTypeToEdit.cellType = cellTypeToEdit.cellType;
  }

  function deleteCellType(cellType) {
    if (cellType.id === 0) {
      return 0;
    }

    const cellTypeIndexToRemove = activeRuleSet.cellTypes.findIndex(cellT => cellT.id === cellType.id);
    activeRuleSet.cellTypes.splice(cellTypeIndexToRemove, 1);
    deleteRulesRelatedToCellType(cellType);
    setActiveRuleSet({...activeRuleSet});
    setChosenCellType(undefined);
  }

  function deleteRulesRelatedToCellType(cellType) {
    const rulesAfterDeletion = [];

    activeRuleSet.rules.forEach(rule => {
      if (!(rule.cellBecomes === cellType.id || rule.effectsCellType === cellType.id || patternsIncludeCellType(rule.patterns, cellType))) {
        rulesAfterDeletion.push(rule);
      }
    })

    activeRuleSet.rules = rulesAfterDeletion;
  }

  function patternsIncludeCellType(patterns, cellType) {
    for (const pattern of patterns) {
      if (pattern.cellTypeToCheck === cellType.id) {
        return true;
      }
    }

    return false;
  }

  function handleClickDeleteCellType(event) {
    deleteCellType(chosenCellType);
  }

  return (
    <div id='RuleEditor'>
      <details id='RulesetDetails' className='RuleEditorDetails'>
        <summary>
          Choose ruleset: 
          <div className="dropdown">
            <button className="dropbtn">{activeRuleSet.ruleSetName}</button>
            <div className="dropdown-content">
              <div className='DropdownElement' onClick={(e) => handleClickDropdownElemRuleset(e, gameOfLifeRuleset)} >Game Of Life</div>
              <div className='DropdownElement' onClick={(e) => handleClickDropdownElemRuleset(e, rule30Ruleset)}>Rule 30</div>
            </div>
          </div>
        </summary>

        <CellTypeEditorContainer 
          chosenCellType={chosenCellType} 
          cellTypes={activeRuleSet.cellTypes} 
          handleClickDropdownElemCellType={handleClickDropdownElemCellType}
          addCellType={addCellType}
          editCellType={editCellType}
          handleClickDeleteCellType={handleClickDeleteCellType}
        />

        <details id='RuleDetails' className='RuleEditorDetails'>
        <summary>
          Choose rule: 
          <div className="dropdown">
            <button className="dropbtn">{chosenRule.ruleName}</button>
            <div className="dropdown-content">
              {activeRuleSet.rules.map((rule, i) =>
                <div key={i} className='DropdownElement' onClick={(e) => handleClickDropdownElemRule(e, rule)}>{rule.ruleName}</div>
              )}
            </div>
          </div>
        </summary>
        <>
        {chosenRule.patterns[0].coordsRelativeToCell.map((coord, i) =>
          <div key={i}>r: {coord.r}, c: {coord.c}</div>
        )}
        </>
        </details>
      </details>

      <div id='SimulationControllButtonsContainer'>
        <button onClick={(e) => stopOrStartSimulation(e)}>{isSimulationStopped ? 'Start' : 'Stop'}</button>
        <button onClick={(e) => handleResetClick(e)}>Reset</button>
        <span>Time between turns (milliseconds):</span>
        <input type="number" onChange={(e) => parseAndSetStateInputNumber(e, setTimeBetweenCalculatingMapTurns)} min={100} value={timeBetweenCalculatingMapTurns}/>
        <span>Size of map (row x column):</span>
        <input type="number" onChange={(e) => parseAndSetStateInputNumber(e, setRowCount)} min={1} value={rowCount}/>
        <span> X </span>
        <input type="number" onChange={(e) => parseAndSetStateInputNumber(e, setColumnCount)} min={1} value={columnCount}/>
      </div>

      {activeRuleSet && activeRuleSet.rules.length > 0 ? (
        <CellularAutomatonSimCanvas 
          isSimulationStopped={isSimulationStopped} 
          activeRuleSet={activeRuleSet}
          resetClicked={resetClicked}
          timeBetweenCalculatingMapTurns={timeBetweenCalculatingMapTurns}
          rowCount={rowCount}
          columnCount={columnCount}
          chosenCellType={chosenCellType}
        />
      ) : (
        <h1>Choose a ruleset with at least one rule</h1>
      )}

    </div>
  )
}

export default RuleEditor