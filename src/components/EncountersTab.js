import React from 'react';
import {useStoreState, useStoreActions} from 'easy-peasy';
import ArraySelect from './ArraySelect';

function EncountersTab(){
    
  const dataLoaded = useStoreState(state => state.dataLoaded);
  const encounterZones = useStoreState(state => state.encounterZones);
  const selectedZone = useStoreState(state => state.selectedZone);
  const setSelectedZone = useStoreActions(actions => actions.setSelectedZone);
  const updateZone = useStoreActions(actions => actions.updateZoneProperty);
  const pokemon = useStoreState(state => state.pokemon);

  const zonesList = encounterZones.map((zone, index) => 
    <li key={index} className={"list-group-item" + (selectedZone === index ? " active" : "")} style={{maxWidth: "400px"}} onClick={()=> setSelectedZone(index)}>{zone.name}</li>
  );

  const encountersList = encounterZones[selectedZone].encounters.map((encounter, index) =>
    <tr>
      <td>{encounter.chance}% Spawn Chance -> Level:</td><td><input value={encounter.level} onChange={(e) => handleZoneChange(e, index, 'level')} /></td>
      <td><ArraySelect collection={pokemon} display='name' selectedValue={encounter.pokemon} handleOptionChange={handleZoneChange} arrayIndex={index} propName={'pokemon'} /></td>
    </tr>
  );
  
  function handleZoneChange(event, encIndex, propName){
    let newValue = event.target.value;
    updateZone({index: encIndex, propName: propName, propValue: newValue});
  };

  return(
      dataLoaded && <div className="zones-tab-container">
        <ul className="list-group" style={{ overflowY: "scroll"}}>{zonesList}</ul>
        <div style={{ overflowY: "scroll"}}>
          <table>
            <tbody>
              <tr><td>Zone Encounter Rate: </td><td><input value={encounterZones[selectedZone].encounterRate} onChange={(e) => handleZoneChange(e, selectedZone, 'encounterRate')} /></td></tr>
              {encountersList}
            </tbody>
          </table>
        </div>
      </div>
  )
  
}

export default EncountersTab;