import React, {useState} from 'react';
import { useStoreState, useStoreActions} from 'easy-peasy';
import PokemonStatGridRow from './PokemonStatGridRow';

function PokemonStatGrid(){

  const [pokeFilter, setPokeFilter] = useState(0);
  const filteredPokemon = useStoreState(state => state.pokemon).filter((poke) => 
    {
      if(pokeFilter === 1){ //fully evolved
        return poke.evolutions.length === 0; // return true if the pokemon has no evolutions
      }else{
        return true;
      }
    });
  const generation = useStoreState(state => state.romModelState.generation);
  const pokemonTypes = useStoreState(state => state.pokemonTypes);
  const updatePokemonSorting = useStoreActions(actions => actions.updatePokemonSorting);
  const pokemonStats = filteredPokemon.map((poke,index) => <PokemonStatGridRow key={index} stats={poke} gen={generation} types={pokemonTypes}/>);  

  function changeSorting(event, column){
    updatePokemonSorting(column);
  }

  function handleFilterChange(event){
    setPokeFilter(parseInt(event.target.value));
  }

  return(
    <div>
      <div style={{padding: 5}}>Filter: <select value={pokeFilter} onChange={(e) => handleFilterChange(e)}>
          <option value={0}>No Filter</option>
          <option value={1}>Fully Evolved</option>
        </select></div>
      <table>
        <thead>
          <tr className="sticky-header">
            <th><button className="header-button" onClick={(e) => changeSorting(e, "id")}>Pokemon</button></th>
            <th><button className="header-button" onClick={(e) => changeSorting(e, "hp")}>HP</button></th>
            <th><button className="header-button" onClick={(e) => changeSorting(e, "attack")}>Attack</button></th>
            <th><button className="header-button" onClick={(e) => changeSorting(e, "defense")}>Defense</button></th>
            <th><button className="header-button" onClick={(e) => changeSorting(e, "speed")}>Speed</button></th>
            {generation === 1 && <th><button className="header-button" onClick={(e) => changeSorting(e, "specialAttack")}>Special</button></th>}
            {generation !== 1 && <th><button className="header-button" onClick={(e) => changeSorting(e, "specialAttack")}>Sp Attack</button></th>}
            {generation !== 1 && <th><button className="header-button" onClick={(e) => changeSorting(e, "specialDefense")}>Sp Defense</button></th>}
            <th><button className="header-button" onClick={(e) => changeSorting(e, "totalStats")}>Total Stats</button></th>
            <th><button className="header-button" onClick={(e) => changeSorting(e, "type1")}>Type 1</button></th>
            <th><button className="header-button" onClick={(e) => changeSorting(e, "type2")}>Type 2</button></th>
            <th><button className="header-button" onClick={(e) => changeSorting(e, "catchRate")}>Catch Rate</button></th>
            <th><button className="header-button" onClick={(e) => changeSorting(e, "expYield")}>EXP Yield</button></th>
            <th><button className="header-button" onClick={(e) => changeSorting(e, "growthRate")}>Growth Rate</button></th>
          </tr>
        </thead>
        <tbody>
          {pokemonStats}
        </tbody>
      </table>
    </div>
  )
}

export default PokemonStatGrid;