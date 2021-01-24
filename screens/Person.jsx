import React, { Component } from 'react'
import NormalHeader from './../component/NormalHeader';
import Firebase from './../firebase/config';
import { Card, CardItem, Container, Content, Picker, Form, Button, Text, View, Icon } from 'native-base';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Image } from 'react-native';
export default class Person extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phone: ['Empty'],
      address: ['Empty'],
      selectedAddress: '',
      selectedPhone: '',
      visible: false,
      addPhone: ''
    }
    this.goToCheckOut = this.goToCheckOut.bind(this)
  }
  capitalize(str) {
    return str.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))
  }
  loadUserInfo = async () => {
    var uid = Firebase.auth().currentUser.uid
    await Firebase.database().ref('/info/' + uid).once('value', snapshot => {
      if (snapshot.child("phone").exists()) {
        this.setState({
          phone: Object.values(snapshot.val().phone),
          selectedPhone: Object.values(snapshot.val().phone)[0]
        })
      }
      if (snapshot.child("address").exists()) {
        this.setState({
          address: Object.values(snapshot.val().address),
          selectedAddress: Object.values(snapshot.val().address)[0]
        })
      }
    })
  }
  goToCheckOut() {
    this.props.navigation.navigate('PlaceOrder', { phone: this.state.selectedPhone, address: this.state.selectedAddress })

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
        <NormalHeader title="Basic Info" navigation={this.props.navigation} />
        <Content contentContainerStyle={{ marginLeft: 4 }}>
          <CardItem header bordered>
            <Text>Your Phone:</Text>
          </CardItem>
          <View style={{ flexDirection: 'row' }}>
            <Form style={{ width: wp("85%") }}>
              <Picker
                mode="dialog"
                selectedValue={this.state.selectedPhone}
                onValueChange={(selectedPhone) => this.setState({ selectedPhone })}
              >
                {
                  this.state.phone.map(item =>
                    <Picker.Item label={item} value={item} key={item} />
                  )
                }
              </Picker>
            </Form>
            <Button dark transparent onPress={() => this.props.navigation.navigate("AddPhone")}>
              <Icon name='md-add' />
            </Button>
          </View>
          <CardItem header bordered>
            <Text>Your Address:</Text>
          </CardItem>
          <View style={{ flexDirection: 'row' }}>
            <Form style={{ width: wp("85%") }}>
              <Picker
                mode="dialog"
                selectedValue={this.state.selectedAddress}
                onValueChange={(selectedAddress) => this.setState({ selectedAddress })}
              >
                {
                  this.state.address.map(item => (
                    <Picker.Item label={item} value={item} key={item} />
                  ))
                }
              </Picker>
            </Form>
            <Button icon dark transparent onPress={() => { this.props.navigation.navigate("AddAddress") }}>
              <Icon name='md-add' />
            </Button>
          </View>
          <Image source={{ uri: "https://i.pinimg.com/originals/df/03/fc/df03fc5c32b309a299bc95260089b0cd.gif" }} style={{ width: 100, height: 50, alignSelf: 'center', marginTop: 40 }} />
          <View>
          </View>

        </Content>
        <Card>

          <CardItem>
            <Text>+Phone: {this.state.selectedPhone}</Text>
            <Text></Text>
          </CardItem>
          <CardItem>
            <Text>+Address: {this.state.selectedAddress}</Text>
          </CardItem>
          <Button onPress={this.goToCheckOut} full warning>
            <Text>Accept</Text>
          </Button>
        </Card>

      </Container>
    )
  }
}
