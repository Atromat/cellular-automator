//displayMode = "add", "edit", "justShow"

import { useState, useEffect } from "react"
import CellTypeDropdownMenu from "../CellTypeDropdownMenu";
import PatternEditor from "../PatternEditor";
import "./RuleCreator.css";
import axios from "axios";

function RuleCreator({
  chosenRule, 
  activeRuleSet,
  setActiveRuleSet,
  handleClickDropdownElemRule, 
  deleteChosenRule, 
  setChosenRule,
  chosenPattern,
  setChosenPattern,
  setRulesets,
  apiURL
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

  //#region Rule Add, Edit, Delete, Save, Cancel
  function handleClickAddRule(event) {
    resetStatesToNotChosenRule();
    setChosenRule({
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

  async function fetchPostRule(ruleset, rule) {
    try {
      const res = await axios.post(apiURL + '/rule', 
        {
          rulesetId: ruleset._id,
          rule: rule
        },
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("userToken")}`
          }
        }
      );
      return res;
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchPatchRule(ruleset, rule) {
    try {
      const res = await axios.patch(apiURL + '/rule', 
        {
          rulesetId: ruleset._id,
          rule: rule
        },
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("userToken")}`
          }
        }
      );
      return res;
    } catch (err) {
      console.error(err);
    }
  }

  async function handleClickSaveRule(event) {
    if (displayMode === "add") {
      console.log(chosenRule)
      const res = await fetchPostRule(activeRuleSet, chosenRule);
      setChosenRule(res.data.rule);
      setActiveRuleSet(res.data.ruleset);
      setRulesets(res.data.rulesets);
    }

    if (displayMode === "edit") {
      const res = await fetchPatchRule(activeRuleSet, chosenRule);
      setChosenRule(res.data.rule);
      setActiveRuleSet(res.data.ruleset);
      setRulesets(res.data.rulesets);
    }
    
    setDisplayMode("justShow");
  }

  function handleClickCancelRule(event) {
    setDisplayMode("justShow");
    resetStatesToNotChosenRule();
  }

  //#endregion

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
            setRulesets={setRulesets}
            apiURL={apiURL}
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