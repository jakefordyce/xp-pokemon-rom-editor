import React from 'react';
import { useStoreState, useStoreActions} from 'easy-peasy';
import ArraySelect from './ArraySelect';
import EnumSelect from './EnumSelect';

function PokemonFullData(){
    
  const selectedPokemon = useStoreState(state => state.selectedPokemon);
  const setSelectedPokemon = useStoreActions(actions => actions.setSelectedPokemon);
  const pokemon = useStoreState(state => state.pokemon);
  const gen = useStoreState(state => state.romModelState.generation);
  const updateStat = useStoreActions(actions => actions.updatePokemonProperty);
  const updateMove = useStoreActions(actions => actions.updatePokemonMoveProperty);
  const updateEvolution = useStoreActions(actions => actions.updatePokemonEvolutionProperty);
  const addEvolution = useStoreActions(actions => actions.addPokemonEvolution);
  const removeEvolution = useStoreActions(actions => actions.removePokemonEvolution);
  const moves = useStoreState(state => state.moves);
  const tms = useStoreState(state => state.tms);
  const pokemonTypes = useStoreState(state => state.pokemonTypes);
  const evolveTypes = useStoreState(state => state.romModelState.evolveTypes);
  const evolveStones = useStoreState(state => state.romModelState.evolveStones);
  const evolveHappiness = useStoreState(state => state.romModelState.evolveHappiness);
  const evolveStats = useStoreState(state => state.romModelState.evolveStats);

  const pokemonList = pokemon.map((pokemon, index) => 
    <li key={index} className={"list-group-item" + (selectedPokemon === index ? " active" : "")} style={{maxWidth: "150px"}} onClick={()=> setSelectedPokemon(index)}>{pokemon.name}</li>
  );
  
  const levelupMoves = pokemon[selectedPokemon].learnedMoves.map((move, index)=> 
    <li key={index} className={"list-group-item"}>
      <input value={move.level} onChange={(e) => handleLevelUpMoveChange(e, index, 'level')}/>
      <ArraySelect collection={moves} value='id' display='name' selectedValue={move.moveID} handleOptionChange={handleLevelUpMoveChange} arrayIndex={index} propName={'moveID'} />
    </li>
  );

  const evolutions = pokemon[selectedPokemon].evolutions.map((evol, index) =>   
    <li key={index} className={"list-group-item"}>
      <EnumSelect enum={evolveTypes} selectedValue={evol.evolve} handleOptionChange={handleEvolutionChange} arrayIndex={index} propName={'evolve'}/>
      {(evol.evolve === 1 || evol.evolve === 5) && 
        <input value={evol.evolveLevel} onChange={(e) => handleEvolutionChange(e, index, 'evolveLevel')}/>
      }
      {evol.evolve === 2 &&  
        <EnumSelect enum={evolveStones} selectedValue={evol.evolveStone} handleOptionChange={handleEvolutionChange} arrayIndex={index} propName={'evolveStone'} />
      }
      {evol.evolve === 4 &&  
        <EnumSelect enum={evolveHappiness} selectedValue={evol.evolveHappiness} handleOptionChange={handleEvolutionChange} arrayIndex={index} propName={'evolveHappiness'} />
      }
      {evol.evolve === 5 &&        
        <EnumSelect enum={evolveStats} selectedValue={evol.evolveStats} handleOptionChange={handleEvolutionChange} arrayIndex={index} propName={'evolveStats'} />
      }
      <ArraySelect collection={pokemon} display='name' selectedValue={evol.evolveTo} handleOptionChange={handleEvolutionChange} arrayIndex={index} propName={'evolveTo'} />
      <button onClick={(e) => handleRemoveEvolution(e, index)}>X</button>
    </li>
  );
  
  console.log(tms);
  const pokemonTMs = pokemon[selectedPokemon].tms.map((tm, index) => 
      <div key={index}>
        <input type="checkbox" checked={tm} onChange={handleTMChange} />
        {moves[tms[index].move].name}
      </div>
    
  );

  function handleLevelUpMoveChange(event, levelupMoveIndex, propName){
    let newValue = event.target.value;
    updateMove({pokeIndex: selectedPokemon, moveIndex: levelupMoveIndex, propName: propName, propValue: newValue});
  };

  
  function handleEvolutionChange(event, evolutionIndex, propName){
    let newValue = event.target.value;
    updateEvolution({pokeIndex: selectedPokemon, evolveIndex: evolutionIndex, propName: propName, propValue: newValue});
  };

  function handleStatChange(event, pokemonIndex, propName){
    let newValue = event.target.value;
    if(newValue > 0 && newValue <= 255){
      updateStat({index: pokemonIndex, propName: propName, propValue: newValue});
    }
  };

  function handleAddEvolution(event){
    addEvolution();
  };

  function handleRemoveEvolution(event, evolutionIndex){
    removeEvolution(evolutionIndex);
  };

  function handleTMChange(event){

  };

  return (
    <div className="pokemon-full-data-container">
      <ul className="list-group" style={{ overflowY: "scroll"}}>{pokemonList}</ul>
      <div style={{ overflowY: "scroll"}}>
        <table>
          <tbody>
            <tr><td>Name: </td><td>{pokemon[selectedPokemon].name}</td></tr>
            <tr><td>HP: </td><td><input value={pokemon[selectedPokemon].hp} onChange={(e) => handleStatChange(e, selectedPokemon, 'hp')} /></td></tr>
            <tr><td>Attack: </td><td><input value={pokemon[selectedPokemon].attack} onChange={(e) => handleStatChange(e, selectedPokemon, 'attack')} /></td></tr>
            <tr><td>Defense: </td><td><input value={pokemon[selectedPokemon].defense} onChange={(e) => handleStatChange(e, selectedPokemon, 'defense')} /></td></tr>
            <tr><td>Speed: </td><td><input value={pokemon[selectedPokemon].speed} onChange={(e) => handleStatChange(e, selectedPokemon, 'speed')} /></td></tr>
            <tr>{gen === 1 && <td>Special: </td>}{gen !== 1 && <td>Special Attack: </td>}<td><input value={pokemon[selectedPokemon].specialAttack} onChange={(e) => handleStatChange(e, selectedPokemon, 'specialAttack')} /></td></tr>
            {gen !== 1 && <tr><td>Special Defense: </td><td><input value={pokemon[selectedPokemon].specialDefense} onChange={(e) => handleStatChange(e, selectedPokemon, 'specialDefense')} /></td></tr>}
            <tr><td><ArraySelect collection={pokemonTypes} value='typeIndex' display='typeName' selectedValue={pokemon[selectedPokemon].type1} handleOptionChange={handleStatChange} arrayIndex={selectedPokemon} propName={'type1'} /></td></tr>
            <tr><td><ArraySelect collection={pokemonTypes} value='typeIndex' display='typeName' selectedValue={pokemon[selectedPokemon].type2} handleOptionChange={handleStatChange} arrayIndex={selectedPokemon} propName={'type2'} /></td></tr>
            <tr><td>Catch Rate: </td><td><input value={pokemon[selectedPokemon].catchRate} onChange={(e) => handleStatChange(e, selectedPokemon, 'catchRate')} /></td></tr>
            <tr><td>EXP Yield: </td><td><input value={pokemon[selectedPokemon].expYield} onChange={(e) => handleStatChange(e, selectedPokemon, 'expYield')} /></td></tr>
            {gen === 1 && 
              <tr><td>Start Move 1: </td>
              <td><ArraySelect collection={moves} value='id' display='name' selectedValue={pokemon[selectedPokemon].move1} handleOptionChange={handleStatChange} arrayIndex={selectedPokemon} propName={'move1'} /></td>
              </tr>
            }
            {gen === 1 && 
              <tr><td>Start Move 2: </td>
              <td><ArraySelect collection={moves} value='id' display='name' selectedValue={pokemon[selectedPokemon].move2} handleOptionChange={handleStatChange} arrayIndex={selectedPokemon} propName={'move2'} /></td>
              </tr>
            }
            {gen === 1 && 
              <tr><td>Start Move 3: </td>
              <td><ArraySelect collection={moves} value='id' display='name' selectedValue={pokemon[selectedPokemon].move3} handleOptionChange={handleStatChange} arrayIndex={selectedPokemon} propName={'move3'} /></td>
              </tr>
            }
            {gen === 1 && 
              <tr><td>Start Move 4: </td>
              <td><ArraySelect collection={moves} value='id' display='name' selectedValue={pokemon[selectedPokemon].move4} handleOptionChange={handleStatChange} arrayIndex={selectedPokemon} propName={'move4'} /></td>
              </tr>
            }
            {pokemon[selectedPokemon].evolutions.length > 0 &&
              <tr><td colSpan="2">Evolutions</td></tr>              
            }
            {pokemon[selectedPokemon].evolutions.length > 0 &&
              <tr><td colSpan="2"><ul className="list-group">{evolutions}</ul></td></tr>
            }
            <tr><td colSpan="2"><button onClick={handleAddEvolution}>Add Evolution</button></td></tr>
            
          </tbody>
        </table>
      </div>
      <div style={{overflowY: "scroll"}}>{pokemonTMs}</div>
      <ul className="list-group" style={{ overflowY: "scroll"}}>{levelupMoves}</ul>
    </div>
  );

}

export default PokemonFullData;