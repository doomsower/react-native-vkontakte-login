import React, {Component, PropTypes} from 'react';
import {View, StyleSheet, WebView} from 'react-native';
import parseURL from 'url-parse';
import queryString from 'query-string';
import _ from 'lodash';

class WebAuth extends Component {
  static propTypes = {
    onAuth: PropTypes.func
  };
  
  render() {
    let uri = 'https://oauth.vk.com/authorize?' +
      'client_id=' + 5514471 +
      '&redirect_uri=' + 'https://oauth.vk.com/blank.html' +
      '&display=mobile' +
      '&scope=' + (2 + 4194304) + // friends+ email
      '&response_type=token';
    return (
      <View style={[styles.container]}>
        <WebView
          source={{uri}}
          javaScriptEnabled={true}
          startInLoadingState={true}
          onNavigationStateChange={this.onNavigationStateChange}
        />
      </View>
    );
  }
  
  onNavigationStateChange = navState => {
    const url = parseURL(navState.url, true);
    if (url.pathname === '/blank.html') {
      const hash = queryString.parse(url.hash);
      if (_.has(hash, 'access_token')) {
        // console.log('Good page', hash);
        this.props.onAuth(hash, false);
      }
    }
  };
}

export default WebAuth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  webview: {
    flex: 1
  }
});