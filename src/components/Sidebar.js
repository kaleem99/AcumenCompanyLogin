import React from "react";
import { connect, useDispatch } from "react-redux";
import styled from "styled-components";
const NavSections = ["Home", "Account"];
const SidebarContainer = styled.div`
  width: 250px;
  background: #45AA6D;
  color: #fff;
  height: 100%;
  transition: transform 0.3s ease;
  transform: ${({ isOpen }) =>
    isOpen ? "translateX(0)" : "translateX(-100%)"};
  @media (min-width: 769px) {
    transform: translateX(0);
  }
  display: flex;
  j
`;
const Button = styled.div`
  width: 96%;
  height: 40px;
  border: none;
  margin: 10px auto;
  background: white;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const Sidebar = ({ isOpen, section }) => {
  const dispatch = useDispatch();
  return (
    <SidebarContainer isOpen={isOpen}>
      <div
        style={{
          width: "100%",
          height: "95%",
          marginBottom: "0%",
          marginTop: "auto",
        }}
      >
        <div style={{ textAlign: "center", height: "90%" }}>
          <h2>Company Name</h2>
          <br></br>
          {NavSections.map((data) => (
            <Button
              onClick={() => dispatch({ type: data })}
              style={
                section === data
                  ? { background: "#007bff", color: "white" }
                  : {}
              }
            >
              {data}
            </Button>
          ))}
        </div>
        <div style={{ height: "10%" }}>
          <Button>Signout</Button>
        </div>
      </div>
    </SidebarContainer>
  );
};
const mapStateToProps = (state) => {
  return {
    section: state.section,
  };
};
export default connect(mapStateToProps, {})(Sidebar);
