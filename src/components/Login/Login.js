import React, { useState } from "react";
import { app, auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
} from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ textAlign: "center", marginTop: "50px" }}>
      <Paper
        sx={{
          padding: 5,
          maxWidth: "100%",
          backgroundColor: "rgba(52, 52, 52, 0.1)",
        }}
        elevation={20}
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => (e.keyCode === 13 ? handleLogin(e) : null)}
          />
          <Button variant="contained" onClick={handleLogin}>
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
