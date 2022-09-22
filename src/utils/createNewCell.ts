import { CellCoordinates, CellId, ICell } from '../components/Cell/CellTypes';

function createNewCell(rowCount: number, columnCount: number): ICell {
  const coordinates: CellCoordinates = [rowCount, columnCount];
  const newCell: ICell = {
    type: null,
    id: coordinates.join(':') as CellId,
    coordinates,
  };
  return newCell;
}

export { createNewCell };
