import React from 'react';
import { useStoreState, useStoreActions} from 'easy-peasy';
import ArraySelect from './ArraySelect';
//import EnumSelect from './EnumSelect';

function MiscTab(){

  const dataLoaded = useStoreState(state => state.dataLoaded);
  const starters = useStoreState(state => state.starters);
  const updateStarterProperty = useStoreActions(actions => actions.updateStarterProperty);
  const pokemon = useStoreState(state => state.pokemon);
  //const generation = useStoreState(state => state.romModelState.generation);
  const items = useStoreState(state => state.items);
  const increaseShinyOdds = useStoreState(state => state.increaseShinyOdds);
  const updateIncreaseShinyOdds = useStoreActions(actions => actions.updateIncreaseShinyOdds);

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

  return ( dataLoaded &&
    <div className="misc-tab-container">
      <table>
        <thead>
          <tr>
            <th>Starter</th><th>Level</th><th>Item</th>
          </tr>
        </thead>
        <tbody>
          {startersList}
        </tbody>
      </table>
      <div>
        <input type="checkbox" checked={increaseShinyOdds} onChange={(e) => handleShinyChange(e)} />
        <span title="This increases the chance to about 1/3">Increase Shiny Odds</span>
      </div>
    </div>
  );
}

export default MiscTab;