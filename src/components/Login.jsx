// import React, { useState } from "react";
// import {
//   Container,
//   Form,
//   Input,
//   Button,
//   Title,
//   LinkText,
// } from "./StyledComponents";

// const Login = ({ setIsLogin }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle login logic here
//   };

//   return (
//     <Container>
//       <Form onSubmit={handleSubmit}>
//         <Title>Login</Title>
//         <Input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <Input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <Button type="submit">Login</Button>
//         <div>
//           Don't have an account?{" "}
//           <LinkText onClick={() => setIsLogin(false)}>Sign up</LinkText>
//         </div>
//       </Form>
//     </Container>
//   );
// };

// export default Login;
