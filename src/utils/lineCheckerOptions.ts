import { CellCoordinates } from '../components/Cell/CellTypes';
import { LineMatchesFinder } from './findMatchesInLine';

type Matches = Array<CellCoordinates>;

interface ICoordinates {
  x: number,
  y: number
}

class LineCheckerOptions {
  matches: Matches = [];

  checkNext: boolean = true;

  checkPrev: boolean = true;

  finder: LineMatchesFinder;

  constructor(finder: LineMatchesFinder) {
    this.finder = finder;
  }

  checkForMatch = (
    nextAccumulators: ICoordinates,
    prevAccumulators: ICoordinates,
  ): CellCoordinates[] => {
    const isTheNextCellCorrect = this.finder.findInLine(
      nextAccumulators.x,
      nextAccumulators.y,
      this.checkNext,
    );
    const isThePrevCellCorrect = this.finder.findInLine(
      prevAccumulators.x,
      prevAccumulators.y,
      this.checkPrev,
    );

    if (!isTheNextCellCorrect) {
      this.checkNext = false;
    }

    if (!isThePrevCellCorrect) {
      this.checkPrev = false;
    }

    const rawRes = [isTheNextCellCorrect, isThePrevCellCorrect];
    const validRes: CellCoordinates[] = [];

    rawRes.forEach((cellCoord) => {
      if (cellCoord) validRes.push(cellCoord);
    });

    return validRes;
  };
}

export type { ICoordinates };
export { LineCheckerOptions };
