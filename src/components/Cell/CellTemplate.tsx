import { FC } from 'react';
import { CellBox } from './CellStyled';
import { CellTemplateProps } from './CellTypes';

const CellTemplate: FC<CellTemplateProps> = ({ cellClickHandler, cellMark, isWinCell }) => (
  <CellBox isWinCell={isWinCell} onClick={cellClickHandler}>
    {cellMark}
  </CellBox>
);

export default CellTemplate;
