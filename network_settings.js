import React, { Component } from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Picker,
  TouchableHighlight
} from 'react-native';


const Spinner = require('react-native-spinkit');
const wifi = require('react-native-android-wifi');

export default class NetworkSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ssid: null,
      password: null,
      loading: true
    }

    this.loadWifiList();
  }

  loadWifiList = () => {
    wifi.loadWifiList(wifiStringList => {
      const wifiArray = JSON.parse(wifiStringList);
      let newState = { loading: false, wifiArray };
      if (wifiArray && wifiArray.length > 0) newState.ssid = wifiArray[0].SSID;
      this.setState(newState);
    }, error => {
      console.log(error);
    });
  }

  saveNetworkCredentials = () => {
    const { ssid, password } = this.state;
    console.log('ssid: ' + ssid);

    fetch('http://10.0.0.1:3001/api/save_network_credentials', {
      method: 'POST',
      body: JSON.stringify({
        ssid: ssid,
        password: password,
        securityType: this.securityType()
      }),
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

  securityType = capabilities => {
    const { ssid, wifiArray } = this.state;

    for (let i = 0; i < wifiArray.length; i++) {
      if (wifiArray[i].SSID === ssid) {
        if (wifiArray[i].capabilities.includes('WPA2-PSK')) {
          return 'WPA2';
        } else if (wifiArray[i].capabilities.includes('WPA-PSK')) {
          return 'WPA';
        }

        return '';
      }
    }
  }

  render() {
    const { ssid, password, loading, wifiArray } = this.state;

    return (
      <View style={styles.container}>
        <Spinner
          style={styles.spinner}
          isVisible={loading}
          size={50}
          type={'ThreeBounce'}
        />
        {
          !loading &&
          <View style={styles.hockeyLightSettingsContainer}>
            <Text>Wifi Name (SSID)</Text>
            <Picker
              selectedValue={ssid}
              onValueChange={ssid => this.setState({ ssid })}>
              {
                wifiArray.map(wifi => {
                  return (
                    <Picker.Item key={wifi.SSID} label={wifi.SSID} value={wifi.SSID} />
                  );
                })
              }
            </Picker>

            <Text>Password</Text>
            <TextInput
              placeholder='Password'
              value={password}
              onChangeText={password => this.setState({ password })}
            />

            <TouchableHighlight onPress={this.saveNetworkCredentials}>
              <Text style={styles.button}>Save</Text>
            </TouchableHighlight>
          </View>
        }
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
  spinner: {
    color: '#ffffff',
    marginTop: 20,
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
