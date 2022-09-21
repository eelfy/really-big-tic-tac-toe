import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { MATCHES_TO_WIN } from '../../consts/game';
import { useStore } from '../../store/RootStore';
import { GameSettingsTemplateProps } from './GameSettingsTypes';

const GameSettingsTemplate: FC<GameSettingsTemplateProps> = observer(() => {
  const {
    MainStore: {
      isNowCross, resetGame, startGame, gameStatus,
    },
  } = useStore();
  return (
    <div>
      {
        gameStatus === 'started' && (
          <>
            <h1>
              Ходит:
              {' '}
              {isNowCross ? 'X' : 'O'}
            </h1>
            <h1>
              cовпадений для победы:
              {' '}
              {MATCHES_TO_WIN}
            </h1>

          </>
        )
      }

      {
        gameStatus.includes('win') && (
        <h1>
          {gameStatus}
        </h1>
        )
      }
      {
        gameStatus === 'not started'
          ? (<button type="button" onClick={startGame}>начать игру</button>)
          : (<button type="button" onClick={resetGame}>начать новую игру</button>)
      }

    </div>
  );
});

export default GameSettingsTemplate;
