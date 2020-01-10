import React from 'react';
import { useStoreActions, useStoreState} from 'easy-peasy';

function MenuButtons() {
  const getFileFromUser = useStoreActions(actions => actions.getFileFromUser);
  const saveFileAs = useStoreActions(actions => actions.saveFileAs);
  const romModelSelected = useStoreActions(actions => actions.romModelSelected);
  const supportedROMs = useStoreState(state => state.supportedROMs);

  const romSelectOptions = supportedROMs.map((rom,index) => <option key={index} value={rom.text}>{rom.text}</option>);

  return (
    <div className="menu-buttons">
      <button onClick={(e) => getFileFromUser()}>Open ROM</button>
      <button >Save ROM</button>
      <button onClick={(e) => saveFileAs() }>Save As</button>
      <select onChange={(e) => romModelSelected(e.target.value)}>{romSelectOptions}</select>
    </div>
  );
}

export default MenuButtons;