const validateMatchesToWin = (rawMatchesToWin: string): number => {
  const numberFromRawMatchesToWin = Number(rawMatchesToWin) || 5;
  if (numberFromRawMatchesToWin < 0) return numberFromRawMatchesToWin * -1;
  return numberFromRawMatchesToWin;
};

export { validateMatchesToWin };
