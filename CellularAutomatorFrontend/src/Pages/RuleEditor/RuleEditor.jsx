import { useState } from 'react';
import CellularAutomatonSimCanvas from '../../Components';
import './RuleEditor.css';
import { gameOfLifeRuleset, rule30Ruleset } from '../../SimulationLogic/PremadeRulesets';

function RuleEditor() {
  const [isSimulationStopped, setIsSimulationStopped] = useState(true);
  const [activeRuleSet, setActiveRuleSet] = useState(gameOfLifeRuleset);
  const [detailsToggled, setDetailsToggled] = useState(0);
  const [chosenRule, setChosenRule] = useState(gameOfLifeRuleset.rules[0]);
  const [resetClicked, setResetClicked] = useState(0)

  function stopOrStartSimulation(event) {
    if (isSimulationStopped) {
      setIsSimulationStopped(false);
    } else {
      setIsSimulationStopped(true);
    }
  }

  function handleDetailsToggle(event) {
    setDetailsToggled(detailsToggled + 1);
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
    //event.preventDefault();
    setChosenRule(rule);
  }

  return (
    <div id='RuleEditor'>
      <details className='RuleEditorDetails' onToggle={(e) => handleDetailsToggle(e)}>
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
      </details>
      <details className='RuleEditorDetails' onToggle={(e) => handleDetailsToggle(e)}>
      <summary>
          Choose rule: 
          <div className="dropdown">
            <button className="dropbtn">{chosenRule.ruleName}</button>
            <div className="dropdown-content">
              {activeRuleSet.rules.map((rule, i) =>
                <div key={i} className='DropdownElement'>{rule.ruleName}</div>
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
      <div id='SimulationControllButtonsContainer'>
        <button onClick={(e) => stopOrStartSimulation(e)}>{isSimulationStopped ? 'Start' : 'Stop'}</button>
        <button onClick={(e) => handleResetClick(e)}>Reset</button>
      </div>
      <CellularAutomatonSimCanvas isSimulationStopped={isSimulationStopped} activeRuleSet={activeRuleSet} detailsToggled={detailsToggled} resetClicked={resetClicked} />
    </div>
  )
}

export default RuleEditor