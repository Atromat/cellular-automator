import { useState } from 'react';
import './CellEditorModal.css';

function CellEditorModal({modalOpenFor, handleClickCloseModal, chosenCellType, handleSave}) {
  const [cellTypeName, setCellTypeName] = useState(modalOpenFor === "adding" ? "" : modalOpenFor === "editing" ? chosenCellType.cellType : "");
  const [cellColor, setCellColor] = useState(modalOpenFor === "editing" ? chosenCellType.cellColor : "#123456");

  function getNewCellType() {
    const newCellType = {
      id: chosenCellType ? chosenCellType.id : undefined, 
      cellType: cellTypeName, 
      cellColor: cellColor
    }

    console.log(newCellType);
    return newCellType;
  }

  function handleChangeCellTypeNameInput(event) {
    setCellTypeName(event.target.value);
  }

  function handleChangeCellColorInput(event) {
    setCellColor(event.target.value);
  }
 
  return (
    <div className='Modal' 
      onSubmit={(e) => {
        handleSave(e, getNewCellType()),
        handleClickCloseModal(e)
      }} 
      style={{display: 'block'}}>
      <div className='ModalContent'>
      <span className="close" onClick={(e) => handleClickCloseModal(e)}>&times;</span>
        <form className='CellEditorForm'>
          <div>
            <label htmlFor="CellTypeNameInput">Cell type name:</label>
            <input type='text' id='CellTypeNameInput' value={cellTypeName} onChange={(e) => handleChangeCellTypeNameInput(e)} />
          </div>
          <div>
            <label htmlFor="CellTypeColorInput">Cell type color:</label>
            <input type='color' value={cellColor} id='CellTypeColorInput' onChange={(e) => handleChangeCellColorInput(e)} />
          </div>
          <button type='submit'>Save</button>
        </form>
      </div>
    </div>
  )
}

export default CellEditorModal