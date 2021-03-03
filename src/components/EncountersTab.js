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
  const generation = useStoreState(state => state.romModelState.generation);


  const zonesList = encounterZones.map((zone, index) =>
    <li key={index} className={"list-group-item" + (selectedZone === index ? " active" : "")} style={{maxWidth: "400px"}} onClick={()=> setSelectedZone(index)}>{zone.name}</li>
  );

  const encountersList = encounterZones[selectedZone].encounters.map((encounter, index) =>
    <tr key={index}>
      {generation < 3 && <td>{encounter.chance}% Spawn Chance -> Level:</td>}
      {generation < 3 &&  <td><input value={encounter.level} onChange={(e) => handleZoneChange(e, index, 'level')} /></td>}

      {generation > 2 && encounterZones[selectedZone].name.endsWith('fishing') && index < 2 && <td>OLD</td>}
      {generation > 2 && encounterZones[selectedZone].name.endsWith('fishing') && index >= 2 && index < 5 && <td>GOOD</td>}
      {generation > 2 && encounterZones[selectedZone].name.endsWith('fishing') && index >= 5 && <td>SUPER</td>}
      {generation > 2 && <td>{encounter.chance}% Spawn Chance -> MinLevel:</td>}
      {generation > 2 && <td><input value={encounter.minLevel} onChange={(e) => handleZoneChange(e, index, 'minlevel')} /></td>}
      {generation > 2 && <td>MaxLevel:</td>}
      {generation > 2 && <td><input value={encounter.maxLevel} onChange={(e) => handleZoneChange(e, index, 'maxlevel')} /></td>}

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
              <tr>
                {generation > 2 && encounterZones[selectedZone].name.endsWith('fishing') && <td>Rod</td>}
                <td>Zone Encounter Rate: </td><td><input value={encounterZones[selectedZone].encounterRate} onChange={(e) => handleZoneChange(e, selectedZone, 'encounterRate')} /></td></tr>
              {encountersList}
            </tbody>
          </table>
        </div>
      </div>
  )

}

export default EncountersTab;