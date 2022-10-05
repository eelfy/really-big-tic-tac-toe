import { validateMatchesToWin } from '../utils';

const C = process.env.MATCHES_TO_WIN!;

const MAP_ROWS = 50;
const MAP_COLUMNS = 50;
const MATCHES_TO_WIN = validateMatchesToWin(C);

export { MAP_ROWS, MAP_COLUMNS, MATCHES_TO_WIN };
