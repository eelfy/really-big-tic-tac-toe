import { MAP_COLUMNS, MAP_ROWS } from '../consts/game';
import { ICell } from '../components/Cell/CellTypes';
import { createNewCell } from './createNewCell';

const fillTheGameField = (
  startRowsPosition: number,
  startColumnPosition: number = 0,
): ICell[][] => {
  const localGameField: ICell[][] = [];

  let rowCount = startRowsPosition;
  for (; rowCount <= startRowsPosition + MAP_ROWS; rowCount += 1) {
    localGameField.push([]);
    let columnCount = 0;
    for (; columnCount <= startColumnPosition + MAP_COLUMNS; columnCount += 1) {
      localGameField[rowCount].push(createNewCell(rowCount, columnCount));
    }
  }
  localGameField[0][0].type = 'cross';
  return localGameField;
};

export { fillTheGameField };
