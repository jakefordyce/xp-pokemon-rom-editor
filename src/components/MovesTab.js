import React, {memo} from 'react';
import {useStoreState} from 'easy-peasy';
import MovesGridRow from './MovesGridRow';

function MovesTab(){

  const dataLoaded = useStoreState(state => state.dataLoaded);
  const moves = useStoreState(state => state.moves);
  const generation = useStoreState(state => state.romModelState.generation);
  
  const movesList = moves.map((move, index) => 
    <MovesGridRow move={move} />
  );

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
          {movesList}
        </tbody>
      </table>
    </div>
  )
}

export default memo(MovesTab);