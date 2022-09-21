type TypeOfCell = null | 'cross' | 'zero';
type MarkOfCell = null | 'x' | 'o';

type RowCount = number;
type ColumnCount = number;

type CellId = `${RowCount}:${ColumnCount}`;
type CellCoordinates = [RowCount, ColumnCount];

interface ICell {
  readonly id: CellId;
  readonly coordinates: CellCoordinates
  type: TypeOfCell;
}

interface CellProps {
  isWinCell: boolean;
}
interface CellTemplateProps extends CellProps {
  cellClickHandler: () => void;
  cellMark: () => MarkOfCell;
  isCellWinned: boolean;
}
interface CellBehaviorProps extends CellProps {
  cell: ICell;
}

export type {
  CellTemplateProps, CellBehaviorProps, ICell, MarkOfCell,
  CellId, CellCoordinates, TypeOfCell,
};
