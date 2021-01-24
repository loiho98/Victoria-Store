import * as ImagePicker from 'expo-image-picker';
import moment from 'moment';
import { Button, Icon, Item, Text } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, FlatList, ImageBackground, Keyboard, TextInput, View } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import NormalHeader from '../component/NormalHeader';
import Firebase from './../firebase/config';
import { ToastAndroid } from 'react-native';
const width = Dimensions.get("window").width
var temp = [], imageCount = 0
export default class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newMessage: '',
      message: [],
      isReady: false,
      image: [],
      isImageReady: false,
    }
  }
  async pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
    });
    console.log(result);
    if (!result.cancelled) {
      this.uploadImage(result.uri)
    }
  };
  uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    var imageName = moment() + Firebase.database().ref('/').push().key
    var ref = Firebase.storage().ref('/chat').child(imageName);
    return ref.put(blob).then(() => { this.writeImageMessage(imageName) }).catch(err => alert(err));
  }
  async writeImageMessage(imageName) {
    ToastAndroid.show("Sending...", ToastAndroid.SHORT)
    var time = moment().format('llll').toString()
    var user = Firebase.auth().currentUser
    await Firebase.storage().ref('/chat').child(imageName).getDownloadURL().then(url => {
      Firebase.database().ref('/chat/' + user.uid).push().set({
        name: user.displayName,
        image: url,
        time: time,
      })
      Firebase.database().ref('/').update({ needReloadChat: true })
    }).then(() => {
      ToastAndroid.show("Message has been sent", ToastAndroid.SHORT)
      this.setState({ newMessage: '' })
    })

  }
  async writeMessage(content) {
    ToastAndroid.show("Sending...", ToastAndroid.SHORT)
    if (content != '') {
      var user = Firebase.auth().currentUser
      var time = moment().format('llll').toString()
      await Firebase.database().ref('/chat/' + user.uid).push().set({
        name: user.displayName,
        content: content,
        time: time
      }).then(() => { this.setState({ newMessage: '' }); })
      Firebase.database().ref('/reload/').update({ chat: "true"})
    }
  }
  async messageRef() {
    var user = Firebase.auth().currentUser
    await Firebase.database().ref('/chat/' + user.uid).on("value", snap => {
      var message=[]
      if (snap.exists()){ 
        message=Object.values(snap.val())
      }
      this.setState({ message: message })
      snap.forEach(item => {
        if (item.val().name== "Victoria Store") {
          Firebase.database().ref('/chat/' + user.uid + "/" + item.key).update({
            seen: "true"
          })
        }
      })
    })
  }
  async componentDidMount() {
    await this.messageRef();
  }
  componentWillUnmount(){
    var user = Firebase.auth().currentUser
    Firebase.database().ref('/chat/' + user.uid).off()
  }
  _renderYourMessage(item) {
    var user = Firebase.auth().currentUser
    if (item.name == user.displayName) {
      return (
        <View style={{
          flexDirection: 'column', width: '65%', alignItems: 'flex-start',
          alignSelf: 'flex-end',
          padding: 8, backgroundColor: '#FFF', borderRadius: 8, marginBottom: 10, marginTop: 10,
        }} >
          <Text style={{ color: '#005ce6', marginBottom: 5 }} >You</Text>
          <Text>{item.content}</Text>
          {item.image ?
            <AutoHeightImage source={{ uri: item.image }} width={200}/>
            :
            <View />
          }
          <View style={{ flexDirection: 'row' }}>
            {item.seen ?
              <Icon name="md-checkmark-circle" style={{ fontSize: (item.seen ? 12 : 0), color: 'green' }} />
              : <View />
            }
            <Text style={{ fontSize: 8, color: 'grey' }}> {moment(item.time).fromNow()}</Text>
          </View>
        </View>
      )
    } else {
      return (
        <View style={{
          flexDirection: 'column', width: '65%', alignItems: 'flex-start',
          padding: 8, backgroundColor: '#FFF', borderRadius: 8, marginBottom: 10, marginTop: 10, marginRight: 5
        }} >
          <Text style={{ color: '#005ce6', marginBottom: 5 }} >Victoria Store</Text>
          <Text>{item.content ? item.content : ""}</Text>
          {item.image ?
            <AutoHeightImage source={{ uri: item.image }} width={200} />
            :
            <View />
          }
          <View style={{ flexDirection: 'row' }}>
            {item.seen ?
              <Icon name="md-checkmark-circle" style={{ fontSize: (item.seen ? 12 : 0), color: 'green' }} />
              : <View />
            }
            <Text style={{ fontSize: 8, color: 'grey' }}> {moment(item.time).fromNow()}</Text>
          </View>
        </View>
      )
    }
  }
  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }} >
        <NormalHeader title="Connect with us" navigation={this.props.navigation} />
        <ImageBackground imageStyle={{ opacity: 0.5 }} source={require('../assets/images/fashion.jpg')}
          style={{ flex: 1, backgroundColor: '#A5A5A5', flexDirection: 'column', justifyContent: 'flex-end' }} >
          <FlatList
            ref={(ref) => { this.flatList = ref }}
            onContentSizeChange={() => { setTimeout(() => this.flatList.scrollToEnd(), 20) }}
            keyExtractor={(item, index) => index.toString()}
            data={this.state.message}
            renderItem={({ item }, index) => this._renderYourMessage(item)} />
        </ImageBackground>
        <Item style={{ backgroundColor: 'white', flexDirection: 'row' }}>
          <Button transparent icon onPress={() => this.pickImage()}>
            <Icon name="md-images" />
          </Button>
          <TextInput
            ref={input => { this.textInput = input }}
            style={{ flex: 98 / 100 }}
            value={this.state.newMessage}
            onEndEditing={() => { this.writeMessage(this.state.newMessage); }}
            placeholder="Enter Message" onChangeText={(newMessage) => { this.setState({ newMessage }); }} />
        </Item>

      </View>
    )
  }
}
