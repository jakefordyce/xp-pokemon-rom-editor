import React, {useState} from 'react';
import PokemonStatGrid from './PokemonStatGrid';
import PokemonFullData from './PokemonFullData';

function PokemonTab(){

  const [fullView, setFullView] = useState(false);

  return(
    <div>
      <button onClick={() => setFullView(!fullView)}>Toggle View</button>
      {!fullView && <PokemonStatGrid />}
      {fullView && <PokemonFullData />}
    </div>
  )
}

export default PokemonTab;