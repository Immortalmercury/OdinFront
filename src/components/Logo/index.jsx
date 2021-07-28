import React from 'react';

//Full logo
import logo from './logo.png';
import lightLogo from './logo-light.png';

//Inline logo
import logoInline from './logo-inline.png';
import lightLogoInline from './logo-inline-light.png';

//Parts of inline logo
import logoInlinePart1 from './logo-inline-part-1.png';
import lightLogoInlinePart1 from './logo-inline-part-1-light.png';
import logoInlinePart2 from './logo-inline-part-2.png';

const Logo = ({ className, style={width: '100%',height: 'auto',}, theme='light', type='inline' }) => {
  let src = null;
  let simple  = lightLogo;
  let inline  = lightLogoInline;
  let inlineP1 = lightLogoInlinePart1;
  let inlineP2 = logoInlinePart2;
  if (theme === 'dark') {
    simple = logo;
    inline = logoInline;
    inlineP1 = logoInlinePart1;
  }
  switch (type) {
    case 'inline':
      src = inline;
      break;
  
    case 'inlineP1':
      src = inlineP1;
      break;
  
    case 'inlineP2':
      src = inlineP2;
      break;
  
    default:
      src = simple;
      break;
  }
  return (
    <img
      src={src}
      alt={'Odins Laboratory'}
      className={className ? className:null}
      style={!className ? style:null}
    />
  );
}
 
export default Logo;