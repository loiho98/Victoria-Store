import { Button, CardItem, Container, Content, Text } from 'native-base'
import React, { Component } from 'react'
import { View } from 'react-native'
import { Icon } from 'react-native-elements'
import Firebase from './../firebase/config';
import NormalHeader from './../component/NormalHeader';

export default class ManagePhone extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phone: ['Empty']
    }
  }
  async loadUserInfo() {
    var uid = Firebase.auth().currentUser.uid
    await Firebase.database().ref('/info/' + uid).once('value', snapshot => {
      if (snapshot.child("phone").exists()) {
        this.setState({
          phone: Object.values(snapshot.val().phone),
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
        <NormalHeader title="Phone Book" navigation={this.props.navigation} />
        <Content>
          {
            this.state.phone.map(item => (
              <View style={{ flexDirection: 'row', margin: 30 }}>
                <Icon name='md-call' type='ionicon' />
                <Text> {item}.</Text>
              </View>
            ))
          }

        </Content>
        <Button full onPress={() => { this.props.navigation.navigate("AddPhone") }}>
          <Text>+ Add new phone</Text>
        </Button>
      </Container>
    )
  }
}
