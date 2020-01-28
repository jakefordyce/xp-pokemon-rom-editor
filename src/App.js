import React, {useState} from 'react';
import './App.css';
import MenuButtons from './components/MenuButtons';
import PokemonTab from './components/PokemonTab';
import MovesTab from './components/MovesTab';
import ItemsTab from './components/ItemsTab';
import TypesTab from './components/TypesTab';
import EncountersTab from './components/EncountersTab';
import TrainersTab from './components/TrainersTab';
import ShopsTab from './components/ShopsTab';


function App() {

  const [tab, setTab] = useState(0);  

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

  return (
    <div className="app-container">
      <div>
        <nav className="navbar navbar-light bg-light navbar-expand-lg">
          <MenuButtons />
        </nav>
        <nav className="nav nav-tabs bg-light navbar-expand-lg">
          <button id="pokemon-tab" className={tabClassNames(0)} onClick={(e) => handleTabClicked(e, 0)}>Pokemon</button>
          <button id="moves-tab" className={tabClassNames(1)} onClick={(e) => handleTabClicked(e, 1)}>Moves</button>
          <button id="items-tab" className={tabClassNames(2)} onClick={(e) => handleTabClicked(e, 2)}>Items</button>
          <button id="types-tab" className={tabClassNames(3)} onClick={(e) => handleTabClicked(e, 3)}>Types</button>
          <button id="encounters-tab" className={tabClassNames(4)} onClick={(e) => handleTabClicked(e, 4)}>Encounters</button>
          <button id="trainers-tab" className={tabClassNames(5)} onClick={(e) => handleTabClicked(e, 5)}>Trainers</button>
          <button id="shops-tab" className={tabClassNames(6)} onClick={(e) => handleTabClicked(e, 6)}>Shops</button>
        </nav>
      </div>      
      <div >
        {tab === 0 && <PokemonTab />}
        {tab === 1 && <MovesTab />}
        {tab === 2 && <ItemsTab />}
        {tab === 3 && <TypesTab />}
        {tab === 4 && <EncountersTab />}
        {tab === 5 && <TrainersTab />}
        {tab === 6 && <ShopsTab />}
      </div>
    </div>
  );
}
export default App;
