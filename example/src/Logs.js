import React, {Component, PropTypes} from 'react';
import {ListView, StyleSheet} from 'react-native';
import LogItem from './LogItem';

export default class Logs extends Component {
  static propTypes = {
    logs: PropTypes.array.isRequired,
  };

  ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

  render() {
    const dataSource = this.ds.cloneWithRows(this.props.logs);
    return (
      <ListView
        ref="listView"
        enableEmptySections={true}
        dataSource={dataSource}
        renderRow={this.renderRow}
        onContentSizeChange={this.scrollToEnd}
      />
    );
  }

  scrollToEnd = () => {
    this.refs['listView'].scrollToEnd();
  };

  renderRow = (rowData) => {
    return (
      <LogItem key={rowData.when.valueOf()} {...rowData}/>
    );
  };
}

const styles = StyleSheet.create({});