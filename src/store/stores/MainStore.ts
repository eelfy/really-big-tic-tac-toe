/* eslint-disable no-param-reassign */
import {
  ICell, CellCoordinates, TypeOfCell, CellId,
} from 'components/Cell/CellTypes';

import { makeAutoObservable } from 'mobx';
import { LineMatchesFinder, LineCheckerOptions } from '../../utils';
import { MAP_ROWS, MAP_COLUMNS, MATCHES_TO_WIN } from '../../consts/game';

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
    this.fillTheGameField(0);
  }

  fillTheGameField = (startRowsPosition: number) => {
    let rowCount = startRowsPosition;
    for (; rowCount <= startRowsPosition + MAP_ROWS; rowCount += 1) {
      this.cells.push([]);
      for (let columnCount = 0; columnCount <= MAP_COLUMNS; columnCount += 1) {
        const coordinates: CellCoordinates = [rowCount, columnCount];
        this.cells[rowCount].push({
          type: null,
          id: coordinates.join(':') as CellId,
          coordinates,
        });
      }
    }
    this.cells[0][0].type = 'cross';
  };

  renderAdditionalColumns = () => {
    this.cells.forEach((row) => {
      const lastElementInRow = row.length!;

      const additionalColumns = row.map((cell) => {
        const newCoordinates: CellCoordinates = [
          cell.coordinates[0], cell.coordinates[1] + lastElementInRow,
        ];
        const newCell: ICell = {
          type: null,
          coordinates: newCoordinates,
          id: newCoordinates.join(':') as CellId,
        };
        return newCell;
      });

      row.push(...additionalColumns);
    });
  };

  renderAdditionalRows = () => {
    this.fillTheGameField(this.cells.length);
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

  startGame = () => {
    this.gameStatus = 'started';
  };

  changeCellType = (cell: ICell) => {
    if (cell.type !== null || this.gameStatus !== 'started') return;

    this.fillTheCell(cell);

    const gameResults = this.checkIsGameEnd(cell);
    if (gameResults) {
      this.totalGameResults = [...gameResults[0]];
      this.gameStatus = `${gameResults[1]} win`;
    }

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

    this.addMoveForPlayer(playerType, cell);
  };

  addMoveForPlayer = (playerType: PlayerType, cell: ICell) => {
    this.playersMoves[playerType].push(cell.coordinates);
    this.inGameCells.push(cell);
  };

  toggleCurrentPlayer = () => {
    this.isNowCross = !this.isNowCross;
  };

  checkIsGameEnd = (currentClickedCell: ICell): [CellCoordinates[], PlayerType] | false => {
    if (this.currentGameNotReadyToCheck(currentClickedCell)) return false;

    let cellForCheckCounter = 0;

    const finder = new LineMatchesFinder(currentClickedCell, this.cells);

    const horizontalChecker = new LineCheckerOptions(finder);
    const verticalChecker = new LineCheckerOptions(finder);
    const diagonal45degChecker = new LineCheckerOptions(finder);
    const diagonal135degChecker = new LineCheckerOptions(finder);

    const allPossibleDirectionsWithMatches = [
      horizontalChecker.matches,
      verticalChecker.matches,
      diagonal45degChecker.matches,
      diagonal135degChecker.matches,
    ];

    while (cellForCheckCounter < MATCHES_TO_WIN) {
      const findedHorizontal: LocalFinded = horizontalChecker.checkForMatch(
        { x: cellForCheckCounter, y: 0 },
        { x: cellForCheckCounter * -1, y: 0 },
      );

      const findedVertical: LocalFinded = verticalChecker.checkForMatch(
        { x: 0, y: cellForCheckCounter },
        { x: 0, y: cellForCheckCounter * -1 },
      );

      const findedDiagonalMatches45deg: LocalFinded = diagonal45degChecker.checkForMatch(
        { x: cellForCheckCounter * -1, y: cellForCheckCounter },
        { x: cellForCheckCounter, y: cellForCheckCounter * -1 },
      );

      const findedDiagonalMatches135deg: LocalFinded = diagonal135degChecker.checkForMatch(
        { x: cellForCheckCounter, y: cellForCheckCounter },
        { x: cellForCheckCounter * -1, y: cellForCheckCounter * -1 },
      );

      if (findedHorizontal) {
        horizontalChecker.matches.push(...findedHorizontal);
      }
      if (findedVertical) {
        verticalChecker.matches.push(...findedVertical);
      }
      if (findedDiagonalMatches45deg) {
        diagonal135degChecker.matches.push(...findedDiagonalMatches45deg);
      }
      if (findedDiagonalMatches135deg) {
        diagonal45degChecker.matches.push(...findedDiagonalMatches135deg);
      }

      cellForCheckCounter += 1;
    }

    const finalFindedMatch = allPossibleDirectionsWithMatches.find((possibleMatch) => (
      (new Set(possibleMatch)).size >= MATCHES_TO_WIN
    ));
    return finalFindedMatch ? [finalFindedMatch, currentClickedCell.type as PlayerType] : false;
  };

  currentGameNotReadyToCheck = (cell: ICell): boolean => (typeof (cell.type) !== 'string' || this.playersMoves[cell.type].length < MATCHES_TO_WIN);
}

export { MainStore };
