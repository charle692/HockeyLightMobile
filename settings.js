import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput
} from 'react-native';

const Spinner = require('react-native-spinkit');

export default class Settings extends Component {
  constructor() {
    super();
    this.state = {
      loading: true
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>{this.props.host}</Text>
      </View>
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