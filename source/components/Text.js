import React from 'react';
import styled, {css} from 'styled-components/native';

export default TextStyle = ({...props}) => {
  return <Text {...props}>{props.children}</Text>;
};

const Text = styled.Text`
  /*Defaults*/
  font-size: ${p => p.theme.sizes.textBaseSize * 4}px;
  color: ${p => p.theme.colors.text.primary};

  /*Color*/
  ${p => p.color && css`color: ${p.color}`}
  
  /*Font size*/
  ${p => p.title && css`font-size: 32px`}
  ${p => p.large && css`font-size: 24px`}
  ${p => p.medium2 && css`font-size: 20px`}
  ${p => p.medium && css`font-size: 16px`}
  ${p => p.small && css`font-size: 13px`}
  ${p => p.tiny && css`font-size: 11px`}
  
  ${p => p.xs && css`font-size: ${p.theme.sizes.textBaseSize * 2}px;`}
  ${p => p.sm && css`font-size: ${p.theme.sizes.textBaseSize * 3}px;`}
  ${p => p.md && css`font-size: ${p.theme.sizes.textBaseSize * 4}px;`}
  ${p => p.lg && css`font-size: ${p.theme.sizes.textBaseSize * 5}px;`}
  ${p => p.xl && css`font-size: ${p.theme.sizes.textBaseSize * 6}px;`}
  ${p => p.xxl && css`font-size: ${p.theme.sizes.textBaseSize * 7}px;`}
  ${p => p.xxxl && css`font-size: ${p.theme.sizes.textBaseSize * 8}px;`}
  
  ${p => p.size && css`font-size: ${p.theme.sizes.textBaseSize * p.size}px;`}
    
  /*Text alignment*/
  ${p => p.right && css`text-align: right`}
  ${p => p.center && css`text-align: center`}
  
  /*Font weight*/
  ${p => p.light && css`font-weight: 200`}
  ${p => p.bold && css`font-weight: 600`}
  ${p => p.heavy && css`font-weight: 700`}
  
  /*Text decoration*/
  ${p => p.underline && css`text-decoration-line: underline;`}
  ${p => p.lineThrough && css`text-decoration-line: line-through;`}
  
  /*Spacing*/
  ${p => p.margin && css`margin: ${p.margin}`};
  ${p => p.padding && css`padding: ${p.padding}`};
  
  /*Margin*/
  ${p => p.m && css`margin: ${p.theme.sizes.spacingBaseSize * p.m}px;`}
  ${p => p.mb && css`margin-bottom: ${p.theme.sizes.spacingBaseSize * p.mb}px;`}
  ${p => p.mt && css`margin-top: ${p.theme.sizes.spacingBaseSize * p.mt}px;`}
  ${p => p.ml && css`margin-left: ${p.theme.sizes.spacingBaseSize * p.ml}px;`}
  ${p => p.mr && css`margin-right: ${p.theme.sizes.spacingBaseSize * p.mr}px;`}
  
  /*Padding*/
  ${p => p.p && css`padding: ${p.theme.sizes.spacingBaseSize * p.p}px;`}
  ${p => p.pb && css`padding-bottom: ${p.theme.sizes.spacingBaseSize * p.pb}px;`}
  ${p => p.pt && css`padding-top: ${p.theme.sizes.spacingBaseSize * p.pt}px;`}
  ${p => p.pl && css`padding-left: ${p.theme.sizes.spacingBaseSize * p.pl}px;`}
  ${p => p.pr && css`padding-right: ${p.theme.sizes.spacingBaseSize * p.pr}px;`}

  /*Classes*/
  ${p => p.heading && css`
    font-size: 20px;
    color: red;
    margin-bottom: 100px;
  `}
`;
