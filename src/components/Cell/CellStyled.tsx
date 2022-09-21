import styled from 'styled-components';

const CellBox = styled.div<{ isWinCell:boolean }>`
    height: 50px;
    width: 50px;

    border-bottom: var(--border-blue);
    border-right:  var(--border-blue);

    display: flex;
    justify-content: center;
    align-items: center;

    color: tomato;
    font-size: 22px;
    
    background-color: ${({ isWinCell }) => (isWinCell ? 'lime' : '')};
`;

export { CellBox };
