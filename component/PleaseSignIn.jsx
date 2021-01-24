import { Container } from 'native-base'
import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Button, Icon } from 'react-native-elements';
import NormalHeader from './NormalHeader';

export default class PleaseSignIn extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <Container>
        <NormalHeader title="Profile" navigation={this.props.navigation} />
        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
          <Icon name="md-person" type="ionicon" iconStyle={{ fontSize: 200, color: 'grey', opacity: 0.4 }} />
          <Button title="Sign In" buttonStyle={{ width: 100, alignSelf: 'center', backgroundColor: '#E70C58' }} onPress={() => this.props.navigation.navigate("SignIn")} />
        </View>
      </Container>
    )
  }
}
