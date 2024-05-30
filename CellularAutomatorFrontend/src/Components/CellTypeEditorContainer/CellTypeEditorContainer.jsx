import CellEditorModal from '../CellEditorModal';
import CellTypeDropdownMenu from '../CellTypeDropdownMenu';
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
      <CellTypeDropdownMenu chosenCellType={chosenCellType} cellTypes={cellTypes} handleClickDropdownElemCellType={handleClickDropdownElemCellType} />

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