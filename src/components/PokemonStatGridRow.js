import React, {memo} from 'react';
import {useStoreActions, useStoreState} from 'easy-peasy';
import ArraySelect from './ArraySelect';
import EnumSelect from './EnumSelect';

function PokemonStatGridRow(props){

  const updateStat = useStoreActions(actions => actions.updatePokemonProperty)
  const growthRates = useStoreState(state => state.romModelState.growthRates);

  function handleStatChange(event, pokemonIndex, propName){
    //console.log(props);
    //console.log(pokemonIndex);
    let newValue = event.target.value;
    if(newValue >= 0 && newValue <= 255){
      updateStat({index: pokemonIndex, propName: propName, propValue: newValue});
    }
  }  

  return(
    <tr>
      <td>{props.stats.name}</td>
      <td><input value={props.stats.hp} className="number-input" onChange={(e) => handleStatChange(e, props.pokeIndex, 'hp')} /></td>
      <td><input value={props.stats.attack} className="number-input" onChange={(e) => handleStatChange(e, props.pokeIndex, 'attack')} /></td>
      <td><input value={props.stats.defense} className="number-input" onChange={(e) => handleStatChange(e, props.pokeIndex, 'defense')} /></td>
      <td><input value={props.stats.speed} className="number-input" onChange={(e) => handleStatChange(e, props.pokeIndex, 'speed')} /></td>
      <td><input value={props.stats.specialAttack} className="number-input" onChange={(e) => handleStatChange(e, props.pokeIndex, 'specialAttack')} /></td>
      {props.gen === 2 && <td><input value={props.stats.specialDefense} className="number-input" onChange={(e) => handleStatChange(e, props.pokeIndex, 'specialDefense')} /></td>}
      <td><ArraySelect collection={props.types} value='typeIndex' display='typeName' selectedValue={props.stats.type1} handleOptionChange={handleStatChange} arrayIndex={props.pokeIndex} propName={'type1'} /></td>
      <td><ArraySelect collection={props.types} value='typeIndex' display='typeName' selectedValue={props.stats.type2} handleOptionChange={handleStatChange} arrayIndex={props.pokeIndex} propName={'type2'} /></td>
      <td><input value={props.stats.catchRate} className="number-input" onChange={(e) => handleStatChange(e, props.pokeIndex, 'catchRate')} /></td>
      <td><input value={props.stats.expYield} className="number-input" onChange={(e) => handleStatChange(e, props.pokeIndex, 'expYield')} /></td>
      <td><EnumSelect enum={growthRates} selectedValue={props.stats.growthRate} handleOptionChange={handleStatChange} arrayIndex={props.pokeIndex} propName={'growthRate'}/></td>
    </tr>
  );
}

export default memo(PokemonStatGridRow);