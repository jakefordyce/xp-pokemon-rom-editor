import React from 'react';
import { useStoreState} from 'easy-peasy';
import PokemonStatGridRow from './PokemonStatGridRow';

function PokemonStatGrid(){

  const pokemon = useStoreState(state => state.pokemon);
  const generation = useStoreState(state => state.romModelState.generation);
  const pokemonTypes = useStoreState(state => state.pokemonTypes);
  const pokemonStats = pokemon.map((poke,index) => <PokemonStatGridRow key={index} pokeIndex={index} stats={poke} gen={generation} types={pokemonTypes}/>);
  

  return(
    <div>
      <table>
        <thead>
          <tr>
            <th>Pokemon</th>
            <th>HP</th>
            <th>Attack</th>
            <th>Defense</th>
            <th>Speed</th>
            {generation === 1 && <th>Special</th>}{generation === 2 && <th>Sp Attack</th>}{generation === 2 && <th>Sp Defense</th>}
            <th>Type 1</th>
            <th>Type 2</th>
            <th>Catch Rate</th>
            <th>EXP Yield</th>
            <th>Growth Rate</th>
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