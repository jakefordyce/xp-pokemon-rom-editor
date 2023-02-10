import { thunk } from "easy-peasy";
import {gscDamageModifiers, gen3Letters, g3MoveAnimations, g3MoveEffects, g3EvolveTypes, g3Stones, g3TradeItems, g3GrowthRates,
  g3ZoneNames, g3GrassEncChances, gsTrainerTypes, g3WaterEncChances,
  getKeyByValue, g3MoveTargets, g3FishingEncChances, g3Abilities, g3TrainerAIFlags, g3MoveFlags} from './utils';
import {isEqual} from "lodash";

const pokemonNameStartByte = 0x245F5B; //Pokemon names start here and run Pokedex order with Chimecho at the end, out of order.
const pokemonMovesStart = 0x257504; //In Firered the learned moves are stored separately from evolutions.
const pokemonStartByte = 0x25480F; //Pokemon base stats data starts here. It goes in Pokedex order, Bulbasaur through Deoxys. Chimecho is at the end, out of order.
const pokemonMovesPointers = 0x25D828;//The first pointer is a dup pointer to bulbasaur's moves so I skipped it.
const pokemonEvolutionsStart = 0x2597EC;
const pokemonTMStart = 0x252C40;

//values used to load the pokemon types
const typesByte = 0x24F210; //
const typeChartByte = 0x24F0C0;

//values used to load the moves
const moveNamesByte = 0x247111;
const movesStartingByte = 0x250C80; //The move data starts.
const moveAnimationsStart = 0x1C6968;
const moveDescPointers = 0x488748;
const moveDescStartByte = 0x482894;
//values used to load the TMs and HMs
const tmStart = 0x45A604; //The TM info.
const itemPropertiesStart = 0x3DB098; // The item properties start here. 44 bytes per item.

//values used to load wild encounters
const wildEncountersStart = 0x3C7410;

//values used to load trainers
const trainerDataStart = 0x23EB38; // this is the start of the trainer data.
const trainerClassesStart = 0x23E5C8; // the names of the different types of trainers.
const trainerPokemonStart = 0x23A210; // Where the trainer pokemon data starts.

const naturesStart = 0x252BB8 // start of the natures stat data.

//values used to load shops
const shopsStarts = [
  {shopName: "Viridian", pointer: 0x16A310},
  {shopName: "Pewter", pointer: 0x16A780},
  {shopName: "Cerulean", pointer: 0x16AD50},
  {shopName: "Vermillion", pointer: 0x16B704},
  {shopName: "Lavender", pointer: 0x16B408},
  {shopName: "Celadon 2F Items", pointer: 0x16BBB0},
  {shopName: "Celadon 2F TMs", pointer: 0x16BBEC},
  {shopName: "Celadon 4F", pointer: 0x16BCA8},
  {shopName: "Celadon 5F Items", pointer: 0x16BCFC},
  {shopName: "Celadon 5F Vitamins", pointer: 0x16BD34},
  {shopName: "Saffron", pointer: 0x16F054},
  {shopName: "Fuchsia", pointer: 0x16D590},
  {shopName: "Cinnabar", pointer: 0x16EAC0},
  {shopName: "Indigo Plateau", pointer: 0x16EB6C},
  {shopName: "Two Island Initial", pointer: 0x16775C},
  {shopName: "Two Island Exp 1", pointer: 0x167774},
  {shopName: "Two Island Exp 2", pointer: 0x167790},
  {shopName: "Two Island Exp 3", pointer: 0x1677B0},
  {shopName: "Three Island", pointer: 0x17192C},
  {shopName: "Four Island", pointer: 0x171D4C},
  {shopName: "Seven Island", pointer: 0x170BD0}
]

const animationPointers = [
  0x081C6FA4,
  0x081C6FA4,
  0x081CFD5A,
  0x081C6FD5,
  0x081C7ED3,
  0x081C7D5D,
  0x081C94C5,
  0x081D0925,
  0x081CD350,
  0x081CD73A,
  0x081CD9EA,
  0x081C93F1,
  0x081C9439,
  0x081D1629,
  0x081C86B4,
  0x081C839A,
  0x081CF6B8,
  0x081CF709,
  0x081C99F9,
  0x081CFC8D,
  0x081D0D70,
  0x081C8B19,
  0x081C8BA1,
  0x081C833A,
  0x081CFF08,
  0x081C7E37,
  0x081CFE15,
  0x081CA24A,
  0x081CDF92,
  0x081CA2CD,
  0x081CA32A,
  0x081CA397,
  0x081CA414,
  0x081C7502,
  0x081C7540,
  0x081D0DAA,
  0x081C78F6,
  0x081CA591,
  0x081C798A,
  0x081C8381,
  0x081C7A9D,
  0x081C7AF2,
  0x081C776C,
  0x081D0A38,
  0x081CE200,
  0x081CDBC7,
  0x081CDB30,
  0x081CA610,
  0x081C75CD,
  0x081C7F4B,
  0x081D170F,
  0x081CF378,
  0x081C7CE9,
  0x081CFA85,
  0x081D0891,
  0x081CF8EA,
  0x081CEA5E,
  0x081CFA71,
  0x081CE36B,
  0x081CE7D8,
  0x081D0DC0,
  0x081C9D83,
  0x081CE4AF,
  0x081D2A17,
  0x081CF7A6,
  0x081C8BD8,
  0x081D030C,
  0x081CA6E4,
  0x081D00CA,
  0x081D479C,
  0x081C746E,
  0x081CEC45,
  0x081CED5D,
  0x081C7C93,
  0x081C99C3,
  0x081D05FC,
  0x081CE583,
  0x081C7028,
  0x081C7159,
  0x081C7287,
  0x081D04C4,
  0x081D14B6,
  0x081CE0D8,
  0x081C88A6,
  0x081C7FAC,
  0x081C801A,
  0x081C81D0,
  0x081CD5E0,
  0x081C9B6F,
  0x081CA741,
  0x081CA78E,
  0x081CA8B1,
  0x081CF1A1,
  0x081CD47B,
  0x081CD4DC,
  0x081D0E5A,
  0x081CA9CD,
  0x081CA9EA,
  0x081CAA34,
  0x081CAA8C,
  0x081CAB02,
  0x081D122B,
  0x081D17E7,
  0x081C7625,
  0x081CAB1B,
  0x081D173D,
  0x081CD11B,
  0x081CAB62,
  0x081C9F20,
  0x081C9AA1,
  0x081CE4A2,
  0x081C8F8C,
  0x081CDD9D,
  0x081CDC98,
  0x081D08F2,
  0x081CDD4A,
  0x081D1377,
  0x081D13B7,
  0x081CAB75,
  0x081C6FA4,
  0x081C8A29,
  0x081D1273,
  0x081D1350,
  0x081CDE90,
  0x081CF210,
  0x081CF4C6,
  0x081C7B65,
  0x081C8C31,
  0x081CE30E,
  0x081C73B5,
  0x081CAB9F,
  0x081C8601,
  0x081D1831,
  0x081CAC65,
  0x081CAC89,
  0x081D1959,
  0x081CFE72,
  0x081CACDA,
  0x081D0A8F,
  0x081D0C92,
  0x081CAD43,
  0x081CF0F5,
  0x081D1CDC,
  0x081CAD8B,
  0x081D2881,
  0x081CDDBA,
  0x081C876C,
  0x081D045F,
  0x081CAF23,
  0x081D0EBA,
  0x081CAF30,
  0x081CAF45,
  0x081CF977,
  0x081C8E85,
  0x081D1D23,
  0x081CF472,
  0x081CD43B,
  0x081C9BFB,
  0x081D21D5,
  0x081CAF5E,
  0x081CA019,
  0x081D223C,
  0x081CAF6A,
  0x081CAFEB,
  0x081D34A3,
  0x081CB025,
  0x081CB08B,
  0x081CFF3B,
  0x081C9D3C,
  0x081D1588,
  0x081CD218,
  0x081CB0B3,
  0x081C7672,
  0x081CDC08,
  0x081D1899,
  0x081CB109,
  0x081CA12E,
  0x081CF7CD,
  0x081D0405,
  0x081C84B5,
  0x081CB146,
  0x081CE964,
  0x081C8FC5,
  0x081CB175,
  0x081D1C10,
  0x081CDF0B,
  0x081D1C73,
  0x081CD130,
  0x081CF252,
  0x081CE03A,
  0x081D082B,
  0x081CF573,
  0x081D0F40,
  0x081CB1FD,
  0x081CB23C,
  0x081D1FB1,
  0x081C9E60,
  0x081C8FE2,
  0x081CF528,
  0x081C9AF4,
  0x081C9518,
  0x081CFB22,
  0x081CEEED,
  0x081CB297,
  0x081CB32B,
  0x081CB36E,
  0x081CB3AF,
  0x081CB436,
  0x081CB47E,
  0x081C96B3,
  0x081C895A,
  0x081D1025,
  0x081C9B2A,
  0x081C98CA,
  0x081D211A,
  0x081D19DB,
  0x081D376A,
  0x081D1E38,
  0x081C9040,
  0x081C9307,
  0x081C9349,
  0x081CD803,
  0x081CB4C0,
  0x081D0002,
  0x081CF5CA,
  0x081CDA1C,
  0x081D1F8F,
  0x081D246E,
  0x081C8590,
  0x081CB551,
  0x081D292D,
  0x081D10D4,
  0x081D1198,
  0x081D0199,
  0x081D2899,
  0x081CF177,
  0x081CB5BE,
  0x081C83CC,
  0x081CFDAC,
  0x081D4D7E,
  0x081CE1B5,
  0x081D03AF,
  0x081CE25E,
  0x081CDD24,
  0x081C86FA,
  0x081CB64E,
  0x081D0703,
  0x081D130D,
  0x081CD53F,
  0x081D0214,
  0x081CFBAA,
  0x081C823F,
  0x081D1BD5,
  0x081CB70C,
  0x081D25DB,
  0x081D2692,
  0x081D27D5,
  0x081CB7D6,
  0x081CB886,
  0x081CB8BE,
  0x081D2B59,
  0x081D23B0,
  0x081CB902,
  0x081CB946,
  0x081D36A3,
  0x081CB966,
  0x081CB9C1,
  0x081D0703,
  0x081CB9E0,
  0x081CBA7B,
  0x081CBACF,
  0x081D2515,
  0x081D2C55,
  0x081D2593,
  0x081CBB42,
  0x081D1D87,
  0x081CBBB3,
  0x081D48F9,
  0x081CBC6E,
  0x081D33CD,
  0x081CBCA2,
  0x081CBEA7,
  0x081D4A7F,
  0x081CBEEA,
  0x081CBF5F,
  0x081CC02C,
  0x081CC077,
  0x081D2CB2,
  0x081CC0BA,
  0x081D41BF,
  0x081D4D2A,
  0x081D41D9,
  0x081D2F03,
  0x081CC0E2,
  0x081CC128,
  0x081CC16B,
  0x081CC282,
  0x081CC311,
  0x081CC3E1,
  0x081D2CF5,
  0x081CC44C,
  0x081D4FFE,
  0x081CC583,
  0x081CC733,
  0x081D2D7D,
  0x081D3464,
  0x081CC74B,
  0x081D3C7E,
  0x081D4622,
  0x081D3346,
  0x081D4754,
  0x081D51CD,
  0x081CC7BB,
  0x081CC91D,
  0x081CC9AD,
  0x081D4330,
  0x081CCA0F,
  0x081D3EC0,
  0x081D3FA7,
  0x081D3653,
  0x081CCA59,
  0x081CCB4C,
  0x081D3BF9,
  0x081CCBB8,
  0x081CEB5D,
  0x081CCBE6,
  0x081CCC41,
  0x081D4C31,
  0x081D2E06,
  0x081D2EDE,
  0x081D2F98,
  0x081D2FAA,
  0x081CCCA9,
  0x081C7831,
  0x081CCD13,
  0x081CCD3D,
  0x081CCD4C,
  0x081D3040,
  0x081D34AF,
  0x081CCD6E,
  0x081CFCF7,
  0x081D32A9,
  0x081D1132,
  0x081CCD8C,
  0x081CCDE9,
  0x081D4EDD,
  0x081CCEE1,
  0x081CCF07,
  0x081CCF87,
  0x081CD00A,
  0x081D4293,
  0x081CD079,
  0x081D4916,
  0x081D4B0F,
  0x081D4A0B
]

export default {
  version: "FIRERED/LEAFGREEN",
  rawBinArray: [],
  fileFilters: [
    { name: 'Gameboy Advance ROM', extensions: ['gba'] }
    ],
  generation: 3,
  moveAnimations: g3MoveAnimations,
  moveEffects: g3MoveEffects,
  evolveTypes: g3EvolveTypes,
  evolveStones: g3Stones,
  tradeItems: g3TradeItems,
  growthRates: g3GrowthRates,
  damageModifiers: gscDamageModifiers,
  trainerTypes: gsTrainerTypes,
  moveTargets: g3MoveTargets,
  abilities: g3Abilities,
  //these are limitations due to space.
  maxEvosMovesBytes: 8894,
  maxTrainerBytes: 17336,
  maxShopItems: 229,
  numHighCritMoves: 7,
  maxMoveDescriptionBytes: 23906, //This is the number of characters used in an unchanged Fire Red ROM
  trainerAIFlags: g3TrainerAIFlags,
  moveFlags: g3MoveFlags,
  defaultEvolution: {evolve: 1, param: 1, evolveTo: 1},
  loadData: thunk(async (actions, rawBinArray, {getStoreActions}) => {
    actions.loadPokemonData(rawBinArray).then((res) => { getStoreActions().setPokemonArray(res) });
    actions.loadPokemonTypes(rawBinArray).then((res) => { getStoreActions().setPokemonTypes(res) });
    actions.loadPokemonMoves(rawBinArray).then((res) => { getStoreActions().setMovesArray(res) });
    actions.loadMoveDescriptions(rawBinArray).then((res) => { getStoreActions().setMoveDescriptions(res) });
    actions.loadTMs(rawBinArray).then((res) => { getStoreActions().setTMs(res) });
    actions.loadItems(rawBinArray).then((res) => { getStoreActions().setItems(res) });
    actions.loadTypeMatchups(rawBinArray).then((res) => { getStoreActions().setTypeMatchups(res) });
    actions.loadEncounters(rawBinArray).then((res) => { getStoreActions().setEncounterZones(res) });
    actions.loadTrainers(rawBinArray).then((res) => { getStoreActions().setTrainers(res) });
    actions.loadShops(rawBinArray).then((res) => { getStoreActions().setShops(res) });
    actions.loadIgnoreNationalDex(rawBinArray).then((res) => { getStoreActions().setIgnoreNationalDex(res) });
    actions.loadUseNewEVMax(rawBinArray).then((res) => { getStoreActions().setUseNewEVMax(res) });
    actions.loadEVMult(rawBinArray).then((res) => { getStoreActions().setEVMult(res) });
    actions.loadNaturesData(rawBinArray).then((res) => { getStoreActions().setNatures(res) });
    actions.loadShinyData(rawBinArray).then((res) => { getStoreActions().setIncreaseShinyOdds(res) });
    actions.loadIVData(rawBinArray).then((res) => { getStoreActions().setMaximizeIVs(res) });
  }),
  loadPokemonData: thunk(async (actions, rawBinArray) => {
    let pokemon = [];
    let currentMovesPosition = pokemonMovesStart;
    let currentEvolutionsPosition = pokemonEvolutionsStart;
    for(let i = 0; i < 411; i++){
      var currentPokemon = {};
      currentPokemon.id = i;
      currentPokemon.hp = rawBinArray[pokemonStartByte + (i * 28) +1];
      currentPokemon.attack = rawBinArray[pokemonStartByte + (i * 28) +2];
      currentPokemon.defense = rawBinArray[pokemonStartByte + (i * 28) +3];
      currentPokemon.speed = rawBinArray[pokemonStartByte + (i * 28) +4];
      currentPokemon.specialAttack = rawBinArray[pokemonStartByte + (i * 28) +5];
      currentPokemon.specialDefense = rawBinArray[pokemonStartByte + (i * 28) +6];
      currentPokemon.totalStats = currentPokemon.hp + currentPokemon.attack + currentPokemon.defense + currentPokemon.speed + currentPokemon.specialAttack + currentPokemon.specialDefense;
      currentPokemon.type1 = rawBinArray[pokemonStartByte + (i * 28) +7];
      currentPokemon.type2 = rawBinArray[pokemonStartByte + (i * 28) +8];
      currentPokemon.catchRate = rawBinArray[pokemonStartByte + (i * 28) + 9];
      currentPokemon.expYield = rawBinArray[pokemonStartByte + (i * 28) + 10];

      let evYieldValue = rawBinArray[pokemonStartByte + (i * 28) + 11];
      currentPokemon.evYieldHP = evYieldValue & 0x03;
      currentPokemon.evYieldAttack = (evYieldValue >> 2) & 0x03;
      currentPokemon.evYieldDefense = (evYieldValue >> 4) & 0x03;
      currentPokemon.evYieldSpeed = (evYieldValue >> 6) & 0x03;
      evYieldValue = rawBinArray[pokemonStartByte + (i * 28) + 12];
      currentPokemon.evYieldSpecialAttack = evYieldValue & 0x03;
      currentPokemon.evYieldSpecialDefense = (evYieldValue >> 2) & 0x03;

      currentPokemon.growthRate = rawBinArray[pokemonStartByte + (i * 28) + 20];
      currentPokemon.ability1 = rawBinArray[pokemonStartByte + (i * 28) + 23];
      currentPokemon.ability2 = rawBinArray[pokemonStartByte + (i * 28) + 24];


      //*
      //the tm/hm data for each pokemon is stored as 8 bytes. Each bit is a true/false for the pokemon's compatibility with a tm/hm.
      //first we grab the 8 bytes in an array.
      let tmIntArray = [];
      tmIntArray.push(rawBinArray[pokemonTMStart + (i * 8) + 0]);
      tmIntArray.push(rawBinArray[pokemonTMStart + (i * 8) + 1]);
      tmIntArray.push(rawBinArray[pokemonTMStart + (i * 8) + 2]);
      tmIntArray.push(rawBinArray[pokemonTMStart + (i * 8) + 3]);
      tmIntArray.push(rawBinArray[pokemonTMStart + (i * 8) + 4]);
      tmIntArray.push(rawBinArray[pokemonTMStart + (i * 8) + 5]);
      tmIntArray.push(rawBinArray[pokemonTMStart + (i * 8) + 6]);
      tmIntArray.push(rawBinArray[pokemonTMStart + (i * 8) + 7]);

      let tmBoolArray = [];

      tmIntArray.forEach((tm) => {
        //this takes each byte and splits it into its base 2 equivalent padded with 0s so each string is 8 characters, then we reverse the string
        let bitArray = tm.toString(2).padStart(8, '0').split("").reverse().join("");
        //go through each character of the string, convert it to a boolean, and add it to our bool array.
        for(let i = 0; i < 8; i++){
          if(tmBoolArray.length < 58){
            tmBoolArray.push(Boolean(Number(bitArray[i])));
          }
        }
      });

      currentPokemon.tms = tmBoolArray;

      //*/
      currentPokemon.evolutions = [];
      currentPokemon.learnedMoves = [];

      //Evolutions.
      while(rawBinArray[currentEvolutionsPosition] !== 0)
      {
          let evo = {param: 1}; //initialize with some default values.
          evo.evolve = rawBinArray[currentEvolutionsPosition];
          currentEvolutionsPosition += 2;

          let evoParam = rawBinArray[currentEvolutionsPosition++];
          evoParam += rawBinArray[currentEvolutionsPosition++] * 256;

          evo.param = evoParam;

          let targetPokemon = rawBinArray[currentEvolutionsPosition++];
          targetPokemon += rawBinArray[currentEvolutionsPosition++] * 256;

          evo.evolveTo = targetPokemon-1;

          //console.log(evo);
          currentPokemon.evolutions.push(evo);
          currentEvolutionsPosition += 2;
      }
      currentEvolutionsPosition += (40 - (currentPokemon.evolutions.length*8));


      //Moves learned while leveling up. They are deliminated with 0xFFFF
      while ((rawBinArray[currentMovesPosition] !== 0xFF) || (rawBinArray[currentMovesPosition+1] !== 0xFF))
      {
          let moveToAdd = {};
          //the moves are stored in 2 bytes, little endian.
          // it is (level << 9 | move). We have to reverse the left shifting and ORing to get the values.
          let moveValue = rawBinArray[currentMovesPosition++];
          moveValue += rawBinArray[currentMovesPosition++] * 256;

          // right shift 9 to get the level
          moveToAdd.level = moveValue >> 9;
          // xor the left shifted level to get the move.
          moveToAdd.moveID = moveValue ^ (moveToAdd.level << 9);
          currentPokemon.learnedMoves.push(moveToAdd);
      }
      currentMovesPosition+=2;

      let pokemonName = "";

      //Each name is 11 bytes
      for (let j = 0; j < 11; j++) {
        //The end of a name is marked with FF
        if (rawBinArray[pokemonNameStartByte + (i * 11) + j] !== 0xFF){
            pokemonName += gen3Letters.get(rawBinArray[pokemonNameStartByte + (i * 11) + j]);
        }else{
          break;
        }
      }

      currentPokemon.name = pokemonName;
      pokemon.push(currentPokemon);
    }
    return pokemon;
  }),
  savePokemonData: thunk(async (actions, payload, {getStoreState}) => {
    let workingArray = getStoreState().rawBinArray;
    let currentMovesPosition = pokemonMovesStart;
    let currentPointerPosition = pokemonMovesPointers;
    let pokemon = getStoreState().pokemon;

    for (let i = 0; i < 411; i++) //There are 411 pokemon in the game
    {
      //basically just write all of the modify-able data back into its location in the binary array.
      workingArray[pokemonStartByte + (i * 28) + 1] = pokemon[i].hp;
      workingArray[pokemonStartByte + (i * 28) + 2] = pokemon[i].attack;
      workingArray[pokemonStartByte + (i * 28) + 3] = pokemon[i].defense;
      workingArray[pokemonStartByte + (i * 28) + 4] = pokemon[i].speed;
      workingArray[pokemonStartByte + (i * 28) + 5] = pokemon[i].specialAttack;
      workingArray[pokemonStartByte + (i * 28) + 6] = pokemon[i].specialDefense;
      workingArray[pokemonStartByte + (i * 28) + 7] = pokemon[i].type1;
      workingArray[pokemonStartByte + (i * 28) + 8] = pokemon[i].type2;
      workingArray[pokemonStartByte + (i * 28) + 9] = pokemon[i].catchRate;
      workingArray[pokemonStartByte + (i * 28) + 10] = pokemon[i].expYield;

      let evYieldValue = pokemon[i].evYieldHP | (pokemon[i].evYieldAttack << 2) |
      (pokemon[i].evYieldDefense << 4) | (pokemon[i].evYieldSpeed << 6)
      workingArray[pokemonStartByte + (i * 28) + 11] = evYieldValue;

      evYieldValue = pokemon[i].evYieldSpecialAttack | (pokemon[i].evYieldSpecialDefense << 2)
      workingArray[pokemonStartByte + (i * 28) + 12] = evYieldValue;

      workingArray[pokemonStartByte + (i * 28) + 20] = pokemon[i].growthRate;
      workingArray[pokemonStartByte + (i * 28) + 23] = pokemon[i].ability1;
      workingArray[pokemonStartByte + (i * 28) + 24] = pokemon[i].ability2;
      let tmArray = [];

      //*
      for(let j = 0; j < 8; j++){ //each byte
        let tmByte = 0;
        for(let b = 0; b < 8; b++){ //each bit
          if (pokemon[i].tms[(j * 8 + b)]){
            tmByte += Math.pow(2, b);
          }
        }
        tmArray.push(tmByte);
      }

      workingArray[pokemonTMStart + (i * 8) + 0] = tmArray[0];
      workingArray[pokemonTMStart + (i * 8) + 1] = tmArray[1];
      workingArray[pokemonTMStart + (i * 8) + 2] = tmArray[2];
      workingArray[pokemonTMStart + (i * 8) + 3] = tmArray[3];
      workingArray[pokemonTMStart + (i * 8) + 4] = tmArray[4];
      workingArray[pokemonTMStart + (i * 8) + 5] = tmArray[5];
      workingArray[pokemonTMStart + (i * 8) + 6] = tmArray[6];
      workingArray[pokemonTMStart + (i * 8) + 7] = tmArray[7];


      for(let e = 0; e < 5; e++){
        if(pokemon[i].evolutions[e] !== undefined){
          workingArray[pokemonEvolutionsStart + (i * 40) + (e * 8)] = pokemon[i].evolutions[e].evolve & 0xFF;
          workingArray[pokemonEvolutionsStart + (i * 40) + (e * 8) + 1] = pokemon[i].evolutions[e].evolve >> 8;
          workingArray[pokemonEvolutionsStart + (i * 40) + (e * 8) + 2] = pokemon[i].evolutions[e].param & 0xFF;
          workingArray[pokemonEvolutionsStart + (i * 40) + (e * 8) + 3] = pokemon[i].evolutions[e].param >> 8;
          workingArray[pokemonEvolutionsStart + (i * 40) + (e * 8) + 4] = (pokemon[i].evolutions[e].evolveTo + 1) & 0xFF;
          workingArray[pokemonEvolutionsStart + (i * 40) + (e * 8) + 5] = (pokemon[i].evolutions[e].evolveTo + 1) >> 8;
        }else{
          workingArray[pokemonEvolutionsStart + (i * 40) + (e * 8)] = 0x00;
          workingArray[pokemonEvolutionsStart + (i * 40) + (e * 8) + 1] = 0x00;
          workingArray[pokemonEvolutionsStart + (i * 40) + (e * 8) + 2] = 0x00;
          workingArray[pokemonEvolutionsStart + (i * 40) + (e * 8) + 3] = 0x00;
          workingArray[pokemonEvolutionsStart + (i * 40) + (e * 8) + 4] = 0x00;
          workingArray[pokemonEvolutionsStart + (i * 40) + (e * 8) + 5] = 0x00;
        }
      }

      //mark the current moves position as this pokemon's pointer
      workingArray[currentPointerPosition++] = currentMovesPosition & 0xFF;
      workingArray[currentPointerPosition++] = (currentMovesPosition >> 8) & 0xFF;
      workingArray[currentPointerPosition++] = (currentMovesPosition >> 16) & 0xFF;
      workingArray[currentPointerPosition++] = 0x08; //they always end with 0x08

      //save the pokemon's moves. Once they are all done we mark the end with 0xFFFF
      //*
      for(const m of pokemon[i].learnedMoves) {
        let moveValue = (m.level << 9) | m.moveID;
        workingArray[currentMovesPosition++] = moveValue & 0xFF;
        workingArray[currentMovesPosition++] = moveValue >> 8;
      }
      workingArray[currentMovesPosition++] = 0xFF;
      workingArray[currentMovesPosition++] = 0xFF;
      //*/
    }

  }),
  loadPokemonTypes: thunk (async (actions, rawBinArray) => {
    let types = [];
    let newType;
    let currentTypesByte = typesByte;
    let typeName;
    let typeIndex = 0;


    while (typeIndex < 18)
    {
      newType = {
        typeIsUsed: true
      };
      typeName = "";

      // read the name of each type
      while (rawBinArray[currentTypesByte] !== 0xFF) //0xFF is the deliminator for the end of a name.
      {
        if(rawBinArray[currentTypesByte] !== 0x00){
          typeName += gen3Letters.get(rawBinArray[currentTypesByte++]);
        }else{
          currentTypesByte++;
        }
      }
      currentTypesByte++;
      //console.log(typeName);

      newType.typeName = typeName;
      newType.typeIndex = typeIndex++;

      types.push(newType);
    }
    //console.log(types);
    return types;
  }),
  savePokemonTypes: thunk (async (actions, payload, {getStoreState}) => {
    //*
    let romData = getStoreState().rawBinArray;
    let pokemonTypes = getStoreState().pokemonTypes;
    let currentTypePosition = typesByte;

    pokemonTypes.forEach(pokeType => {
      pokeType.typeName.split("").forEach((c) => {
        romData[currentTypePosition++] = getKeyByValue(gen3Letters, c);
      });
      romData[currentTypePosition++] = 0xFF;
      for(let z = 0; z < (6 - pokeType.typeName.length); z++){
        romData[currentTypePosition++] = 0x00;
      }
    });
    //*/
  }),
  loadPokemonMoves: thunk (async (actions, rawBinArray) => {
    let moves = [];
    let currentMoveNameByte = moveNamesByte;
    let moveToAdd;
    let moveName;


    moveToAdd = {}; //uses 0x00 for blank starter move
    moveToAdd.id = 0;
    moveToAdd.name = "nothing";
    moveToAdd.power = 0;
    moveToAdd.accuracy = 0;
    moveToAdd.pp = 0;
    moves.push(moveToAdd);

    for (let i = 0; i < 354; i++) //354 because there are 354 moves in the game.
    {
      moveName = "";

      //Luckily the names for the moves are stored in the same order as the moves, just in a different spot in memory.
      while (rawBinArray[currentMoveNameByte] !== 0xFF){
        if(rawBinArray[currentMoveNameByte] !== 0x00 || moveName.length > 0){
          moveName += gen3Letters.get(rawBinArray[currentMoveNameByte]);
        }
        currentMoveNameByte++;
      }
      currentMoveNameByte++;

      moveToAdd = {};
      moveToAdd.id = i + 1;
      moveToAdd.name = moveName;
      //Each Move uses 12 bytes. i = the current move so we take the starting point and add 12 for each move
      // that we have already read and then add 0-11 as we read through the data fields for that move.
      moveToAdd.effect = rawBinArray[movesStartingByte + (i * 12)];
      moveToAdd.power = rawBinArray[movesStartingByte + (i * 12) + 1];
      moveToAdd.moveType = rawBinArray[movesStartingByte + (i * 12) + 2];
      moveToAdd.accuracy = rawBinArray[movesStartingByte + (i * 12) + 3];
      moveToAdd.pp = rawBinArray[movesStartingByte + (i * 12) + 4];
      moveToAdd.effectChance = rawBinArray[movesStartingByte + (i * 12) + 5];
      moveToAdd.target = rawBinArray[movesStartingByte + (i * 12) + 6];
      moveToAdd.priority = rawBinArray[movesStartingByte + (i * 12) + 7];
      moveToAdd.highCrit = false;
      let moveFlagsValue = rawBinArray[movesStartingByte + (i * 12) + 8];
      let moveFlagsBoolArray = [];
      for(let i = 0; i < g3MoveFlags.length; i++){
        let flag = (moveFlagsValue >> i) & 0x01;
        moveFlagsBoolArray.push(Boolean(flag));
      }
      moveToAdd.flags = moveFlagsBoolArray;

      let animationPointer = rawBinArray[moveAnimationsStart + i*4];
      animationPointer += rawBinArray[moveAnimationsStart + i*4 + 1] * 0x100;
      animationPointer += rawBinArray[moveAnimationsStart + i*4 + 2] * 0x10000;
      animationPointer += rawBinArray[moveAnimationsStart + i*4 + 3] * 0x1000000;

      moveToAdd.animationID = animationPointers.indexOf(animationPointer);

      moves.push(moveToAdd);
    }

    return moves;
  }),
  savePokemonMoves: thunk (async (actions, payload, {getStoreState}) => {
    let currentMoveNameByte = moveNamesByte;
    let currentAnimationPosition = moveAnimationsStart;
    let romData = getStoreState().rawBinArray;
    let moves = getStoreState().moves;

    for(let i = 0; i < 354; i++)
    {
      romData[movesStartingByte + (i * 12)] = moves[i + 1].effect;
      romData[movesStartingByte + (i * 12) + 1] = moves[i + 1].power;
      romData[movesStartingByte + (i * 12) + 2] = moves[i + 1].moveType;
      romData[movesStartingByte + (i * 12) + 3] = moves[i + 1].accuracy;
      romData[movesStartingByte + (i * 12) + 4] = moves[i + 1].pp;
      romData[movesStartingByte + (i * 12) + 5] = moves[i + 1].effectChance;
      romData[movesStartingByte + (i * 12) + 6] = moves[i + 1].target;
      romData[movesStartingByte + (i * 12) + 7] = moves[i + 1].priority;

      let flagsValue = 0;
      for(let f = 0; f < moves[i + 1].flags.length; f++){
        flagsValue += Number(moves[i + 1].flags[f]) << f;
      }
      romData[movesStartingByte + (i * 12) + 8] = flagsValue;

      //the the value we save is a pointer to the function that performs the move's animation.
      let animationValue = animationPointers[moves[i + 1].animationID];
      romData[currentAnimationPosition++] = animationValue & 0xFF;
      romData[currentAnimationPosition++] = (animationValue >> 8) & 0xFF;
      romData[currentAnimationPosition++] = (animationValue >> 16) & 0xFF;
      currentAnimationPosition++; // skip the last byte because it is always 08;

      for(const c of moves[i + 1].name.split("")){
        romData[currentMoveNameByte++] = getKeyByValue(gen3Letters, c);
      }
      romData[currentMoveNameByte++] = 0xFF;
      for(let z = 0; z < (12 - moves[i + 1].name.length); z++){
        romData[currentMoveNameByte++] = 0x00;
      }

    }

  }),
  loadMoveDescriptions: thunk (async (actions, rawBinArray) => {
    let descriptions = [];
    let currentMoveDescByte = moveDescStartByte;
    let moveDesc;

    moveDesc = {};
    moveDesc.id = 0;
    moveDesc.text = "not an actual move";

    descriptions.push(moveDesc);

    for (let i = 0; i < 354; i++) //There are 354 moves in the game
    {
        let descText = "";

        while (rawBinArray[currentMoveDescByte] !== 0xFF) //0xFF is the deliminator for the end of a description.
        {
          if(gen3Letters.get(rawBinArray[currentMoveDescByte]) === undefined){
            console.log(`Add character for value: ${rawBinArray[currentMoveDescByte++]}`);
          }
          descText += gen3Letters.get(rawBinArray[currentMoveDescByte++]);
        }
        currentMoveDescByte++;

        moveDesc = {};
        moveDesc.id = i+1; // +1 because an extra move was added.
        moveDesc.text = descText;

        descriptions.push(moveDesc);
    }

    return descriptions;
  }),
  saveMoveDescriptions: thunk (async (actions, payload, {getStoreState}) => {
    let currentMoveDescByte = moveDescStartByte;
    let romData = getStoreState().rawBinArray;
    let moveDescriptions = getStoreState().moveDescriptions;
    let currentPointerByte = moveDescPointers;

    for(let i = 0; i < 354; i++)
    {
      // write the pointer to the desc first.
      romData[currentPointerByte++] = currentMoveDescByte & 0xFF;
      romData[currentPointerByte++] = (currentMoveDescByte >> 8 ) & 0xFF;
      romData[currentPointerByte++] = (currentMoveDescByte >> 16 ) & 0xFF;
      currentPointerByte++; //skip the last byte because it is always 0x08

      // +1 is being used because an extra move is added to the moves array during the load process. We are skipping that here.
      for(const c of moveDescriptions[i+1].text.split("")){
        romData[currentMoveDescByte++] = getKeyByValue(gen3Letters, c);
      }

      romData[currentMoveDescByte++] = 0xFF;
    }
  }),
  loadTMs: thunk (async (actions, rawBinArray) => {

    let tms = [];

    for (let i = 0; i < 58; i++) //There are 50 TMs and 8 HMs. Each is 2 bytes which is the moveID
    {
        let newTM = {};

        newTM.move = rawBinArray[tmStart + i*2];
        newTM.move += rawBinArray[tmStart + i*2 + 1] * 256;
        if (i < 50)
        {
            newTM.name = `TM${i + 1}`;
        }
        else
        {
            newTM.name = `HM${i - 49}`;
        }
        tms.push(newTM);
    }

    //console.log(tms);
    return tms;
  }),
  saveTMs: thunk (async (actions, payload, {getStoreState}) => {
    let romData = getStoreState().rawBinArray;
    let tms = getStoreState().tms;

    for (let i = 0; i < 58; i++) //There are 50 TMs and 7 HMs. Each is 2 bytes which is the moveID
    {
      romData[tmStart + i*2] = tms[i].move & 0xFF;
      romData[tmStart + (i*2) + 1] = tms[i].move >> 8;
    }
  }),
  loadItems: thunk (async (actions, rawBinArray) => {
    let items = [];

    for(let i = 0; i < 375; i++){
      let newItem = {};

      //The price is stored in 2 bytes little endian.
      newItem.price = (rawBinArray[itemPropertiesStart + i*44 + 17] * 256) + rawBinArray[itemPropertiesStart + i*44 + 16];
      newItem.importance = rawBinArray[itemPropertiesStart + i*44 + 24]

      let itemName = "";
      let currentPosition = itemPropertiesStart + i*44;
      while(rawBinArray[currentPosition] !== 0xFF){
        itemName += gen3Letters.get(rawBinArray[currentPosition++]);
      }
      newItem.name = itemName;

      items.push(newItem);
    }
    //console.log(items);
    return items;
  }),
  saveItems: thunk (async (actions, payload, {getStoreState}) => {
    let romData = getStoreState().rawBinArray;
    let items = getStoreState().items;

    for(let i = 0; i < 375; i++){
      romData[itemPropertiesStart + i*44 + 16] = items[i].price & 0xFF;
      romData[itemPropertiesStart + i*44 + 17] = items[i].price >> 8;
      romData[itemPropertiesStart + i*44 + 24] = items[i].importance;
    }

  }),
  loadTypeMatchups: thunk (async (action, rawBinArray) => {
    let typeMatchups = [];
    let currentByte = typeChartByte;
    let foresightTypes = false;

    while(rawBinArray[currentByte] !== 0xFF)
    {
      // The type matchups are split into 2 groups. The first group ends with FE.
      // The 2nd group is the ghost immunes that are cancelled by using the Foresight move.
      if(rawBinArray[currentByte] === 0xFE){
        currentByte += 3;
        foresightTypes = true;
      }
      else{
        let typeMatchupToAdd = {};
        typeMatchupToAdd.attackType = rawBinArray[currentByte++]; //first byte is the attacking type
        typeMatchupToAdd.defenseType = rawBinArray[currentByte++]; //second byte is the defending type
        typeMatchupToAdd.effectiveness = rawBinArray[currentByte++]; //third byte is effectiveness X 10. So double damage = 20, half damage = 5.
        typeMatchupToAdd.foresight = foresightTypes;
        typeMatchups.push(typeMatchupToAdd);
      }
    }

    //console.log(typeMatchups);
    return typeMatchups;
  }),
  saveTypeMatchups: thunk (async (actions, payload, {getStoreState}) => {
    let romData = getStoreState().rawBinArray;
    let typeMatchups = getStoreState().typeMatchups;
    let currentByte = typeChartByte;

    let foresightCount = 1;
    for(let m = 0; m < typeMatchups.length; m++){
      if (typeMatchups[m].foresight === true){
        foresightCount++;
      }
    }

    //make sure the matchups that foresight affect are saved last.
    typeMatchups.sort((a,b) => {
      if(a.foresight=== true && b.foresight === false){
        return 1;
      }else if(a.foresight === false && b.foresight === true){
        return -1;
      }else{
        return 0;
      }
    });

    for(let i = 0; i < typeMatchups.length; i++){
      romData[currentByte++] = typeMatchups[i].attackType;
      romData[currentByte++] = typeMatchups[i].defenseType;
      romData[currentByte++] = typeMatchups[i].effectiveness;
      if(i === typeMatchups.length-foresightCount){
        romData[currentByte++] = 0xFE; //0xFE separates the last 2 type matchups. Originally they are the ghost immunes that are removed by foresight.
        romData[currentByte++] = 0xFE;
        romData[currentByte++] = 0x00;
      }
    }
    romData[currentByte++] = 0xFF; //writing the ending byte manually in case the user removed some type strengths.
    romData[currentByte++] = 0xFF;
    romData[currentByte++] = 0x00;

  }),
  loadEncounters: thunk (async (action, rawBinArray) => {
    let zones = [];

    let currentPosition = wildEncountersStart;

    const rockSmashZones = [24,25,26,28,40,42,44,45,46,47,48,49,70,85];
    const waterZones = [11,20,21,22,23,24,26,32,33,50,51,54,70,71,72,73,75,76,77,78,79,80,81,82,83,86,90,
                        92,96,97,98,99,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,
                        120,121,122];
    const noLandZones = [11,75,76,79,80,83,86,105,106,113,114,115,116,117,118,119,120,121,122,123];

    // 132 maps/zones
    for(let z = 0; z < 132; z++)
    {

      //It's important to keep the order of the 4 if statements below unless a
      // way of checking the zones is changed to a way that looks at each map.

      // no land zones contain the zones that don't have land pokemon.
      // it's easier to find zones that don't have land than those that do.
      // Land in this context includes tall grass and walking in caves.
      if(!noLandZones.includes(z))
      {
        let newZone = {};

        newZone.name =  `${g3ZoneNames[z]} land`;
        newZone.encounters = [];

        for(let i = 0; i < 12; i++){
          let encounter = {};
          encounter.minLevel = rawBinArray[currentPosition++];
          encounter.maxLevel = rawBinArray[currentPosition++];
          let pokeValue = rawBinArray[currentPosition++];
          pokeValue += rawBinArray[currentPosition++] * 256;

          encounter.pokemon = pokeValue - 1;
          encounter.chance = g3GrassEncChances[i];
          newZone.encounters.push(encounter);
        }
        newZone.encounterRate = rawBinArray[currentPosition++];
        currentPosition += 7; //encounter rates use 3 extra bytes. The next 4 bytes are a pointer to the previous data.

        zones.push(newZone);
      }

      // See if the current zone is included in the list of zones with water.
      if(waterZones.includes(z))
      {
        let newZone = {};

        newZone.name =  `${g3ZoneNames[z]} water`;
        newZone.encounters = [];

        for(let i = 0; i < 5; i++){
          let encounter = {};
          encounter.minLevel = rawBinArray[currentPosition++];
          encounter.maxLevel = rawBinArray[currentPosition++];
          let pokeValue = rawBinArray[currentPosition++];
          pokeValue += rawBinArray[currentPosition++] * 256;

          encounter.pokemon = pokeValue - 1;
          encounter.chance = g3WaterEncChances[i];
          newZone.encounters.push(encounter);
        }
        newZone.encounterRate = rawBinArray[currentPosition++];
        currentPosition += 7; //encounter rates use 3 extra bytes. The next 4 bytes are a pointer to the previous data.

        zones.push(newZone);
      }

      // See if the current zone is included in the list of zones with rocks to smash.
      if(rockSmashZones.includes(z))
      {
        let newZone = {};

        newZone.name =  `${g3ZoneNames[z]} rocks`;
        newZone.encounters = [];

        for(let i = 0; i < 5; i++){
          let encounter = {};
          encounter.minLevel = rawBinArray[currentPosition++];
          encounter.maxLevel = rawBinArray[currentPosition++];
          let pokeValue = rawBinArray[currentPosition++];
          pokeValue += rawBinArray[currentPosition++] * 256;

          encounter.pokemon = pokeValue - 1;
          encounter.chance = g3WaterEncChances[i]; // rocksmash uses the same enc chances as water
          newZone.encounters.push(encounter);
        }
        newZone.encounterRate = rawBinArray[currentPosition++];
        currentPosition += 7; //encounter rates use 3 extra bytes. The next 4 bytes are a pointer to the previous data.

        zones.push(newZone);
      }

      // See if the current zone is included in the list of zones with water.
      if(waterZones.includes(z))
      {
        let newZone = {};

        newZone.name =  `${g3ZoneNames[z]} fishing`;
        newZone.encounters = [];

        for(let i = 0; i < 10; i++){
          let encounter = {};
          encounter.minLevel = rawBinArray[currentPosition++];
          encounter.maxLevel = rawBinArray[currentPosition++];
          let pokeValue = rawBinArray[currentPosition++];
          pokeValue += rawBinArray[currentPosition++] * 256;

          encounter.pokemon = pokeValue - 1;
          encounter.chance = g3FishingEncChances[i];
          newZone.encounters.push(encounter);
        }
        newZone.encounterRate = rawBinArray[currentPosition++];
        currentPosition += 7; //encounter rates use 3 extra bytes. The next 4 bytes are a pointer to the previous data.

        zones.push(newZone);
      }

    }

    //console.log(zones);
    return zones;
  }),
  saveEncounters: thunk (async (actions, payload, {getStoreState}) => {
    let romData = getStoreState().rawBinArray;
    let zones = getStoreState().encounterZones;
    let currentPosition = wildEncountersStart

    zones.forEach(zone => {
      zone.encounters.forEach(enc => {
        romData[currentPosition++] = enc.minLevel;
        romData[currentPosition++] = enc.maxLevel;

        romData[currentPosition++] = enc.pokemon + 1;
        romData[currentPosition++] = (enc.pokemon + 1) >> 8;
      });
      romData[currentPosition++] = zone.encounterRate;
      currentPosition += 7;
    });
  }),
  loadTrainers: thunk (async (action, rawBinArray) => {
    let trainers = [];
    let trainerClasses = [];
    let currentClassPosition = trainerClassesStart;

    for(let i = 0; i < 107; i++){
      let trainerClassName = "";
      while(rawBinArray[currentClassPosition] !== 0xFF){
        if(rawBinArray[currentClassPosition] !== 0x00 || trainerClassName.length > 0){
          trainerClassName += gen3Letters.get(rawBinArray[currentClassPosition++]);
        }else{
          currentClassPosition++;
        }
      }
      trainerClasses.push(trainerClassName);
      currentClassPosition++;
    }

    for(let t = 0; t < 743; t++){
      let newTrainer = {};
      newTrainer.id = t;

      //this value determines if the trainers pokemon hold items and/or have custom movesets.
      newTrainer.type = rawBinArray[trainerDataStart + t*40 + 0];

      let trainerName = "";
      trainerName += trainerClasses[rawBinArray[trainerDataStart + t*40 + 1]];

      let uniqueName = "";
      let currentNamePosition = trainerDataStart + t*40 + 4;
      //reads the name. The ending is marked with 0xFF
      while(rawBinArray[currentNamePosition] !== 0xFF){
        uniqueName += gen3Letters.get(rawBinArray[currentNamePosition++]);
      }
      trainerName += " " + uniqueName;
      newTrainer.name = trainerName;
      newTrainer.uniqueName = uniqueName; //need to keep track of this for the saving process.
      //this is a true/false for double battle
      newTrainer.doubleBattle = Boolean(rawBinArray[trainerDataStart + t*40 + 24]);

      let aiFlagsValue = rawBinArray[trainerDataStart + t*40 + 28];
      let aiFlagsBoolArray = [];
      for(let i = 0; i < g3TrainerAIFlags.length; i++){
        let flag = (aiFlagsValue >> i) & 0x01;
        aiFlagsBoolArray.push(Boolean(flag));
      }
      newTrainer.aiFlags = aiFlagsBoolArray;

      let numOfPokemon = rawBinArray[trainerDataStart + t*40 + 32];

      //get the starting point for the trainer's pokemon
      let pokemonPointer = rawBinArray[trainerDataStart + t*40 + 36];
      pokemonPointer += rawBinArray[trainerDataStart + t*40 + 37] * 256;
      pokemonPointer += rawBinArray[trainerDataStart + t*40 + 38] * 65536;

      let currentPokemonPosition = pokemonPointer;
      newTrainer.pokemon = [];
      //The trainer data tells us how many pokemon to load.
      for(let p = 0; p < numOfPokemon; p++){
        let newPokemon = {};

        newPokemon.ivs = rawBinArray[currentPokemonPosition++];
        currentPokemonPosition++;

        newPokemon.level = rawBinArray[currentPokemonPosition++];
        currentPokemonPosition++;

        newPokemon.pokemon = rawBinArray[currentPokemonPosition++]-1; // -1 because the pokemon array is 0 based. We will add 1 when saving.
        newPokemon.pokemon += rawBinArray[currentPokemonPosition++] * 256;

        //if the trainer type is 2 or 3 the next 2 bytes are the pokemon's item
        if(newTrainer.type === 2 || newTrainer.type === 3){
          newPokemon.item = rawBinArray[currentPokemonPosition++];
          newPokemon.item += rawBinArray[currentPokemonPosition++] * 256;
        }else{ // setting default value in case the user switches the trainer's type to one that uses items.
          newPokemon.item = 0;
        }

        //if the trainer type is 1 or 3 the next 8 bytes will be the pokemon's moves.
        if(newTrainer.type === 1 || newTrainer.type === 3){
          newPokemon.move1 = rawBinArray[currentPokemonPosition++];
          newPokemon.move1 += rawBinArray[currentPokemonPosition++] * 256;
          newPokemon.move2 = rawBinArray[currentPokemonPosition++];
          newPokemon.move2 += rawBinArray[currentPokemonPosition++] * 256;
          newPokemon.move3 = rawBinArray[currentPokemonPosition++];
          newPokemon.move3 += rawBinArray[currentPokemonPosition++] * 256;
          newPokemon.move4 = rawBinArray[currentPokemonPosition++];
          newPokemon.move4 += rawBinArray[currentPokemonPosition++] * 256;
        }else{ // setting some default values in case the user switches the trainer's type to one that uses moves.
          newPokemon.move1 = 0;
          newPokemon.move2 = 0;
          newPokemon.move3 = 0;
          newPokemon.move4 = 0;
        }

        if(newTrainer.type === 0 || newTrainer.type === 1){
          currentPokemonPosition += 2;
        }
        newTrainer.pokemon.push(newPokemon);
      }

      trainers.push(newTrainer);
    }

    //console.log(trainers);
    return trainers;
  }),
  saveTrainers: thunk (async (action, payload, {getStoreState}) => {
    let romData = getStoreState().rawBinArray;
    let trainers = getStoreState().trainers.sort((a,b) => a.id < b.id ? -1 : 1); // sort the trainers by ID so they get saved in the correct order.

    let currentPosition = trainerPokemonStart;

    for(let i = 0; i < trainers.length; i++){

      //party flags
      romData[trainerDataStart + (i * 40)] = trainers[i].type;
      //double battle.
      romData[trainerDataStart + (i * 40) + 24] = trainers[i].doubleBattle;

      let aiFlagsValue = 0;
      for(let f = 0; f < trainers[i].aiFlags.length; f++){
        aiFlagsValue += Number(trainers[i].aiFlags[f]) << f;
      }
      romData[trainerDataStart + (i * 40) + 28] = aiFlagsValue;

      //number of pokemon
      romData[trainerDataStart + (i * 40) + 32] = trainers[i].pokemon.length;
      //pointer to the trainer's pokemon.
      romData[trainerDataStart + (i * 40) + 36] = currentPosition & 0xFF;
      romData[trainerDataStart + (i * 40) + 37] = (currentPosition >> 8) & 0xFF;
      romData[trainerDataStart + (i * 40) + 38] = (currentPosition >> 16) & 0xFF;
      //The last byte of the pointer is always 0x08 so I don't bother changing it.

      for(const poke of trainers[i].pokemon){
        romData[currentPosition++] = poke.ivs;
        currentPosition++;
        romData[currentPosition++] = poke.level;
        currentPosition++;
        romData[currentPosition++] = (poke.pokemon + 1) & 0xFF;
        romData[currentPosition++] = (poke.pokemon + 1) >> 8;

        //if the type is 2 or 3 the next byte is the pokemon's item
        if(trainers[i].type === 2 || trainers[i].type === 3){
          romData[currentPosition++] = poke.item & 0xFF;
          romData[currentPosition++] = poke.item >> 8;
        }

        //if the type is 1 or 3 the next 8 bytes will be the pokemon's moves.
        if(trainers[i].type === 1 || trainers[i].type === 3){
          romData[currentPosition++] = poke.move1 & 0xFF;
          romData[currentPosition++] = poke.move1 >> 8;
          romData[currentPosition++] = poke.move2 & 0xFF;
          romData[currentPosition++] = poke.move2 >> 8;
          romData[currentPosition++] = poke.move3 & 0xFF;
          romData[currentPosition++] = poke.move3 >> 8;
          romData[currentPosition++] = poke.move4 & 0xFF;
          romData[currentPosition++] = poke.move4 >> 8;
        }

        //for type 0 or 1 there is 2 bytes of 0s for padding.
        if(trainers[i].type === 0 || trainers[i].type === 1){
          romData[currentPosition++] = 0x00;
          romData[currentPosition++] = 0x00;
        }
      }
    };

  }),
  loadShops: thunk (async (action, rawBinArray) => {
    let shops = [];

    shopsStarts.forEach(s => {
      let newShop = {};
      newShop.name = s.shopName;
      let currentItemPosition = s.pointer;
      newShop.items = [];
      while(rawBinArray[currentItemPosition] !== 0x00 || rawBinArray[currentItemPosition + 1] !== 0x00) //the end of the shop is marked by 0x0000
      {
        let newItem = rawBinArray[currentItemPosition++];
        newItem += rawBinArray[currentItemPosition++] * 256;
        newShop.items.push({item: newItem });
      }
      shops.push(newShop);
    });

    return shops;
  }),
  saveShops: thunk (async (actions, payload, {getStoreState}) => {
    let romData = getStoreState().rawBinArray;
    let shops = getStoreState().shops;

    for (let i = 0; i < shopsStarts.length; i++)
    {
      let currentPosition = shopsStarts[i].pointer;

      shops[i].items.forEach(item => {
        romData[currentPosition++] = item.item & 0xFF;
        romData[currentPosition++] = item.item >> 8;
      });

      romData[currentPosition++] = 0x00; //mark end of shop
      romData[currentPosition++] = 0x00; //mark end of shop
    }
  }),
  loadIgnoreNationalDex: thunk (async (action, rawBinArray) => {
    let ignoreNationalDex = false;

    ignoreNationalDex = !(
      rawBinArray[0xCE92E] === 0x97 &&
      rawBinArray[0xCE931] === 0xDD &&
      rawBinArray[0x126CC2] === 0x97 &&
      rawBinArray[0x126CC5] === 0xD9
    )

    return ignoreNationalDex;
  }),
  saveIgnoreNationalDex: thunk (async (actions, payload, {getStoreState}) => {
    let romData = getStoreState().rawBinArray;
    let ignoreNationalDex = getStoreState().ignoreNationalDex;

    if(ignoreNationalDex){
      romData[0xCE92E] = 0x00;
      romData[0xCE931] = 0xDA;
      romData[0x126CC2] = 0x00;
      romData[0x126CC5] = 0xD8;
    }else{
      romData[0xCE92E] = 0x97;
      romData[0xCE931] = 0xDD;
      romData[0x126CC2] = 0x97;
      romData[0x126CC5] = 0xD9;
    }
  }),
  loadUseNewEVMax: thunk (async (action, rawBinArray) => {
    let useNewEVMax = false;

    useNewEVMax = !(
      rawBinArray[0x3E076] === 0xFF &&
      rawBinArray[0x3E078] === 0x40 &&
      rawBinArray[0x439F2] === 0xFF &&
      rawBinArray[0x439F4] === 0x40 &&
      rawBinArray[0x43A50] === 0xFD &&
      rawBinArray[0x43A51] === 0x01 &&
      rawBinArray[0x43A10] === 0xFF &&
      rawBinArray[0x43A16] === 0xFF
    )

    return useNewEVMax;
  }),
  loadEVMult: thunk (async (action, rawBinArray) => {
    let evMult = 0;

    evMult = rawBinArray[0x438E6];
    return evMult;
  }),
  saveEVData: thunk (async (actions, payload, {getStoreState}) => {
    let romData = getStoreState().rawBinArray;
    let useNewEVMax = getStoreState().useNewEVMax;
    let evMult = getStoreState().evMult;

    if(useNewEVMax){
      romData[0x3E076] = 0xBD
      romData[0x3E078] = 0xC0
      romData[0x439F2] = 0xBD
      romData[0x439F4] = 0xC0
      romData[0x43A50] = 0xE7
      romData[0x43A51] = 0x05
      romData[0x43A10] = 0xFC
      romData[0x43A16] = 0xFC
    }else{
      romData[0x3E076] = 0xFF
      romData[0x3E078] = 0x40
      romData[0x439F2] = 0xFF
      romData[0x439F4] = 0x40
      romData[0x43A50] = 0xFD
      romData[0x43A51] = 0x01
      romData[0x43A10] = 0xFF
      romData[0x43A16] = 0xFF
    }

    romData[0x438E6] = evMult;
  }),
  loadNaturesData: thunk (async (action, rawBinArray) => {
    let natures = [];
    let natureNames = ["Hardy", "Lonely", "Brave", "Adamant", "Naughty", "Bold", "Docile", "Relaxed", "Impish", "Lax", "Timid", "Hasty", "Serious", "Jolly", "Naive", "Modest",
                        "Mild", "Quiet", "Bashful", "Rash", "Calm", "Gentle", "Sassy", "Careful", "Quirky"];

    for(let i = 0; i < 25; i++){
      let newNature = {name: natureNames[i]}
      newNature.attack = rawBinArray[naturesStart + i*5];
      newNature.defense = rawBinArray[naturesStart + i*5 + 1];
      newNature.speed = rawBinArray[naturesStart + i*5 + 2];
      newNature.specialAttack = rawBinArray[naturesStart + i*5 + 3];
      newNature.specialDefense = rawBinArray[naturesStart + i*5 + 4];
      natures.push(newNature);
    }

    return natures;
  }),
  saveNaturesData: thunk (async (actions, payload, {getStoreState}) => {
    let romData = getStoreState().rawBinArray;
    let natures = getStoreState().natures;

    for(let i = 0; i < 25; i++){
      romData[naturesStart + i*5] = natures[i].attack;
      romData[naturesStart + i*5 + 1] = natures[i].defense;
      romData[naturesStart + i*5 + 2] = natures[i].speed;
      romData[naturesStart + i*5 + 3] = natures[i].specialAttack;
      romData[naturesStart + i*5 + 4] = natures[i].specialDefense;
    }
  }),
  loadShinyData: thunk (async (action, rawBinArray) => {
    let valuesUnchanged = true;

    if(
      //load the palette.
      rawBinArray[0x4410A] === 0x13 &&
      rawBinArray[0x4410E] === 0x04 &&
      rawBinArray[0x44110] === 0x25 &&
      rawBinArray[0x44116] === 0x84 &&
      rawBinArray[0x44124] === 0x08 &&
      rawBinArray[0x44127] === 0x4A &&
      rawBinArray[0x44128] === 0x11 &&
      rawBinArray[0x4412A] === 0x48 &&
      rawBinArray[0x4412C] === 0x19 &&
      rawBinArray[0x4412E] === 0x48 &&
      rawBinArray[0x44130] === 0x13 &&
      rawBinArray[0x44131] === 0x40 &&
      rawBinArray[0x44132] === 0x58 &&
      rawBinArray[0x44134] === 0x07 &&
      rawBinArray[0x44135] === 0x28 &&
      rawBinArray[0x4413A] === 0xE1 &&
      //is mon shiny?
      rawBinArray[0x444B4] === 0x02 &&
      rawBinArray[0x444B7] === 0x4B &&
      rawBinArray[0x444B8] === 0x18 &&
      rawBinArray[0x444BA] === 0x42 &&
      rawBinArray[0x444BC] === 0x08 &&
      rawBinArray[0x444BE] === 0x42 &&
      rawBinArray[0x444C0] === 0x19 &&
      rawBinArray[0x444C1] === 0x40 &&
      rawBinArray[0x444C2] === 0x4A &&
      rawBinArray[0x444C4] === 0x07 &&
      rawBinArray[0x444C5] === 0x2A &&
      //battle animation shiny
      rawBinArray[0xF17EA] === 0x3C &&
      rawBinArray[0xF17EB] === 0x40 &&
      rawBinArray[0xF17EC] === 0x60 &&
      rawBinArray[0xF17EE] === 0x07
    ){
      valuesUnchanged = true;
    }else{
      valuesUnchanged = false;
    }

    return !valuesUnchanged;
  }),
  saveShinyData: thunk (async (actions, payload, {getStoreState}) => {
    let romData = getStoreState().rawBinArray;
    let increaseShinyOdds = getStoreState().increaseShinyOdds;

    if(increaseShinyOdds){
      //load the palette.
      romData[0x4410A] = 0x0C;
      romData[0x4410E] = 0x03;
      romData[0x44110] = 0x1D;
      romData[0x44116] = 0x83;
      romData[0x44124] = 0x21;
      romData[0x44127] = 0x48;
      romData[0x44128] = 0x20;
      romData[0x4412A] = 0x41;
      romData[0x4412C] = 0x10;
      romData[0x4412E] = 0x41;
      romData[0x44130] = 0xFF;
      romData[0x44131] = 0x20;
      romData[0x44132] = 0x01;
      romData[0x44134] = 0x7F; // this is the number being compared.
      romData[0x44135] = 0x29;
      romData[0x4413A] = 0xD9;
      //is mon shiny?
      romData[0x444B4] = 0x03;
      romData[0x444B7] = 0x4A;
      romData[0x444B8] = 0x02;
      romData[0x444BA] = 0x53;
      romData[0x444BC] = 0x09;
      romData[0x444BE] = 0x4B;
      romData[0x444C0] = 0xFF;
      romData[0x444C1] = 0x20;
      romData[0x444C2] = 0x03;
      romData[0x444C4] = 0x7F; // this is the number being compared
      romData[0x444C5] = 0x2B;
      //battle animation shiny
      romData[0xF17EA] = 0xFF;
      romData[0xF17EB] = 0x21;
      romData[0xF17EC] = 0x08;
      romData[0xF17EE] = 0x7F; // this is the number being compared
    }else{
      //load the palette.
      romData[0x4410A] = 0x13;
      romData[0x4410E] = 0x04;
      romData[0x44110] = 0x25;
      romData[0x44116] = 0x84;
      romData[0x44124] = 0x08;
      romData[0x44127] = 0x4A;
      romData[0x44128] = 0x11;
      romData[0x4412A] = 0x48;
      romData[0x4412C] = 0x19;
      romData[0x4412E] = 0x48;
      romData[0x44130] = 0x13;
      romData[0x44131] = 0x40;
      romData[0x44132] = 0x58;
      romData[0x44134] = 0x07;
      romData[0x44135] = 0x28;
      romData[0x4413A] = 0xE1;
      //is mon shiny?
      romData[0x444B4] = 0x02;
      romData[0x444B7] = 0x4B;
      romData[0x444B8] = 0x18;
      romData[0x444BA] = 0x42;
      romData[0x444BC] = 0x08;
      romData[0x444BE] = 0x42;
      romData[0x444C0] = 0x19;
      romData[0x444C1] = 0x40;
      romData[0x444C2] = 0x4A;
      romData[0x444C4] = 0x07;
      romData[0x444C5] = 0x2A;
      //battle animation shiny
      romData[0xF17EA] = 0x3C;
      romData[0xF17EB] = 0x40;
      romData[0xF17EC] = 0x60;
      romData[0xF17EE] = 0x07;
    }


  }),
  loadIVData: thunk (async (action, rawBinArray) => {
    let maximizeIVs = false;

    if(
      rawBinArray[0x3DCF3] === 0x43 &&
      rawBinArray[0x3DD09] === 0x43 &&
      rawBinArray[0x3DD1F] === 0x43 &&
      rawBinArray[0x3DD3B] === 0x43 &&
      rawBinArray[0x3DD4B] === 0x43 &&
      rawBinArray[0x3DD5D] === 0x43
    ){
      maximizeIVs = true;
    }

    return maximizeIVs;
  }),
  saveIVData: thunk (async (actions, payload, {getStoreState}) => {
    let romData = getStoreState().rawBinArray;
    let maximizeIVs = getStoreState().maximizeIVs;

    if(maximizeIVs){
      romData[0x3DCF3] = 0x43;
      romData[0x3DD09] = 0x43;
      romData[0x3DD1F] = 0x43;
      romData[0x3DD3B] = 0x43;
      romData[0x3DD4B] = 0x43;
      romData[0x3DD5D] = 0x43;
    }else{
      romData[0x3DCF3] = 0x40;
      romData[0x3DD09] = 0x40;
      romData[0x3DD1F] = 0x40;
      romData[0x3DD3B] = 0x40;
      romData[0x3DD4B] = 0x40;
      romData[0x3DD5D] = 0x40;
    }

  }),
  getChanges: thunk (async (actions, originalROM, {getStoreState}) => {
    let changes = ""

    let originalPokemon = []
    await actions.loadPokemonData(originalROM).then((res) => { originalPokemon = res });
    const updatedPokemon = getStoreState().pokemon;
    for (let i = 0; i < 411; i++) //There are 411 pokemon in the game
    {
      //console.log(originalPokemon[i]);
      //console.log(updatedPokemon[i]);
      if(!isEqual(originalPokemon[i], updatedPokemon[i])){
        changes += `---Changes for ${originalPokemon[i].name}---\n`;
        //let properties = Object.getOwnPropertyNames(originalPokemon[i]);
        let properties = ['hp', 'attack', 'defense', 'speed', 'specialAttack', 'specialDefense', 'totalStats', 'catchRate', 'expYield',
        'evYieldHP', 'evYieldAttack', 'evYieldDefense', 'evYieldSpeed', 'evYieldSpecialAttack', 'evYieldSpecialDefense'];

        for(const prop of properties){
          if(originalPokemon[i][prop] !== updatedPokemon[i][prop]){
            changes += `${prop} changed. ${originalPokemon[i][prop]} --> ${updatedPokemon[i][prop]}\n`;
          }
        }
        changes += `------------------`;

        /*
        if(originalPokemon[i].attack !== updatedPokemon[i].attack){
          changes += `Attack changed to ${updatedPokemon[i].attack}. Original value: ${originalPokemon[i].attack}\n`;
        }
        //*/
      }
    }

    return changes;
  }),
  randomizeWildPokemon: thunk (async (actions, payload, {getStoreState, getStoreActions}) => {
    let zones = getStoreState().encounterZones;
    let epz = getStoreState().encountersPerZone;
    let pokemonIDs = getStoreState().pokemon.filter(p => p.name !== "?").map(p => p.id);
    //console.log(`${JSON.stringify(pokemonIDs)}`);
    zones.forEach(zone => {
      zone.encounters.forEach(enc => {
        let randomPokemon = pokemonIDs[Math.floor(Math.random() * pokemonIDs.length)]
        enc.pokemon = randomPokemon;
      });
      if(zone.name.includes(" land")){
        if(epz < 12){
          zone.encounters[11].pokemon = zone.encounters[9].pokemon;
        }
        if(epz < 11){
          zone.encounters[10].pokemon = zone.encounters[8].pokemon;
        }
        if(epz < 10){
          zone.encounters[7].pokemon = zone.encounters[8].pokemon;
        }
        if(epz < 9){
          zone.encounters[5].pokemon = zone.encounters[6].pokemon;
        }
        if(epz < 8){
          zone.encounters[4].pokemon = zone.encounters[9].pokemon;
        }
        if(epz < 7){
          zone.encounters[3].pokemon = zone.encounters[8].pokemon;
        }
        if(epz < 6){
          zone.encounters[1].pokemon = zone.encounters[2].pokemon;
        }
        if(epz < 5){
          zone.encounters[6].pokemon = zone.encounters[9].pokemon;
          zone.encounters[5].pokemon = zone.encounters[9].pokemon;
        }
        if(epz < 4){
          zone.encounters[0].pokemon = zone.encounters[8].pokemon;
        }
        if(epz < 3){
          zone.encounters[2].pokemon = zone.encounters[9].pokemon;
          zone.encounters[1].pokemon = zone.encounters[9].pokemon;
        }
        if(epz < 2){
          zone.encounters.forEach(enc => enc.pokemon = zone.encounters[0].pokemon);
        }
      }
      else if(zone.name.includes(" water") || zone.name.includes(" rocks")){
        if(epz < 5){
          zone.encounters[3].pokemon = zone.encounters[4].pokemon;
        }
        if(epz < 4){
          zone.encounters[2].pokemon = zone.encounters[3].pokemon;
        }
        if(epz < 3){
          zone.encounters[1].pokemon = zone.encounters[2].pokemon;
        }
        if(epz < 2){
          zone.encounters[0].pokemon = zone.encounters[1].pokemon;
        }
      }
      else if(zone.name.includes(" fishing")){
        if(epz < 5){
          zone.encounters[8].pokemon = zone.encounters[9].pokemon;
        }
        if(epz < 4){
          zone.encounters[7].pokemon = zone.encounters[9].pokemon;
        }
        if(epz < 3){
          zone.encounters[3].pokemon = zone.encounters[4].pokemon;
          zone.encounters[6].pokemon = zone.encounters[9].pokemon;
        }
        if(epz < 2){
          zone.encounters[2].pokemon = zone.encounters[4].pokemon;
          zone.encounters[5].pokemon = zone.encounters[9].pokemon;
          zone.encounters[0].pokemon = zone.encounters[1].pokemon;
        }
      }
    });

    getStoreActions().setEncounterZones(zones);
  }),
  randomizeTrainerPokemon: thunk (async (actions, payload, {getStoreState, getStoreActions}) => {
    let trainers = getStoreState().trainers;
    let pokemonIDs = getStoreState().pokemon.filter(p => p.name !== "?").map(p => p.id);
    
    trainers.forEach(trainer => {
      trainer.pokemon.forEach(mon => {
        let randomPokemon = pokemonIDs[Math.floor(Math.random() * pokemonIDs.length)]
        mon.pokemon = randomPokemon;
      });
    });

    getStoreActions().setTrainers(trainers);
  }),
  randomizePokemonStats: thunk (async (actions, payload, {getStoreState, getStoreActions}) => {
    let pokemon = getStoreState().pokemon;
    
    pokemon.forEach(mon => {
      mon.hp = Math.floor(Math.random() * 100) +50;
      mon.attack = Math.floor(Math.random() * 100) +50;
      mon.defense = Math.floor(Math.random() * 100) +50;
      mon.speed = Math.floor(Math.random() * 100) +50;
      mon.specialAttack = Math.floor(Math.random() * 100) +50;
      mon.specialDefense = Math.floor(Math.random() * 100) +50;
      mon.totalStats = mon.hp + mon.attack + mon.defense + mon.speed + mon.specialAttack + mon.specialDefense;
    });

    getStoreActions().setPokemon(pokemon);
  }),
  randomizePokemonMoves: thunk (async (actions, payload, {getStoreState, getStoreActions}) => {
    let pokemon = getStoreState().pokemon;
    
    pokemon.forEach(pokemon => {
      pokemon.learnedMoves.forEach(move => {
        let randomMove = Math.floor(Math.random() * 354) +1;
        move.moveID = randomMove;
      });
    });

    getStoreActions().setPokemon(pokemon);
  }),


  prepareDataForSaving: thunk(async (actions, payload) => {
    actions.savePokemonData();
    actions.savePokemonMoves();
    actions.saveTMs();
    actions.saveItems();
    actions.savePokemonTypes();
    actions.saveTypeMatchups();
    actions.saveEncounters();
    actions.saveTrainers();
    actions.saveShops();
    actions.saveMoveDescriptions();
    actions.saveIgnoreNationalDex();
    actions.saveEVData();
    actions.saveNaturesData();
    actions.saveShinyData();
    actions.saveIVData();
  })
}