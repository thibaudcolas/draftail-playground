// @flow
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 1rem;
`;

type Props = {
  html: string,
};

const LivePage = ({ html }: Props) => (
  <Container>
    <h1>Draftail Playground</h1>
    <div dangerouslySetInnerHTML={{ __html: html }} />
  </Container>
);

export default LivePage;
