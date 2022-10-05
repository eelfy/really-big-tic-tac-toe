import { FC, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store/RootStore';
import { CellBehaviorProps, MarkOfCell } from './CellTypes';
import CellTemplate from './CellTemplate';

const CellBehavior: FC<CellBehaviorProps> = observer(({ cell, isWinCell }) => {
  const { MainStore: { clickOnCell } } = useStore();

  const cellClickHandler = () => {
    clickOnCell(cell);
  };

  const cellMark = useMemo(
    (): MarkOfCell => {
      const { type } = cell;
      if (type === null) return null;
      return type === 'cross' ? 'x' : 'o';
    },
    [cell.type],
  );

  return (
    <CellTemplate
      cellClickHandler={cellClickHandler}
      cellMark={cellMark}
      isWinCell={isWinCell}
    />
  );
});

export default CellBehavior;
