import React from "react";
import { connect, useDispatch } from "react-redux";
import styled from "styled-components";

import { userPool } from "../aws-exports";
const NavSections = [
  { name: "Home", user: true },
  { name: "Account", user: false },
  { name: "Upload", user: false },

];
const SidebarContainer = styled.div`
  width: 250px;
  background: #B0B0B0;
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
  padding: 0px;
`;
const Sidebar = ({ isOpen, section, email, userRole }) => {
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
          <p style={{ fontWeight: "bold" }}>{email}</p>
          <br></br>
          {NavSections.map((data) => {
            if (userRole && userRole === "TenantAdmin") {
              data.user = true;
            }
            return (
              data.user && (
                <Button
                  className="button"
                  onClick={() => dispatch({ type: data.name })}
                  style={
                    section === data.name
                      ? { background: "#007bff", color: "white" }
                      : {}
                  }
                >
                  {data.name}
                </Button>
              )
            );
          })}
        </div>
        <div
          style={{
            height: "10%",
            display: "flex",
            position: "absolute",
            bottom: "10px",
            width: "100%",
            justifyContent: "center",
            alignItems: "end",
          }}
        >
          <Button
            className="button"
            style={{ margin: "0px" }}
            onClick={() => {
              userPool.getCurrentUser().signOut();
              window.location.reload();
            }}
          >
            Signout
          </Button>
        </div>
      </div>
    </SidebarContainer>
  );
};
const mapStateToProps = (state) => {
  return {
    section: state.section,
    email: state?.session?.idToken?.payload?.email || "",
    userRole: state?.session?.idToken?.payload["custom:userRole"] || null,
  };
};
export default connect(mapStateToProps, {})(Sidebar);
