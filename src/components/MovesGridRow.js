import React, {memo} from 'react';
import {useStoreState, useStoreActions} from 'easy-peasy';
import ArraySelect from './ArraySelect';


function MovesGridRow(props){

  const updateMoveProperty = useStoreActions(actions => actions.updateMoveProperty);
  const generation = useStoreState(state => state.romModelState.generation);
  const pokemonTypes = useStoreState(state => state.pokemonTypes);
  const moveAnimations = useStoreState(state => state.romModelState.moveAnimations);
  const moveEffects = useStoreState(state => state.romModelState.moveEffects);

  function handleMoveChange(event, moveIndex, propName){
    let newValue = event.target.value;
    updateMoveProperty({index: moveIndex, propName: propName, propValue: newValue});
  }
  
  return(
    <tr>
      <td><input value={props.move.name} onChange={(e) => handleMoveChange(e, props.move.id, 'name')} /></td>
      <td><ArraySelect collection={moveAnimations} selectedValue={props.move.animationID} handleOptionChange={handleMoveChange} arrayIndex={props.move.id} propName={'animationID'} /></td>      
      <td><ArraySelect collection={moveEffects} selectedValue={props.move.effect} handleOptionChange={handleMoveChange} arrayIndex={props.move.id} propName={'effect'} /></td>
      <td><input value={props.move.power} className="number-input" onChange={(e) => handleMoveChange(e, props.move.id, 'power')} /></td>
      <td><ArraySelect collection={pokemonTypes} value='typeIndex' display='typeName' selectedValue={props.move.moveType} handleOptionChange={handleMoveChange} arrayIndex={props.move.id} propName={'moveType'} /></td>
      <td><input value={props.move.accuracy} className="number-input" onChange={(e) => handleMoveChange(e, props.move.id, 'accuracy')} /></td>
      <td><input value={props.move.pp} className="number-input" onChange={(e) => handleMoveChange(e, props.move.id, 'pp')} /></td>
      {generation === 2 && <td><input value={props.move.effectChance} onChange={(e) => handleMoveChange(e, props.move.id, 'effectChance')} /></td>}
    </tr>
  );
}

export default memo(MovesGridRow);