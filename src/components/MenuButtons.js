import React from 'react';
import { useStoreActions, useStoreState} from 'easy-peasy';

function MenuButtons() {
  const getFileFromUser = useStoreActions(actions => actions.getFileFromUser);
  const saveFileAs = useStoreActions(actions => actions.saveFileAs);
  const saveFile = useStoreActions(actions => actions.saveFile);
  const romModelSelected = useStoreActions(actions => actions.romModelSelected);
  const supportedROMs = useStoreState(state => state.supportedROMs);
  const generateChangeLog = useStoreActions(actions => actions.generateChangeLog);

  const romSelectOptions = supportedROMs.map((rom,index) => <option key={index} value={rom.text}>{rom.text}</option>);

  return (
    <div className="menu-buttons">
      <button onClick={(e) => getFileFromUser()}>Open ROM</button>
      <button onClick={(e) => saveFile() }>Save ROM</button>
      <button onClick={(e) => saveFileAs() }>Save As</button>
      <select onChange={(e) => romModelSelected(e.target.value)}>{romSelectOptions}</select>
      <button onClick={(e) => generateChangeLog() }>Generate Changelog</button>
    </div>
  );
}

export default MenuButtons;