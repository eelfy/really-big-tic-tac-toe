import { CellCoordinates } from '../components/Cell/CellTypes';
import { LineMatchesFinder } from './findMatchesInLine';

type Matches = Array<CellCoordinates>;

class LineCheckerOptions {
  matches: Matches = [];

  checkNext: boolean = true;

  checkPrev: boolean = true;

  finder: LineMatchesFinder;

  constructor(finder: LineMatchesFinder) {
    this.finder = finder;
  }

  checkForMatch = (
    nextAccumulators: {
      x: number,
      y: number
    },
    prevAccumulators: {
      x: number,
      y: number
    },
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

export { LineCheckerOptions };
