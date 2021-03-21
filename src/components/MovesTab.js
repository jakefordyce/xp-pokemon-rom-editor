import React, {useState} from 'react';
import {useStoreState, useStoreActions} from 'easy-peasy';
import MoveData from './MoveData';
import MoveDescriptions from './MoveDescriptions';

function MovesTab(){

  const [dataView, setDataView] = useState(true);
  const dataLoaded = useStoreState(state => state.dataLoaded);
  const generation = useStoreState(state => state.romModelState.generation);
  const resetMovesSorting = useStoreActions(actions => actions.resetMovesSorting);
  const numHighCritMoves = useStoreState(state => state.romModelState.numHighCritMoves);
  const currentHighCritMoves = useStoreState(state => state.currentHighCritMoves);
  const maxMoveDescriptionBytes = useStoreState(state => state.romModelState.maxMoveDescriptionBytes);
  const currentMoveDescriptionBytes = useStoreState(state => state.currentMoveDescriptionBytes);


  function handleViewToggle(){
    resetMovesSorting();
    setDataView(!dataView);
  }

  return( dataLoaded &&
    <div>
      {generation !== 1 && <button onClick={handleViewToggle}>Toggle View</button>}
      {generation < 3 && <span>High Crit Moves Used: {currentHighCritMoves} / {numHighCritMoves}</span>}
      {generation === 3 &&
      <span>Move Description Bytes: {currentMoveDescriptionBytes} / {maxMoveDescriptionBytes}</span>}
      {!dataView && <MoveDescriptions />}
      {dataView && <MoveData />}
    </div>
  )
}

export default MovesTab;