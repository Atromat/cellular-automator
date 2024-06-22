import { useState, useEffect } from "react";
import CellTypeDropdownMenu from "../CellTypeDropdownMenu";
import "./PatternEditor.css";
import AreaEditorCanvas from "../AreaEditorCanvas";
import axios from "axios";

function PatternEditor({
  chosenRule,
  setChosenRule,
  activeRuleSet,
  setActiveRuleSet,
  chosenPattern,
  setChosenPattern,
  handleClickDropdownElemPattern,
  setRulesets,
  apiURL
}) {
  const [displayMode, setDisplayMode] = useState("justShow");

  useEffect(() => {
    if (chosenPattern === undefined) {
      setDisplayMode("justShow");
    }
  }, [chosenPattern])
  

  function handleClickDropdownElemCellType(event, cellType) {
    chosenPattern.cellTypeToCheck = cellType.id;
    setChosenPattern({...chosenPattern});
  }

  function getCellTypeName(cellTypeId, ruleset) {
    return ruleset.cellTypes.find(cellType => cellType.id === cellTypeId).cellType;
  }

  function handleChangePatternNameInput(event) {
    chosenPattern.name = event.target.value;
    setChosenPattern({...chosenPattern});
  }

  //#region Pattern Add, Edit, Delete, Save, Cancel

  function handleClickAddPattern(event) {
    chosenPattern = {
      id: chosenRule.patterns.reduce((maxPatternId, pattern) => Math.max(maxPatternId, pattern.id), 0) + 1,
      name: "",
      coordsRelativeToCell: [],
      cellTypeToCheck: undefined,
      operation: 'lesser',
      min: 0,
      max: undefined
    }

    setChosenPattern({...chosenPattern});
    setDisplayMode("add");
  }

  function handleClickEditPattern(event) {
    const patternToEdit = structuredClone(chosenPattern);
    setChosenPattern(patternToEdit);
    setDisplayMode("edit");
  }

  async function fetchDeletePattern(ruleset, rule, pattern) {
    try {
      const res = await axios.delete(apiURL + '/pattern', 
        {
          data: { rulesetId: ruleset._id, ruleId: rule, pattern: pattern },
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

  async function handleClickDeletePattern(event) {
    const res = await fetchDeletePattern(activeRuleSet, chosenRule, chosenPattern);
    setRulesets(res.rulesets);
    setActiveRuleSet(res.ruleset);
    setChosenRule(res.rule);
    setChosenPattern(undefined);
  }

  async function fetchPostPattern(ruleset, rule, pattern) {
    try {
      const res = await axios.post(apiURL + '/pattern', 
        {
          rulesetId: ruleset._id,
          ruleId: rule._id,
          pattern: pattern
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

  async function fetchPatchPattern(ruleset, rule, pattern) {
    try {
      const res = await axios.patch(apiURL + '/pattern', 
        {
          rulesetId: ruleset._id,
          ruleId: rule._id,
          pattern: pattern
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

  async function handleClickSavePattern(event) {
    if (displayMode === "add") {
      const res = await fetchPostPattern(activeRuleSet, chosenRule, chosenPattern);
      console.log(res.data)
      setRulesets(res.data.rulesets);
      setActiveRuleSet(res.data.ruleset);
      setChosenRule(res.data.rule);
      setChosenPattern(res.data.pattern);
    }

    if (displayMode === "edit") {
      const res = await fetchPatchPattern(activeRuleSet, chosenRule, chosenPattern);
      setRulesets(res.data.rulesets);
      setActiveRuleSet(res.data.ruleset);
      setChosenRule(res.data.rule);
      setChosenPattern(res.data.pattern);
    }

    setDisplayMode("justShow");
  }

  function handleClickCancelPattern(event) {
    if (displayMode === "add") {
      setChosenPattern(undefined);
    }

    setDisplayMode("justShow");
  }

  //#endregion

  function getPatternDescription(pattern, ruleset) {
    const cellTypeToCheckName = getCellTypeName(pattern.cellTypeToCheck, ruleset);

    if (pattern.operation === "between") {
      return `This pattern needs between ${pattern.min} and ${pattern.max} (inclusive) ${cellTypeToCheckName} cells.`
    }

    if (pattern.operation === "lesser") {
      return `This pattern needs less than ${pattern.max} ${cellTypeToCheckName} cells.`
    }

    if (pattern.operation === "greater") {
      return `This pattern needs more than ${pattern.min} ${cellTypeToCheckName} cells.`
    }

    if (pattern.operation === "equal") {
      return `This pattern needs exactly ${pattern.max} ${cellTypeToCheckName} cells.`
    }
  }

  function handleSelectOperation(event) {
    chosenPattern.operation = event.target.value;
    chosenPattern.min = 0
    chosenPattern.max = undefined;
    setChosenPattern({...chosenPattern});
  }

  function handleChangeMinInput(event) {
    const inputNumber = parseInt(event.target.value);
    chosenPattern.min = inputNumber;

    if (chosenPattern.operation === "between" && !chosenPattern.max || (chosenPattern.max && chosenPattern.max <= chosenPattern.min)) {
      chosenPattern.max = inputNumber +1;
    }

    if (chosenPattern.operation === "equal") {
      chosenPattern.max = inputNumber;
    }
    
    setChosenPattern({...chosenPattern});
  }

  function handleChangeMaxInput(event) {
    const inputNumber = parseInt(event.target.value);
    chosenPattern.max = inputNumber;
    setChosenPattern({...chosenPattern});
  }

  function getMaxCellNumberInputValue(pattern) {
    if (chosenPattern.max) {
      return chosenPattern.max
    }

    if (chosenPattern.min) {
      return chosenPattern.min + 1;
    }

    return 1;
  }

  function getSetOperationElement(pattern) {
    if (pattern.operation === "between") {
      return (
        <>
        <input className="CellNumberInput" type="number" min={0} onChange={(e) => handleChangeMinInput(e)} value={chosenPattern.min}></input>
        <span> and </span>
        <input className="CellNumberInput" type="number" min={(chosenPattern.min + 1)} onChange={(e) => handleChangeMaxInput(e)} value={getMaxCellNumberInputValue(chosenPattern)}></input>
        </>
      )
    }

    if (pattern.operation === "lesser") {
      return (
        <>
        <input className="CellNumberInput" type="number" min={1} onChange={(e) => handleChangeMaxInput(e)} value={getMaxCellNumberInputValue(chosenPattern)}></input>
        </>
      )
    }

    if (pattern.operation === "greater") {
      return (
        <>
        <input className="CellNumberInput" type="number" min={0} onChange={(e) => handleChangeMinInput(e)} value={chosenPattern.min}></input>
        </>
      )
    }

    if (pattern.operation === "equal") {
      return (
        <>
        <input className="CellNumberInput" type="number" min={0} onChange={(e) => handleChangeMinInput(e)} value={chosenPattern.min}></input>
        </> 
      )
    }
  }

  function getCellTypeFromId(cellTypeId) {
    return activeRuleSet.cellTypes.find(cellType => cellType.id === cellTypeId);
  }

  function getPatternDescriptionInputElement(pattern, ruleset) {
    return (
      <div className="PatternDescriptionInputContainer Grey">
        <span>This pattern needs </span>
        <select id="OperationSelector" className="OperationSelector" onChange={(e) => handleSelectOperation(e)} value={chosenPattern.operation}>
          <option value="between">between</option>
          <option value="lesser">less than</option>
          <option value="greater">greater than</option>
          <option value="equal">exactly</option>
        </select>
        <span> </span>
        {getSetOperationElement(pattern)}
        <span> </span>
        <CellTypeDropdownMenu chosenCellType={getCellTypeFromId(chosenPattern.cellTypeToCheck)} cellTypes={ruleset.cellTypes} handleClickDropdownElemCellType={handleClickDropdownElemCellType} />
        <span> cells in the chosen area.</span>
      </div>
    )
  }

  return (
    <div className='PatternEditorContainer'>

      {displayMode !== "justShow" && chosenPattern ? (
        <input className="TextInput" type="text" value={chosenPattern.name} onChange={(e) => handleChangePatternNameInput(e)} placeholder="Pattern name"></input>
      ) : (
        <div className="PatternDropdown">
          <button className="PatternDropbtn FirstColumnWidth">{chosenPattern ? chosenPattern.name : "Choose a pattern"}</button>

          {chosenRule && chosenRule.patterns && chosenRule.patterns.length > 0 ? (
            <div className="PatternDropdownContent">
              {chosenRule.patterns.map((pattern) =>
                  <div 
                  key={pattern._id} 
                  className='PatternDropdownElement' 
                  onClick={(e) => handleClickDropdownElemPattern(e, pattern)}
                  >
                    {pattern.name}
                  </div>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      )}

      {displayMode !== "justShow" ? (
        <>
          <button className='EditorButton' onClick={(e) => handleClickSavePattern(e)}>Save</button>
          <button className='EditorButton' onClick={(e) => handleClickCancelPattern(e)}>Cancel</button>
        </>
      ) : (
        <>
        <button className='EditorButton' onClick={(e) => handleClickAddPattern(e, chosenPattern)}>Add</button>

        {chosenPattern ? (
          <>
          <button className='EditorButton' onClick={(e) => handleClickEditPattern(e, chosenPattern)}>Edit</button>
          <button className='EditorButton' onClick={(e) => handleClickDeletePattern(e, chosenPattern)}>Delete</button>
          </>
        ) : (
          <></>
        )}
        
        </>
      )}
      
      {chosenPattern ? (
        <div>
          {displayMode === "justShow" ? (
            <div className="PatternDescription Grey" >{getPatternDescription(chosenPattern, activeRuleSet)}</div>
          ) : (
            getPatternDescriptionInputElement(chosenPattern, activeRuleSet)
          )}
        </div>
      ) : (
        <></>
      )}

      {chosenRule && chosenPattern ? (
        <AreaEditorCanvas 
          activeRuleSet={activeRuleSet}
          chosenRule={chosenRule}
          chosenPattern={chosenPattern}
          setChosenPattern={setChosenPattern}
        />
      ) : (
        <></>
      )}

      
    </div>
  )
}

export default PatternEditor