import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f3f5f8;
`;

const Header = styled.header.attrs({
  role: "banner",
})`
  padding: 1.5rem;
  background-color: #263347;
  color: #fff;

  p {
    margin: 0;
    font-size: 1.5rem;
    color: #bac7da;
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 3.25rem;
  font-weight: normal;
  padding-bottom: 1rem;

  a {
    text-decoration: none;
  }
`;

const Nav = styled.nav.attrs({
  role: "navigation",
})`
  position: relative;
  background-color: #84d1ba;
  background-image: linear-gradient(#a2dccb, #84d1ba, #5bc1a3);
  border-top: 1px solid #bce6d9;
  border-bottom: 1px solid #3a9b7e;
  color: #194437;
  font-size: 0.9em;

  ul {
    margin: 0;
    padding: 1rem;
    padding-left: 1.5rem;
  }

  li {
    display: inline;
    list-style-type: none;

    & + li {
      border-left: 1px solid #5bc1a3;
      margin-left: 0.5rem;
      padding-left: 0.5rem;
    }
  }
`;

const Article = styled.article`
  flex: 1;
  padding: 1.5rem;
  font-family: Georgia, serif;
  border-bottom: 1px solid #bfbfbf;

  img {
    max-width: 100%;
  }
`;

const Meta = styled.p`
  font-size: 0.9em;
  color: #aaa;
  margin: 0;
`;

const Footer = styled.footer.attrs({
  role: "contentinfo",
})`
  padding: 0.5rem 1.5rem;
  font-size: 0.8em;
  border-top: 1px solid #f2f2f2;
  text-shadow: #d9d9d9 0 1px;
  color: #444;
  background-color: #e0e0e0;
  background-image: linear-gradient(#e0e0e0, #ccc, #b0b0b0);
  border-top: 1px solid #f2f2f2;
`;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const posted = new Date();
const formattedDate = `${
  MONTHS[posted.getMonth()]
} ${posted.getDate()}, ${posted.getFullYear()}`;

type Props = {
  html: string;
};

const LivePage = ({ html }: Props) => (
  <Container>
    <Header>
      <Title>
        <a href="/">Draftail Playground</a>
      </Title>
      <p>Try Draftail in a full-fledged preview environment</p>
    </Header>

    <Nav>
      <ul>
        <li>
          <a href="https://github.com/thibaudcolas/draftail-playground">
            View it on GitHub
          </a>
        </li>
        <li>
          <a href="https://www.draftail.org/">Draftail</a>
        </li>
        <li>
          <a href="https://github.com/springload/draftjs_exporter">
            Draft.js exporter
          </a>
        </li>
        <li>
          <a href="https://draftjs.org/">Draft.js</a>
        </li>
      </ul>
    </Nav>
    <Article>
      <Meta>
        <time>{formattedDate}</time> • <a href="/">Permalink</a>
      </Meta>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Article>
    <Footer>
      <p>
        By{" "}
        <a href="https://twitter.com/thibaud_colas" rel="author">
          Thibaud Colas
        </a>{" "}
        - Content available under{" "}
        <a
          rel="license"
          href="https://creativecommons.org/publicdomain/zero/1.0/"
        >
          CC0
        </a>{" "}
        - Hosted on <a href="https://vercel.com/">Vercel</a> -{" "}
        <a href="https://github.com/thibaudcolas/draftail-playground">
          View source
        </a>
      </p>
    </Footer>
  </Container>
);

export default LivePage;
