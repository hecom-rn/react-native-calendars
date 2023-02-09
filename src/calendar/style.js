import {StyleSheet} from 'react-native';
import * as defaultStyle from '../style';

const STYLESHEET_ID = 'stylesheet.calendar.main';

export default function getStyle(theme={}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    container: {
      overflow: 'hidden',
      paddingLeft: 5,
      paddingRight: 5,
      backgroundColor: appStyle.calendarBackground
    },
    week: {
      marginTop: 4,
      marginBottom: 6,
      flexDirection: 'row',
      justifyContent: 'space-around'
    },
    fake: {
      position: 'absolute'
    },
    ...(theme[STYLESHEET_ID] || {})
  });
}

