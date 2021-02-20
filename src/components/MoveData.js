import React from 'react';
import {useStoreState, useStoreActions} from 'easy-peasy';
import MovesGridRow from './MovesGridRow';


function MoveData(){

  const dataLoaded = useStoreState(state => state.dataLoaded);
  const moves = useStoreState(state => state.moves);
  const generation = useStoreState(state => state.romModelState.generation);
  const updateMovesSorting = useStoreActions(actions => actions.updateMovesSorting);

  const movesList = moves.map((move, index) =>
    <MovesGridRow key={index} move={move} />
  );

  function changeSorting(event, column){
    updateMovesSorting(column);
  }

  return( dataLoaded &&
    <div>
      <table>
        <thead>
          <tr className="sticky-header">
            <th><button className="header-button" onClick={(e) => changeSorting(e, "id")}>Move</button></th>
            <th><button className="header-button" onClick={(e) => changeSorting(e, "animationID")}>Animation</button></th>
            <th><button className="header-button" onClick={(e) => changeSorting(e, "effect")}>Effect</button></th>
            <th><button className="header-button" onClick={(e) => changeSorting(e, "power")}>Power</button></th>
            <th><button className="header-button" onClick={(e) => changeSorting(e, "moveType")}>Type</button></th>
            <th><button className="header-button" onClick={(e) => changeSorting(e, "accuracy")}>Accuracy</button></th>
            <th><button className="header-button" onClick={(e) => changeSorting(e, "pp")}>PP</button></th>
            {generation !== 1 && <th><button className="header-button" onClick={(e) => changeSorting(e, "effectChance")}>Effect Chance</button></th>}
            <th>High Crit Chance</th>
          </tr>
        </thead>
        <tbody>
          {movesList}
        </tbody>
      </table>
    </div>
  )
}

export default MoveData;