import React from 'react';
import {useStoreState, useStoreActions} from 'easy-peasy';
import ArraySelect from './ArraySelect';
import EnumSelect from './EnumSelect';

function TypesTab(){
    
  const dataLoaded = useStoreState(state => state.dataLoaded);
  const types = useStoreState(state => state.pokemonTypes);
  const typeMatchups = useStoreState(state => state.typeMatchups);
  const damageModifiers = useStoreState(state => state.romModelState.damageModifiers);
  const updateType = useStoreActions(actions => actions.updateTypeProperty);
  const updateTypeMatchup = useStoreActions(actions => actions.updateTypeMatchupProperty);
  const addType = useStoreActions(actions => actions.addType);
  const removeType = useStoreActions(actions => actions.removeType);
  const addTypeMatchup = useStoreActions(actions => actions.addTypeMatchup);
  const removeTypeMatchup = useStoreActions(actions => actions.removeTypeMatchup);
  const generation = useStoreState(state => state.romModelState.generation);
  
  const usedTypes = types.filter((type) => type.typeIsUsed);

  const typeMatchupList = typeMatchups.map((typematch, index) =>
    <tr key={index}>
      <td><ArraySelect collection={types} value='typeIndex' display='typeName' selectedValue={typematch.attackType} handleOptionChange={handleTypeMatchupChange} arrayIndex={index} propName='attackType'/></td>
      <td><ArraySelect collection={types} value='typeIndex' display='typeName' selectedValue={typematch.defenseType} handleOptionChange={handleTypeMatchupChange} arrayIndex={index} propName='defenseType'/></td>
      <td><EnumSelect enum={damageModifiers} selectedValue={typematch.effectiveness} handleOptionChange={handleTypeMatchupChange} arrayIndex={index} propName={'effectiveness'}/></td>
      <td><button onClick={(e) => handleRemoveTypeMatchup(e, index)}>X</button></td>
    </tr>
  );

  const typeList = types.map((type, index) => 
    <tr key={index}>
      <td><input style={{width: "100px"}} value={type.typeName} onChange={(e) => handleTypeChange(e, index, 'typeName')} /></td>
      <td><input type="checkbox" checked={type.typeIsUsed} onChange={(e) => handleTypeCheckbox(e, index, 'typeIsUsed')} /></td>
      <td><button onClick={(e) => handleRemoveType(e, index)}>X</button></td>
      {index < 20 && <td>Att</td>}
      {(index >= 20 && generation === 1) && <td>Spec</td>}
      {(index >= 20 && generation !== 1) && <td>Sp. Att</td>}
    </tr>
  );

  const typeChartHeaders = usedTypes.map((type, index) => 
    <th className="type-header" key={index}><div><span>{type.typeName}</span></div></th>
  );

  const typeChart = usedTypes.map((type, index) => {
    let matchups = typeMatchups.filter((matchup) => matchup.attackType === type.typeIndex);
    //console.log(type);
    //console.log(matchups);
    let cells = usedTypes.map((defType, defIndex) => {
      let effectiveCSS = "";
      let cellText = "";
      let matchup = matchups.find((match) => match.defenseType === defType.typeIndex);
      if(matchup !== undefined){
        if(matchup.effectiveness === 0){
          effectiveCSS = "type-none";
          cellText = "x0";
        }else if(matchup.effectiveness === 5){
          effectiveCSS = "type-half";
          cellText = "x1/2";
        }else if(matchup.effectiveness === 20){
          effectiveCSS = "type-double";
          cellText = "x2";
        }
      }

      return <td className={effectiveCSS} key={defIndex}>{cellText}</td>
    });
    return <tr key={index}><td>{type.typeName}</td>{cells}</tr>
  });
  
  function handleTypeCheckbox(event, typeIndex, propName){
    let newValue = event.target.checked;
    updateType({index: typeIndex, propName: propName, propValue: newValue});
  };

  function handleTypeChange(event, typeIndex, propName){
    let newValue = event.target.value;
    updateType({index: typeIndex, propName: propName, propValue: newValue});
  };

  function handleTypeMatchupChange(event, matchupIndex, propName){
    let newValue = event.target.value;
    updateTypeMatchup({index: matchupIndex, propName: propName, propValue: newValue});
  }

  function handleRemoveType(event, typeIndex){
    removeType(typeIndex);
  };

  function handleAddType(event){
    addType();
  }

  function handleRemoveTypeMatchup(event, matchupIndex){
    removeTypeMatchup(matchupIndex);
  };

  function handleAddTypeMatchup(event){
    addTypeMatchup();
  }

  return( dataLoaded &&
    <div className="types-tab-container">
      <div style={{overflowY: "scroll"}}>
        <button onClick={handleAddTypeMatchup}>Add Row</button>
        <table>
          <thead>
            <tr className="sticky-header">
              <th>Attacking</th>
              <th>Defending</th>
              <th>Effectiveness</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {typeMatchupList}
          </tbody>
        </table>
      </div>
      <div className="type-table">
      <table >
          <thead>
            <tr>
              <th></th>
              {typeChartHeaders}
            </tr>
          </thead>
          <tbody>
            {typeChart}
          </tbody>
        </table>
      </div>
      <div style={{overflowY: "scroll", overflowX: "scroll", backgroundColor: "#fff"}}>
        <button onClick={handleAddType}>Add Type</button>
        <table>
          <thead>
            <tr className="sticky-header">
              <th>Type</th>
              <th>Is Used</th>
              <th></th>
              <th>Stat</th>
            </tr>
          </thead>
          <tbody>
            {typeList}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TypesTab;