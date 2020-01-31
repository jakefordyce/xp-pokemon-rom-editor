import React from 'react';
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
      <td><input value={props.stats.hp} onChange={(e) => handleStatChange(e, props.pokeIndex, 'hp')} /></td>
      <td><input value={props.stats.attack} onChange={(e) => handleStatChange(e, props.pokeIndex, 'attack')} /></td>
      <td><input value={props.stats.defense} onChange={(e) => handleStatChange(e, props.pokeIndex, 'defense')} /></td>
      <td><input value={props.stats.speed} onChange={(e) => handleStatChange(e, props.pokeIndex, 'speed')} /></td>
      <td><input value={props.stats.specialAttack} onChange={(e) => handleStatChange(e, props.pokeIndex, 'specialAttack')} /></td>
      {props.gen === 2 && <td><input value={props.stats.specialDefense} onChange={(e) => handleStatChange(e, props.pokeIndex, 'specialDefense')} /></td>}
      <td><ArraySelect collection={props.types} value='typeIndex' display='typeName' selectedValue={props.stats.type1} handleOptionChange={handleStatChange} arrayIndex={props.pokeIndex} propName={'type1'} /></td>
      <td><ArraySelect collection={props.types} value='typeIndex' display='typeName' selectedValue={props.stats.type2} handleOptionChange={handleStatChange} arrayIndex={props.pokeIndex} propName={'type2'} /></td>
      <td><input value={props.stats.catchRate} onChange={(e) => handleStatChange(e, props.pokeIndex, 'catchRate')} /></td>
      <td><input value={props.stats.expYield} onChange={(e) => handleStatChange(e, props.pokeIndex, 'expYield')} /></td>
      <td><EnumSelect enum={growthRates} selectedValue={props.stats.growthRate} handleOptionChange={handleStatChange} arrayIndex={props.pokeIndex} propName={'growthRate'}/></td>
    </tr>
  );
}

export default PokemonStatGridRow;