import React, {useState} from 'react';
import PokemonStatGrid from './PokemonStatGrid';
import PokemonFullData from './PokemonFullData';
import {useStoreState, useStoreActions} from 'easy-peasy';

function PokemonTab(){

  const [fullView, setFullView] = useState(false);
  const dataLoaded = useStoreState(state => state.dataLoaded);
  const resetPokemonSorting = useStoreActions(actions => actions.resetPokemonSorting);
  const resetMovesSorting = useStoreActions(actions => actions.resetMovesSorting);

  function handleViewToggle(){
    resetPokemonSorting();
    resetMovesSorting();
    setFullView(!fullView);
  }

  return( dataLoaded &&
    <div>
      <button onClick={handleViewToggle}>Toggle View</button>
      {!fullView && <PokemonStatGrid />}
      {fullView && <PokemonFullData />}
    </div>
  )
}

export default PokemonTab;