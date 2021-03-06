import React from 'react';
import {useStoreState, useStoreActions} from 'easy-peasy';
import ArraySelect from './ArraySelect';

function ItemsTab(){

  const dataLoaded = useStoreState(state => state.dataLoaded);
  const moves = useStoreState(state => state.moves);
  const tms = useStoreState(state => state.tms);
  const items = useStoreState(state => state.items);
  const updateTM = useStoreActions(actions => actions.updateTMProperty);
  const updateItem = useStoreActions(actions => actions.updateItemProperty);
  const generation = useStoreState(state => state.romModelState.generation);

  const tmList = tms.map((tm, index) =>
    <tr key={index}>
      <td>{tm.name}</td>
      <td><ArraySelect collection={moves} value='id' display='name' selectedValue={tm.move} handleOptionChange={handleTMChange} arrayIndex={index} propName={'move'} /></td>
      {generation === 1 &&
        <td>Price in Thousands: </td>
      }
      {generation === 1 &&
        <td><input value={tm.price} onChange={(e) => handleTMChange(e, index, 'price')} /></td>
      }
    </tr>
  );

  const itemList = items.filter(item => item.price !== undefined).map((item, index) =>
    <tr key={index}>
      <td>{item.name}</td>
      <td><input value={item.price} onChange={(e) => handleItemChange(e, index, 'price')} /></td>
      {generation > 2 && <td><input value={item.importance} onChange={(e) => handleItemChange(e, index, 'importance')} /></td>}
    </tr>
  );

  function handleTMChange(event, tmIndex, propName){
    let newValue = event.target.value;
    updateTM({index: tmIndex, propName: propName, propValue: newValue});
  };

  function handleItemChange(event, itemIndex, propName){
    let newValue = event.target.value;
    updateItem({index: itemIndex, propName: propName, propValue: newValue});
  }

  return( dataLoaded &&
    <div className="items-tab-container">
      <div style={{overflowY: "scroll"}}>
        <table>
          <tbody>
            {tmList}
          </tbody>
        </table>
      </div>
      <div style={{overflowY: "scroll"}}>
        <table>
          <thead>
            <tr>
              <th>Item</th><th>Price</th>
              {generation > 2 && <th>Importance</th>}
            </tr>
          </thead>
          <tbody>
            {itemList}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ItemsTab;