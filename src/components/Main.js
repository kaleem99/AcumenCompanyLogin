import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Home from "./Home";
import Account from "./Account";

const MainContainer = styled.div`
  flex-grow: 1;
  background: #f4f4f4;
  padding: 20px;
`;

const Main = ({ section }) => {
  console.log(section);
  const checkSection = () => {
    switch (section) {
      case "Home":
        return <Home />;
      case "Account":
        return <Account />;
      default:
        return <Home />;
    }
  };
  return (
    <MainContainer>
      <h1>{section}</h1>
      {checkSection()}
    </MainContainer>
  );
};
const mapStateToProps = (state) => {
  return {
    section: state.section,
  };
};
export default connect(mapStateToProps, {})(Main);
