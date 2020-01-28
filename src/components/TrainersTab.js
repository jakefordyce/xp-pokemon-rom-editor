import React from 'react';
import {useStoreState, useStoreActions} from 'easy-peasy';
import ArraySelect from './ArraySelect';

function TrainersTab(){
    
  const dataLoaded = useStoreState(state => state.dataLoaded);
  const generation = useStoreState(state => state.romModelState.generation);
  const trainers = useStoreState(state => state.trainers);
  const selectedTrainer = useStoreState(state => state.selectedTrainer);
  const setSelectedTrainer = useStoreActions(actions => actions.setSelectedTrainer);
  const updateTrainer = useStoreActions(actions => actions.updateTrainerProperty);
  const updateTrainerPokemon = useStoreActions(actions => actions.updateTrainerPokemonProperty);
  const pokemon = useStoreState(state => state.pokemon);
  const trainerTypes = useStoreState(state => state.romModelState.trainerTypes);
  const items = useStoreState(state => state.items);
  const moves = useStoreState(state => state.moves);

  const trainersList = trainers.map((trainer, index) => 
    <li key={index} className={"list-group-item" + (selectedTrainer === index ? " active" : "")} style={{maxWidth: "300px"}} onClick={()=> setSelectedTrainer(index)}>{trainer.name}</li>
  );

  const pokemonList = trainers[selectedTrainer].pokemon.map((poke, index) =>
    <tr key={index}>
      <td><ArraySelect collection={pokemon} display='name' selectedValue={poke.pokemon} handleOptionChange={handleTrainerPokemonChange} arrayIndex={index} propName={'pokemon'} /></td>
      {((generation === 1 && !trainers[selectedTrainer].allSameLevel) || generation === 2 )&&
        <td><input value={poke.level} onChange={(e) => handleTrainerPokemonChange(e, index, 'level')} /></td>
      }
      {generation === 2 && (trainers[selectedTrainer].type === 2 || trainers[selectedTrainer].type === 3) &&
        <td><ArraySelect collection={items} display='name' selectedValue={poke.item} handleOptionChange={handleTrainerPokemonChange} arrayIndex={index} propName={'item'} /></td>
      }
      {generation === 2 && (trainers[selectedTrainer].type === 1 || trainers[selectedTrainer].type === 3) &&
        <td><ArraySelect collection={moves} value='id' display='name' selectedValue={poke.move1} handleOptionChange={handleTrainerPokemonChange} arrayIndex={index} propName={'move1'} /></td>
      }
      {generation === 2 && (trainers[selectedTrainer].type === 1 || trainers[selectedTrainer].type === 3) &&
        <td><ArraySelect collection={moves} value='id' display='name' selectedValue={poke.move2} handleOptionChange={handleTrainerPokemonChange} arrayIndex={index} propName={'move2'} /></td>
      }
      {generation === 2 && (trainers[selectedTrainer].type === 1 || trainers[selectedTrainer].type === 3) &&
        <td><ArraySelect collection={moves} value='id' display='name' selectedValue={poke.move3} handleOptionChange={handleTrainerPokemonChange} arrayIndex={index} propName={'move3'} /></td>
      }
      {generation === 2 && (trainers[selectedTrainer].type === 1 || trainers[selectedTrainer].type === 3) &&
        <td><ArraySelect collection={moves} value='id' display='name' selectedValue={poke.move4} handleOptionChange={handleTrainerPokemonChange} arrayIndex={index} propName={'move4'} /></td>
      }
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

  function handleTrainerCheckbox(event, trainerIndex, propName){
    let newValue = event.target.checked;
    updateTrainer({index: trainerIndex, propName: propName, propValue: newValue});
  }

  return(
      dataLoaded && <div className="trainers-tab-container">
        <ul className="list-group" style={{ overflowY: "scroll"}}>{trainersList}</ul>
        <div style={{ overflowY: "scroll"}}>
          <table>
            <tbody>
              {generation === 1 && <tr><td>All Same Level: </td><td><input type="checkbox" checked={trainers[selectedTrainer].allSameLevel} onChange={(e) => handleTrainerCheckbox(e, selectedTrainer, 'allSameLevel')} /></td></tr>}
              {generation === 1 && trainers[selectedTrainer].allSameLevel && <tr><td>Party Level: </td><td><input value={trainers[selectedTrainer].partyLevel} onChange={(e) => handleTrainerChange(e, selectedTrainer, 'partyLevel')} /></td></tr>}
              {generation === 2 && <tr><td>Trainer Type: </td><td><ArraySelect collection={trainerTypes} selectedValue={trainers[selectedTrainer].type} handleOptionChange={handleTrainerChange} arrayIndex={selectedTrainer} propName={'type'} /></td></tr>}
              {pokemonList}
            </tbody>
          </table>
        </div>
      </div>
  )
  
}

export default TrainersTab;