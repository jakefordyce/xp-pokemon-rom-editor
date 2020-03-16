import React from 'react';
import {useStoreState} from 'easy-peasy';
import MoveDescRow from './MoveDescRow';

function MoveDescriptions(){

  const moves = useStoreState(state => state.moves);
  const moveDescriptions = useStoreState(state => state.moveDescriptions);

  const descriptionRows = moveDescriptions.map((desc, index) => 
    <MoveDescRow key={index} name={moves[desc.id].name} text={desc.text} id={desc.id}/>
  );

  return(
    <div>
      <table>
        <thead>
          <tr className="sticky-header">
            <th>Move</th><th>Description</th>
          </tr>
        </thead>
        <tbody>
          {descriptionRows}
        </tbody>
      </table>
    </div>
  )
}

export default MoveDescriptions;