import styled from 'styled-components';

const Wrapper = styled.section`
  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;

  gap: 10px;

  padding: 0 30px;
`;

const Game = styled.div`
  position: relative;
  overflow: auto;

  display: flex;
  flex-wrap: wrap;

  box-shadow: var(--shadow-default);

  width: 100%;
  height: 100%;

  background-color: #fff;

  border: var(--border-blue);
`;

export { Wrapper, Game };
