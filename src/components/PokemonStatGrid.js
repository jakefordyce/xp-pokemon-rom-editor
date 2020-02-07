import React from 'react';
import { useStoreState, useStoreActions} from 'easy-peasy';
import PokemonStatGridRow from './PokemonStatGridRow';

function PokemonStatGrid(){

  const pokemon = useStoreState(state => state.pokemon);
  const generation = useStoreState(state => state.romModelState.generation);
  const pokemonTypes = useStoreState(state => state.pokemonTypes);
  const updatePokemonSorting = useStoreActions(actions => actions.updatePokemonSorting);
  const pokemonStats = pokemon.map((poke,index) => <PokemonStatGridRow key={index} pokeIndex={index} stats={poke} gen={generation} types={pokemonTypes}/>);

  function changeSorting(event, column){
    updatePokemonSorting(column);
  }  

  return(
    <div>
      <table>
        <thead>
          <tr>
            <th><button class="header-button" onClick={(e) => changeSorting(e, "id")}>Pokemon</button></th>
            <th><button class="header-button" onClick={(e) => changeSorting(e, "hp")}>HP</button></th>
            <th><button class="header-button" onClick={(e) => changeSorting(e, "attack")}>Attack</button></th>
            <th><button class="header-button" onClick={(e) => changeSorting(e, "defense")}>Defense</button></th>
            <th><button class="header-button" onClick={(e) => changeSorting(e, "speed")}>Speed</button></th>
            {generation === 1 && <th><button class="header-button" onClick={(e) => changeSorting(e, "specialAttack")}>Special</button></th>}
            {generation === 2 && <th><button class="header-button" onClick={(e) => changeSorting(e, "specialAttack")}>Sp Attack</button></th>}
            {generation === 2 && <th><button class="header-button" onClick={(e) => changeSorting(e, "specialDefense")}>Sp Defense</button></th>}
            <th><button class="header-button" onClick={(e) => changeSorting(e, "totalStats")}>Total Stats</button></th>
            <th><button class="header-button" onClick={(e) => changeSorting(e, "type1")}>Type 1</button></th>
            <th><button class="header-button" onClick={(e) => changeSorting(e, "type2")}>Type 2</button></th>
            <th><button class="header-button" onClick={(e) => changeSorting(e, "catchRate")}>Catch Rate</button></th>
            <th><button class="header-button" onClick={(e) => changeSorting(e, "expYield")}>EXP Yield</button></th>
            <th><button class="header-button" onClick={(e) => changeSorting(e, "growthRate")}>Growth Rate</button></th>
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