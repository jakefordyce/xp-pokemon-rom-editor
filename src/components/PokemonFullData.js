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
  const addPokemonMove = useStoreActions(actions => actions.addPokemonMove);
  const removePokemonMove = useStoreActions(actions => actions.removePokemonMove);
  const sortPokemonMoves = useStoreActions(actions => actions.sortPokemonMoves);
  const updatePokemonTM = useStoreActions(actions => actions.updatePokemonTMProperty);
  const moves = useStoreState(state => state.moves);
  const tms = useStoreState(state => state.tms);
  const pokemonTypes = useStoreState(state => state.pokemonTypes);
  const evolveTypes = useStoreState(state => state.romModelState.evolveTypes);
  const evolveStones = useStoreState(state => state.romModelState.evolveStones);
  const evolveHappiness = useStoreState(state => state.romModelState.evolveHappiness);
  const evolveStats = useStoreState(state => state.romModelState.evolveStats);
  const tradeItems = useStoreState(state => state.romModelState.tradeItems);
  const growthRates = useStoreState(state => state.romModelState.growthRates);
  const abilities = useStoreState(state => state.romModelState.abilities);
  const maxEvosMovesBytes = useStoreState(state => state.romModelState.maxEvosMovesBytes);
  const currentEvosMovesBytes = useStoreState(state => state.currentEvosMovesBytes);

  const pokemonList = pokemon.map((pokemon, index) =>
    <li key={index} className={"list-group-item" + (selectedPokemon === index ? " active" : "")} style={{maxWidth: "150px"}} onClick={()=> setSelectedPokemon(index)}>{pokemon.name}</li>
  );

  const levelupMoves = pokemon[selectedPokemon].learnedMoves.map((move, index)=>
    <li key={index} className={"list-group-item"}>
      <input value={move.level} className="number-input" onChange={(e) => handleLevelUpMoveChange(e, index, 'level')} onBlur={(e) => handlePokemonMoveBlur(e, selectedPokemon)} />
      <ArraySelect collection={moves} value='id' display='name' selectedValue={move.moveID} handleOptionChange={handleLevelUpMoveChange} arrayIndex={index} propName={'moveID'} />
      <button onClick={(e) => handleRemoveMove(e, index)}>X</button>
    </li>
  );

  const evolutions = pokemon[selectedPokemon].evolutions.map((evol, index) =>
    <li key={index} className={"list-group-item"}>
      <EnumSelect enum={evolveTypes} selectedValue={evol.evolve} handleOptionChange={handleEvolutionChange} arrayIndex={index} propName={'evolve'}/>

      {gen < 3 && gen1EvolutionOptions(evol, index)}
      {gen >= 3 && gen3EvolutionOptions(evol, index)}

      <ArraySelect collection={pokemon} display='name' selectedValue={evol.evolveTo} handleOptionChange={handleEvolutionChange} arrayIndex={index} propName={'evolveTo'} />
      <button onClick={(e) => handleRemoveEvolution(e, index)}>X</button>
    </li>
  );

  const pokemonTMs = pokemon[selectedPokemon].tms?.map((tm, index) =>
      <div key={index}>
        <input type="checkbox" checked={tm} onChange={(e) => handleTMChange(e, index)} />
        {moves[tms[index].move].name}
      </div>
  );

  function gen1EvolutionOptions(evol, index){
    return <span>
      {(evol.evolve === 1 || evol.evolve === 5) &&
        <input value={evol.evolveLevel} className="number-input" onChange={(e) => handleEvolutionChange(e, index, 'evolveLevel')}/>
      }
      {evol.evolve === 2 &&
        <EnumSelect enum={evolveStones} selectedValue={evol.evolveStone} handleOptionChange={handleEvolutionChange} arrayIndex={index} propName={'evolveStone'} />
      }
      {evol.evolve === 3 && gen !== 1 &&
        <EnumSelect enum={tradeItems} selectedValue={evol.tradeItem} handleOptionChange={handleEvolutionChange} arrayIndex={index} propName={'tradeItem'} />
      }
      {evol.evolve === 4 &&
        <EnumSelect enum={evolveHappiness} selectedValue={evol.evolveHappiness} handleOptionChange={handleEvolutionChange} arrayIndex={index} propName={'evolveHappiness'} />
      }
      {evol.evolve === 5 &&
        <EnumSelect enum={evolveStats} selectedValue={evol.evolveStats} handleOptionChange={handleEvolutionChange} arrayIndex={index} propName={'evolveStats'} />
      }
    </span>
  }

  function gen3EvolutionOptions(evol, index){
    return <span>
      {(evol.evolve !== 1 && evol.evolve !== 2 && evol.evolve !== 3 && evol.evolve !== 5 && evol.evolve !== 6 && evol.evolve !== 7) &&
        <input value={evol.param} className="number-input" onChange={(e) => handleEvolutionChange(e, index, 'param')}/>
      }
      {evol.evolve === 6 &&
        <EnumSelect enum={tradeItems} selectedValue={evol.param} handleOptionChange={handleEvolutionChange} arrayIndex={index} propName={'param'} />
      }
      {evol.evolve === 7 &&
        <EnumSelect enum={evolveStones} selectedValue={evol.param} handleOptionChange={handleEvolutionChange} arrayIndex={index} propName={'param'} />
      }

    </span>
  }

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
    if(newValue >= 0 && newValue <= 255){
      updateStat({index: pokemonIndex, propName: propName, propValue: newValue});
    }
  };

  function handleAddEvolution(event){
    addEvolution();
  };

  function handleRemoveEvolution(event, evolutionIndex){
    removeEvolution(evolutionIndex);
  };

  function handleAddMove(event){
    addPokemonMove();
  }

  function handleRemoveMove(event, moveIndex){
    removePokemonMove(moveIndex);
  }

  function handlePokemonMoveBlur(event, pokeIndex){
    sortPokemonMoves(pokeIndex);
  }

  function handleTMChange(event, tmIndex){
    let newValue = event.target.checked;
    updatePokemonTM({index: tmIndex, propValue: newValue});
  };

  return (
    <div className="pokemon-full-data-container">
      <ul className="list-group" style={{ overflowY: "scroll"}}>{pokemonList}</ul>
      <div style={{ overflowY: "scroll"}}>
        <table>
          <tbody>
            <tr><td>Name: </td><td>{pokemon[selectedPokemon].name}</td></tr>
            <tr><td>HP: </td><td><input value={pokemon[selectedPokemon].hp} className="number-input" onChange={(e) => handleStatChange(e, selectedPokemon, 'hp')} /></td>
            {gen > 2 && <td>Yield: <input value={pokemon[selectedPokemon].evYieldHP} className="tiny-number-input" onChange={(e) => handleStatChange(e, selectedPokemon, 'evYieldHP')} /></td>}
            </tr>
            <tr><td>Attack: </td><td><input value={pokemon[selectedPokemon].attack} className="number-input" onChange={(e) => handleStatChange(e, selectedPokemon, 'attack')} /></td>
            {gen > 2 && <td>Yield: <input value={pokemon[selectedPokemon].evYieldAttack} className="tiny-number-input" onChange={(e) => handleStatChange(e, selectedPokemon, 'evYieldAttack')} /></td>}
            </tr>
            <tr><td>Defense: </td><td><input value={pokemon[selectedPokemon].defense} className="number-input" onChange={(e) => handleStatChange(e, selectedPokemon, 'defense')} /></td>
            {gen > 2 && <td>Yield: <input value={pokemon[selectedPokemon].evYieldDefense} className="tiny-number-input" onChange={(e) => handleStatChange(e, selectedPokemon, 'evYieldDefense')} /></td>}
            </tr>
            <tr><td>Speed: </td><td><input value={pokemon[selectedPokemon].speed} className="number-input" onChange={(e) => handleStatChange(e, selectedPokemon, 'speed')} /></td>
            {gen > 2 && <td>Yield: <input value={pokemon[selectedPokemon].evYieldSpeed} className="tiny-number-input" onChange={(e) => handleStatChange(e, selectedPokemon, 'evYieldSpeed')} /></td>}
            </tr>
            <tr>{gen === 1 && <td>Special: </td>}{gen !== 1 && <td>Special Attack: </td>}<td><input value={pokemon[selectedPokemon].specialAttack} className="number-input" onChange={(e) => handleStatChange(e, selectedPokemon, 'specialAttack')} /></td>
            {gen > 2 && <td>Yield: <input value={pokemon[selectedPokemon].evYieldSpecialAttack} className="tiny-number-input" onChange={(e) => handleStatChange(e, selectedPokemon, 'evYieldSpecialAttack')} /></td>}
            </tr>
            {gen !== 1 && <tr><td>Special Defense: </td><td><input value={pokemon[selectedPokemon].specialDefense} className="number-input" onChange={(e) => handleStatChange(e, selectedPokemon, 'specialDefense')} /></td>
            {gen > 2 && <td>Yield: <input value={pokemon[selectedPokemon].evYieldSpecialDefense} className="tiny-number-input" onChange={(e) => handleStatChange(e, selectedPokemon, 'evYieldSpecialDefense')} /></td>}
            </tr>}
            <tr><td><ArraySelect collection={pokemonTypes} value='typeIndex' display='typeName' selectedValue={pokemon[selectedPokemon].type1} handleOptionChange={handleStatChange} arrayIndex={selectedPokemon} propName={'type1'} /></td></tr>
            <tr><td><ArraySelect collection={pokemonTypes} value='typeIndex' display='typeName' selectedValue={pokemon[selectedPokemon].type2} handleOptionChange={handleStatChange} arrayIndex={selectedPokemon} propName={'type2'} /></td></tr>
            <tr><td>Catch Rate: </td><td><input value={pokemon[selectedPokemon].catchRate} className="number-input" onChange={(e) => handleStatChange(e, selectedPokemon, 'catchRate')} /></td></tr>
            <tr><td>EXP Yield: </td><td><input value={pokemon[selectedPokemon].expYield} className="number-input" onChange={(e) => handleStatChange(e, selectedPokemon, 'expYield')} /></td></tr>
            <tr><td>Growth Rate: </td><td><EnumSelect enum={growthRates} selectedValue={pokemon[selectedPokemon].growthRate} handleOptionChange={handleStatChange} arrayIndex={selectedPokemon} propName={'growthRate'}/></td></tr>
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
            {gen > 2 &&
              <tr><td>Ability: </td>
              <td><ArraySelect collection={abilities} selectedValue={pokemon[selectedPokemon].ability1} handleOptionChange={handleStatChange} arrayIndex={selectedPokemon} propName={'ability1'} /></td>
              </tr>
            }
            {gen > 2 &&
              <tr><td>Ability: </td>
              <td><ArraySelect collection={abilities}  selectedValue={pokemon[selectedPokemon].ability2} handleOptionChange={handleStatChange} arrayIndex={selectedPokemon} propName={'ability2'} /></td>
              </tr>
            }
            {pokemon[selectedPokemon].evolutions.length > 0 &&
              <tr><td colSpan="100">Evolutions</td></tr>
            }
            {pokemon[selectedPokemon].evolutions.length > 0 &&
              <tr><td colSpan="100"><ul className="list-group">{evolutions}</ul></td></tr>
            }
            <tr><td colSpan="100"><button onClick={handleAddEvolution}>Add Evolution</button></td></tr>

          </tbody>
        </table>
      </div>
      <div style={{overflowY: "scroll"}}>{pokemonTMs}</div>
      <div><div>bytes used: {currentEvosMovesBytes}/{maxEvosMovesBytes}</div><ul className="list-group" style={{ overflowY: "scroll"}}>{levelupMoves}</ul><button onClick={handleAddMove}>Add Move</button></div>
    </div>
  );

}

export default PokemonFullData;