import React, {useState} from 'react';
import PokemonStatGrid from './PokemonStatGrid';
import PokemonFullData from './PokemonFullData';
import {useStoreState} from 'easy-peasy';

function PokemonTab(){

  const [fullView, setFullView] = useState(false);
  const dataLoaded = useStoreState(state => state.dataLoaded);

  return( dataLoaded &&
    <div>
      <button onClick={() => setFullView(!fullView)}>Toggle View</button>
      {!fullView && <PokemonStatGrid />}
      {fullView && <PokemonFullData />}
    </div>
  )
}

export default PokemonTab;