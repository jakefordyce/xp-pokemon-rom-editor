import React from 'react';
import {useStoreState, useStoreActions} from 'easy-peasy';
import EnumSelect from './EnumSelect';

function ShopsTab(){

  const dataLoaded = useStoreState(state => state.dataLoaded);
  const shops = useStoreState(state => state.shops);
  const selectedShop = useStoreState(state => state.selectedShop);
  const setSelectedShop = useStoreActions(actions => actions.setSelectedShop);
  const items = useStoreState(state => state.romModelState.items);


  const shopsList = shops.map((shop, index) => 
    <li key={index} className={"list-group-item" + (selectedShop === index ? " active" : "")} style={{maxWidth: "300px"}} onClick={()=> setSelectedShop(index)}>{shop.name}</li>
  );

  const itemsList = shops[selectedShop].items.map((item, index) => 
    <tr key={index}>
      <td><EnumSelect enum={items} display='name' selectedValue={item.item} handleOptionChange={handleShopItemChange} arrayIndex={index} propName={'item'} /></td>
    </tr>
  );

  function handleShopItemChange(event, index, propName){

  }


  return (
    dataLoaded && <div className="shops-tab-container">
        <ul className="list-group" style={{ overflowY: "scroll"}}>{shopsList}</ul>
        <div style={{ overflowY: "scroll"}}>
          <table>
            <tbody>
              {itemsList}
            </tbody>
          </table>
        </div>
      </div>
  );
}

export default ShopsTab;