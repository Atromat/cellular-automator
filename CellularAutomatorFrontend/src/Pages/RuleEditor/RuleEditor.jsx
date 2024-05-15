import { useState } from 'react';
import CellularAutomatonSimCanvas from '../../Components';
import './RuleEditor.css';
import { gameOfLifeRuleset, rule30Ruleset } from '../../SimulationLogic/PremadeRulesets';

function RuleEditor() {
  const [isSimulationStopped, setIsSimulationStopped] = useState(true);
  const [activeRuleSet, setActiveRuleSet] = useState(gameOfLifeRuleset);

  function stopOrStartSimulation(event) {
    if (isSimulationStopped) {
      setIsSimulationStopped(false);
    } else {
      setIsSimulationStopped(true);
    }
  }

  function changeRuleSet(event) {
    if (activeRuleSet === gameOfLifeRuleset) {
      setActiveRuleSet(rule30Ruleset);
    } else {
      setActiveRuleSet(gameOfLifeRuleset);
    }
  }

  return (
    <div id='RuleEditor'>
      <div>RuleEditor</div>
      <details>
      <summary>
          Vmi
      </summary>
      <p>sdsddasd</p>
      <p>sdsddasd</p>
      <p>sdsddasd</p>
      </details>
      <button onClick={(e) => stopOrStartSimulation(e)}>{isSimulationStopped ? 'Start' : 'Stop'}</button>
      <button onClick={(e) => changeRuleSet(e)}>Active rule set: {activeRuleSet === gameOfLifeRuleset ? 'Game Of Life' : 'Rule 30'}</button>
      <CellularAutomatonSimCanvas isSimulationStopped={isSimulationStopped} activeRuleSet={activeRuleSet} />
    </div>
  )
}

export default RuleEditor