import React from 'react';
import {useStoreState, useStoreActions} from 'easy-peasy';
import ArraySelect from './ArraySelect';

function TrainersTab(){
    
  const dataLoaded = useStoreState(state => state.dataLoaded);
  const trainers = useStoreState(state => state.trainers);
  const selectedTrainer = useStoreState(state => state.selectedTrainer);
  const setSelectedTrainer = useStoreActions(actions => actions.setSelectedTrainer);
  const updateTrainer = useStoreActions(actions => actions.updateTrainer);
  const updateTrainerPokemon = useStoreActions(actions => actions.updateTrainerPokemon);
  const pokemon = useStoreState(state => state.pokemon);

  const trainersList = trainers.map((trainer, index) => 
    <li key={index} className={"list-group-item" + (selectedTrainer === index ? " active" : "")} style={{maxWidth: "300px"}} onClick={()=> setSelectedTrainer(index)}>{trainer.name}</li>
  );

  const pokemonList = trainers[selectedTrainer].pokemon.map((poke, index) =>
    <tr key={index}>
      <td><input value={poke.level} onChange={(e) => handleTrainerPokemonChange(e, index, 'level')} /></td>
      <td><ArraySelect collection={pokemon} display='name' selectedValue={poke.pokemon} handleOptionChange={handleTrainerPokemonChange} arrayIndex={index} propName={'pokemon'} /></td>
    </tr>
  );
  
  function handleTrainerPokemonChange(event, pokeIndex, propName){
    let newValue = event.target.value;
    updateTrainerPokemon({index: pokeIndex, propName: propName, propValue: newValue});
  };

  function handleTrainerChange(event, trainerIndex, propName){
    let newValue = event.target.value;
    updateTrainer({index: trainerIndex, propName: propName, propValue: newValue});
  }

  return(
      dataLoaded && <div className="trainers-tab-container">
        <ul className="list-group" style={{ overflowY: "scroll"}}>{trainersList}</ul>
        <div style={{ overflowY: "scroll"}}>
          <table>
            <tbody>
              <tr><td>Party Level: </td><td><input value={trainers[selectedTrainer].partyLevel} onChange={(e) => handleTrainerChange(e, selectedTrainer, 'partyLevel')} /></td></tr>
              {pokemonList}
            </tbody>
          </table>
        </div>
      </div>
  )
  
}

export default TrainersTab;