import { Button } from 'native-base';
import React, { Component } from 'react'
import { Text, View } from 'react-native'
import Firebase from './../firebase/config';
import moment from 'moment';
var a = 0
export default class History extends Component {
  render() {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Button onPress={() => {
          a = moment()
          console.log(a)
        }}>
          <Text>Test</Text>
        </Button>
        <Button onPress={() => {
          console.log(a.fromNow())
        }}>
          <Text>Test</Text>
        </Button>
      </View>
    )
  }
}
