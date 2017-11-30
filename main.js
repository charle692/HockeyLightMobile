import React, { Component } from 'react';
import Settings from './settings';
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
global.Buffer = global.Buffer || require('buffer').Buffer;

export default class Main extends Component {
  constructor() {
    super();
    this.state = {
      loading: true
    }

    this.findHockeyLight();
  }

  findHockeyLight() {
    let client = new Client();

    client.on('response', (headers, statusCode, rinfo) => {
      console.log(headers);
      console.log(rinfo);

      if (headers['ST'] === 'my:hockey-light') {
        this.setState({ loading: false, host: rinfo['address'] });
        client.stop();
      }
    });

    client.search('my:hockey-light');
  }

  render() {
    const { loading, host } = this.state;

    return (
      <View style={styles.container}>
        <Image
          source={require('./images/hockey_light.png')}
          style={styles.hockeyLight}
        />
        <Text style={styles.title}>
          Hockey Light
        </Text>
        <Spinner
          style={styles.spinner}
          isVisible={loading}
          size={50}
          type={'ThreeBounce'}
        />
        {!loading && <Settings host={host} />}
      </View >
    );
  }
}

const styles = StyleSheet.create({
  hockeyLight: {
    height: 120,
    width: 240
  },
  container: {
    paddingTop: 50,
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#999',
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
