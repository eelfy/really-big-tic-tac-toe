const C = process.env.MATCHES_TO_WIN;

const MAP_ROWS = 20;
const MAP_COLUMNS = 20;
const MATCHES_TO_WIN: number = Number(C) || 5;

export { MAP_ROWS, MAP_COLUMNS, MATCHES_TO_WIN };
