// frontend/src/components/Signup.jsx


import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  TextField,
  Card,
  CardContent,
  MenuItem,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material";

import { validatePassword } from "../utils/validators";
import { toast } from 'react-hot-toast';


const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    department: "",
    phone_no: "",
    password: "",
    confirm_password: "",
    role: "student",
    staff_code: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // frontend password check
    if (form.password !== form.confirm_password) {
      toast.error(" Passwords do not match");
      return;
    }

    const passwordError = validatePassword(form.password);
    if (passwordError) {
      toast.error(` ${passwordError}`);
      return;
    }


    try {
      const payload = {
        username: form.username,
        email: form.email,
        first_name: form.first_name,
        last_name: form.last_name,
        department: form.department,
        phone_no: form.phone_no,
        password: form.password,
        confirm_password: form.confirm_password,
        role: form.role,
      };

      // send staff_code only if role is staff
      if (form.role === "staff") {
        payload.staff_code = form.staff_code;
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );



      toast.success(" Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(
        error.response?.data?.non_field_errors ||
        JSON.stringify(error.response?.data) ||
        "Signup failed"
      );
    }
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Nav */}
      <AppBar position="sticky" color="default">
        <Toolbar>
          <Button startIcon={<ArrowBack />} onClick={() => navigate("/")}>
            Back
          </Button>
          <Typography sx={{ flexGrow: 1, fontWeight: "bold" }}>
            CampusEvents
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Form */}
      <Box sx={{ bgcolor: "primary.main", py: 8 }}>
        <Container maxWidth="sm">
          <Card>
            <CardContent>
              <Typography variant="h4" align="center" gutterBottom>
                Create Account
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
                <TextField label="First Name" name="first_name" onChange={handleChange} required />
                <TextField label="Last Name" name="last_name" onChange={handleChange} required />
                <TextField label="Register Number" name="username" onChange={handleChange} required />
                <TextField label="College Email" name="email" type="email" onChange={handleChange} required />

                <TextField
                  select
                  label="Department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="BCA">BCA</MenuItem>
                  <MenuItem value="BBA">BBA</MenuItem>
                  <MenuItem value="BCOM">BCOM</MenuItem>
                  <MenuItem value="BSW">BSW</MenuItem>
                  <MenuItem value="BACE">BACE</MenuItem>
                  <MenuItem value="ECONOMICS">BA ECONOMICS</MenuItem>
                  <MenuItem value="PHYSICS">PHYSICS</MenuItem>
                  <MenuItem value="MATHS">MATHS</MenuItem>
                  <MenuItem value="MCA">MCA</MenuItem>
                  <MenuItem value="MCOM">MCOM</MenuItem>
                  <MenuItem value="MSW">MSW</MenuItem>
                  <MenuItem value="MCMS">MCMS</MenuItem>
                  <MenuItem value="MMH">MMH</MenuItem>
                  <MenuItem value="MBA">MBA</MenuItem>






                </TextField>
                <TextField label="Phone Number" name="phone_no" onChange={handleChange} required />


                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                <Button type="submit" variant="contained" size="large">
                  Sign Up
                </Button>

                <Typography align="center">
                  Already have an account?{" "}
                  <span
                    style={{ cursor: "pointer", fontWeight: "bold" }}
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </span>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default Signup;
