import React from 'react';
import {useStoreState, useStoreActions} from 'easy-peasy';

function RandomizeTab(){

  const dataLoaded = useStoreState(state => state.dataLoaded);
  const randomizeWildPokemon = useStoreActions(actions => actions.randomizeWildPokemon);
 
  function handleRandomize(event){
    randomizeWildPokemon();
  }

  return(
      dataLoaded && <div className="randomize-tab-container">
        <button onClick={handleRandomize}>Randomize Wild Pokemon</button>
      </div>
  )

}

export default RandomizeTab;