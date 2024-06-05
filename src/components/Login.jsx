import { useState } from "react";
import jwtDecode from "jwt-decode";

import {
  Container,
  Form,
  Input,
  Button,
  Title,
  LinkText,
} from "./StyledComponents";

function Login({ setIsLogin, setSign, setUserDetails, fetchUserDetails }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://fasal-backend.vercel.app/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        const decoded = jwtDecode(data.token);
        setIsLogin(false);
        fetchUserDetails(decoded.id);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Failed to login:", error);
    }
  };

  return (
    <Container>
      <Title>Login</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <Button type="submit">Login</Button>
        <LinkText onClick={() => setSign(false)}>
          Don't have an account? Sign up
        </LinkText>
      </Form>
    </Container>
  );
}
export default Login;
