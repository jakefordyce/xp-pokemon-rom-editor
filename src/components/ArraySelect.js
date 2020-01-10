import React from 'react';

function ArraySelect(props){  

  const selectOptions = props.collection.map((item,index) => 
    <option key={index} value={props.value === undefined ? index : item[props.value]}>{props.display === undefined ? item : item[props.display]}</option>
  );

  return (
    <select value={props.selectedValue} onChange={(e) => props.handleOptionChange(e, props.arrayIndex, props.propName)}>
      {selectOptions}
    </select>
  );

}

export default ArraySelect;