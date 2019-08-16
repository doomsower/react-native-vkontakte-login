import React from 'react';
import PropTypes from 'prop-types';
import {FlatList} from 'react-native';
import LogItem from './LogItem';

const keyExtractor = item => item.when.toString();

export default class Logs extends React.PureComponent {
  static propTypes = {
    logs: PropTypes.arrayOf(
      PropTypes.shape({
        ...LogItem.propTypes,
      }),
    ).isRequired,
  };

  renderItem = ({item}) => <LogItem {...item} />;

  render() {
    return (
      <FlatList
        inverted
        data={this.props.logs}
        renderItem={this.renderItem}
        keyExtractor={keyExtractor}
      />
    );
  }
}
