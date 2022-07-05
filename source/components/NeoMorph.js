import React, {useState} from 'react';;
import styled from 'styled-components/native';

export default NeoMorph = ({children, color, size, opacity, radius}) => {

  return (
    <Container color={color} size={size} opacity={opacity} radius={radius}>
      {children}
    </Container>
  );
};


const Container = styled.View`
  shadowColor: ${props => props.color ?? 'white'};
  shadowOpacity: ${props => props.opacity ?? 0.5};
  shadowRadius: ${props => props.opacity ?? 5};
`;

const TopShadow = styled.View`
  shadowOffset: {
`;

const BottomShadow = styled.View`
`;

const Inner = styled.View`
  width: ${props => props.size ?? 40};
  height: ${props => props.size ?? 40};
  borderRadius: ${props => (props.size / 2) ?? (40 / 2)};
  backgroundColor: #DEE9F7;
  alignItems: center;
  justifyContent: center;
  borderColor; #E2ECFD;
  borderWidth: 1px;
`;
