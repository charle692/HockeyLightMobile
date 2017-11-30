import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight
} from 'react-native';

export default class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
    console.log("The props are: " + JSON.stringify(props));
  }

  triggerHornAndLight = () => {
    console.log("The props are: " + this.props.host);

    fetch(`http://${this.props.host}:8080/play_horn`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      console.log(response);
    }).catch(err => {
      console.log(response);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.triggerHornAndLight}>
          <Text style={styles.triggerHornAndLight}>Trigger Horn and Light</Text>
        </TouchableHighlight>
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
  triggerHornAndLight: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    color: '#ffffff',
    fontSize: 17,
  }
});