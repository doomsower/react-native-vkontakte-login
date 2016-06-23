import React, {Component, PropTypes} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Button from 'apsl-react-native-button';
import WebAuth from './WebAuth';
import VKLogin from 'react-native-vkontakte-login';

class Login extends Component {
  static propTypes = {
    onAuth: PropTypes.func
  };

  state = {
    intro: true
  };

  render() {
    if (this.state.intro) {
      return (
        <View style={styles.container}>
          <Button onPress={this.onLoginViaWebView}>Login via WebView</Button>
          <Button onPress={this.onLoginViaSdk}>Login via SDK</Button>
        </View>
      );
    }
    else {
      return (<WebAuth onAuth={this.props.onAuth}/>);
    }
  }

  onLoginViaWebView = () => {
    this.setState({intro: false});
  };

  onLoginViaSdk = () => {
    VKLogin.initialize(5514471);
    VKLogin.login(['friends', 'photos', 'email'])
      .then(resp => {
        console.log('VK SDK response: ', resp);
        this.props.onAuth(resp);
      })
      .catch(err => console.log('VK SDK error', err));
  };
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});