/* eslint-disable max-len */
import { CellCoordinates, ICell } from 'components/Cell/CellTypes';

type FindInLine = (
  x: number, // can be negative or positive
  y: number, // can be negative or positive
  check: boolean,
) => false | CellCoordinates;

class LineMatchesFinder {
  currentClickedCell: ICell;

  allCells: ICell[][];

  constructor(currentClickedCell: ICell, allCells: ICell[][]) {
    this.currentClickedCell = currentClickedCell;
    this.allCells = allCells;
  }

  findInLine: FindInLine = (
    x,
    y,
    check = true,
  ) => {
    if (!check) return false;

    const [startY, startX] = this.currentClickedCell.coordinates;
    const rowForCheck = this.allCells?.[startY + y];
    const cellForCheck = rowForCheck?.[startX + x];

    if (cellForCheck) {
      return this.currentClickedCell.type === cellForCheck.type ? cellForCheck.coordinates : false;
    }
    return false;
  };
}

export { LineMatchesFinder };
