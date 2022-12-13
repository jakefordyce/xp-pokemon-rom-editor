import React from 'react';
import {useStoreState, useStoreActions} from 'easy-peasy';

function RandomizeTab(){

  const dataLoaded = useStoreState(state => state.dataLoaded);
  const encountersPerZone = useStoreState(state => state.encountersPerZone);
  const randomizeWildPokemon = useStoreActions(actions => actions.randomizeWildPokemon);
  const updateEncountersPerZone = useStoreActions(actions => actions.updateEncountersPerZone);
 
  function handleRandomize(event){
    randomizeWildPokemon();
  }

  function handleEncountersPerZoneChange(event){
    let newValue = event.target.value;

    if (newValue > 0 && newValue < 13){
      updateEncountersPerZone(newValue);
    }
  }

  return(
      dataLoaded && <div className="randomize-tab-container">
        <button onClick={handleRandomize}>Randomize Wild Pokemon</button>
        <div>Encounters Per Zone: <input value={encountersPerZone} onChange={(e) => handleEncountersPerZoneChange(e)} /></div>
      </div>
  )

}

export default RandomizeTab;