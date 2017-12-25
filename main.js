import React, { Component } from 'react';
import Settings from './settings';
import NetworkSettings from './network_settings';
import { Client } from 'react-native-ssdp';

import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput
} from 'react-native';

const Spinner = require('react-native-spinkit');
const wifi = require('react-native-android-wifi');
global.Buffer = global.Buffer || require('buffer').Buffer;

export default class Main extends Component {
  constructor() {
    super();
    this.state = {
      loading: true
    }

    this.findHockeyLightSSDP();
    this.findHockeyLightWifi();
  }

  onLoadingComplete = () => {
    this.setState({ loading: false });
  }

  findHockeyLightSSDP = () => {
    let client = new Client();

    client.on('response', (headers, statusCode, rinfo) => {
      if (headers['ST'] === 'my:hockey-light') {
        this.setState({ host: rinfo['address'] });
        client.stop();

        if (this.state.interval) {
          this.clearInterval(this.state.interval);
          this.setState({ interval: null });
        }
      }
    });

    client.search('my:hockey-light');
  }

  findHockeyLightWifi = () => {
    wifi.loadWifiList(wifiStringList => {
      const wifiArray = JSON.parse(wifiStringList);

      for (let i = 0; i < wifiArray.length; i++) {
        if (wifiArray[i].SSID === 'pi-wifi') {
          this.setState({ securityType: this.securityType(wifiArray[i].capabilities) }, () => {
            wifi.findAndConnect('pi-wifi', '', found => {
              console.log(found);

              if (found) {
                console.log("wifi is in range!");
                this.waitForHockeyLightWifi();
              }
            });
          });

          break;
        }
      }
    },
      error => {
        console.log(error);
      }
    );
  }

  securityType = capabilities => {
    if (capabilities.includes('WPA2-PSK')) {
      return 'WPA2';
    } else if (capabilities.includes('WPA-PSK')) {
      return 'WPA';
    }

    return '';
  }

  waitForHockeyLightWifi = () => {
    const interval = setInterval(() => {
      wifi.getSSID(ssid => {
        console.log("Connected to: " + ssid);

        if (ssid === 'pi-wifi') {
          this.setState({ connectedToAP: true });
        }
      });
    }, 2000);

    this.setState({ interval });
  }

  render() {
    const { loading, host, connectedToAP, securityType } = this.state;

    return (
      <View style={styles.container}>
        <Image
          source={require('./images/hockey_light.png')}
          style={styles.hockeyLight}
        />
        <Text style={styles.title}>Hockey Light</Text>
        <Spinner
          style={styles.spinner}
          isVisible={loading}
          size={50}
          type={'ThreeBounce'}
        />
        {
          host &&
          <Settings
            host={host}
            loading={loading}
            onLoadingComplete={this.onLoadingComplete}
          />
        }
        {
          connectedToAP &&
          <NetworkSettings
            securityType={securityType}
            onCredentialsSaved={() => this.setState({ connectedToAP: false })}
          />
        }
      </View >
    );
  }
}

const styles = StyleSheet.create({
  hockeyLight: {
    height: 120,
    width: 240,
  },
  container: {
    flex: 1,
    backgroundColor: '#999',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
    marginTop: 20,
    color: '#FEFFFE',
  },
  spinner: {
    color: '#ffffff',
    marginTop: 20,
  }
});
