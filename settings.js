import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  Picker
} from 'react-native';

export default class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      teams: [],
      delay: null
    }
  }

  componentDidMount = () => {
    this.getTeams()
    this.getDelay()
  }

  getTeams = () => {
    fetch(`http://${this.props.host}:8080/get/teams`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      return response.json();
    }).then(teams => {
      let teamName = null;

      for (let i = 0; i < teams.length; i++) {
        if (teams[i].Selected) {
          teamName = teams[i].name;
          break;
        }
      }

      this.setState({ teams, teamName });
      this.props.onLoadingComplete();
    }).catch(err => {
      console.log(err);
    });
  }

  getDelay = () => {
    fetch(`http://${this.props.host}:8080/get/delay`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      return response.json();
    }).then(delayObject => {
      this.setState({ delay: delayObject.value });
      this.props.onLoadingComplete();
    }).catch(err => {
      console.log(err);
    });
  }

  triggerHornAndLight = () => {
    fetch(`http://${this.props.host}:8080/play_horn`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      console.log(response);
    }).catch(err => {
      console.log(err);
    });
  }

  sendNewHockeyLightSettings = () => {
    this.setState({ sendingNewSettings: true });
    this.refs.delayInput.blur();

    fetch(`http://${this.props.host}:8080/post/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        team: {
          name: this.state.teamName
        },
        delay: {
          value: this.state.delay
        }
      })
    }).then(response => {
      this.setState({ sendingNewSettings: false });
    }).catch(err => {
      this.setState({ sendingNewSettings: false });
    });
  }

  render() {
    const { loading } = this.props;
    const { teamName, teams, delay, sendingNewSettings } = this.state;

    return (
      <View style={styles.container}>
        {
          !loading &&
          <View style={styles.hockeyLightSettingsContainer}>
            <Text>Selected Team</Text>
            <Picker
              selectedValue={teamName}
              onValueChange={teamName => this.setState({ teamName })}>
              {
                teams.map(team => {
                  return (
                    <Picker.Item key={team.name} label={team.name} value={team.name} />
                  );
                })
              }
            </Picker>

            <Text>Delay (sec)</Text>
            <TextInput
              placeholder='Delay in seconds'
              keyboardType='numeric'
              value={delay}
              onChangeText={delay => this.setState({ delay })}
              ref={'delayInput'}
            />

            {
              !sendingNewSettings ?
                <TouchableHighlight
                  onPress={this.sendNewHockeyLightSettings}>
                  <Text style={styles.button}>Update</Text>
                </TouchableHighlight>
                :
                <Text style={styles.button}>Updating...</Text>
            }
          </View>
        }

        <TouchableHighlight onPress={this.triggerHornAndLight}>
          <Text style={styles.button}>Trigger Horn and Light</Text>
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
  },
  spinner: {
    color: '#ffffff',
    alignSelf: 'center',
    marginTop: 20,
  }
});