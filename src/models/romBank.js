class UsedDataBlock
{
  startByte;
  endByte;
  contains(address)
  {
    return (this.startByte < address && this.endByte > address);
  }
}

export default class RomBank {
  constructor(start, end) 
  {
      this.startByte = start;
      this.endByte = end;
      this.usedDataBlocks = [];
  }                        
  /// <summary>
  /// Mark a space in the bank as used.
  /// </summary>
  /// <param name="start"></param>
  /// <param name="end"></param>
  /// <returns></returns>
  addDataBlock(start, end)
  {
    if(end > this.endByte || start < this.startByte)
    {
        return -1;
    }
    else
    {
      var block = new UsedDataBlock();
      block.startByte = start;
      block.endByte = end;

      this.usedDataBlocks.push(block);
      this.usedDataBlocks.sort((x, y) => x.startByte - y.startByte); //not sure about this

      return this.usedDataBlocks.indexOf(block);
    }
  }

  addData(start, size)
  {
    if(this.usedDataBlocks.length > 0)
    {
      let needsNewBlock = true;
      //check ours current blocks to see if we can extend one that is already there.
      for(let i = 0; i < this.usedDataBlocks.length; i++)
      {
        if(this.usedDataBlocks[i].endByte === start - 1)
        {
            needsNewBlock = false;
            this.extendBlock(i, size);
            break;
        }
      }
      //otherwise add a new one
      if (needsNewBlock)
      {
          this.addDataBlock(start, start + size);
      }
    }
    else
    {
        //if there's no current blocks start a new one.
        this.addDataBlock(start, start + size);
    }
  }

  extendBlock(blockIndex, size)
  {
      this.usedDataBlocks[blockIndex].endByte += size;
  }
        
  /// <summary>
  /// Pass in the number of bytes you want to save and it will tell you the lowest address that has free space for the bytes.
  /// </summary>
  /// <param name="size"></param>
  /// <returns></returns>
  hasRoomAt(size)
  {
    if(size > (this.endByte - this.startByte)) // make sure the data will fit into the bank
    {
      return -1;
    }
    else
    {
      if(this.usedDataBlocks.length === 0) // if it fits in the bank and there are no blocks then we know we have enough room.
      {
          return this.startByte;
      }
      else
      {
        if (this.usedDataBlocks[0].contains(this.startByte + size))
        {
          for(let i = 0; i < this.usedDataBlocks.length; i++)
          {
            if(i + 1 === this.usedDataBlocks.length)//last block, compare to end byte
            {
              if(this.endByte - this.usedDataBlocks[i].endByte >= size)
              {
                return this.usedDataBlocks[i].endByte + 1;
              }
              else
              {
                return -2;
              }
            }
            else
            {
              if(this.usedDataBlocks[i+1].startByte - this.usedDataBlocks[i].endByte - 1 >= size) //if there's enough room between the current block and the next block
              {
                return this.usedDataBlocks[i].endByte + 1;
              }
            }
              //check each block against its next block or against the end
          }
        }
        else // the first block didn't contain the address which means there is room at the start of the block.
        {
          return this.startByte;
        }
      }
    }
    return -2;
  }
}