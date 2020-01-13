import React, {useState} from 'react';
import './App.css';
import MenuButtons from './components/MenuButtons';
import PokemonTab from './components/PokemonTab';
import MovesTab from './components/MovesTab';
import ItemsTab from './components/ItemsTab';
import TypesTab from './components/TypesTab';


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
        </nav>
      </div>      
      <div style={{overflowY: "scroll"}}>
        {tab === 0 && <PokemonTab />}
        {tab === 1 && <MovesTab />}
        {tab === 2 && <ItemsTab />}
        {tab === 3 && <TypesTab />}
      </div>
    </div>
  );
}
export default App;
