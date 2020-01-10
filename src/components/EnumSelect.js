import React from 'react';

function EnumSelect(props){

  const selectOptions = Object.entries(props.enum).map(([itemKey, itemValue],index) => <option key={index} value={itemValue}>{itemKey}</option>);

  return (
    <select value={props.selectedValue} onChange={(e) => props.handleOptionChange(e, props.arrayIndex, props.propName)}>
      {selectOptions}
    </select>
  );

}

export default EnumSelect;