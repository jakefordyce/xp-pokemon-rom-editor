import React, {useState} from 'react';
import {useStoreState, useStoreActions} from 'easy-peasy';
import MoveData from './MoveData';
import MoveDescriptions from './MoveDescriptions';

function MovesTab(){

  const [dataView, setDataView] = useState(true);
  const dataLoaded = useStoreState(state => state.dataLoaded);
  const generation = useStoreState(state => state.romModelState.generation);
  const resetMovesSorting = useStoreActions(actions => actions.resetMovesSorting);


  function handleViewToggle(){
    resetMovesSorting();
    setDataView(!dataView);
  }

  return( dataLoaded &&
    <div>
      {generation !== 1 && <button onClick={handleViewToggle}>Toggle View</button>}
      {!dataView && <MoveDescriptions />}
      {dataView && <MoveData />}
    </div>
  )
}

export default MovesTab;