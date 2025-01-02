import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Stepper,
  Step,
  StepLabel,
  Grid,
  IconButton,
  InputAdornment,
  Alert,
  useTheme,
  useMediaQuery,
  Stack,
  styled,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Visibility, VisibilityOff, Google, LockOutlined } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/store';
import type { RootState } from '@/store/store';
import { register, loginWithGoogle } from '@/features/auth/authSlice';
import { RegistrationData, Address } from '@/types/auth';

const steps = ['Personal Information', 'ID Verification', 'Account Security'];

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '480px',
  margin: '0 auto',
}));

const LogoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  '& svg': {
    fontSize: 28,
    color: theme.palette.primary.main,
  },
}));

const StyledStepper = styled(Stepper)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(3),
  '& .MuiStepLabel-label': {
    fontSize: '0.875rem',
  },
  '& .MuiStepIcon-root': {
    width: 28,
    height: 28,
  },
}));

const FormContainer = styled(Box)({
  width: '100%',
});

// Add a type for ID verification
type IdType = 'ssn' | 'stateId' | 'realId' | 'drivingLicense';

const RegisterPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state: RootState) => state.auth);
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedIdType, setSelectedIdType] = useState<IdType>('ssn');

  const [formData, setFormData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    ssn_last4: '',
    stateId: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
    },
  });

  // Add new state for recovery methods
  const [selectedRecoveryMethods, setSelectedRecoveryMethods] = useState<string[]>([]);
  const [recoveryData, setRecoveryData] = useState({
    phone: '',
    backupEmail: '',
    trustedContact: {
      name: '',
      relationship: '',
      phone: '',
      email: '',
    },
  });

  // Add validation state
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isContactVerified, setIsContactVerified] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof RegistrationData] as Address),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeStep < steps.length - 1) {
      handleNext();
      return;
    }
    await dispatch(register(formData));
  };

  const handleGoogleSignIn = async () => {
    await dispatch(loginWithGoogle());
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Typography variant="body1" color="text.secondary">
              Create your secure account to manage your important documents.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                required
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={isLoading}
                variant="outlined"
                size="medium"
                placeholder="First Name"
              />
              <TextField
                required
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isLoading}
                variant="outlined"
                size="medium"
                placeholder="Last Name"
              />
            </Box>
            <TextField
              required
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              variant="outlined"
              size="medium"
              placeholder="Email Address"
            />
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              variant="outlined"
              size="medium"
              placeholder="Password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              sx={{
                py: 1.5,
                mt: 1,
                color: 'text.primary',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'transparent',
                },
              }}
            >
              Continue with Google
            </Button>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3}>
            <Alert 
              severity="info" 
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem',
                },
              }}
            >
              Please provide your date of birth and one form of government ID for verification. Your address will be automatically retrieved from the government database.
            </Alert>
            <TextField
              required
              fullWidth
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              disabled={isLoading}
              variant="outlined"
              size="medium"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& input[type="date"]': {
                    padding: '16.5px 14px',
                  },
                  '& input[type="date"]::-webkit-calendar-picker-indicator': {
                    cursor: 'pointer',
                    padding: '4px',
                  },
                },
                '& .MuiInputLabel-root': {
                  transform: 'translate(14px, -9px) scale(0.75)',
                  '&.Mui-focused': {
                    transform: 'translate(14px, -9px) scale(0.75)',
                  },
                  '&:not(.Mui-focused):not(.MuiFormLabel-filled)': {
                    transform: 'translate(14px, -9px) scale(0.75)',
                  },
                },
              }}
              placeholder="MM/DD/YYYY"
              inputProps={{
                max: new Date().toISOString().split('T')[0],
                min: "1900-01-01"
              }}
            />
            
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Select one form of identification *
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant={selectedIdType === 'ssn' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedIdType('ssn')}
                    sx={{ justifyContent: 'flex-start', py: 1.5 }}
                  >
                    Last 4 digits of SSN
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant={selectedIdType === 'drivingLicense' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedIdType('drivingLicense')}
                    sx={{ justifyContent: 'flex-start', py: 1.5 }}
                  >
                    Driver's License Number
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant={selectedIdType === 'stateId' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedIdType('stateId')}
                    sx={{ justifyContent: 'flex-start', py: 1.5 }}
                  >
                    State ID Number
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant={selectedIdType === 'realId' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedIdType('realId')}
                    sx={{ justifyContent: 'flex-start', py: 1.5 }}
                  >
                    Real ID Number
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {selectedIdType === 'ssn' && (
              <TextField
                required
                fullWidth
                label="Last 4 digits of SSN"
                name="ssn_last4"
                value={formData.ssn_last4}
                onChange={handleChange}
                disabled={isLoading}
                inputProps={{ 
                  maxLength: 4,
                  pattern: '[0-9]*',
                  inputMode: 'numeric'
                }}
                variant="outlined"
                size="medium"
                helperText="Enter the last 4 digits of your Social Security Number"
              />
            )}

            {selectedIdType === 'drivingLicense' && (
              <TextField
                required
                fullWidth
                label="Driver's License Number"
                name="stateId"
                value={formData.stateId}
                onChange={handleChange}
                disabled={isLoading}
                variant="outlined"
                size="medium"
                helperText="Enter your Driver's License Number as shown on your license"
              />
            )}

            {selectedIdType === 'stateId' && (
              <TextField
                required
                fullWidth
                label="State ID Number"
                name="stateId"
                value={formData.stateId}
                onChange={handleChange}
                disabled={isLoading}
                variant="outlined"
                size="medium"
                helperText="Enter your State ID Number as shown on your ID"
              />
            )}

            {selectedIdType === 'realId' && (
              <TextField
                required
                fullWidth
                label="Real ID Number"
                name="stateId"
                value={formData.stateId}
                onChange={handleChange}
                disabled={isLoading}
                variant="outlined"
                size="medium"
                helperText="Enter your Real ID Number as shown on your ID"
              />
            )}
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={3}>
            <Alert 
              severity="info" 
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem',
                },
              }}
            >
              Let's set up a way to recover your account if you ever get locked out. Choose the methods that work best for you.
            </Alert>

            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, mb: 2 }}>
                How would you like to recover your account? (Choose at least 2)
              </Typography>
              
              <Stack spacing={2}>
                <Box sx={{ 
                  p: 2, 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={selectedRecoveryMethods.includes('phone')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRecoveryMethods([...selectedRecoveryMethods, 'phone']);
                          } else {
                            setSelectedRecoveryMethods(selectedRecoveryMethods.filter(m => m !== 'phone'));
                          }
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Recovery Phone Number
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          We'll send a code to your phone if you need to recover your account
                        </Typography>
                      </Box>
                    }
                  />
                  {selectedRecoveryMethods.includes('phone') && (
                    <Box sx={{ mt: 2, ml: 4 }}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={recoveryData.phone}
                        onChange={(e) => setRecoveryData({ ...recoveryData, phone: e.target.value })}
                        placeholder="Enter your phone number"
                        variant="outlined"
                        size="medium"
                        type="tel"
                        disabled={isPhoneVerified}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {isPhoneVerified ? (
                                <Typography variant="caption" color="success.main">
                                  Verified ✓
                                </Typography>
                              ) : (
                                <Button
                                  size="small"
                                  onClick={() => {
                                    // TODO: Implement phone verification
                                    setIsPhoneVerified(true);
                                  }}
                                >
                                  Verify
                                </Button>
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  )}
                </Box>

                <Box sx={{ 
                  p: 2, 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={selectedRecoveryMethods.includes('email')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRecoveryMethods([...selectedRecoveryMethods, 'email']);
                          } else {
                            setSelectedRecoveryMethods(selectedRecoveryMethods.filter(m => m !== 'email'));
                          }
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Backup Email Address
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Use another email address to recover your account
                        </Typography>
                      </Box>
                    }
                  />
                  {selectedRecoveryMethods.includes('email') && (
                    <Box sx={{ mt: 2, ml: 4 }}>
                      <TextField
                        fullWidth
                        label="Backup Email"
                        name="backupEmail"
                        value={recoveryData.backupEmail}
                        onChange={(e) => setRecoveryData({ ...recoveryData, backupEmail: e.target.value })}
                        placeholder="Enter your backup email"
                        variant="outlined"
                        size="medium"
                        type="email"
                        disabled={isEmailVerified}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {isEmailVerified ? (
                                <Typography variant="caption" color="success.main">
                                  Verified ✓
                                </Typography>
                              ) : (
                                <Button
                                  size="small"
                                  onClick={() => {
                                    // TODO: Implement email verification
                                    setIsEmailVerified(true);
                                  }}
                                >
                                  Verify
                                </Button>
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  )}
                </Box>

                <Box sx={{ 
                  p: 2, 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={selectedRecoveryMethods.includes('trustedContact')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRecoveryMethods([...selectedRecoveryMethods, 'trustedContact']);
                          } else {
                            setSelectedRecoveryMethods(selectedRecoveryMethods.filter(m => m !== 'trustedContact'));
                          }
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Trusted Family Member or Friend
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Choose someone you trust to help you recover your account
                        </Typography>
                      </Box>
                    }
                  />
                  {selectedRecoveryMethods.includes('trustedContact') && (
                    <Box sx={{ mt: 2, ml: 4 }}>
                      <Stack spacing={2}>
                        <TextField
                          fullWidth
                          label="Contact Name"
                          name="trustedContactName"
                          value={recoveryData.trustedContact.name}
                          onChange={(e) => setRecoveryData({
                            ...recoveryData,
                            trustedContact: { ...recoveryData.trustedContact, name: e.target.value }
                          })}
                          placeholder="Enter trusted contact's name"
                          variant="outlined"
                          size="medium"
                          disabled={isContactVerified}
                        />
                        <TextField
                          fullWidth
                          label="Relationship"
                          name="trustedContactRelationship"
                          value={recoveryData.trustedContact.relationship}
                          onChange={(e) => setRecoveryData({
                            ...recoveryData,
                            trustedContact: { ...recoveryData.trustedContact, relationship: e.target.value }
                          })}
                          placeholder="e.g., Parent, Sibling, Friend"
                          variant="outlined"
                          size="medium"
                          disabled={isContactVerified}
                        />
                        <TextField
                          fullWidth
                          label="Contact Phone"
                          name="trustedContactPhone"
                          value={recoveryData.trustedContact.phone}
                          onChange={(e) => setRecoveryData({
                            ...recoveryData,
                            trustedContact: { ...recoveryData.trustedContact, phone: e.target.value }
                          })}
                          placeholder="Enter contact's phone number"
                          variant="outlined"
                          size="medium"
                          type="tel"
                          disabled={isContactVerified}
                        />
                        <TextField
                          fullWidth
                          label="Contact Email"
                          name="trustedContactEmail"
                          value={recoveryData.trustedContact.email}
                          onChange={(e) => setRecoveryData({
                            ...recoveryData,
                            trustedContact: { ...recoveryData.trustedContact, email: e.target.value }
                          })}
                          placeholder="Enter contact's email"
                          variant="outlined"
                          size="medium"
                          type="email"
                          disabled={isContactVerified}
                        />
                        {!isContactVerified && (
                          <Button
                            variant="outlined"
                            onClick={() => {
                              // TODO: Implement trusted contact verification
                              setIsContactVerified(true);
                            }}
                          >
                            Verify Contact
                          </Button>
                        )}
                        {isContactVerified && (
                          <Alert severity="success">
                            Contact verified successfully
                          </Alert>
                        )}
                      </Stack>
                    </Box>
                  )}
                </Box>

                <Box sx={{ 
                  p: 2, 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={selectedRecoveryMethods.includes('government')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRecoveryMethods([...selectedRecoveryMethods, 'government']);
                          } else {
                            setSelectedRecoveryMethods(selectedRecoveryMethods.filter(m => m !== 'government'));
                          }
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Visit a Government Office
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Recover your account by visiting any government office with your ID
                        </Typography>
                        {selectedRecoveryMethods.includes('government') && (
                          <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                            This option is always available and requires no additional setup
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </Box>
              </Stack>
            </Box>

            <Alert 
              severity={selectedRecoveryMethods.length >= 2 ? "success" : "warning"}
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem',
                },
              }}
            >
              {selectedRecoveryMethods.length >= 2 
                ? "Great! You've selected enough recovery methods to keep your account secure."
                : "Important: Choose at least two recovery methods. This helps keep your account safe and makes sure you can always access your documents."}
            </Alert>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Container maxWidth="sm" sx={{ width: '100%' }}>
        <StyledPaper>
          <LogoBox>
            <LockOutlined />
            <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
              DocSafe
            </Typography>
          </LogoBox>

          <Typography
            component="h1"
            variant="h5"
            gutterBottom
            sx={{ 
              color: 'text.primary', 
              fontWeight: 600,
              mb: 2,
            }}
          >
            Create Account
          </Typography>

          <StyledStepper
            activeStep={activeStep}
            orientation={isMobile ? 'vertical' : 'horizontal'}
            alternativeLabel={!isMobile}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </StyledStepper>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                width: '100%', 
                mb: 2,
                borderRadius: 1,
              }}
            >
              {error}
            </Alert>
          )}

          <FormContainer
            component="form"
            onSubmit={handleSubmit}
          >
            {renderStepContent(activeStep)}

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: 3,
              gap: 1,
            }}>
              <Button
                disabled={activeStep === 0 || isLoading}
                onClick={handleBack}
                variant="outlined"
                size="large"
                sx={{ 
                  flex: 1,
                  borderColor: 'divider',
                }}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                size="large"
                sx={{ 
                  flex: 1,
                }}
              >
                {activeStep === steps.length - 1 ? 'Create Account' : 'Next'}
              </Button>
            </Box>

            {activeStep === 0 && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link 
                    component={RouterLink} 
                    to="/login" 
                    color="primary"
                    sx={{ 
                      textDecoration: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
            )}
          </FormContainer>
        </StyledPaper>
      </Container>
    </Box>
  );
};

export default RegisterPage; 