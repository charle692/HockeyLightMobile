import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput
} from 'react-native';

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
  container: {
    paddingTop: 10,
    flex: 1,
    alignItems: 'center',
  },
});