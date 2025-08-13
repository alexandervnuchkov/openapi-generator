import { html } from 'lit';
import ColorUtils from '~/utils/color-utils';
/* Generates an schema object containing type and constraint info */
export default function setTheme(baseTheme, theme = {}) {
  let newTheme = {};

  // Common Theme colors
  const primaryColor = theme.primaryColor ? theme.primaryColor : baseTheme === 'dark' ? '#f76b39' : '#ff591e';
  const primaryColorInvert = ColorUtils.color.invert(primaryColor);
  const primaryColorTrans = ColorUtils.color.opacity(primaryColor, '0.8');

  // Dark and Light Theme colors
  if (baseTheme === 'dark') {
    const bg1 = (theme.bg1 ? theme.bg1 : '#ffffff');
    const fg1 = (theme.fg1 ? theme.fg1 : '#1E2126');
    const bg2 = theme.bg2 ? theme.bg2 : ColorUtils.color.brightness(bg1, -5); // or '#fafafa'
    const bg3 = theme.bg3 ? theme.bg3 : ColorUtils.color.brightness(bg1, -15); // or '#f6f6f6'
    const lightBg = theme.bg3 ? theme.bg3 : ColorUtils.color.brightness(bg1, -45);
    const fg2 = theme.fg2 ? theme.fg2 : ColorUtils.color.brightness(fg1, 17); // or '#555'
    const fg3 = theme.fg3 ? theme.fg3 : ColorUtils.color.brightness(fg1, 30); // or #666
    const lightFg = theme.fg3 ? theme.fg3 : ColorUtils.color.brightness(fg1, 70); // or #999
    const inlineCodeFg = theme.inlineCodeFg ? theme.inlineCodeFg : 'brown';
    const selectionBg = '#1E2126';
    const selectionFg = '#eee';

    const headerColor = theme.headerColor ? theme.headerColor : ColorUtils.color.brightness(bg1, -180);

    const navBgColor = theme.navBgColor ? theme.navBgColor : ColorUtils.color.brightness(bg1, -180);
    const navTextColor = theme.navTextColor ? theme.navTextColor : ColorUtils.color.opacity(ColorUtils.color.invert(navBgColor), '0.65');
    const navHoverBgColor = theme.navHoverBgColor ? theme.navHoverBgColor : ColorUtils.color.brightness(navBgColor, -15);
    const navHoverTextColor = theme.navHoverTextColor ? theme.navHoverTextColor : ColorUtils.color.invert(navBgColor);
    const navAccentColor = theme.navAccentColor ? theme.navAccentColor : ColorUtils.color.brightness(primaryColor, 25);
    const overlayBg = 'rgba(0, 0, 0, 0.4)';

    newTheme = {
      bg1,
      bg2,
      bg3,
      lightBg,
      fg1,
      fg2,
      fg3,
      lightFg,
      inlineCodeFg,
      primaryColor,
      primaryColorTrans,
      primaryColorInvert,
      selectionBg,
      selectionFg,
      overlayBg,
      navBgColor,
      navTextColor,
      navHoverBgColor,
      navHoverTextColor,
      navAccentColor,

      headerColor,
      headerColorInvert: ColorUtils.color.invert(headerColor),
      headerColorDarker: ColorUtils.color.brightness(headerColor, -20),
      headerColorBorder: ColorUtils.color.brightness(headerColor, 10),

      borderColor: theme.borderColor || ColorUtils.color.brightness(bg1, -38),
      lightBorderColor: theme.lightBorderColor || ColorUtils.color.brightness(bg1, -23),
      codeBorderColor: theme.codeBorderColor || 'transparent',

      inputBg: theme.inputBg || ColorUtils.color.brightness(bg1, 10), // #fff
      placeHolder: theme.placeHolder || ColorUtils.color.brightness(lightFg, 20), // #dedede
      hoverColor: theme.hoverColor || ColorUtils.color.brightness(bg1, -5), // # f1f1f1

      gray: theme.gray || 'rgba(30,33,38,1)',
      lighterGray: theme.lighterGray || 'rgba(30,33,38,.64)',
      lightGray: theme.lightGray || 'rgba(30,33,38,.12)',
      lightestGray: theme.lightestGray || 'rgba(30,33,38,.08)',

      red: theme.red || 'rgba(217,93,43,1)',
      lighterRed: theme.lighterRed || 'rgba(217,93,43,.64)',
      lightRed: theme.lightRed || 'rgba(217,93,43,.16)',

      pink: theme.pink ? theme.pink : 'rgba(181,126,220,1)',
      lighterPink: theme.lighterPink ? theme.lighterPink : 'rgba(181,126,220,.74)',
      lightPink: theme.lightPink ? theme.lightPink : 'rgba(181,126,220,.16)',

      green: theme.green || 'rgba(21,155,0,1)',
      lighterGreen: theme.lighterGreen || 'rgba(21,155,0,.64)',
      lightGreen: theme.lightGreen || 'rgba(21,155,0,.12)',

      blue: theme.blue || 'rgba(0,105,255,1)',
      darkBlue: theme.darkBlue || 'rgba(0,85,217,1)',
      lighterBlue: theme.lighterBlue || 'rgba(0,105,255,.56)',
      lightBlue: theme.lightBlue || 'rgba(0,105,255,.12)',

      blueAdd: theme.blueAdd || 'rgba(0,85,217,1)',
      lighterBlueAdd: theme.lighterBlueAdd || 'rgba(0,85,217,.56)',
      lightBlueAdd: theme.lightBlueAdd || 'rgba(0,85,217,.12)',

      orange: theme.orange || 'rgba(255,140,95,1)',
      lighterOrange: theme.lighterOrange || 'rgba(255,140,95,.64)',
      lightOrange: theme.lightOrange || 'rgba(255,140,95,.12)',

      yellow: theme.yellow || 'rgba(229,149,22,1)',
      lighterYellow: theme.lighterYellow || 'rgba(229,149,22,.74)',
      lightYellow: theme.lightYellow || 'rgba(229,149,22,.16)',

      purple: theme.purple || '#d95d2b',
      brown: theme.brown || '#D4AC0D',

      codeBg: theme.codeBg || ColorUtils.color.opacity(ColorUtils.color.brightness('#1E2126', 0), 1),
      codeFg: theme.codeFg || '#fff',
      codePropertyColor: theme.codePropertyColor || '#905',
      codeKeywordColor: theme.codeKeywordColor || '#07a',
      codeOperatorColor: theme.codeOperatorColor || '#9a6e3a',
    };
  } else {
    const bg1 = (theme.bg1 ? theme.bg1 : '#ffffff');
    const fg1 = (theme.fg1 ? theme.fg1 : '#1E2126');
    const bg2 = theme.bg2 ? theme.bg2 : ColorUtils.color.brightness(bg1, -5); // or '#fafafa'
    const bg3 = theme.bg3 ? theme.bg3 : ColorUtils.color.brightness(bg1, -15); // or '#f6f6f6'
    const lightBg = theme.bg3 ? theme.bg3 : ColorUtils.color.brightness(bg1, -45);
    const fg2 = theme.fg2 ? theme.fg2 : ColorUtils.color.brightness(fg1, 17); // or '#555'
    const fg3 = theme.fg3 ? theme.fg3 : ColorUtils.color.brightness(fg1, 30); // or #666
    const lightFg = theme.fg3 ? theme.fg3 : ColorUtils.color.brightness(fg1, 70); // or #999
    const inlineCodeFg = theme.inlineCodeFg ? theme.inlineCodeFg : 'brown';

    const selectionBg = '#1E2126';
    const selectionFg = '#eee';

    const headerColor = theme.headerColor ? theme.headerColor : ColorUtils.color.brightness(bg1, -180);

    const navBgColor = theme.navBgColor ? theme.navBgColor : ColorUtils.color.brightness(bg1, -180);
    const navTextColor = theme.navTextColor ? theme.navTextColor : ColorUtils.color.opacity(ColorUtils.color.invert(navBgColor), '0.65');
    const navHoverBgColor = theme.navHoverBgColor ? theme.navHoverBgColor : ColorUtils.color.brightness(navBgColor, -15);
    const navHoverTextColor = theme.navHoverTextColor ? theme.navHoverTextColor : ColorUtils.color.invert(navBgColor);
    const navAccentColor = theme.navAccentColor ? theme.navAccentColor : ColorUtils.color.brightness(primaryColor, 25);
    const overlayBg = 'rgba(0, 0, 0, 0.4)';

    newTheme = {
      bg1,
      bg2,
      bg3,
      lightBg,
      fg1,
      fg2,
      fg3,
      lightFg,
      inlineCodeFg,
      primaryColor,
      primaryColorTrans,
      primaryColorInvert,
      selectionBg,
      selectionFg,
      overlayBg,
      navBgColor,
      navTextColor,
      navHoverBgColor,
      navHoverTextColor,
      navAccentColor,

      headerColor,
      headerColorInvert: ColorUtils.color.invert(headerColor),
      headerColorDarker: ColorUtils.color.brightness(headerColor, -20),
      headerColorBorder: ColorUtils.color.brightness(headerColor, 10),

      borderColor: theme.borderColor || ColorUtils.color.brightness(bg1, -38),
      lightBorderColor: theme.lightBorderColor || ColorUtils.color.brightness(bg1, -23),
      codeBorderColor: theme.codeBorderColor || 'rgba(30,33,38,.08)',

      inputBg: theme.inputBg || ColorUtils.color.brightness(bg1, 10), // #fff
      placeHolder: theme.placeHolder || ColorUtils.color.brightness(lightFg, 20), // #dedede
      hoverColor: theme.hoverColor || ColorUtils.color.brightness(bg1, -5), // # f1f1f1

      gray: theme.gray || 'rgba(30,33,38,1)',
      lighterGray: theme.lighterGray || 'rgba(30,33,38,.64)',
      lightGray: theme.lightGray || 'rgba(30,33,38,.12)',
      lightestGray: theme.lightestGray || 'rgba(30,33,38,.08)',

      red: theme.red || 'rgba(217,93,43,1)',
      lighterRed: theme.lighterRed || 'rgba(217,93,43,.64)',
      lightRed: theme.lightRed || 'rgba(217,93,43,.16)',
      lightestRed: theme.lightestRed || 'rgba(255,140,95,.08)',

      pink: theme.pink ? theme.pink : 'rgba(181,126,220,1)',
      lighterPink: theme.lighterPink ? theme.lighterPink : 'rgba(181,126,220,.74)',
      lightPink: theme.lightPink ? theme.lightPink : 'rgba(181,126,220,.16)',

      green: theme.green || 'rgba(21,155,0,1)',
      lighterGreen: theme.lighterGreen || 'rgba(21,155,0,.64)',
      lightGreen: theme.lightGreen || 'rgba(21,155,0,.12)',
      lightestGreen: theme.lightestGreen || 'gba(29,208,0,.08)',

      blue: theme.blue || 'rgba(0,105,255,1)',
      darkBlue: theme.darkBlue || 'rgba(0,85,217,1)',
      lighterBlue: theme.lighterBlue || 'rgba(0,105,255,.56)',
      lightBlue: theme.lightBlue || 'rgba(0,105,255,.12)',
      lightestBlue: theme.lightestBlue || 'rgba(0,105,255,.08)',

      blueAdd: theme.blueAdd || 'rgba(0,85,217,1)',
      lighterBlueAdd: theme.lighterBlueAdd || 'rgba(0,85,217,.56)',
      lightBlueAdd: theme.lightBlueAdd || 'rgba(0,85,217,.12)',

      orange: theme.orange || 'rgba(255,140,95,1)',
      lighterOrange: theme.lighterOrange || 'rgba(255,140,95,.64)',
      lightOrange: theme.lightOrange || 'rgba(255,140,95,.12)',

      yellow: theme.yellow || 'rgba(229,149,22,1)',
      lighterYellow: theme.lighterYellow || 'rgba(229,149,22,.74)',
      lightYellow: theme.lightYellow || 'rgba(229,149,22,.16)',

      purple: theme.purple || '#d95d2b',
      brown: theme.brown || '#D4AC0D',

      codeBg: theme.codeBg || ColorUtils.color.opacity(ColorUtils.color.brightness('#1E2126', 0), 0.04),
      codeFg: theme.codeFg || '#fff',
      codePropertyColor: theme.codePropertyColor || '#905',
      codeKeywordColor: theme.codeKeywordColor || '#07a',
      codeOperatorColor: theme.codeOperatorColor || '#9a6e3a',
    };
  }
  return html`
  <style>
  *, *:before, *:after { box-sizing: border-box; }

  :host {
    /* Common Styles - irrespective of themes */
    --border-radius-bigger: 8px;
    --border-radius: 6px;
    --border-radius-smaller: 4px;
    --layout: ${this.layout || 'row'};
    --font-mono: ${this.monoFont || 'Monaco, "Andale Mono", "Roboto Mono", Consolas, monospace'};
    --font-regular: ${this.regularFont || 'SuisseIntl,"Fallback Helvetica","Fallback Arial",sans-serif'};
    --scroll-bar-width: 8px;
    --nav-item-padding: ${this.navItemSpacing === 'relaxed'
    ? '10px 16px 10px 10px'
    : (this.navItemSpacing === 'compact'
      ? '5px 10px 5px 20px'
      : '7px 16px 7px 10px')};

    --resp-area-height: ${this.responseAreaHeight};
    --font-size-small:  ${this.fontSize === 'default' ? '12px' : (this.fontSize === 'large' ? '14px' : '14px')};
    --font-size-mono:   ${this.fontSize === 'default' ? '13px' : (this.fontSize === 'large' ? '13px' : '15px')};
    --font-size-regular: ${this.fontSize === 'default' ? '14px' : (this.fontSize === 'large' ? '16px' : '16px')};
    --dialog-z-index: 1000;

    /* Theme specific styles */
    --bg:${newTheme.bg1};
    --bg2:${newTheme.bg2};
    --bg3:${newTheme.bg3};
    --light-bg:${newTheme.lightBg};
    --fg:${newTheme.fg1};
    --fg2:${newTheme.fg2};
    --fg3:${newTheme.fg3};
    --light-fg:${newTheme.lightFg};
    --selection-bg:${newTheme.selectionBg};
    --selection-fg:${newTheme.selectionFg};
    --overlay-bg:${newTheme.overlayBg};

    /* Border Colors */
    --border-color:${newTheme.borderColor};
    --light-border-color:${newTheme.lightBorderColor};
    --code-border-color:${newTheme.codeBorderColor};

    --input-bg:${newTheme.inputBg};
    --placeholder-color:${newTheme.placeHolder};
    --hover-color:${newTheme.hoverColor};
    --gray:${newTheme.gray};
    --lighter-gray:${newTheme.lighterGray};
    --light-gray:${newTheme.lightGray};
    --lightest-gray:${newTheme.lightestGray};
    --red:${newTheme.red};
    --lighter-red:${newTheme.lighterRed};
    --light-red:${newTheme.lightRed};
    --lightest-red:${newTheme.lightestRed};
    --pink:${newTheme.pink};
    --lighter-pink:${newTheme.lighterPink};
    --light-pink:${newTheme.lightPink};
    --green:${newTheme.green};
    --lighter-green:${newTheme.lighterGreen};
    --light-green:${newTheme.lightGreen};
    --lightest-green:${newTheme.lightestGreen};
    --blue:${newTheme.blue};
    --dark-blue:${newTheme.darkBlue};
    --lighter-blue:${newTheme.lighterBlue};
    --light-blue:${newTheme.lightBlue};
    --lightest-blue:${newTheme.lightestBlue};
    --blue-add:${newTheme.blueAdd};
    --lighter-blue-add:${newTheme.lighterBlueAdd};
    --light-blue-add:${newTheme.lightBlueAdd};
    --orange:${newTheme.orange};
    --lighter-orange:${newTheme.lighterOrange};
    --light-orange:${newTheme.lightOrange};
    --yellow:${newTheme.yellow};
    --lighter-yellow:${newTheme.lighterYellow};
    --light-yellow:${newTheme.lightYellow};
    --purple:${newTheme.purple};
    --brown:${newTheme.brown};

    /* Header Color */
    --header-bg:${newTheme.headerColor};
    --header-fg:${newTheme.headerColorInvert};
    --header-color-darker:${newTheme.headerColorDarker};
    --header-color-border:${newTheme.headerColorBorder};

    /* Nav Colors */
    --nav-bg-color:${newTheme.navBgColor};
    --nav-text-color:${newTheme.navTextColor};
    --nav-hover-bg-color:${newTheme.navHoverBgColor};
    --nav-hover-text-color:${newTheme.navHoverTextColor};
    --nav-accent-color:${newTheme.navAccentColor};

    /* Nav API Method Colors*/
    --nav-get-color:${newTheme.blue};
    --nav-put-color:${newTheme.orange};
    --nav-post-color:${newTheme.green};
    --nav-delete-color:${newTheme.red};
    --nav-head-color:${newTheme.yellow};

    /* Primary Colors */
    --primary-color:${newTheme.primaryColor};
    --primary-color-invert:${newTheme.primaryColorInvert};
    --primary-color-trans:${newTheme.primaryColorTrans};

    /*Code Syntax Color*/
    --code-bg:${newTheme.codeBg};
    --code-fg:${newTheme.codeFg};
    --inline-code-fg:${newTheme.inlineCodeFg};
    --code-property-color:${newTheme.codePropertyColor};
    --code-keyword-color:${newTheme.codeKeywordColor};
    --code-operator-color:${newTheme.codeOperatorColor};
  }
  </style>`;
}
