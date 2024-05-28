import { useState } from 'react';
import CellularAutomatonSimCanvas from '../../Components';
import './RuleEditor.css';
import { gameOfLifeRuleset, rule30Ruleset } from '../../SimulationLogic/PremadeRulesets';

function RuleEditor() {
  const [isSimulationStopped, setIsSimulationStopped] = useState(true);
  const [activeRuleSet, setActiveRuleSet] = useState(gameOfLifeRuleset);
  const [chosenRule, setChosenRule] = useState(gameOfLifeRuleset.rules[0]);
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
      <>
      {activeRuleSet.cellTypes.map((cellType, i) =>
        <div key={i} className='CellTypeSummaryElement'>{cellType.cellType}</div>
      )}
      </>
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
      <CellularAutomatonSimCanvas 
        isSimulationStopped={isSimulationStopped} 
        activeRuleSet={activeRuleSet}
        resetClicked={resetClicked}
        timeBetweenCalculatingMapTurns={timeBetweenCalculatingMapTurns}
        rowCount={rowCount}
        columnCount={columnCount}
      />
    </div>
  )
}

export default RuleEditor