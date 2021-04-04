import React from 'react';
import {useStoreState, useStoreActions} from 'easy-peasy';

function TypesTab(){

  const dataLoaded = useStoreState(state => state.dataLoaded);
  const types = useStoreState(state => state.pokemonTypes);
  const typeMatchups = useStoreState(state => state.typeMatchups);
  const updateType = useStoreActions(actions => actions.updateTypeProperty);
  const updateTypeMatchup = useStoreActions(actions => actions.updateTypeMatchupProperty);
  const addType = useStoreActions(actions => actions.addType);
  const removeType = useStoreActions(actions => actions.removeType);
  const addTypeMatchup = useStoreActions(actions => actions.addTypeMatchup);
  const removeTypeMatchup = useStoreActions(actions => actions.removeTypeMatchup);
  const generation = useStoreState(state => state.romModelState.generation);

  const usedTypes = types.filter((type) => type.typeIsUsed);

  const typeList = types.map((type, index) =>
    <tr key={index}>
      <td><input style={{width: "100px"}} value={type.typeName} onChange={(e) => handleTypeChange(e, index, 'typeName')} /></td>
      <td><input type="checkbox" checked={type.typeIsUsed} onChange={(e) => handleTypeCheckbox(e, index, 'typeIsUsed')} /></td>
      <td><button onClick={(e) => handleRemoveType(e, index)}>X</button></td>
      {(index < 20 && generation < 3) && <td>Att</td>}
      {(index >= 20 && generation === 1) && <td>Spec</td>}
      {(index >= 20 && generation === 2) && <td>Sp. Att</td>}
      {(index < 10 && generation === 3) && <td>Att</td>}
      {(index >= 10 && generation === 3) && <td>Sp. Att</td>}
      <td>{typeStrengthBalance(type)}</td>
    </tr>
  );

  const typeChartHeaders = usedTypes.map((type, index) =>
    <th className="type-header" key={index}><div><span>{type.typeName}</span></div></th>
  );

  const typeChart = usedTypes.map((type, index) => {
    let matchups = typeMatchups.filter((matchup) => matchup.attackType === type.typeIndex);
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

        if(matchup.foresight){
          effectiveCSS += " type-foresight";
        }
      }

      return <td className={effectiveCSS} key={defIndex} onClick={(e) => handleTypeMatchupChange(e, type, defType)}
      onContextMenu={(e) => {e.preventDefault(); handleTypeMatchupChange(e, type, defType)}} >{cellText}</td>
    });
    return <tr key={index}><td>{type.typeName}</td>{cells}</tr>
  });

  function typeStrengthBalance(type){
    let balance = 0;
    typeMatchups.forEach((m) => {
      if((m.attackType === type.typeIndex && m.effectiveness === 20) ||
      (m.defenseType === type.typeIndex && m.effectiveness === 5) ||
      (m.defenseType === type.typeIndex && m.effectiveness === 0)
      ){
        balance++;
      }

      if((m.defenseType === type.typeIndex && m.effectiveness === 20) ||
      (m.attackType === type.typeIndex && m.effectiveness === 5) ||
      (m.attackType === type.typeIndex && m.effectiveness === 0)
      ){
        balance--;
      }
    });
    return balance;
  }

  function handleTypeCheckbox(event, typeIndex, propName){
    let newValue = event.target.checked;
    updateType({index: typeIndex, propName: propName, propValue: newValue});
  };

  function handleTypeChange(event, typeIndex, propName){
    let newValue = event.target.value;
    updateType({index: typeIndex, propName: propName, propValue: newValue});
  };

  function handleTypeMatchupChange(event, attType, defType){
    let matchup = typeMatchups.find((match) => match.defenseType === defType.typeIndex && match.attackType === attType.typeIndex);

    if(event.button === 0){ //left click cycle through damage modifiers
      if(matchup !== undefined){
        if(matchup.effectiveness === 0){
          removeTypeMatchup(typeMatchups.indexOf(matchup));
        }else if(matchup.effectiveness === 5){
          updateTypeMatchup({index: typeMatchups.indexOf(matchup), propName: "effectiveness", propValue: 20});
        }else if(matchup.effectiveness === 20){
          updateTypeMatchup({index: typeMatchups.indexOf(matchup), propName: "effectiveness", propValue: 0});
        }
      }else{
        addTypeMatchup({attackType: attType.typeIndex, defenseType: defType.typeIndex});
      }
    }else if(event.button === 2){ //right click toggle foresight
      if(matchup !== undefined){
        updateTypeMatchup({index: typeMatchups.indexOf(matchup), propName: "foresight", propValue: !matchup.foresight});
      }
    }
  }

  function handleRemoveType(event, typeIndex){
    removeType(typeIndex);
  };

  function handleAddType(event){
    addType();
  }

  return( dataLoaded &&
    <div className="types-tab-container">
      <div style={{overflowY: "scroll", overflowX: "scroll", backgroundColor: "#fff"}}>
        <button onClick={handleAddType}>Add Type</button>
        <table>
          <thead>
            <tr className="sticky-header">
              <th>Type</th>
              <th>Is Used</th>
              <th></th>
              <th>Stat</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {typeList}
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
    </div>
  )
}

export default TypesTab;