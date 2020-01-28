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
  //data we want to edit and actions which edit
  pokemon: pokemonDefault,
  selectedPokemon: 0,
  selectedZone: 0,
  selectedTrainer: 0,
  selectedShop: 0,
  pokemonTypes: [{typeIsUsed: 'true', typeName: 'NORMAL', typeIndex: 0}],
  moves: [{}],
  tms: [{}],
  items: [{}],
  typeMatchups: [{}],
  encounterZones: [{encounters: []}],
  trainers: [{pokemon: []}],
  shops: [{items: []}],
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
  updatePokemonProperty: action((state, payload) => {
    state.pokemon[payload.index][payload.propName] = payload.propValue;
  }),
  updateMoveProperty: action((state, payload) => {
    state.moves[payload.index][payload.propName] = payload.propValue;
  }),
  updatePokemonMoveProperty: action((state, payload) => {
    //this sets the new value to be the same type as the property being updated.
    let newValue = state.pokemon[payload.pokeIndex].learnedMoves[payload.moveIndex][payload.propName].constructor(payload.propValue);
    state.pokemon[payload.pokeIndex].learnedMoves[payload.moveIndex][payload.propName] = newValue;
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
  addPokemonEvolution: action((state, payload) => {
    state.pokemon[state.selectedPokemon].evolutions.push(state.romModelState.defaultEvolution);
  }),
  removePokemonEvolution: action((state, payload) => {
    state.pokemon[state.selectedPokemon].evolutions.splice(payload, 1);
  }),
  updateTypeMatchupProperty: action((state, payload) => {
    state.typeMatchups[payload.index][payload.propName] = payload.propValue;
  }),
  updateTypeProperty: action((state, payload) => {
    state.pokemonTypes[payload.index][payload.propName] = payload.propValue;
  }),
  updateZoneProperty: action((state, payload) => {
    state.encounterZones[state.selectedZone].encounters[payload.index][payload.propName] = payload.propValue;
  }),
  updateTrainerPokemonProperty: action((state, payload) => {
    let newValue = state.trainers[state.selectedTrainer].pokemon[payload.index][payload.propName].constructor(payload.propValue);
    state.trainers[state.selectedTrainer].pokemon[payload.index][payload.propName] = newValue;
  }),
  updateTrainerProperty: action((state, payload) => {
    let newValue = state.trainers[payload.index][payload.propName].constructor(payload.propValue)
    state.trainers[payload.index][payload.propName] = newValue;
  }),
  updateShopItemProperty: action((state, payload) => {
    let newValue = state.shops[state.selectedShop].items[payload.index][payload.propName].constructor(payload.propValue)
    state.shops[state.selectedShop].items[payload.index][payload.propName] = newValue;
  }),

  //accessing data from the correct ROM
  dataLoaded: false,
  redBlueModel: redBlue,
  goldSilverModel: goldSilver,
  selectedROM: 0, 
  romModelSelected: thunk(async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    const romFound = getState().supportedROMs.find(rom => rom.text === payload);
    if(romFound){
      //need to reset data when the rom is changed.
      actions.setSelectedPokemon(0);
      actions.setPokemonArray(pokemonDefault);
      actions.setMovesArray([{}]);
      actions.setTMs([{}]);
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
        modelActions = actions.redBlueModel
        break;
      case 1:
        modelActions = actions.goldSilverModel
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
        modelState = state.redBlueModel
        break;
      case 1:
        modelState = state.goldSilverModel
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
  supportedROMs: [{text: 'red/blue', select: 0}, {text: 'gold/silver', select: 1}],
  defaultSupportedROM: 'red/blue',
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
  saveFileAs: thunk(async (actions, payload) => {
    //console.log(actions.getRomModelActions());
    actions.getRomModelActions()
    .then(res => {
      res.saveFileAs();
    })
  })
}
