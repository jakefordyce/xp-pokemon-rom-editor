import React from 'react';
import {useStoreActions} from 'easy-peasy';
import ArraySelect from './ArraySelect';


function MovesGridRow(props){

  const updateMove = useStoreActions(actions => actions.updateMoveProperty);
  
  function handleMoveChange(event, moveIndex, propName){
    //console.log(props);
    //console.log(pokemonIndex);
    let newValue = event.target.value;
    if(newValue > 0 && newValue <= 255){
      updateMove({index: moveIndex, propName: propName, propValue: newValue});
    }
  }
  
  return(
    <tr>
      <td>{props.move.name}</td>
      <td><ArraySelect collection={props.animations} selectedValue={props.move.animationID} handleOptionChange={handleMoveChange} arrayIndex={props.move.id} propName={'animationID'} /></td>      
      <td><ArraySelect collection={props.effects} selectedValue={props.move.effect} handleOptionChange={handleMoveChange} arrayIndex={props.move.id} propName={'effect'} /></td>
      <td><input value={props.move.power} onChange={(e) => handleMoveChange(e, props.pokeIndex, 'power')} /></td>
      <td><ArraySelect collection={props.types} value='typeIndex' display='typeName' selectedValue={props.move.moveType} handleOptionChange={handleMoveChange} arrayIndex={props.move.id} propName={'moveType'} /></td>
      <td><input value={props.move.accuracy} onChange={(e) => handleMoveChange(e, props.pokeIndex, 'accuracy')} /></td>
      <td><input value={props.move.pp} onChange={(e) => handleMoveChange(e, props.pokeIndex, 'pp')} /></td>
      {props.gen === 2 && <td><input value={props.move.effectChance} onChange={(e) => handleMoveChange(e, props.pokeIndex, 'effectChance')} /></td>}
    </tr>
  );
}

export default MovesGridRow;