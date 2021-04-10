import React from 'react';
import { useStoreState, useStoreActions} from 'easy-peasy';
import ArraySelect from './ArraySelect';
//import EnumSelect from './EnumSelect';

function MiscTab(){

  const dataLoaded = useStoreState(state => state.dataLoaded);
  const starters = useStoreState(state => state.starters);
  const updateStarterProperty = useStoreActions(actions => actions.updateStarterProperty);
  const pokemon = useStoreState(state => state.pokemon);
  const generation = useStoreState(state => state.romModelState.generation);
  const items = useStoreState(state => state.items);
  const increaseShinyOdds = useStoreState(state => state.increaseShinyOdds);
  const updateIncreaseShinyOdds = useStoreActions(actions => actions.updateIncreaseShinyOdds);
  const ignoreNationalDex = useStoreState(state => state.ignoreNationalDex);
  const updateIgnoreNationalDex = useStoreActions(actions => actions.updateIgnoreNationalDex);
  const useNewEVMax = useStoreState(state => state.useNewEVMax);
  const updateUseNewEVMax = useStoreActions(actions => actions.updateUseNewEVMax);
  const evMult = useStoreState(state => state.evMult);
  const updateEVMult = useStoreActions(actions => actions.updateEVMult);
  const maximizeIVs = useStoreState(state => state.maximizeIVs);
  const updateMaximizeIVs = useStoreActions(actions => actions.updateMaximizeIVs);

  const startersList = starters.map((starter, index) =>
    <tr key={index}>
      <td><ArraySelect collection={pokemon} display='name' selectedValue={starter.pokemon} handleOptionChange={handleStarterPropertyChange} arrayIndex={index} propName={'pokemon'} /></td>
      <td><input value={starter.level} onChange={(e) => handleStarterPropertyChange(e, index, 'level')} /></td>
      <td><ArraySelect collection={items} display='name' selectedValue={starter.item} handleOptionChange={handleStarterPropertyChange} arrayIndex={index} propName={'item'} /></td>
    </tr>
  );

  function handleStarterPropertyChange(event, starterIndex, propName){
    let newValue = event.target.value;
    updateStarterProperty({index: starterIndex, propName: propName, propValue: newValue});
  }

  function handleShinyChange(event){
    let newValue = event.target.checked;
    updateIncreaseShinyOdds({value: newValue});
  };

  function handleNationalDexChange(event){
    let newValue = event.target.checked;
    updateIgnoreNationalDex({value: newValue});
  }

  function handleEVMaxChange(event){
    let newValue = event.target.checked;
    updateUseNewEVMax({value: newValue});
  }

  function handleEVMult(event){
    let newValue = event.target.value;
    updateEVMult({value: newValue});
  }

  function handleIVChange(event){
    let newValue = event.target.checked;
    updateMaximizeIVs({value: newValue});
  }


  return ( dataLoaded &&
    <div className="misc-tab-container">
      {generation === 2 && <table>
        <thead>
          <tr>
            <th>Starter</th><th>Level</th><th>Item</th>
          </tr>
        </thead>
        <tbody>
          {startersList}
        </tbody>
      </table>}
      {generation > 1 && <div>
        <input type="checkbox" checked={increaseShinyOdds} onChange={(e) => handleShinyChange(e)} />
        <span title="This increases the chance to about 1/3 in Gen2 and 1/2 in Gen3">Increase Shiny Odds</span>
      </div>}
      {generation === 3 && <div>
        <input type="checkbox" checked={ignoreNationalDex} onChange={(e) => handleNationalDexChange(e)} />
        <span title="This allows all pokemon to evolve without the national dex">Ignore National Dex</span>
      </div>}
      {generation === 3 && <div>
        <input type="checkbox" checked={useNewEVMax} onChange={(e) => handleEVMaxChange(e)} />
        <span title="This removes the 510 EV limit.">Remove EV Limit</span>
      </div>}
      {generation === 3 && <div>
        <input value={evMult} onChange={(e) => handleEVMult(e)} />
        <span title="All EVs gained are multiplied by this amount.">EV Multiplier</span>
      </div>}
      {generation === 3 && <div>
        <input type="checkbox" checked={maximizeIVs} onChange={(e) => handleIVChange(e)} />
        <span title="This makes all wild pokemon and pokemon you receive have 31 IVs.">Maximize IVs</span>
      </div>}
    </div>
  );
}

export default MiscTab;