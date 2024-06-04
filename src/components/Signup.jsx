// import React, { useState } from "react";
// import {
//   Container,
//   Form,
//   Input,
//   Button,
//   Title,
//   LinkText,
// } from "./StyledComponents";

// const Signup = ({ setIsLogin }) => {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }
//     // Handle signup logic here
//   };

//   return (
//     <Container>
//       <Form onSubmit={handleSubmit}>
//         <Title>Signup</Title>
//         <Input
//           type="text"
//           placeholder="First Name"
//           value={firstName}
//           onChange={(e) => setFirstName(e.target.value)}
//           required
//         />
//         <Input
//           type="text"
//           placeholder="Last Name"
//           value={lastName}
//           onChange={(e) => setLastName(e.target.value)}
//           required
//         />
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
//         <Input
//           type="password"
//           placeholder="Confirm Password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           required
//         />
//         <Button type="submit">Signup</Button>
//         <div>
//           Have an account?{" "}
//           <LinkText onClick={() => setIsLogin(true)}>Login</LinkText>
//         </div>
//       </Form>
//     </Container>
//   );
// };

// export default Signup;
