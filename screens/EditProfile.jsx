import React, { Component } from 'react'
import { View } from 'react-native'
import { Button, Card, CardItem, Item, Label, Right, Text } from 'native-base';
import NormalHeader from '../component/NormalHeader';
import Firebase from './../firebase/config';
import { Input } from 'react-native-elements';
import { ToastAndroid } from 'react-native';

export default class EditProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: "",
      name: ""
    }
    this.updateProfile = this.updateProfile.bind(this)
  }
  updateProfile() {
    if (this.state.email != "" && this.state.name != "") {
      Firebase.auth().currentUser.updateProfile({
        email: this.state.email,
        displayName: this.state.email
      }).then(() => {
        ToastAndroid.show("Success", ToastAndroid.SHORT)
        this.props.navigation.goBack()
      })
    } else {
      alert("Please fill out all fields")
    }

  }
  componentDidMount() {
    this.setState({ email: Firebase.auth().currentUser.email, name: Firebase.auth().currentUser.displayName })
  }

  render() {
    return (
      <View style={{ justifyContent: "center" }}>
        <NormalHeader title="Update Profile" navigation={this.props.navigation} />
        <View>
          <CardItem>
            <Input label="Email(*)"
              defaultValue={this.state.email}
              onChangeText={(email) => this.setState({ email })}></Input>
          </CardItem>
          <CardItem>
            <Input
              label="Name(*)"
              defaultValue={this.state.name}
              onChangeText={(name) => { this.setState({ name }) }}
            ></Input>
          </CardItem>
          <CardItem>
            <Right>
              <Button onPress={this.updateProfile}>
                <Text>Accept</Text>
              </Button>
            </Right>
          </CardItem>
        </View>
        <Card>
          <CardItem bordered>
            <Text>Change Password</Text>
          </CardItem>
        </Card>
      </View>
    )
  }
}
