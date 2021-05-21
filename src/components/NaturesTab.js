import React from 'react';
import { useStoreState, useStoreActions} from 'easy-peasy';

function NaturesTab(){

  const dataLoaded = useStoreState(state => state.dataLoaded);
  const natures = useStoreState(state => state.natures);
  const updateNatureProperty = useStoreActions(actions => actions.updateNatureProperty);

  const natureRows = natures?.map((nature, index) => <tr key={index}>
    <td>{nature.name}</td>
    <td className={getCssForValue(nature.attack)} onClick={(e) => handleNatureStatChange(e, index, nature.attack, "attack")} >{getTextForValue(nature.attack)}</td>
    <td className={getCssForValue(nature.defense)} onClick={(e) => handleNatureStatChange(e, index, nature.defense, "defense")} >{getTextForValue(nature.defense)}</td>
    <td className={getCssForValue(nature.speed)} onClick={(e) => handleNatureStatChange(e, index, nature.speed, "speed")} >{getTextForValue(nature.speed)}</td>
    <td className={getCssForValue(nature.specialAttack)} onClick={(e) => handleNatureStatChange(e, index, nature.specialAttack, "specialAttack")} >{getTextForValue(nature.specialAttack)}</td>
    <td className={getCssForValue(nature.specialDefense)} onClick={(e) => handleNatureStatChange(e, index, nature.specialDefense, "specialDefense")} >{getTextForValue(nature.specialDefense)}</td>
  </tr>);

  function getCssForValue(natureValue){
    let cssClass = "";

    switch(natureValue){
      case 1:
        cssClass += "type-double";
        break;
      case 255:
        cssClass += "type-half";
        break;
      default:
        break;
    }

    return cssClass;
  }

  function getTextForValue(natureValue){
    let text = ""

    switch(natureValue){
      case 1:
        text += "+10%";
        break;
      case 255:
        text += "-10%";
        break;
      default:
        text += "100%"
        break;
    }

    return text;
  }

  function handleNatureStatChange(event, natureIndex, natureValue, stat){
    switch(natureValue){
      case 1:
        updateNatureProperty({index: natureIndex, propName: stat, propValue: 255})
        break;
      case 255:
        updateNatureProperty({index: natureIndex, propName: stat, propValue: 0})
        break;
      default:
        updateNatureProperty({index: natureIndex, propName: stat, propValue: 1})
        break;
    }
  }

  return ( dataLoaded &&
    <div>
      <table>
        <thead>
          <tr>
            <th>Nature</th>
            <th>Attack</th>
            <th>Defense</th>
            <th>Speed</th>
            <th>Sp. Att</th>
            <th>Sp. Def</th>
          </tr>
        </thead>
        <tbody>
          {natureRows}
        </tbody>
      </table>

    </div>
  )
}

export default NaturesTab;