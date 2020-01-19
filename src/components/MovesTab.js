import React from 'react';
import {useStoreState} from 'easy-peasy';
import MovesGridRow from './MovesGridRow';

function MovesTab(){

  const dataLoaded = useStoreState(state => state.dataLoaded);
  const moves = useStoreState(state => state.moves);
  const generation = useStoreState(state => state.romModelState.generation);
  const pokemonTypes = useStoreState(state => state.pokemonTypes);
  const moveAnimations = useStoreState(state => state.romModelState.moveAnimations);
  const moveEffects = useStoreState(state => state.romModelState.moveEffects);
  const moveRows = moves.map((move, index) => <MovesGridRow key={index} move={move} gen={generation} types={pokemonTypes} animations={moveAnimations} effects={moveEffects}/>);
  

  return( dataLoaded &&
    <div>
      <table>
        <thead>
          <tr>
            <th>Move</th>
            <th>Animation</th>
            <th>Effect</th>
            <th>Power</th>
            <th>Type</th>
            <th>Accuracy</th>
            <th>PP</th>
            {generation === 2 && <th>Effect Chance</th>}
          </tr>
        </thead>
        <tbody>
          {moveRows}
        </tbody>
      </table>
    </div>
  )
}

export default MovesTab;