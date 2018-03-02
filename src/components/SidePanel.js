import styled from "styled-components";

const SidePanel = styled.div`
  --min-width: 320px;

  width: 40%;
  min-width: var(--min-width);
  padding: 1rem;

  @media screen and (min-width: 768px) {
    min-height: 100vh;
    border-right: 1px solid #333;
    padding: 2rem;
    --min-width: 420px;
  }

  @media screen and (min-width: 1280px) {
    --min-width: 600px;
  }
`;

export default SidePanel;
