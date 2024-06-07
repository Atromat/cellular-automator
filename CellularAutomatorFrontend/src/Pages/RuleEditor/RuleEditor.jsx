import { useState } from 'react';
import CellularAutomatonSimCanvas from '../../Components';
import './RuleEditor.css';
import { gameOfLifeRuleset, rule30Ruleset } from '../../SimulationLogic/PremadeRulesets';
import CellTypeEditorContainer from '../../Components/CellTypeEditorContainer/CellTypeEditorContainer';
import RuleCreator from '../../Components/RuleCreator';

function RuleEditor() {
  const [isSimulationStopped, setIsSimulationStopped] = useState(true);
  const [activeRuleSet, setActiveRuleSet] = useState(gameOfLifeRuleset);
  const [chosenRule, setChosenRule] = useState(undefined);
  const [chosenCellType, setChosenCellType] = useState(undefined);
  const [resetClicked, setResetClicked] = useState(0);
  const [timeBetweenCalculatingMapTurns, setTimeBetweenCalculatingMapTurns] = useState(400);
  const [rowCount, setRowCount] = useState(80);
  const [columnCount, setColumnCount] = useState(120);
  const [chosenPattern, setChosenPattern] = useState(undefined);

  function stopOrStartSimulation(event) {
    setIsSimulationStopped(!isSimulationStopped);
  }

  function handleResetClick(event) {
    setResetClicked(resetClicked + 1);
  }

  function handleClickDropdownElemRuleset(event, ruleset) {
    event.preventDefault();
    setActiveRuleSet(ruleset);
    setChosenCellType(undefined);
  }

  function handleClickDropdownElemRule(event, rule) {
    event.preventDefault();
    setChosenRule(rule);
    setRuleCreatorDisplayMode("justShow");
    setChosenPattern(undefined);
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
    setActiveRuleSet({...activeRuleSet});
  }

  function editCellType(cellType) {
    const cellTypeToEdit = activeRuleSet.cellTypes.find(cellT => cellT.id === cellType.id);
    cellTypeToEdit.cellColor = cellType.cellColor;
    cellTypeToEdit.cellType = cellType.cellType;
    setActiveRuleSet({...activeRuleSet});
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

  function deleteChosenRule() {
    const ruleToDelIndex = activeRuleSet.rules.findIndex(r => r.id === chosenRule.id);
    activeRuleSet.rules.splice(ruleToDelIndex, 1);
    setChosenRule(undefined);
    setActiveRuleSet({...activeRuleSet});
  }

  return (
    <div id='RuleEditor'>
      <details id='RulesetDetails' className='RuleEditorDetails'>
        <summary>
          <div className="dropdown">
            <button className="dropbtn FirstColumnWidth">{activeRuleSet.ruleSetName}</button>
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

        <RuleCreator 
          chosenRule={chosenRule}
          activeRuleSet={activeRuleSet}
          setActiveRuleSet={setActiveRuleSet}
          handleClickDropdownElemRule={handleClickDropdownElemRule}
          deleteChosenRule={deleteChosenRule}
          setChosenRule={setChosenRule}
          chosenPattern={chosenPattern}
          setChosenPattern={setChosenPattern}
        />

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