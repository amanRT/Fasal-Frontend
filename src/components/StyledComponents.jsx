import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #121212;
  color: #ffffff;
  text-align: center; /* Center the text in the container */
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 20px;
  background-color: #1f1f1f;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: center; /* Center the text in the form */
`;

export const Input = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #333333;
  color: #ffffff;
`;

export const Button = styled.button`
  padding: 10px;
  margin-bottom: 20px;
  margin-top: 20px;
  border: none;
  border-radius: 4px;
  background-color: #6c5ce7;
  color: #ffffff;
  cursor: pointer;

  &:hover {
    background-color: #5a4cb2;
  }
`;

export const Title = styled.h2`
  margin-bottom: 20px;
  color: #6c5ce7;
`;

export const LinkText = styled.span`
  color: #6c5ce7;
  cursor: pointer;
  text-decoration: underline;
`;
