import React, {useState} from 'react';
import styled from 'styled-components/native';
import {ThemeProvider} from "styled-components";
import {useSelector} from "react-redux";
import {Text} from '@components';
import helpers from '@common/helpers';


export default TextStyle = ({name, label, setValue, setValue2, errors, ...props}) => {
  const [activeInput, setActiveInput] = useState(false);
  const [empty, setEmpty] = useState(true);
  const theme = useSelector(state => state.themeReducer.theme);
  const err = errors[name];
  const errMsg = helpers.deepValue(err, 'message', '');
  return (
    <ThemeProvider theme={theme}>
      <TextInputContainer errMsg={errMsg} activeInput={activeInput}>
        {
          !empty &&
          <TextInputLabel>
            {label}
          </TextInputLabel>
        }
        <TextInput
          key={name}
          name={name}
          activeInput={activeInput}
          onFocus={() => {
            setActiveInput(true)
          }}
          onBlur={() => {
            setActiveInput(false)
          }}
          onChangeText={text => {
            const empt = !text;
            setEmpty(empt);
            setValue(name, text);
            setValue2 && setValue2(text);
          }}
          {...props}
          autoCapitalize="none"
          placeholderTextColor={theme.colors.placeholder.primary}
          placeholder={label}
          errMsg={errMsg}
          empty={empty}
        />
        {
          !!errMsg &&
            <ErrorText tiny>
              {errMsg}
            </ErrorText>
        }
      </TextInputContainer>

    </ThemeProvider>
  );
};

const TextInputContainer = styled.View`
  width: 100%;
  margin-top: ${p => p.theme.spacing.sm}px;
  margin-bottom: ${p => p.errMsg ? p.theme.spacing.sm : 0}px;
`;

const TextInput = styled.TextInput`
  height: ${p => p.theme.sizes.input}
  background-color: ${props => props.theme.colors.input.primary}
  color: ${props => props.theme.colors.text.secondary}
  font-size: ${props => props.theme.sizes.textBaseSize * 4}px;
  padding-horizontal: 20px;
  border-radius: ${p => p.theme.sizes.borderRadius}px;
  border-color: ${p => p.theme.colors.actions.error};
  border-bottom-width: ${p => p.errMsg ? 2 : 0}px;
`;

const TextInputLabel = styled.Text`
   position: absolute;
   top: 9px;
   left: 14px;
   padding-horizontal: 7px;
   color: ${props => props.theme.INPUT_TEXT_COLOR_1};
   font-size: 10px;
   z-index: 2;
`;

const ErrorText = styled(Text)`
  position: absolute;
  bottom: -20px;
  color: ${p => p.theme.colors.actions.error};
`;
