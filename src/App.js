import React, {useState, useEffect} from 'react';
import {useStoreState} from 'easy-peasy';
import './App.css';
import MenuButtons from './components/MenuButtons';
import PokemonTab from './components/PokemonTab';
import MovesTab from './components/MovesTab';
import ItemsTab from './components/ItemsTab';
import TypesTab from './components/TypesTab';
import EncountersTab from './components/EncountersTab';
import TrainersTab from './components/TrainersTab';
import ShopsTab from './components/ShopsTab';
import MiscTab from './components/MiscTab';


function App() {

  const [tab, setTab] = useState(0);
  const currentFile = useStoreState(state => state.currentFile);

  function handleTabClicked(event, tabNum){
    setTab(tabNum);
  }

  function tabClassNames(tabNum){
    let className = 'nav-item nav-link';
    if(tab === tabNum){
      className += ' active';
    }
    return className;
  }

  useEffect(() => {
    let docTitle = "Pokemon Rom Editor";
    if(currentFile !== ""){
      docTitle += ` - ${currentFile}`;
    }
    document.title = docTitle;
  })

  return (
    <div className="app-container">
      <div>
        <nav className="navbar navbar-light bg-light navbar-expand-lg">
          <MenuButtons />
        </nav>
        <nav className="nav nav-tabs bg-light navbar-expand-lg">
          <button className={tabClassNames(0)} onClick={(e) => handleTabClicked(e, 0)}>Pokemon</button>
          <button className={tabClassNames(1)} onClick={(e) => handleTabClicked(e, 1)}>Moves</button>
          <button className={tabClassNames(2)} onClick={(e) => handleTabClicked(e, 2)}>Items</button>
          <button className={tabClassNames(3)} onClick={(e) => handleTabClicked(e, 3)}>Types</button>
          <button className={tabClassNames(4)} onClick={(e) => handleTabClicked(e, 4)}>Encounters</button>
          <button className={tabClassNames(5)} onClick={(e) => handleTabClicked(e, 5)}>Trainers</button>
          <button className={tabClassNames(6)} onClick={(e) => handleTabClicked(e, 6)}>Shops</button>
          <button className={tabClassNames(7)} onClick={(e) => handleTabClicked(e, 7)}>Misc</button>
        </nav>
      </div>      
      <div >
        <div hidden={tab !== 0}><PokemonTab /></div>
        <div hidden={tab !== 1}><MovesTab /></div>
        <div hidden={tab !== 2}><ItemsTab /></div>
        <div hidden={tab !== 3}><TypesTab /></div>
        <div hidden={tab !== 4}><EncountersTab /></div>
        <div hidden={tab !== 5}><TrainersTab /></div>
        <div hidden={tab !== 6}><ShopsTab /></div>
        <div hidden={tab !== 7}><MiscTab /></div>
      </div>
    </div>
  );
}
export default App;
