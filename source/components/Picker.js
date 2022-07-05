import React, {useState} from 'react';
import styled from 'styled-components/native';
import {ThemeProvider} from "styled-components";
import {useSelector} from "react-redux";
import {Picker} from 'native-base';
import {Text} from '@components';
import helpers from '@common/helpers';

export default PickerComp = ({name, setValue, setValue2, errors, items, ...props}) => {
  const [activeInput, setActiveInput] = useState(false);
  const theme = useSelector(state => state.themeReducer.theme);
  const err = errors[name];
  const errMsg = helpers.deepValue(err, 'message', '');
  return (
    <ThemeProvider theme={theme}>
      <PickerContainer errMsg={errMsg} activeInput={activeInput}>
        <StyledPicker
          mode="dropdown"
          placeholderStyle={{color: theme.colors.placeholder.primary}}
          textStyle={{color: theme.colors.text.secondary}}
          {...props}
        >
          {
            items.map(({label, value}) => {
              return <Picker.Item label={label} value={value}/>
            })
          }
        </StyledPicker>
        {
          !!errMsg &&
          <ErrorText tiny>
            {errMsg}
          </ErrorText>
        }
      </PickerContainer>

    </ThemeProvider>
  );
};

const PickerContainer = styled.View`
  width: 100%;
  margin-top: ${p => p.theme.spacing.sm}px;
  margin-bottom: ${p => p.errMsg ? p.theme.spacing.sm : 0}px;
`;

const ErrorText = styled(Text)`
  position: absolute;
  bottom: -20px;
  color: ${p => p.theme.colors.actions.error};
`;

const StyledPicker = styled(Picker)`
  width: 100%;
  height: ${p => p.theme.sizes.input}
  background-color: ${p => p.theme.colors.input.primary}
  color: ${p => p.theme.colors.text.secondary}
  font-size: ${p => p.theme.sizes.textBaseSize * 4}px;
  border-radius: ${p => p.theme.sizes.borderRadius}px;
  border-color: ${p => p.theme.colors.actions.error};
  border-bottom-width: ${p => p.errMsg ? 2 : 0}px;
`;
