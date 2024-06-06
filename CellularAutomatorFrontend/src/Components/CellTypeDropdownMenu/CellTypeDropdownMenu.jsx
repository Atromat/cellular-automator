function CellTypeDropdownMenu({chosenCellType, cellTypes, handleClickDropdownElemCellType}) {
  return (
    <div className="CellTypeDropdown">
      {chosenCellType ? (
        <button className="CellTypeDropbtn" style={{backgroundColor: chosenCellType.cellColor}}>{chosenCellType.cellType}</button>
      ) : (
        <button className="CellTypeDropbtn" style={{backgroundColor: '#04AA6D'}}>Choose a cell type</button>
      )}
      
      <div className="CellTypeDropdownContent">
        {cellTypes.map((cellType) =>
            <div 
            key={cellType.id + cellType.cellType} 
            className='CellTypeDropdownElement' 
            onClick={(e) => handleClickDropdownElemCellType(e, cellType)}
            style={{borderColor: cellType.cellColor}}
          >{cellType.cellType}</div>
        )}
      </div>
    </div>
  )
}

export default CellTypeDropdownMenu