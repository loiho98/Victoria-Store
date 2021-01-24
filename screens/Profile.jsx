import { Card, CardItem, Container, Content, Right, Text, Thumbnail, View } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, ToastAndroid, TouchableOpacity } from 'react-native';
import { Button, Icon, withBadge } from 'react-native-elements';
import Store from 'react-native-store';
import NormalHeader from "../component/NormalHeader";
import Firebase from './../firebase/config';
import PleaseSignIn from './../component/PleaseSignIn';
const width = Dimensions.get("window").width
const DB = {
  'user': Store.model('user'),
}

export default class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      address: ['Empty'],
      phone: ['Empty'],
      isNewMessage: 0
    }
    this.signOut = this.signOut.bind(this)
    this.openChat = this.openChat.bind(this)
  }
  async loadUserInfo() {
    var uid = Firebase.auth().currentUser.uid
    await Firebase.database().ref('/info/' + uid).once('value', snapshot => {
      if (snapshot.child("phone").exists()) {
        this.setState({
          phone: Object.values(snapshot.val().phone),
        })
      }
      if (snapshot.child("address").exists()) {
        this.setState({
          address: Object.values(snapshot.val().address),
        })
      }
    })
  }
  async readMessage() {
    var user = Firebase.auth().currentUser
    await Firebase.database().ref('/chat/' + user.uid).orderByKey().once('value', snapshot => {
      var newMesssage = 0
      snapshot.forEach(item => {
        if (item.val().name != user.displayName && !item.val().seen) {
          newMesssage += 1
        }
      })
      this.setState({ isNewMessage: newMesssage })
    })
  }
  async signOut() {
    this.props.navigation.navigate("Home")
    await Firebase.auth()
      .signOut()
      .then(() => {
        DB.user.destroy()
        this.props.navigation.navigate("SignIn")
      }
      )
      .catch(function (error) {
        alert(error);
      });
  }
  openChat() {
    if (!Firebase.auth().currentUser.displayName) {
      ToastAndroid.show("Please update your name", ToastAndroid.SHORT)
      this.props.navigation.navigate("EditProfile")
    } else
      this.props.navigation.navigate('Chat')
  }
  componentDidMount() {
    this.loadUserInfo()
    this.readMessage()
  }


  render() {
    const BadgedIcon = withBadge(this.state.isNewMessage)(Button)
    if (Firebase.auth().currentUser.isAnonymous)
      return (
        <PleaseSignIn navigation={this.props.navigation} />
      )
    else
      return (
        <Container>
          <NormalHeader title="Profile" navigation={this.props.navigation} />
          <Content>
            <View>
              <CardItem button onPress={() => { this.props.navigation.navigate("EditProfile") }}>
                <Thumbnail source={require("../assets/images/images.jpg")} style={{ borderColor: "white", borderWidth: 2 }} />
                <View style={{ flexDirection: 'column', paddingLeft: 10 }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{Firebase.auth().currentUser.displayName || ""}</Text>
                  <Text>{Firebase.auth().currentUser.email}</Text>
                </View>
                <Right>
                  <Icon name="ios-arrow-forward" type="ionicon" />
                </Right>
              </CardItem>

            </View>
            {/* <View>
              {this.state.address && this.state.phone ?
                <View style={{ marginLeft: 16 }}>
                  <Icon name="md-call" type="ionicon" style={{ width: 30 }} size={30} />
                  {
                    this.state.phone.map(item => (
                      <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                        <Icon name="md-arrow-dropright" type="ionicon" />
                        <Text> {item}.</Text>
                      </View>
                    ))
                  }
                  <Button type="clear" buttonStyle={{ borderColor: "tomato", height: 30, width: 130 }} title="+Add new phone" titleStyle={{ color: "tomato", fontSize: 12 }} onPress={() => { this.props.navigation.navigate("AddPhone") }} />
                  <Icon name="md-home" type="ionicon" style={{ width: 30 }} size={30} />
                  {
                    this.state.address.map(item => (
                      <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                        <Icon name="md-arrow-dropright" type="ionicon" />
                        <Text> {item}.</Text>
                      </View>
                    ))
                  }
                  <Button type="clear" buttonStyle={{ borderColor: "tomato", height: 30, width: 130 }} title="+Add new address" titleStyle={{ color: "tomato", fontSize: 12 }} onPress={() => { this.props.navigation.navigate("AddAddress") }} />
                </View>
                :
                <CardItem>
                  <Text>No Information</Text>
                </CardItem>
              }
            </View> */}
            <View>
              <CardItem header>
                <Text style={{ fontWeight: 'bold' }}>My Information</Text>
              </CardItem>
              <CardItem style={{ justifyContent: 'space-around' }}>
                <TouchableOpacity onPress={() => { this.props.navigation.navigate("ManagePhone") }}>
                  <Icon name='md-call' type='ionicon' />
                  <Text style={{ fontSize: 13 }}>Phone</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { this.props.navigation.navigate("ManageAddress") }}>
                  <Icon name='map-pin' type='feather' />
                  <Text style={{ fontSize: 13 }}>Address</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { this.props.navigation.navigate("EditProfile") }}>
                  <Icon name='md-person' type='ionicon' />
                  <Text style={{ fontSize: 13 }}>Update Profile</Text>
                </TouchableOpacity>
              </CardItem>
            </View>
            <View>
              <CardItem header>
                <Text style={{ fontWeight: 'bold' }}>Service</Text>
              </CardItem>
              <CardItem style={{ justifyContent: 'space-between' }}>
                <View>
                  <BadgedIcon
                    icon={<Icon name="ios-chatbubbles" type="ionicon" color="white" />}
                    onPress={this.openChat}
                    buttonStyle={{ backgroundColor: 'black', borderRadius: 15 }}
                  />
                  <Text style={{ fontSize: 13 }}>Connect with us</Text>
                </View>
              </CardItem>
            </View>
          </Content>
          <Card style={{ position: 'absolute', bottom: 5, width: width }}>
            <Button type="clear" title="Sign Out" titleStyle={{ color: "#E70C58" }} onPress={this.signOut} />
          </Card>
        </Container>

      )
  }
}
