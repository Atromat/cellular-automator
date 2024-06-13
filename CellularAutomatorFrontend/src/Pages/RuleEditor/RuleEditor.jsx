import { useEffect, useState } from 'react';
import CellularAutomatonSimCanvas from '../../Components';
import './RuleEditor.css';
import CellTypeEditorContainer from '../../Components/CellTypeEditorContainer/CellTypeEditorContainer';
import RuleCreator from '../../Components/RuleCreator';
import axios from 'axios';

function RuleEditor({apiURL}) {
  const [isSimulationStopped, setIsSimulationStopped] = useState(true);
  const [activeRuleSet, setActiveRuleSet] = useState(undefined);
  const [chosenRule, setChosenRule] = useState(undefined);
  const [chosenCellType, setChosenCellType] = useState(undefined);
  const [resetClicked, setResetClicked] = useState(0);
  const [timeBetweenCalculatingMapTurns, setTimeBetweenCalculatingMapTurns] = useState(400);
  const [rowCount, setRowCount] = useState(80);
  const [columnCount, setColumnCount] = useState(120);
  const [chosenPattern, setChosenPattern] = useState(undefined);
  const [displayMode, setDisplayMode] = useState("justShow")
  const [rulesets, setRulesets] = useState(undefined);

  async function fetchRulesets() {
    try {
      const res = await axios.get(apiURL + '/allrulesets', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`
          }
        }
      );
      return res;
    } catch (err) {
      console.error(err);
    }
  }
  
  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      fetchRulesets()
        .then(res => setRulesets(res.data));
    }
  }, [])

  function stopOrStartSimulation(event) {
    setIsSimulationStopped(!isSimulationStopped);
  }

  function handleResetClick(event) {
    setResetClicked(resetClicked + 1);
  }

  function handleClickDropdownElemRuleset(event, ruleset) {
    event.preventDefault();
    setActiveRuleSet(ruleset);
    setChosenRule(undefined);
    setChosenCellType(undefined);
    setChosenPattern(undefined)
  }

  function handleClickDropdownElemRule(event, rule) {
    event.preventDefault();
    setChosenRule(rule);
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

  //#region Cell type Add, Edit, Delete, Save, Cancel

  async function fetchPostCellType(ruleset, cellType) {
    try {
      const res = await axios.post(apiURL + '/cellType', 
        {
          rulesetId: ruleset._id,
          cellType: cellType
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

  async function addCellType(cellType) {
    const newCellType = {
      cellType: cellType.cellType,
      cellColor: cellType.cellColor
    }

    const res = await fetchPostCellType(activeRuleSet, newCellType);
    setRulesets(res.data.rulesets);
    setActiveRuleSet(res.data.ruleset);
    setChosenCellType(res.data.cellType);
  }

  async function fetchPatchCellType(ruleset, cellType) {
    try {
      const res = await axios.patch(apiURL + '/cellType', 
        {
          rulesetId: ruleset._id,
          cellType: cellType
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

  async function editCellType(cellType) {
    const cellTypeToEdit = activeRuleSet.cellTypes.find(cellT => cellT.id === cellType.id);
    cellTypeToEdit.cellColor = cellType.cellColor;
    cellTypeToEdit.cellType = cellType.cellType;

    const res = await fetchPatchCellType(activeRuleSet, cellTypeToEdit);
    setRulesets(res.data.rulesets);
    setActiveRuleSet(res.data.ruleset);
    setChosenCellType(res.data.cellType);
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

  //#endregion

  function deleteChosenRule() {
    const ruleToDelIndex = activeRuleSet.rules.findIndex(r => r.id === chosenRule.id);
    activeRuleSet.rules.splice(ruleToDelIndex, 1);
    setChosenRule(undefined);
    setActiveRuleSet({...activeRuleSet});
  }

  function resetChosen() {
    setActiveRuleSet(undefined);
    setChosenRule(undefined);
    setChosenPattern(undefined);
    setChosenCellType(undefined);
  }

  //#region Ruleset Add, Edit, Delete, Save, Cancel
  function handleClickAddRuleset() {
    setChosenRule(undefined);
    setChosenPattern(undefined);
    setActiveRuleSet({
      ruleSetName: "",
      cellTypes: [
        {
          id: 0,
          cellType: 'empty',
          cellColor: '#000000'
        }
      ],
      rules: []
    });
    setDisplayMode("add");
  }

  function handleClickEditRuleset() {
    const rulesetToEdit = structuredClone(activeRuleSet);
    setActiveRuleSet(rulesetToEdit);
    setDisplayMode("edit");
  }

  async function fetchDeleteRuleset(ruleset) {
    console.log(ruleset._id)
    console.log(localStorage.getItem("userToken"))
    try {
      const res = await axios.delete(apiURL + '/ruleset', 
        {
          rulesetId: ruleset._id
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

  async function handleClickDeleteRuleset() {
    resetChosen();
    await fetchDeleteRuleset(activeRuleSet);
    setDisplayMode("justShow");
  }

  async function fetchPostRuleset(ruleset) {
    try {
      const res = await axios.post(apiURL + '/ruleset', 
        {
          ruleset: ruleset
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

  async function fetchPatchRuleset(ruleset) {
    try {
      const res = await axios.patch(apiURL + '/ruleset', 
        {
          ruleset: ruleset
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

  async function handleClickSaveRuleset() {
    if (displayMode === "add") {
      const res = await fetchPostRuleset(activeRuleSet);
      setRulesets(res.data.rulesets);
      setActiveRuleSet(res.data.ruleset);
    }

    if (displayMode === "edit") {
      const res = await fetchPatchRuleset(activeRuleSet);
      setRulesets(res.data);
    }
    
    setDisplayMode("justShow");
  }

  function handleClickCancelRuleset() {
    resetChosen();
    setDisplayMode("justShow");
  }
  //#endregion

  function handleChangeRulesetNameInput(event) {
    activeRuleSet.ruleSetName = event.target.value;
    setActiveRuleSet({...activeRuleSet});
  }

  function isRulesetValid(ruleset) {
    if (!ruleset) {
      return false;
    }

    if (!ruleset.cellTypes) {
      return false;
    }

    if (!ruleset.rules) {
      return false;
    }

    if (ruleset.rules.length < 1) {
      return false;
    }

    for (const rule of ruleset.rules) {
      if (!rule.patterns) {
        return false;
      }

      if (rule.patterns.length < 1) {
        return false;
      }

      for (const pattern of rule.patterns) {
        if (!pattern.coordsRelativeToCell) {
          return false;
        }

        if (pattern.coordsRelativeToCell.length < 1) {
          return false;
        }
      }
    }

    return true;
  }

  return (
    <div id='RuleEditor'>
      <details id='RulesetDetails' className='RuleEditorDetails'>
        <summary>
          {displayMode !== "justShow" ? (
            <input className="TextInput" type="text" value={activeRuleSet.ruleSetName} onChange={(e) => handleChangeRulesetNameInput(e)} placeholder="Ruleset name"></input>
          ) : (
            <div className="dropdown">
              <button className="dropbtn FirstColumnWidth">{activeRuleSet ? activeRuleSet.ruleSetName : "Choose a ruleset"}</button>
              {rulesets && rulesets.length > 0 ? (
                <div className="dropdown-content">
                  {rulesets.map(ruleset => 
                    <div key={ruleset._id} className='DropdownElement' onClick={(e) => handleClickDropdownElemRuleset(e, ruleset)}>{ruleset.ruleSetName}</div>
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>
          )}

          {displayMode !== "justShow" ? (
            <>
              <button className='EditorButton' onClick={(e) => handleClickSaveRuleset(e)}>Save</button>
              <button className='EditorButton' onClick={(e) => handleClickCancelRuleset(e)}>Cancel</button>
            </>
          ) : (
            <>
            <button className='EditorButton' onClick={(e) => handleClickAddRuleset(e)}>Add</button>

            {activeRuleSet ? (
              <>
              <button className='EditorButton' onClick={(e) => handleClickEditRuleset(e)}>Edit</button>
              <button className='EditorButton' onClick={(e) => handleClickDeleteRuleset(e)}>Delete</button>
              </>
            ) : (
              <></>
            )}
            
            </>
          )}

        </summary>

        {activeRuleSet && displayMode === "justShow" ? (
          <>
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
            setRulesets={setRulesets}
            apiURL={apiURL}
          />
          </>
        ) : (
          <></>
        )}

      </details>

      {isRulesetValid(activeRuleSet) ? (
      <>
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
        chosenCellType={chosenCellType}
      />
      </>
      ) : (
        <h1>TODO describe what a valid ruleset is</h1>
      )}

    </div>
  )
}

export default RuleEditor