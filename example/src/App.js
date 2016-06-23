import React, {Component} from 'react';
import { View, Text, StyleSheet} from 'react-native';
import Login from './Login';

class App extends Component {
    state = {
        isLoggedIn: false,
        auth: null,
        friends: []
    };

    render() {
        if (this.state.isLoggedIn)
            return this.renderLoginInfo();
        else
            return this.renderLoginScreen();
    }

    renderLoginInfo = () => {
        return (
            <View style={styles.container}>
                <Text>Logged in</Text>
                <Text>{JSON.stringify(this.state.friends)}</Text>
            </View>
        );
    };

    renderLoginScreen = () => {
        return <Login onAuth={this.onAuth}/>
    };

    onAuth = (auth) => {
        console.log('Authenticated', auth);
        this.setState({isLoggedIn: true, auth});
        const reqUrl = 'https://api.vk.com/method/friends.getOnline?user_id=' +
            auth.user_id + '&access_token=' + auth.access_token;
        fetch(reqUrl, {method: 'POST'})
            .then(response => response.json())
            .then(json => this.setState({friends: json}))
            .catch(error => this.setState({friends: error}));
    }
}

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});