import React from 'react';
import {useStoreState, useStoreActions} from 'easy-peasy';
import EnumSelect from './EnumSelect';
import ArraySelect from './ArraySelect';

function ShopsTab(){

  const dataLoaded = useStoreState(state => state.dataLoaded);
  const generation = useStoreState(state => state.romModelState.generation);
  const shops = useStoreState(state => state.shops);
  const selectedShop = useStoreState(state => state.selectedShop);
  const setSelectedShop = useStoreActions(actions => actions.setSelectedShop);
  // red/blue/yellow have a giant gap in their item numbering so it is easier to use the items enum here instead of the loaded item data.
  const enumItems = useStoreState(state => state.romModelState.items);
  const items = useStoreState(state => state.items);
  const updateShopItemProperty = useStoreActions(actions => actions.updateShopItemProperty);
  const addShopItem = useStoreActions(actions => actions.addShopItem);
  const removeShopItem = useStoreActions(actions => actions.removeShopItem);
  const currentShopItems = useStoreState(state => state.currentShopItems);
  const maxShopItems = useStoreState(state => state.romModelState.maxShopItems);


  const shopsList = shops.map((shop, index) => 
    <li key={index} className={"list-group-item" + (selectedShop === index ? " active" : "")} style={{maxWidth: "300px"}} onClick={()=> setSelectedShop(index)}>{shop.name}</li>
  );

  const itemsList = shops[selectedShop].items.map((item, index) => 
    <tr key={index}>
      {generation === 1 &&
        <td><EnumSelect enum={enumItems} display='name' selectedValue={item.item} handleOptionChange={handleShopItemChange} arrayIndex={index} propName={'item'} /></td>
      }
      {generation !== 1 &&
        <td><ArraySelect collection={items} display='name' selectedValue={item.item} handleOptionChange={handleShopItemChange} arrayIndex={index} propName={'item'} /></td>
      }
      <td><button onClick={(e) => handleRemoveItem(e, index)}>X</button></td>
    </tr>
  );

  function handleShopItemChange(event, index, propName){
    let newValue = event.target.value;
    updateShopItemProperty({index: index, propName: propName, propValue: newValue});
  }

  function handleAddItem(event){
    addShopItem();
  }

  function handleRemoveItem(event, itemIndex){
    removeShopItem(itemIndex);
  };


  return (
    dataLoaded && <div className="shops-tab-container">
        <ul className="list-group" style={{ overflowY: "scroll"}}>{shopsList}</ul>
        <div style={{ overflowY: "scroll"}}>
          <div>Space used: {currentShopItems}/{maxShopItems}</div>
          <table>
            <tbody>
              {itemsList}
            </tbody>
          </table>
          <button onClick={handleAddItem}>Add Item</button>
        </div>
      </div>
  );
}

export default ShopsTab;