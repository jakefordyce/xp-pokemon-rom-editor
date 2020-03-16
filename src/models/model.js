import { thunk, action, computed } from "easy-peasy";
import redBlue from './redBlue';
import goldSilver from './goldSilver';
const remote = require('electron').remote;
const dialog = remote.dialog;
const fs = remote.require('fs');

const pokemonDefault = [{name: 'not loaded', hp: 0, attack: 0, defense: 0, speed: 0, specialAttack: 0, specialDefense: 0, 
                        type1: 0, type2: 0, catchRate: 0, expYield: 0, move1: 0, move2: 0, move3: 0, move4: 0, 
                        learnedMoves: [], evolutions: [], tms: []}];

export default {
  //data we want to edit.
  pokemon: pokemonDefault,
  selectedPokemon: 0,
  selectedZone: 0,
  selectedTrainer: 0,
  selectedShop: 0,
  selectedTypeMatchup: 0,
  pokemonTypes: [{typeIsUsed: 'true', typeName: 'NORMAL', typeIndex: 0}],
  moves: [{}],
  tms: [{}],
  items: [{}],
  typeMatchups: [{}],
  encounterZones: [{encounters: []}],
  trainers: [{uniqueName: '', pokemon: []}],
  shops: [{items: []}],
  starters: [],
  moveDescriptions: [],

  //actions for setting the above data. These are called from the ROM specific models after loading data from the ROM file.
  //I might refactor these into 1 method at some point.
  setPokemonArray: action((state, payload) => {
    state.pokemon = payload;
  }),
  setSelectedPokemon: action((state, payload) => {
    state.selectedPokemon = payload;
  }),
  setPokemonTypes: action((state, payload) => {
    state.pokemonTypes = payload;
  }),
  setMovesArray: action((state, payload) => {
    state.moves = payload;
  }),
  setTMs: action((state, payload) => {
    state.tms = payload;
  }),
  setItems: action((state, payload) => {
    state.items = payload;
  }),
  setTypeMatchups: action((state, payload) => {
    state.typeMatchups = payload;
  }),
  setSelectedTypeMatchup: action((state, payload) => {
    state.selectedTypeMatchup = payload;
  }),
  setEncounterZones: action((state, payload) => {
    state.encounterZones = payload;
  }),
  setSelectedZone: action((state, payload) => {
    state.selectedZone = payload;
  }),
  setTrainers: action((state, payload) => {
    state.trainers = payload;
  }),
  setSelectedTrainer: action((state, payload) => {
    state.selectedTrainer = payload;
  }),
  setShops: action((state, payload) => {
    state.shops = payload;
  }),
  setSelectedShop: action((state, payload) => {
    state.selectedShop = payload;
  }),
  setStarters: action((state, payload) => {
    state.starters = payload;
  }),
  setMoveDescriptions: action((state, payload) => {
    state.moveDescriptions = payload;
  }),

  //actions for updating the data.
  updatePokemonProperty: action((state, payload) => {
    let newValue = state.pokemon[payload.index][payload.propName].constructor(payload.propValue);
    state.pokemon[payload.index][payload.propName] = newValue;
    state.pokemon[payload.index].totalStats = state.pokemon[payload.index].hp + state.pokemon[payload.index].attack + state.pokemon[payload.index].defense + state.pokemon[payload.index].speed + state.pokemon[payload.index].specialAttack + state.pokemon[payload.index].specialDefense;
  }),
  updateMoveProperty: action((state, payload) => {
    let moveIndex = state.moves.findIndex((move) => move.id === payload.index);
    let newValue = state.moves[moveIndex][payload.propName].constructor(payload.propValue);
    state.moves[moveIndex][payload.propName] = newValue;
  }),
  updateMoveDescriptionProperty: action((state, payload) => {
    let moveIndex = state.moves.findIndex((move) => move.id === payload.index);
    let newValue = state.moveDescriptions[moveIndex][payload.propName].constructor(payload.propValue);
    state.moveDescriptions[moveIndex][payload.propName] = newValue;
  }),
  updatePokemonMoveProperty: action((state, payload) => {
    let newValue = state.pokemon[payload.pokeIndex].learnedMoves[payload.moveIndex][payload.propName].constructor(payload.propValue);
    state.pokemon[payload.pokeIndex].learnedMoves[payload.moveIndex][payload.propName] = newValue;
  }),
  //this is called automatically to keep pokemon moves sorted by level
  sortPokemonMoves: action((state, payload) => {
    state.pokemon[payload].learnedMoves.sort((a, b) => {return a.level - b.level});
  }),
  updatePokemonEvolutionProperty: action((state, payload) => {
    let newValue = state.pokemon[payload.pokeIndex].evolutions[payload.evolveIndex][payload.propName].constructor(payload.propValue);
    state.pokemon[payload.pokeIndex].evolutions[payload.evolveIndex][payload.propName] = newValue;
  }),
  updatePokemonTMProperty: action((state, payload) => {
    state.pokemon[state.selectedPokemon].tms[payload.index] = payload.propValue;
  }),
  updateTMProperty: action((state, payload) => {
    let newValue = state.tms[payload.index][payload.propName].constructor(payload.propValue);
    state.tms[payload.index][payload.propName] = newValue;
  }),
  updateItemProperty: action((state, payload) => {
    let newValue = state.items[payload.index][payload.propName].constructor(payload.propValue);
    state.items[payload.index][payload.propName] = newValue;
  }),
  addPokemonEvolution: action((state, payload) => {
    state.pokemon[state.selectedPokemon].evolutions.push(state.romModelState.defaultEvolution);
  }),
  removePokemonEvolution: action((state, payload) => {
    state.pokemon[state.selectedPokemon].evolutions.splice(payload, 1);
  }),
  addPokemonMove: action((state, payload) => {
    state.pokemon[state.selectedPokemon].learnedMoves.unshift({level: 1, moveID: 1});
  }),
  removePokemonMove: action((state, payload) => {
    state.pokemon[state.selectedPokemon].learnedMoves.splice(payload, 1);
  }),
  updateTypeMatchupProperty: action((state, payload) => {
    let newValue = state.typeMatchups[payload.index][payload.propName].constructor(payload.propValue);
    state.typeMatchups[payload.index][payload.propName] = newValue;
  }),
  updateTypeProperty: action((state, payload) => {
    let newValue = state.pokemonTypes[payload.index][payload.propName].constructor(payload.propValue)
    state.pokemonTypes[payload.index][payload.propName] = newValue;
  }),
  addType: action((state, payload) => {
    state.pokemonTypes.push({typeName: "", typeIsUsed: true, typeIndex: state.pokemonTypes.length});
  }),
  removeType: action((state, payload) => {
    state.pokemonTypes.splice(payload, 1);
  }),
  addTypeMatchup: action((state, payload) => {
    state.typeMatchups.push({attackType: payload.attackType, defenseType: payload.defenseType, effectiveness: 5, foresight: false});
  }),
  removeTypeMatchup: action((state, payload) => {
    state.typeMatchups.splice(payload, 1);
  }),
  updateZoneProperty: action((state, payload) => {
    let newValue = state.encounterZones[state.selectedZone].encounters[payload.index][payload.propName].constructor(payload.propValue);
    state.encounterZones[state.selectedZone].encounters[payload.index][payload.propName] = newValue;
  }),
  updateTrainerPokemonProperty: action((state, payload) => {
    let newValue = state.trainers[state.selectedTrainer].pokemon[payload.index][payload.propName].constructor(payload.propValue);
    state.trainers[state.selectedTrainer].pokemon[payload.index][payload.propName] = newValue;
  }),
  updateTrainerProperty: action((state, payload) => {
    let newValue = state.trainers[payload.index][payload.propName].constructor(payload.propValue)
    state.trainers[payload.index][payload.propName] = newValue;
  }),
  addTrainerPokemon: action((state, payload) => {
    state.trainers[state.selectedTrainer].pokemon.push({level: 1, pokemon: 1, item: 0, move1: 0, move2: 0, move3: 0, move4: 0});
  }),
  removeTrainerPokemon: action((state, payload) => {
    state.trainers[state.selectedTrainer].pokemon.splice(payload, 1);
  }),
  updateShopItemProperty: action((state, payload) => {
    let newValue = state.shops[state.selectedShop].items[payload.index][payload.propName].constructor(payload.propValue)
    state.shops[state.selectedShop].items[payload.index][payload.propName] = newValue;
  }),
  addShopItem: action((state, payload) => {
    state.shops[state.selectedShop].items.push({item: 1});
  }),
  removeShopItem: action((state, payload) => {
    state.shops[state.selectedShop].items.splice(payload, 1);
  }),
  updateStarterProperty: action((state, payload) => {
    let newValue = state.starters[payload.index][payload.propName].constructor(payload.propValue);
    state.starters[payload.index][payload.propName] = newValue;
  }),

  //sorting data and actions for the pokemon grid and moves grid
  pokemonSortColumn: "id",
  updatePokemonSortColumn: action((state, payload) => {
    state.pokemonSortColumn = payload;
  }),
  pokemonSortOrder: 1,
  updatePokemonSortOrder: action((state, payload) => {
    state.pokemonSortOrder = payload;
  }),
  updatePokemonSorting: thunk(async (actions, payload, {getState, getStoreActions}) => {
    //console.log(`sorting changed ${column}`);
    if(payload !== getState().pokemonSortColumn){
      actions.updatePokemonSortColumn(payload);
      actions.updatePokemonSortOrder(1);
    }else{
      let newValue = getState().pokemonSortOrder * -1;
      actions.updatePokemonSortOrder(newValue);
    }
    actions.sortPokemon();
  }),
  resetPokemonSorting: thunk(async (actions, payload, {getState, getStoreActions}) => {
    actions.updatePokemonSortColumn("id");
    actions.updatePokemonSortOrder(1);
    actions.sortPokemon();
  }),
  sortPokemon: action((state, payload) => {
    state.pokemon.sort((a, b) => { 
      if( a[state.pokemonSortColumn] < b[state.pokemonSortColumn] ){
        return (-1 * state.pokemonSortOrder)
      }
      if( a[state.pokemonSortColumn] > b[state.pokemonSortColumn] ){
        return state.pokemonSortOrder
      }
      if( a["name"] < b["name"]){
        return -1;
      }
      else{
        return 1;
      }
    });
  }),
  movesSortColumn: "id",
  updateMovesSortColumn: action((state, payload) => {
    state.movesSortColumn = payload;
  }),
  movesSortOrder: 1,
  updateMovesSortOrder: action((state, payload) => {
    state.movesSortOrder = payload;
  }),
  updateMovesSorting: thunk(async (actions, payload, {getState, getStoreActions}) => {
    if(payload !== getState().movesSortColumn){
      actions.updateMovesSortColumn(payload);
      actions.updateMovesSortOrder(1);
    }else{
      let newValue = getState().movesSortOrder * -1;
      actions.updateMovesSortOrder(newValue);
    }
    actions.sortMoves();
  }),
  resetMovesSorting: thunk(async (actions, payload, {getState, getStoreActions}) => {
    actions.updateMovesSortColumn("id");
    actions.updateMovesSortOrder(1);
    actions.sortMoves();
  }),
  sortMoves: action((state, payload) => {
    state.moves.sort((a, b) => { 
      if( a[state.movesSortColumn] < b[state.movesSortColumn] ){
        return (-1 * state.movesSortOrder)
      }
      if( a[state.movesSortColumn] > b[state.movesSortColumn] ){
        return state.movesSortOrder
      }
      if( a["id"] < b["id"]){
        return -1;
      }
      else{
        return 1;
      }
    });
  }),

  //computed data that will be used in the UI
  currentEvosMovesBytes: computed((state) => {
      let count = 0;
      
      state.pokemon.forEach((poke) => 
      {
        count += 2; //every pokemon has at least 2 bytes of data. 1 to mark the end of the evolutions and 1 to mark the end of the learned moves.

        poke.evolutions.forEach((evo) => 
        {
          if(state.romModelState.generation === 1)
          {
            if (evo.evolve === 2) // stone
            {
                count += 4;
            }
            else
            {
                count += 3;
            }
          }
          else // generations other than 1st
          {
            if (evo.evolve === 5) // stats
            {
                count += 4;
            }
            else
            {
                count += 3;
            }
          }
        });

        poke.learnedMoves.forEach((move) => 
        {
          count += 2;
        });
      });
      
      return count;    
  }),
  currentTrainerBytes: computed((state) => {
    let count = 0;

    if(state.romModelState.generation === 1){
      state.trainers.forEach((trainer) => {
        count += 2; //every trainer has at least 2 bytes. The first is whether the pokemon have unique levels or all the same, second is the 0 to mark the end of the trainer's pokemon
        if (trainer.allSameLevel){
            count += trainer.pokemon.length; //1 byte per pokemon if they are all the same level
        }
        else{
            count += (trainer.pokemon.length * 2); //2 bytes if they each have a different level
        }
      });
    }
    else if(state.romModelState.generation === 2){
      state.trainers.forEach((trainer) => {
        //every trainer has at least 3 bytes. 
        //The first is the 0x50 to mark the end of the trainer's unique name.
        //The second is the trainer's type: normal, items, moves, or items and moves.
        //The third is the 0 to mark the end of the trainer's data.
        count += trainer.uniqueName.length + 3;
        
        switch(trainer.type){
          case 0:
            count += (trainer.pokemon.length * 2)
            break;
          case 1:
            count += (trainer.pokemon.length * 6)
            break;
          case 2:
            count += (trainer.pokemon.length * 3)
            break;
          case 3:
            count += (trainer.pokemon.length * 7)
            break;
          default:
            break;
        }
      });
    }
    return count;
  }),
  currentShopItems: computed((state) => {
    let count = 0;
    state.shops.forEach((shop) => {
      count += shop.items.length;
    });
    return count;
  }),

  //accessing data from the correct ROM
  dataLoaded: false,
  redBlueModel: redBlue,
  goldSilverModel: goldSilver,
  selectedROM: 0,
  romModelSelected: thunk(async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    getState().dataLoaded = false;
    const romFound = getState().supportedROMs.find(rom => rom.text === payload);
    if(romFound){
      //need to reset data when the rom is changed.
      actions.setSelectedPokemon(0);
      actions.setPokemonArray(pokemonDefault);
      actions.setMovesArray([{}]);
      actions.setTMs([{}]);
      actions.setTrainers([{uniqueName: '', pokemon: []}]);
      actions.setRomModel(romFound.select);
    }
  }),
  setRomModel: action((state, payload) => {
    state.selectedROM = payload;
  }),
  getRomModelActions: thunk(async (actions, payload, {getState}) => {
    let modelActions;
    switch(getState().selectedROM){
      case 0:
        modelActions = actions.goldSilverModel
        break;
      case 1:
        modelActions = actions.redBlueModel
        break;
      default:
        break;
    }
    return modelActions;
  }),
  romModelState: computed((state) => {
    let modelState;
    switch(state.selectedROM){
      case 0:
        modelState = state.goldSilverModel        
        break;
      case 1:
        modelState = state.redBlueModel
        break;
      default:
        break;
    }
    return modelState;
  }),

  //file io  
  currentFile: '',
  setCurrentFile: action((state, payload) => {
    state.currentFile = payload;
  }),
  supportedROMs: [{text: 'gold/silver', select: 0}, {text: 'red/blue', select: 1}],
  defaultSupportedROM: 'gold/silver',
  getFileFromUser: thunk(async (actions, payload, {getState}) => {
    getState().dataLoaded = false;
    let filedata;
    dialog.showOpenDialog(
      {filters: getState().romModelState.fileFilters}
    ).then((res) => {
      filedata = fs.readFileSync(res.filePaths[0]);
      actions.setCurrentFile(res.filePaths[0]);
      return actions.getRomModelActions();
    }).then((res) => {
      res.loadData(filedata);
      getState().dataLoaded = true;
    }).catch(err => {
      //TODO
    });
  }),
  saveFileAs: thunk(async (actions, payload, {getState}) => {
    //return the pokemon to their original order before saving.
    actions.resetPokemonSorting();
    //return the moves to their original order before saving.
    actions.resetMovesSorting();
    actions.getRomModelActions()
    .then(res => {
      // the rom model will prepare its rawBinArray to be saved.
      return res.prepareDataForSaving();
    })
    .then(() => {
      return dialog.showSaveDialog({
        title: 'Save ROM',
        filters: getState().romModelState.fileFilters
      })
    })
    .then((res) => {
      fs.writeFileSync(res.filePath, getState().romModelState.rawBinArray, 'base64');  
    })
    .catch((err) => {
      console.log(err);
    });
  }),
  saveFile: thunk(async (actions, payload, {getState}) => {
    //return the pokemon to their original order before saving.
    actions.resetPokemonSorting();
    //return the moves to their original order before saving.
    actions.resetMovesSorting();
    actions.getRomModelActions()
    .then(res => {
      // the rom model will prepare its rawBinArray to be saved.
      return res.prepareDataForSaving();
    })
    .then(() => {
      fs.writeFileSync(getState().currentFile, getState().romModelState.rawBinArray, 'base64');
    })
    .catch((err) => {
      console.log(err);
    });
  }),
}
