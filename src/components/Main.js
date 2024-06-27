import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Home from "./Home";
import Account from "./Account";
import UserHome from "./UserHome";
import Upload from "./Upload";

const MainContainer = styled.div`
  flex-grow: 1;
  background: #f4f4f4;
  padding: 20px;
`;

const Main = ({ section, session }) => {
  const userRole = session?.idToken?.payload["custom:userRole"] || null;
  const checkSection = () => {
    switch (section) {
      case "Home":
        if (userRole && userRole === "TenantUser") {
          return <UserHome />;
        }
        return <Home />;
      case "Upload":
        return <Upload />;
      case "Account":
        return <Account />;
      default:
        return <Home />;
    }
  };
  return (
    <MainContainer>
      <div className="sectionName">{section}</div>
      {checkSection()}
    </MainContainer>
  );
};
const mapStateToProps = (state) => {
  return {
    section: state.section,
    session: state.session,
  };
};
export default connect(mapStateToProps, {})(Main);
