import React, { useState } from "react";
import styled from "styled-components";

const FormContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  margin: 20px auto;
`;

const FormTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    outline: none;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    outline: none;
  }
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const Form = ({ setState, newUsers, setNewUsers, handleSignUp }) => {
  const [err, setError] = useState("");
  // const AddNewUser = () => {
  //   if (data.name && data.surname && data.email) {
  //     setNewUsers([...newUsers, data]);
  //     setState(false);
  //   }
  // };
  const handleData = (e) => {
    const { name, value } = e.target;
    setNewUsers({ ...newUsers, [name]: value });
  };
  return (
    <FormContainer>
      <form>
        <p>{err}</p>
        <FormTitle>Add New User</FormTitle>
        <FormGroup>
          <Label htmlFor="username">Username</Label>
          <Input
            onChange={(e) => handleData(e)}
            type="text"
            id="username"
            name="username"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Enter a temporary password</Label>
          <Input
            onChange={(e) => handleData(e)}
            type="password"
            id="password"
            name="password"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            onChange={(e) => handleData(e)}
            id="email"
            name="email"
            rows="4"
            required
          />
        </FormGroup>
        <Button onClick={() => handleSignUp(setError)} type="button">
          Submit
        </Button>
        <br></br>
        <Button
          onClick={() => setState(false)}
          style={{ background: "red" }}
          type="button"
        >
          Cancel
        </Button>
      </form>
    </FormContainer>
  );
};

export default Form;
