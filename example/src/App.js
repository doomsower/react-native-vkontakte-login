import React, {Component} from 'react';
import LoginScreen from './LoginScreen';
import LoggedInScreen from './LoggedInScreen';

console.ignoredYellowBox = ['Circular indeterminate'];

export default class App extends Component {
  state = {
    viaSDK: true,
    auth: null
  };
  
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