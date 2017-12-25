import React, { Component } from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight
} from 'react-native';

export default class NetworkSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ssid: null,
      password: null
    }
  }

  saveNetworkCredentials = () => {
    const { ssid, password } = this.state;

    fetch('http://10.0.0.1:3001/api/save_network_credentials', {
      method: 'POST',
      body: {
        ssid: ssid,
        password: password,
        securityType: this.props.securityType
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      this.props.onCredentialsSaved();
    }).catch(err => {
      console.log("An error occurred: " + err);
      this.props.onCredentialsSaved();
    });
  }

  render() {
    const { ssid, password } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.hockeyLightSettingsContainer}>
          <Text>Wifi Name (SSID)</Text>
          <TextInput
            placeholder='SSID'
            value={ssid}
            onChangeText={ssid => this.setState({ ssid })}
          />

          <Text>Password</Text>
          <TextInput
            placeholder='Password'
            value={password}
            onChangeText={password => this.setState({ password })}
          />
        </View>

        <TouchableHighlight onPress={this.saveNetworkCredentials}>
          <Text style={styles.button}>Save</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  hockeyLightSettingsContainer: {
    marginTop: 10,
  },
  button: {
    textAlign: 'center',
    marginTop: 10,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    color: '#ffffff',
    fontSize: 17,
  }
});
