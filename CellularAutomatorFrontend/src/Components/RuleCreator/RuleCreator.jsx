//displayMode = "add", "edit", "justShow"

import { useState, useEffect } from "react"
import CellTypeDropdownMenu from "../CellTypeDropdownMenu";
import PatternEditor from "../PatternEditor";
import "./RuleCreator.css";

function RuleCreator({
  chosenRule, 
  activeRuleSet,
  setActiveRuleSet,
  handleClickDropdownElemRule, 
  deleteChosenRule, 
  setChosenRule,
  chosenPattern,
  setChosenPattern
}) {
  const [patternEditorDisplayMode, setPatternEditorDisplayMode] = useState("justShow");
  const [displayMode, setDisplayMode] = useState("justShow")
  
  function handleClickDropdownElemPattern(event, pattern) {
    setChosenPattern(pattern);
  }

  function getCellTypeFromId(cellTypeId) {
    return activeRuleSet.cellTypes.find(cellType => cellType.id === cellTypeId);
  }

  function handleChangeRuleNameInput(event) {
    chosenRule.ruleName = event.target.value
    setChosenRule({...chosenRule});
  }

  function handleChangeEffectedCellType(event, cellType) {;
    chosenRule.effectsCellType = cellType.id;
    setChosenRule({...chosenRule});
  }

  function handleChangeCellBecomes(event, cellType) {
    chosenRule.cellBecomes = cellType.id;
    setChosenRule({...chosenRule});
  }

  function resetStatesToNotChosenRule() {
    setChosenRule(undefined);
    setChosenPattern(undefined);
  }

  function handleClickAddRule(event) {
    resetStatesToNotChosenRule();
    setChosenRule({
      id: activeRuleSet.rules.reduce((maxRuleId, rule) => Math.max(maxRuleId, rule.id), 0) + 1,
      ruleName: '',
      effectsCellType: 0,
      patterns: [],
      cellBecomes: 0
    })
    setDisplayMode("add");
  }

  function handleClickEditRule(event) {
    if (chosenRule === undefined) {
      setDisplayMode("justShow");
      return;
    }

    const ruleToEdit = structuredClone(chosenRule);
    setChosenRule(ruleToEdit);
    setDisplayMode("edit");
  }

  function handleClickDeleteRule(event) {
    // TODO look at it again for potential problems
    deleteChosenRule();
    setDisplayMode("justShow");
    resetStatesToNotChosenRule();
  }

  function handleClickSaveRule(event) {
    if (displayMode === "add") {
      activeRuleSet.rules.push(chosenRule);
    }

    if (displayMode === "edit") {
      const ruleIndex = activeRuleSet.rules.findIndex(rule => rule.id === chosenRule.id);
      activeRuleSet.rules.splice(ruleIndex, 1, chosenRule);
    }
    
    setActiveRuleSet({...activeRuleSet});
    setDisplayMode("justShow");
  }

  function handleClickCancelRule(event) {
    setDisplayMode("justShow");
    resetStatesToNotChosenRule();
  }

  function getPatternEditor() {
    if (displayMode === "justShow") {
      return (
        <div>
          <PatternEditor
            chosenRule={chosenRule}
            setChosenRule={setChosenRule}
            activeRuleSet={activeRuleSet}
            setActiveRuleSet={setActiveRuleSet}
            chosenPattern={chosenPattern}
            setChosenPattern={setChosenPattern}
            handleClickDropdownElemPattern={handleClickDropdownElemPattern}
            effectedCellType={getCellTypeFromId(chosenRule.effectsCellType)}
          />
        </div>
      )
    }
  }

  function getRuleCreatorSummary() {
    if (displayMode === "justShow" && chosenRule) {
      return (
        <div className='RuleCreatorDiv'>
          <div className="RuleDescribingElement">
            <span className="CellAutomRect Green RuleSpan FirstColumnWidth">Effected cell type:</span>
            <span className="CellAutomRect TextOutline RuleSpan FirstColumnWidth" style={{backgroundColor: getCellTypeFromId(chosenRule.effectsCellType).cellColor}}>{getCellTypeFromId(chosenRule.effectsCellType).cellType}</span>
          </div>
          <div className="RuleDescribingElement">
            <span className="CellAutomRect Green RuleSpan FirstColumnWidth">Cell becomes:</span>
            <span className="CellAutomRect TextOutline RuleSpan FirstColumnWidth" style={{backgroundColor: getCellTypeFromId(chosenRule.cellBecomes).cellColor}}>{getCellTypeFromId(chosenRule.cellBecomes).cellType}</span>
          </div>
          {getPatternEditor()}
        </div>
      )
    }

    if (chosenRule) {
      return (
        <form className='RuleCreatorForm'>
          <div>
            <span className="CellAutomRect Green RuleSpan FirstColumnWidth">Effected cell type:</span>
            <CellTypeDropdownMenu 
              chosenCellType={getCellTypeFromId(chosenRule.effectsCellType)} 
              cellTypes={activeRuleSet.cellTypes} 
              handleClickDropdownElemCellType={handleChangeEffectedCellType} 
            />
          </div>
          <div>
            <span className="CellAutomRect Green RuleSpan FirstColumnWidth">Cell becomes:</span>
            <CellTypeDropdownMenu 
              chosenCellType={getCellTypeFromId(chosenRule.cellBecomes)} 
              cellTypes={activeRuleSet.cellTypes} 
              handleClickDropdownElemCellType={handleChangeCellBecomes} 
            />
          </div>
          {getPatternEditor()}
        </form>
      )
    }
  }

  return (
    <details id='RuleDetails' className='RuleEditorDetails'>
    <summary>
      {displayMode !== "justShow" ? (
        <input className="TextInput" type="text" value={chosenRule.ruleName} onChange={(e) => handleChangeRuleNameInput(e)} placeholder="Rule name"></input>
      ) : (
        <div className="dropdown">
          <button className="dropbtn FirstColumnWidth">{chosenRule ? chosenRule.ruleName : "Choose a rule"}</button>
          <div className="dropdown-content">
            {activeRuleSet.rules.map((rule, i) =>
              <div key={i} className='DropdownElement' onClick={(e) => handleClickDropdownElemRule(e, rule)}>{rule.ruleName}</div>
            )}
          </div>
        </div>
      )}



      {displayMode !== "justShow" ? (
        <>
          <button className='EditorButton' onClick={(e) => handleClickSaveRule(e)}>Save</button>
          <button className='EditorButton' onClick={(e) => handleClickCancelRule(e)}>Cancel</button>
        </>
      ) : (
        <>
        <button className='EditorButton' onClick={(e) => handleClickAddRule(e)}>Add</button>

        {chosenRule ? (
          <>
          <button className='EditorButton' onClick={(e) => handleClickEditRule(e)}>Edit</button>
          <button className='EditorButton' onClick={(e) => handleClickDeleteRule(e)}>Delete</button>
          </>
        ) : (
          <></>
        )}
        
        </>
      )}

    </summary>

      {getRuleCreatorSummary()}

    </details>
  )
}

export default RuleCreator