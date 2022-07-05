import React, {useState, useEffect, useCallback} from 'react'
import {TextInput, Linking, StatusBar, Keyboard, View} from 'react-native'
import {Container, Content, Icon} from 'native-base'
import {Redirect,} from "react-router-native";
import Meteor from 'react-native-meteor';
import styled from "styled-components/native";
import {ThemeProvider} from 'styled-components';
import {useSelector, useDispatch} from 'react-redux';
import * as yup from 'yup';
import {useForm} from "react-hook-form";
//
import {Text, Input, NeoMorph} from '@components';
import LoadingOverlay from '../../components/Layout/LoadingOverlay';
import KeyboardAvoiding from "../../components/Layout/KeyboardAvoiding";
// import bg from '../../images/test-bg-4.jpeg';

export default Home = (props) => {
  // State
  const [isLoading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    email: yup.string().email('Invalid Email Address').required('Email is required'),
    password: yup.string().required('Password is required')
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
    register('email');
    register('password');
  }, [register]);
  useEffect(() => {
  }, [errors]);
  // Event handlers
  const _onPressRegister = () => {
    props.history.push('/register');
  };
  const _onPressResetPassword = () => {
    props.history.push('/reset');
  };
  const _onPressLogin = (data) => {
    const {email, password} = data;
    Keyboard.dismiss()
    setLoading(true);
    _login(email, password);
  };
  // API CALL
  const _login = (email, password) => {
    Meteor.loginWithPassword(email, password, (error) => {
      setLoading(false);
      if (error) {
        const {reason} = error;
        if (reason) {
          alert(reason);
        }
      } else {
        props.history.push('/home');
      }
    });
  };
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
              <LogoImage source={theme.LOGO}/>
              <Input label={'Email Address'} setValue={setValue} name={'email'} errors={errors}/>
              <View style={{width: '100%'}}>
                <Input
                  label={'Password'}
                  setValue={setValue}
                  setValue2={setPassword}
                  secureTextEntry={!showPassword}
                  name={'password'}
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
              <LoginButtonContainer>
                <LoginButton onPress={handleSubmit(_onPressLogin)}>
                  <Text color={theme.colors.text.secondary} center medium heavy>Log in</Text>
                </LoginButton>
              </LoginButtonContainer>
              <RegisterNoteText heavy center color={theme.colors.text.primary}>{`Not a member? `}
                <Text color={theme.colors.text.primary} heavy onPress={_onPressRegister}>
                  {`Register now for free!`}
                </Text>
              </RegisterNoteText>
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

const LogoImage = styled.Image`
  height: 80px;
  width:  300px;
  resize-mode: contain;
  margin-bottom: ${p => p.theme.spacing.lg};
`;

const LoginButtonContainer = styled.View`
  width: 100%;
  margin-bottom: ${props => props.theme.spacing.xxxl}px;
  height: ${props => props.theme.sizes.button}px;
  align-items: center;
  justify-content: center;
  margin-top: 45px;
`;

const LoginButton = styled.TouchableOpacity`
  flex: 1;
  width: 100%;
  padding: 12px;
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
