import React from 'react';
import {useStoreActions} from 'easy-peasy';

function MoveDescRow(props) {

  const updateMoveDescriptionProperty = useStoreActions(actions => actions.updateMoveDescriptionProperty);

  function handleDescChange(event, moveIndex, propName){
    let newValue = event.target.value;
    updateMoveDescriptionProperty({index: moveIndex, propName: propName, propValue: newValue});
  }

  return(
    <tr>
      <td>{props.name}</td>
      <td><input value={props.text} onChange={(e) => handleDescChange(e, props.id, 'text')} style={{width: "600px"}}/></td>
    </tr>
  )
}

export default MoveDescRow;