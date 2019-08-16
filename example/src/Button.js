import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    margin: 4,
    height: 32,
    backgroundColor: '#507299',
    borderWidth: 0,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#507299',
    borderWidth: 0,
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    color: '#FFFFFF',
    fontSize: 11,
  },
});

const Button = ({circle, onPress, children}) => (
  <TouchableOpacity
    onPress={onPress}
    style={circle ? styles.circleBtn : styles.btn}>
    <Text style={styles.txt}>{children}</Text>
  </TouchableOpacity>
);

Button.propTypes = {
  onPress: PropTypes.func,
  circle: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Button.defaultProps = {
  circle: false,
};

export default Button;
