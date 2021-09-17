import React from 'react';
import { IconButton, InputAdornment, Stack, TextField } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

const LoginForm = ({ formik }) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <>
            <Stack spacing={2}>
                <TextField
                    fullWidth
                    name="email"
                    label="Email"
                    margin="dense"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />

                <TextField
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    margin="dense"
                    InputProps={{
                        endAdornment: (
                            < InputAdornment position="end" >
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                    onMouseDown={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <Visibility /> : < VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />
            </Stack>
        </>
    )
}

export default LoginForm;