import React, {Component, PropTypes} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Button from 'apsl-react-native-button';
import WebAuth from './WebAuth';
import VKLogin from 'react-native-vkontakte-login';
const shareImg = require('./assets/ycombinator.png');

export default class LoginScreen extends Component {
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
          <Button style={styles.btn} textStyle={styles.txt} onPress={this.onLoginViaWebView}>Login via WebView</Button>
          <Button style={styles.btn} textStyle={styles.txt} onPress={this.onLoginViaSdk}>Login via SDK</Button>
          <Button style={styles.btn} textStyle={styles.txt} onPress={this.onShareViaSdk}>Share via SDK</Button>
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
    VKLogin.login(['friends', 'photos', 'email'])
      .then(resp => {
        console.log('VK SDK response: ', resp);
        this.props.onAuth(resp, true);
      })
      .catch(err => console.log('VK SDK error', err));
  };

  async onShareViaSdk() {
    try {
      const isLoggedIn = await VKLogin.isLoggedIn();
      if (!isLoggedIn) {
        // You need 'wall' privilege to share
        // Also you need 'photos' privilege to share with image
        await VKLogin.login(['friends', 'photos', 'email', 'wall']);
      }
      const postId = await VKLogin.share({
        linkText: 'Cool site',
        linkUrl: 'https://news.ycombinator.com/',
        description: `Check out this cool site!`,
        image: shareImg,
      });
      console.log(postId);
    } catch (err) {
      console.log('Error:', err);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  btn: {
    backgroundColor: '#507299',
    borderWidth: 0
  },
  txt: {
    color: '#FFFFFF'
  }
});
