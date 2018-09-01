import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import Btn from 'apsl-react-native-button';

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    margin: 4,
    height: 32,
    backgroundColor: '#507299',
    borderWidth: 0,
    borderRadius: 0,
  },
  circleBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#507299',
    borderWidth: 0,
    marginRight: 4,
  },
  txt: {
    color: '#FFFFFF',
    fontSize: 11,
  },
});

const Button = ({ circle, children, ...props }) => (
  <Btn {...props} style={circle ? styles.circleBtn : styles.btn} textStyle={styles.txt}>
    {children}
  </Btn>
);

Button.propTypes = {
  ...Btn.propTypes,
  circle: PropTypes.bool,
};

Button.defaultProps = {
  circle: false,
};

export default Button;
