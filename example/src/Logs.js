import React from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';
import LogItem from './LogItem';

const keyExtractor = item => item.when.valueOf();

export default class Logs extends React.PureComponent {
  static propTypes = {
    logs: PropTypes.arrayOf(PropTypes.shape({
      ...LogItem.propTypes,
    })).isRequired,
  };

  constructor(props) {
    super(props);
    this._list = null;
  }

  componentDidUpdate() {
    if (this._list) {
      this._list.scrollToEnd();
    }
  }

  setRef = (list) => {
    this._list = list;
  };

  renderItem = ({ item }) => (<LogItem {...item} />);

  render() {
    return (
      <FlatList
        ref={this.setRef}
        data={this.props.logs}
        renderItem={this.renderItem}
        keyExtractor={keyExtractor}
      />
    );
  }

}
