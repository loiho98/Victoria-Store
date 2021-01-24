import { Button, Text, Container, Content } from 'native-base'
import React, { Component } from 'react'
import { View } from 'react-native'
import { Input } from 'react-native-elements';
import Firebase from '../firebase/config'
import NormalHeader from './../component/NormalHeader';

export default class AddPhone extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phone: ''
    }
  }
  addNewPhone() {
    if (this.state.phone != "") {
      var uid = Firebase.auth().currentUser.uid
      var pushKey = Firebase.database().ref('/info/' + uid + "/phone").push().key
      var obj = new Object()
      obj[pushKey] = this.state.phone
      Firebase.database().ref('/info/' + uid + "/phone").update(obj).then(() => {
        this.props.navigation.goBack()
      })
    }
    else {
      alert("Cannot empty!")
    }

  }
  render() {
    return (
      <Container>
        <NormalHeader title="Add New Phone Number" navigation={this.props.navigation} />
        <Content>
          <View style={{ margin: 10 }}>
            <Input
              label="Phone number(*)"
              keyboardType="phone-pad"
              onChangeText={(phone) => this.setState({ phone })} />
            <Button style={{ alignSelf: 'flex-end', margin: 5 }} onPress={() => { this.addNewPhone() }}>
              <Text>Save</Text>
            </Button>
          </View>
        </Content>
      </Container>
    )
  }
}
