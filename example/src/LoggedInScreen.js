import React, {PropTypes} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Button from 'apsl-react-native-button';
import VKLogin from 'react-native-vkontakte-login';

export default class LoggedInScreen extends React.Component {
  static propTypes = {
    auth: PropTypes.object,
    showLogout: PropTypes.bool,
    onAuth: PropTypes.func
  };
  
  state = {
    friends: null
  };
  
  componentWillMount(){
    const {auth: {user_id, access_token}} = this.props;
    const reqUrl = `https://api.vk.com/method/friends.getOnline?user_id=${user_id}&access_token=${access_token}`;
    fetch(reqUrl, {method: 'POST'})
      .then(response => response.json())
      .then(json => this.setState({friends: json.response}))
      .catch(error => this.setState({friends: error}));
  }
  
  render() {
    const auth = this.props.auth || {};
    return (
      <View style={styles.container}>
        <Row title="User id" value={auth.user_id}/>
        <Row title="E-mail" value={auth.email}/>
        <Row title="Access token" value={auth.access_token}/>
        <Row title="Expires in" value={auth.expires_in}/>
        <Row title="Secret" value={auth.secret}/>
        <Row title="Friends online:" value={JSON.stringify(this.state.friends)}/>
        {
          this.props.showLogout &&
          <Button style={styles.btn} textStyle={styles.txt} onPress={this.logout}>Logout via SDK</Button>
        }
      </View>
    );
  }
  
  logout = () => {
    VKLogin.logout()
      .then(() => {
        console.log('VK SDK logged out');
        this.props.onAuth(null)
      });
  }
}


class Row extends React.Component {
  render() {
    return (
      <View style={styles.row}>
        <Text style={styles.col}>{this.props.title}</Text>
        <Text style={styles.col}>{'' + this.props.value}</Text>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    padding: 20
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8
  },
  col: {
    flex: 1
  },
  btn: {
    backgroundColor: '#507299',
    borderWidth: 0
  },
  txt: {
    color: '#FFFFFF'
  }
});