/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import { ICell, CellCoordinates, TypeOfCell } from 'components/Cell/CellTypes';

import { makeAutoObservable } from 'mobx';
import { fillTheGameField } from '../../utils/fillTheGameField';
import {
  LineMatchesFinder, LineCheckerOptions, createNewCell, ICoordinates,
} from '../../utils';
import { MAP_COLUMNS, MATCHES_TO_WIN } from '../../consts/game';

type PlayerType = Exclude<TypeOfCell, null>;
type GameStatus = 'not started' | 'started' | `${PlayerType} win` | 'draw';

type PlayerMoves = Record<PlayerType, CellCoordinates[]>;

type LocalFinded = CellCoordinates[];

const initialFirstPlayer = false;

class MainStore {
  cells: ICell[][] = [];

  isNowCross = initialFirstPlayer;

  playersMoves: PlayerMoves = { cross: [[0, 0]], zero: [] };

  inGameCells: ICell[] = [];

  totalGameResults: CellCoordinates[] = [];

  gameStatus: GameStatus = 'not started';

  constructor() {
    makeAutoObservable(this);
    this.cells = fillTheGameField(0);
  }

  renderAdditionalColumns = () => {
    this.cells.forEach((row, rowCount) => {
      const additionalColumns: ICell[] = [];
      const lastElementInRow = row.length;

      let columnCount = lastElementInRow;

      for (; columnCount <= MAP_COLUMNS + lastElementInRow; columnCount += 1) {
        additionalColumns.push(createNewCell(rowCount, columnCount));
      }
      row.push(...additionalColumns);
    });
  };

  renderAdditionalRows = () => {
    this.cells = fillTheGameField(this.cells.length, this.cells[0].length);
  };

  startGame = () => {
    this.gameStatus = 'started';
  };

  resetGame = () => {
    this.isNowCross = initialFirstPlayer;
    this.playersMoves = { cross: [[0, 0]], zero: [] };
    this.inGameCells.forEach((cell) => {
      cell.type = null;
    });
    this.totalGameResults = [];
    this.startGame();
  };

  clickOnCell = (cell: ICell) => {
    if (cellNotAllowToBeClicked(cell, this.gameStatus)) return;

    this.fillTheCell(cell);
    this.endTheGameIfItNecessary(cell);
    this.toggleCurrentPlayer();
  };

  fillTheCell = (cell: ICell) => {
    let playerType: PlayerType;

    if (this.isNowCross) {
      playerType = 'cross';
      cell.type = 'cross';
    } else {
      playerType = 'zero';
      cell.type = playerType;
    }

    this.registerPlayerMove(playerType, cell);
  };

  endTheGameIfItNecessary = (cell: ICell) => {
    const gameResults = this.checkIsGameEnd(cell);
    if (gameResults) {
      this.totalGameResults = [...gameResults[0]];
      this.gameStatus = `${gameResults[1]} win`;
    }
  };

  toggleCurrentPlayer = () => {
    this.isNowCross = !this.isNowCross;
  };

  registerPlayerMove = (playerType: PlayerType, cell: ICell) => {
    this.addCellToPlayerMoves(playerType, cell);
    this.addCellToInGameList(cell);
  };

  addCellToPlayerMoves = (playerType: PlayerType, cell: ICell) => {
    this.playersMoves[playerType].push(cell.coordinates);
  };

  addCellToInGameList = (cell: ICell) => {
    this.inGameCells.push(cell);
  };

  checkIsGameEnd = (currentClickedCell: ICell): [CellCoordinates[], PlayerType] | false => {
    if (currentGameNotReadyToCheck(currentClickedCell, this.playersMoves)) return false;

    let cellForCheckCounter = 0;

    const finder = new LineMatchesFinder(currentClickedCell, this.cells);

    const directionsCheckers = {
      horizontalChecker: new LineCheckerOptions(finder),
      verticalChecker: new LineCheckerOptions(finder),
      diagonal45degChecker: new LineCheckerOptions(finder),
      diagonal135degChecker: new LineCheckerOptions(finder),
    };

    const allPossibleDirectionsWithMatches = Object.values(directionsCheckers).map((checker) => checker.matches);

    while (cellForCheckCounter < MATCHES_TO_WIN) {
      checkDirection(
        directionsCheckers.horizontalChecker,
        [
          { x: cellForCheckCounter, y: 0 },
          { x: cellForCheckCounter * -1, y: 0 },
        ],
      );
      checkDirection(
        directionsCheckers.verticalChecker,
        [
          { x: 0, y: cellForCheckCounter },
          { x: 0, y: cellForCheckCounter * -1 },
        ],
      );
      checkDirection(
        directionsCheckers.diagonal45degChecker,
        [
          { x: cellForCheckCounter * -1, y: cellForCheckCounter },
          { x: cellForCheckCounter, y: cellForCheckCounter * -1 },
        ],
      );
      checkDirection(
        directionsCheckers.diagonal135degChecker,
        [
          { x: cellForCheckCounter, y: cellForCheckCounter },
          { x: cellForCheckCounter * -1, y: cellForCheckCounter * -1 },
        ],
      );

      cellForCheckCounter += 1;
    }

    const finalFindedMatch = allPossibleDirectionsWithMatches.find((possibleMatch) => (
      (new Set(possibleMatch)).size >= MATCHES_TO_WIN
    ));

    function checkDirection(checker: LineCheckerOptions, config : [ICoordinates, ICoordinates]) {
      const finded: LocalFinded = checker.checkForMatch(...config);
      if (finded) {
        checker.matches.push(...finded);
      }
    }
    return finalFindedMatch ? [finalFindedMatch, currentClickedCell.type as PlayerType] : false;
  };
}

function currentGameNotReadyToCheck(cell: ICell, playersMoves: PlayerMoves): boolean {
  return (typeof (cell.type) !== 'string' || playersMoves[cell.type].length < MATCHES_TO_WIN);
}

function cellNotAllowToBeClicked(cell:ICell, gameStatus: GameStatus): boolean {
  return cell.type !== null || gameStatus !== 'started';
}

export { MainStore };
