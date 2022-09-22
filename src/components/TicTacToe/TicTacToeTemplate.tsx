import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { useStore } from '../../store/RootStore';
import Cell from '../Cell';
import GameSettings from '../GameSettings';
import { Wrapper, Game } from './TicTacToeStyled';
import { TicTacToeTemplateProps } from './TicTacToeTypes';

const TicTacToeTemplate: FC<TicTacToeTemplateProps> = observer(() => {
  const {
    MainStore: {
      cells, gameStatus, totalGameResults, renderAdditionalRows, renderAdditionalColumns,
    },
  } = useStore();
  return (
    <Wrapper>
      <GameSettings />
      <Game onScroll={(event) => {
        /*
          TODO нужно поправить функцию рендера дополнительных ячеек
          т.к сейчас она работает не корректно
        */
        const element = event.currentTarget;

        if (element.scrollHeight - element.scrollTop === element.clientHeight) {
          renderAdditionalRows();
        }
        if (element.scrollWidth - element.scrollLeft === element.clientWidth) {
          renderAdditionalColumns();
        }
      }}
      >
        {
          gameStatus === 'not started' ? <div>начните игру</div> : (
            cells.map((row, rowIndex) => (
              /*
               here i can use index as key cause i know that array will only mutate
               and elements in array will never be delete or change our position
              */
              // eslint-disable-next-line react/no-array-index-key
              <div style={{ display: 'flex' }} key={rowIndex}>
                {row.map((cell) => {
                  const isWinCell = totalGameResults.some((winCell) => `${winCell[0]}:${winCell[1]}` === cell.id);
                  return (<Cell key={cell.id} cell={cell} isWinCell={isWinCell} />);
                })}
              </div>
            ))
          )
        }
      </Game>
    </Wrapper>
  );
});

export default TicTacToeTemplate;
