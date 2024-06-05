import { useState } from "react";
import jwtDecode from "jwt-decode";
// import "./App.css";
import {
  Container,
  Form,
  Input,
  Button,
  Title,
  LinkText,
} from "./StyledComponents";
function ErrorMessage(message) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}
const Signup = ({ setIsLogin, setSign, setUserDetails, fetchUserDetails }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "https://fasal-backend.vercel.app/userRegister",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fname: firstName,
            lname: lastName,
            email,
            password,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        const decoded = jwtDecode(data.token);
        // console.log(decoded.id);
        setIsLogin(false);
        fetchUserDetails(decoded.id);
      } else {
        const data2 = await response.json();
        setError(data2.message);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setError("An error occurred during signup. Please try again later.");
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Signup</Title>
        {error && <ErrorMessage message={error} />}
        <Input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit">Signup</Button>
        <div>
          Have an account?{" "}
          <LinkText onClick={() => setSign(true)}>Login</LinkText>
        </div>
      </Form>
    </Container>
  );
};
export default Signup;
