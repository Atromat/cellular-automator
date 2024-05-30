import CellEditorModal from '../CellEditorModal';
import './CellTypeEditorContainer.css';
import { useState } from 'react';

function CellTypeEditorContainer({ chosenCellType, cellTypes, handleClickDropdownElemCellType, addCellType, editCellType, handleClickDeleteCellType }) {
  const [modalOpenFor, setModalOpenFor] = useState("notOpen");

  function handleClickAdd(event) {
    setModalOpenFor("adding");
  }

  function handleClickEdit(event) {
    setModalOpenFor("editing");
  }

  function handleClickCloseModal(event) {
    setModalOpenFor("notOpen");
  }

  function handleSave(event, cellType) {
    event.preventDefault();
    console.log("handleSave")
    console.log(cellType);
    switch (modalOpenFor) {
      case "adding":
        addCellType(cellType);
        break;
      case "editing":
        editCellType(cellType);
        break;
    }
  }

  function canCellTypeBeEdited(cellType) {
    return cellType !== undefined && cellType.id !== 0;
  }

  return (
    <div className='CellTypeEditorContainer'>
      <div className="CellTypeDropdown">
        {chosenCellType ? (
          <button className="CellTypeDropbtn" style={{backgroundColor: chosenCellType.cellColor}}>{chosenCellType.cellType}</button>
        ) : (
          <button className="CellTypeDropbtn" style={{backgroundColor: '#04AA6D'}}>Choose a cell type</button>
        )}
        
        <div className="CellTypeDropdownContent">
          {cellTypes.map((cellType) =>
              <div 
              key={cellType.id} 
              className='CellTypeDropdownElement' 
              onClick={(e) => handleClickDropdownElemCellType(e, cellType)}
              style={{borderColor: cellType.cellColor}}
            >{cellType.cellType}</div>
          )}
        </div>
      </div>

      <button className='EditorButton' onClick={(e) => handleClickAdd(e)}>Add</button>
      <button className='EditorButton' onClick={(e) => handleClickEdit(e)}>Edit</button>
      <button className='EditorButton' onClick={(e) => handleClickDeleteCellType(e)} disabled={!canCellTypeBeEdited(chosenCellType)}>Delete</button>

      {modalOpenFor != "notOpen" ? (
        <CellEditorModal modalOpenFor={modalOpenFor} handleClickCloseModal={handleClickCloseModal} chosenCellType={chosenCellType} handleSave={handleSave}/>
      ) : (
        <></>
      )}
      
    </div>
  )
}

export default CellTypeEditorContainer