import React, {memo} from 'react';
import {useStoreState, useStoreActions} from 'easy-peasy';
import ArraySelect from './ArraySelect';
import EnumSelect from './EnumSelect';


function MovesGridRow(props){

  const updateMoveProperty = useStoreActions(actions => actions.updateMoveProperty);
  const generation = useStoreState(state => state.romModelState.generation);
  const pokemonTypes = useStoreState(state => state.pokemonTypes);
  const moveAnimations = useStoreState(state => state.romModelState.moveAnimations);
  const moveEffects = useStoreState(state => state.romModelState.moveEffects);
  const sortMoves = useStoreActions(actions => actions.sortMoves);
  const numHighCritMoves = useStoreState(state => state.romModelState.numHighCritMoves);
  const currentHighCritMoves = useStoreState(state => state.currentHighCritMoves);
  const targets = useStoreState(state => state.romModelState.moveTargets);

  function handleMoveChange(event, moveIndex, propName){
    let newValue = event.target.value;
    console.log(`new value: ${newValue}`);
    updateMoveProperty({index: moveIndex, propName: propName, propValue: newValue});
  }

  function handleCritChange(event, moveIndex, propName){
    let newValue = event.target.checked;
    if(newValue === false || currentHighCritMoves < numHighCritMoves){
      updateMoveProperty({index: moveIndex, propName: propName, propValue: newValue});
    }
  }

  return(
    <tr>
      <td><input value={props.move.name} onChange={(e) => handleMoveChange(e, props.move.id, 'name')} /></td>
      <td><ArraySelect collection={moveAnimations} selectedValue={props.move.animationID} handleOptionChange={handleMoveChange} arrayIndex={props.move.id} propName={'animationID'} /></td>
      <td><ArraySelect collection={moveEffects} selectedValue={props.move.effect} handleOptionChange={handleMoveChange} arrayIndex={props.move.id} propName={'effect'} /></td>
      <td><input value={props.move.power} className="number-input" onChange={(e) => handleMoveChange(e, props.move.id, 'power')} onBlur={sortMoves}/></td>
      <td><ArraySelect collection={pokemonTypes} value='typeIndex' display='typeName' selectedValue={props.move.moveType} handleOptionChange={handleMoveChange} arrayIndex={props.move.id} propName={'moveType'} /></td>
      <td><input value={props.move.accuracy} className="number-input" onChange={(e) => handleMoveChange(e, props.move.id, 'accuracy')} onBlur={sortMoves}/></td>
      <td><input value={props.move.pp} className="number-input" onChange={(e) => handleMoveChange(e, props.move.id, 'pp')} onBlur={sortMoves}/></td>
      {generation > 1 && <td><input className="number-input" value={props.move.effectChance} onChange={(e) => handleMoveChange(e, props.move.id, 'effectChance')} onBlur={sortMoves}/></td>}
      {generation > 2 && <td><EnumSelect enum={targets} selectedValue={props.move.target} handleOptionChange={handleMoveChange} arrayIndex={props.move.id} onBlur={sortMoves}/></td>}
      {generation > 2 && <td><input className="number-input" value={props.move.priority} onChange={(e) => handleMoveChange(e, props.move.id, 'priority')} onBlur={sortMoves}/></td>}
      {generation < 3 && <td><input type="checkbox" checked={props.move.highCrit} onChange={(e) => handleCritChange(e, props.move.id, 'highCrit')}/></td>}
    </tr>
  );
}

export default memo(MovesGridRow);