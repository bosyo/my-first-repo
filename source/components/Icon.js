import React from 'react';
import styled from 'styled-components/native';
import {Icon} from "native-base";

export default StyledIcon = ({...props}) => {
  return <Text {...props}>{props.children}</Text>;
};

const Text = styled(Icon)`
  color: ${props => props.color ?? '#000000'};
  margin: ${props => props.margin ?? 0};
  padding: ${props => props.padding ?? 0};
  ${({title, large, medium, small, tiny}) => {
    switch (true) {
      case large:
        return `font-size: 40px`;
      case medium:
        return `font-size: 30px`;
      case small:
        return `font-size: 20px`;
      case tiny:
        return `font-size: 15px`;
      default:
        return 'font-size: 25px';
    }
  }}
`;
