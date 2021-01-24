import { Button, CardItem, Container, Content, Text } from 'native-base'
import React, { Component } from 'react'
import { View } from 'react-native'
import { Icon } from 'react-native-elements'
import Firebase from './../firebase/config';
import NormalHeader from './../component/NormalHeader';

export default class ManageAddress extends Component {
  constructor(props) {
    super(props)
    this.state = {
      address: ['Empty']
    }
  }
  async loadUserInfo() {
    var uid = Firebase.auth().currentUser.uid
    await Firebase.database().ref('/info/' + uid).once('value', snapshot => {
      if (snapshot.child("address").exists()) {
        this.setState({
          address: Object.values(snapshot.val().address),
        })
      }
    })
  }
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.loadUserInfo()
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }
  render() {
    return (
      <Container>
        <NormalHeader title="Address Book" navigation={this.props.navigation} />
        <Content>
          {
            this.state.address.map(item => (
              <View style={{ flexDirection: 'row', margin: 30 }}>
                <Icon name='map-pin' type='feather' />
                <Text> {item}.</Text>
              </View>
            ))
          }

        </Content>
        <Button full onPress={() => { this.props.navigation.navigate("AddAddress") }}>
          <Text>+ Add new address</Text>
        </Button>
      </Container>
    )
  }
}
