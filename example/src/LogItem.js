import React, {Component, PropTypes} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import moment from 'moment';

export default class LogItem extends Component {
  static propTypes = {
    when: PropTypes.number.isRequired,
    who: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    error: PropTypes.bool,
  };

  render() {
    const textColor = {color: this.props.error ? '#d95b57' : '#507299'};
    const when = moment(this.props.when).format('HH:mm:ss');
    return (
      <View style={styles.container}>
          <Text style={[styles.when, textColor]}>{when}</Text>
          <Text style={[styles.who, textColor]}>{this.props.who}</Text>
          <Text style={[styles.message, textColor]}>{this.props.message}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: 4,
  },
  who: {
    fontSize: 10,
    width: 55,
  },
  when: {
    fontSize: 10,
    width: 45,
  },
  message: {
    flex: 1,
    fontSize: 10,
  },
});