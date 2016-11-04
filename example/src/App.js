import React, {Component} from 'react';
import {Alert} from 'react-native';
import LoginScreen from './LoginScreen';
import LoggedInScreen from './LoggedInScreen';
import VKLogin from 'react-native-vkontakte-login';

console.ignoredYellowBox = ['Circular indeterminate'];

export default class App extends Component {
  state = {
    viaSDK: true,
    auth: null
  };

  componentDidMount() {
    VKLogin.initialize(5514471);
    VKLogin.isLoggedIn()
      .then(result => Alert.alert('VK status', result ? 'Logged in' : 'Not logged in'));
  }
  
  render() {
    if (this.state.auth === null)
      return <LoginScreen onAuth={this.onAuth}/>;
    else
      return <LoggedInScreen auth={this.state.auth} onAuth={this.onAuth} showLogout={this.state.viaSDK}/>;
  }
  
  onAuth = (auth, viaSDK) => {
    this.setState({auth, viaSDK});
  }
}