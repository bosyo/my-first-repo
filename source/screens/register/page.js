import React, {useState, useEffect, useCallback} from 'react'
import {TextInput, Linking, StatusBar, View} from 'react-native'
import {Container, Content, Icon} from 'native-base'
import {Redirect,} from "react-router-native";
import Meteor, {Accounts} from 'react-native-meteor';
import styled from "styled-components/native";
import {ThemeProvider} from 'styled-components';
import {useSelector, useDispatch} from 'react-redux';
import * as yup from 'yup';
import {useForm} from "react-hook-form";
//
import {Text, Input, Picker, NeoMorph} from '@components';
import LoadingOverlay from '../../components/Layout/LoadingOverlay';
import KeyboardAvoiding from "../../components/Layout/KeyboardAvoiding";
// import bg from '../../images/test-bg-4.jpeg';

export default Home = (props) => {
  // State
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [gender, setGender] = useState('');
  // Form
  const useYupValidationResolver = validationSchema =>
    useCallback(
      async data => {
        try {
          const values = await validationSchema.validate(data, {
            abortEarly: false
          });

          return {
            values,
            errors: {}
          };
        } catch (errors) {
          return {
            values: {},
            errors: errors.inner.reduce(
              (allErrors, currentError) => ({
                ...allErrors,
                [currentError.path]: {
                  type: currentError.type ?? "validation",
                  message: currentError.message
                }
              }),
              {}
            )
          };
        }
      },
      [validationSchema]
    );
  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    age: yup.string().required('Age is required'),
    country: yup.string().required('Country is required'),
    gender: yup.string().required('Gender is required'),
    email: yup.string().email('Invalid Email Address').required('Email is required'),
    password: yup.string().required('Password is required').min(3, 'Password must be atleast 3 characters'),
    confirmPassword: yup.string().required('Confirm password is required').test('password-match', 'Passwords do not match', function (value) {
      const {password} = this.parent;
      return password === value;
    }).min(3, 'Confirm password must be atleast 3 characters'),
  });
  const resolver = useYupValidationResolver(validationSchema);
  const {
    register,
    handleSubmit,
    setValue,
    clearError,
    getValues,
    formState: {errors},
  } = useForm({
    resolver
  });
  // Effects
  useEffect(() => {
    // Orientation.lockToPortrait();
  }, []);
  useEffect(() => {
    register('country');
    register('email');
    register('password');
    register('confirmPassword');
  }, [register]);
  useEffect(() => {
  }, [errors]);
  // Event handlers
  const _onPressRegister = (data) => {
    setLoading(true);
    _register(data);
  };
  const _onPressResetPassword = () => {
    props.history.push('/reset');
  };
  const _onPressLogin = () => {
    props.history.push('/');
  };
  // API
  const _register = (data) => {
    const {
      name,
      age,
      country,
      gender,
      email,
      password,
    } = data;
    Accounts.createUser({
      email,
      password,
      profile: {name, age, gender, country}}, (error, result) => {
      if (error) {
        setLoading(false);
        const {reason} = error;
        if (reason) {
          alert(reason);
        }
      } else {
        _signIn(email, password);
      }
    });
  };
  const _signIn = (email, password) => {
    Meteor.loginWithPassword(email, password, (error) => {
      if (error) {
        const {reason} = error;
        if (reason) {
          alert(reason);
        }
      } else {
        props.history.push('/home');
      }
      setLoading(false);
    });
  }
  // REDUX
  const theme = useSelector(state => state.themeReducer.theme);
  // Components
  const SocialIconComp = ({icon, URL}) => {
    return (
      <SocialIconsBtn onPress={() => {
        Linking.openURL(URL)
      }}>
        <SocialIcon type='FontAwesome' name={icon}/>
      </SocialIconsBtn>
    )
  };
  if (!props.serverConnected) { // Todo change this and detect internet
    return (
      <ServerNotConnected>
        <LoadingOverlay/>
      </ServerNotConnected>
    );
  }
  if (props.user) {
    return <Redirect to={'/home'}/>;
  }
  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle={theme.STATUS_BAR_STYLE}/>
      <StyledContainer
        // source={bg}
      >
        <StyledContent1>
          <StyledContent>
            <Content2>
              {/*<LogoContainer>*/}
              <LogoImage source={theme.LOGO}/>
              {/*</LogoContainer>*/}
              <Input label={'Name'} setValue={setValue} name={'name'} errors={errors}/>
              <Input label={'Age'} setValue={setValue} name={'age'} errors={errors}/>
              <Picker
                name={'gender'}
                items={[
                  {label: 'Male', value: 'male'},
                  {label: 'Female', value: 'female'},
                ]}
                placeholder={'Gender'}
                iosHeader={'Select Gender'}
                selectedValue={gender}
                onValueChange={(gender) => {
                  setValue('gender', gender);
                  setGender(gender);
                }}
                errors={errors}/>
              <Input label={'Country'} setValue={setValue} name={'country'} errors={errors}/>
              <Input label={'Email'} setValue={setValue} name={'email'} errors={errors}/>
              <View style={{width: '100%'}}>
                <Input
                  name={'password'}
                  label={'Password'}
                  setValue={setValue}
                  secureTextEntry={!showPassword}
                  setValue2={setPassword}
                  errors={errors}/>
                {
                  !!password &&
                  <Text style={{position: 'absolute', right: 10, top: 19}} color={'white'} onPress={() => {
                    setShowPassword(!showPassword)
                  }}>
                    {showPassword ? `HIDE` : `SHOW`}
                  </Text>
                }
              </View>
              <View style={{width: '100%'}}>
                <Input
                  name={'confirmPassword'}
                  label={'Confirm Password'}
                  setValue={setValue}
                  secureTextEntry={!showPassword2}
                  setValue2={setPassword2}
                  errors={errors}/>
                {
                  !!password2 &&
                  <Text style={{position: 'absolute', right: 10, top: 19}} color={'white'} onPress={() => {
                    setShowPassword2(!showPassword2)
                  }}>
                    {showPassword2 ? `HIDE` : `SHOW`}
                  </Text>
                }
              </View>
              {/*<NeoMorph>*/}
              {/*  <ForgotPasswordText center color={theme.TEXT_COLOR_1}>Forgot Password?</ForgotPasswordText>*/}
              {/*</NeoMorph>*/}
              <LoginButtonContainer>
                <LoginButton onPress={handleSubmit(_onPressRegister)}>
                  <Text color={theme.colors.text.secondary} center heavy>Sign Up</Text>
                </LoginButton>
              </LoginButtonContainer>
              <RegisterNoteText heavy center color={theme.colors.text.primary}>{`Already have an account? `}
                <Text heavy color={theme.colors.text.primary} underline bold onPress={_onPressLogin}>
                  {`Log In!`}
                </Text>
              </RegisterNoteText>
              {/*<PoweredBy>*/}
              {/*<Text small center color={'white'}>Powered by</Text>*/}
              {/*<Text small center color={'white'}>3P Touch Media Group, Inc.</Text>*/}
              {/*<SocialIconsContainer>*/}
              {/*  <SocialIconComp*/}
              {/*    icon={'youtube'}*/}
              {/*    URL={'https://www.youtube.com/channel/UCy2Rwii4lAGh1lLRjvuk1ig'}*/}
              {/*  />*/}
              {/*  <SocialIconComp*/}
              {/*    icon={'twitter'}*/}
              {/*    URL={'https://twitter.com/southpasadenan'}*/}
              {/*  />*/}
              {/*  <SocialIconComp*/}
              {/*    icon={'instagram'}*/}
              {/*    URL={'https://www.youtube.com/channel/UCy2Rwii4lAGh1lLRjvuk1ig'}*/}
              {/*  />*/}
              {/*  <SocialIconComp*/}
              {/*    icon={'facebook'}*/}
              {/*    URL={'https://www.youtube.com/channel/UCy2Rwii4lAGh1lLRjvuk1ig'}*/}
              {/*  />*/}
              {/*  <SocialIconComp*/}
              {/*    icon={'pinterest'}*/}
              {/*    URL={'https://www.youtube.com/channel/UCy2Rwii4lAGh1lLRjvuk1ig'}*/}
              {/*  />*/}
              {/*</SocialIconsContainer>*/}
              {/*</PoweredBy>*/}
            </Content2>
          </StyledContent>
        </StyledContent1>
        {isLoading && <LoadingOverlay/>}
        <KeyboardAvoiding/>
      </StyledContainer>
    </ThemeProvider>
  )
};

const StyledContainer = styled.ImageBackground`
  flex: 1;
  background-color: ${p => p.theme.colors.core.primary};
`;
const StyledContent1 = styled.SafeAreaView`
  flex: 1;
  width: 100%;
`;
const StyledContent = styled.ScrollView`
  width: 100%;
  padding-horizontal: 25px;
  padding-top: ${p => p.theme.spacing.xxxl};
`;
const Content2 = styled.View`
  width: 100%;
  padding-horizontal: 25px;
  align-items: center;
  padding: 20px 25px 35px 25px;
  background-color: ${p => p.theme.colors.core.primary};
  border-radius: 16px;
`;
const LogoContainer = styled.View`
  width: 100%;
  align-items: center;
  margin-bottom: 35px;
  shadowColor: ${props => props.theme.BUTTON_COLOR_3};
  shadowOffset: { height: 10 };
  shadowOpacity: 0.5;
  shadowRadius: 5;
`;

const LogoImage = styled.Image`
  height: 80px;
  width:  300px;
  resize-mode: contain;
  margin-bottom: ${p => p.theme.spacing.lg};
`;

const LoginButtonContainer = styled.View`
  width: 100%;
  margin-bottom: ${p => p.theme.spacing.xxxl}px;
  height: ${props => props.theme.sizes.button}px;
  align-items: center;
  justify-content: center;
  margin-top: ${p => p.theme.spacing.sm}px;
`;

const LoginButton = styled.TouchableOpacity`
  flex: 1;
  width: 100%;
  padding: 6px;
  background-color: ${props => props.theme.colors.buttons.primary};
  border-radius: ${props => props.theme.sizes.borderRadius};
  justify-content: center;
  shadowColor: ${props => props.theme.colors.core.primary};
  shadowOffset: { height: 10 };
  shadowOpacity: 0.5;
  shadowRadius: 5;
`;

const RegisterButtonContainer = styled.View`
  margin-bottom: 40px;
  height: ${props => props.theme.BUTTON_HEIGHT}px;
  align-items: center;
  justify-content: center;
`;

const RegisterButton = styled.TouchableOpacity`
  flex: 1;
  width: 100%;
  padding: 6px;
  background-color: ${props => props.theme.BUTTON_COLOR_3};
  border-radius: ${props => props.theme.BUTTON_BORDER_RADIUS};
  justify-content: center;
    shadowColor: ${props => props.theme.BUTTON_COLOR_3};
  shadowOffset: { height: 10 };
  shadowOpacity: 0.5;
  shadowRadius: 5;
`;

const ForgotPasswordText = styled(Text)`
  margin-bottom: 30px;
`;

const RegisterNoteText = styled(Text)`
  margin-bottom: 30px;
`;

const SocialIconsContainer = styled.View`
  width: 100%;
  padding-horizontal: 20px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

const SocialIconsBtn = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  margin-horizontal: 3px;
  background-color: ${props => props.theme.BUTTON_COLOR_2}
  shadowColor: ${props => props.theme.BUTTON_COLOR_2};
  shadowOffset: { height: 10 };
  shadowOpacity: 0.8;
  shadowRadius: 4;
`;

const SocialIcon = styled(Icon)`
  font-size: 20px;
  color: white;
`;

const PoweredBy = styled.View`
  width: 100%;
  padding: 20px;
  align-items: center;
  justify-content: center;
`;

const ServerNotConnected = styled.View`
  flex: 1;
  width: 100%;
  background-color: black;
`;
