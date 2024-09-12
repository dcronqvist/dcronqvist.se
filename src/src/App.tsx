import React from 'react';
import logo from './logo.svg';

import styled from 'styled-components';

function Separator() {
  const Separator = styled.hr`
    border: 1px solid lightblue;
    padding: 0px;
    margin: 0px;
    `;

  return <Separator />;
}

function Header() {
  const HeaderDiv = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
  `;

  return (
    <header>
      <HeaderDiv>
        <p>dcronqvist</p>
        <p>github</p>
        <p>linkedin</p>
        <p>email</p>
      </HeaderDiv>
      <Separator />
    </header>
  );
}

function Sidebar() {
  const SidebarDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    & > p,h3 {
      margin-left: 20px;
    }
  `;

  return (
    <SidebarDiv>
      <p>search...</p>
      <h3>tags</h3>
      <p>react</p>
      <p>javascript</p>
      <p>c#</p>
    </SidebarDiv>
  );
};

function ScrollableContent() {
  return (
    <div>
      <p>scrollable content</p>
      <p>scrollable content</p>
    </div>
  );
}

function Content() {
  const Grid = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;

    border: 1px solid green;

    & > div {
      border: 1px solid blue;
    }

    :first-child {
      width: 30%;
    }

    :nth-child(2) {
      width: 70%;
    }
  `;

  return (
    <Grid>
      <Sidebar />
      <ScrollableContent />
    </Grid>
  );
}

function App() {
  const RootWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #282c34;
    color: lightgray;
  `;

  const ContentDiv = styled.div`
    width: 800px;
    border: 1px solid red;
    height: 90%;
  `;

  return (
    <RootWrapper>
      <ContentDiv>
        <Header />
        <Content />
      </ContentDiv>
    </RootWrapper>
  );
}

export default App;
