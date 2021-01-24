import { Card, CardItem, Container, Content, Button, Text, Label, Form, Picker, Item } from 'native-base';
import React, { Component } from 'react'
import { View, ToastAndroid } from 'react-native';
import { Input } from 'react-native-elements';
import NormalHeader from './../component/NormalHeader';
import Firebase from './../firebase/config';
export default class AddAddress extends Component {
  constructor(props) {
    super(props)
    this.state = {
      province: '',
      district: '',
      ward: '',
      street: '',
      house: '',
      listProvince: [],
      listDistrict: [],
      listWard: []
    }
    this.writeUserInfo = this.writeUserInfo.bind(this)
  }
  writeUserInfo() {
    var uid = Firebase.auth().currentUser.uid
    if (this.state.house != "" && this.state.street != "") {
      var pushKey = Firebase.database().ref('/info/' + uid + "/address").push().key
      var obj = new Object()
      obj[pushKey] = this.capitalize(this.state.house) + ", " + this.capitalize(this.state.street)
      Firebase.database().ref('/info/' + uid + "/address/").update(obj)
      ToastAndroid.show("Saved", ToastAndroid.SHORT)
      this.props.navigation.goBack()
    }
    else {
      ToastAndroid.show("Please fill out all fields", ToastAndroid.SHORT)
    }

  }
  capitalize(str) {
    return str.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))
  }
  // getProvince() {
  //   return fetch('https://thongtindoanhnghiep.co/api/city')
  //     .then((response) => response.json())
  //     .then((json) => {
  //       // console.log(json.LtsItem);
  //       this.setState({ listProvince: json.LtsItem })
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

  getProvince() {
    return fetch('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/json/tinh.json')
      .then((response) => response.json())
      .then((json) => {
        this.setState({ listProvince: json })
      })
      .catch((error) => {
        console.error(error);
      });
  }
  getDistrict(p) {
    return fetch('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/json/huyen.json')
      .then((response) => response.json())
      .then((json) => {
        this.setState({ listDistrict: json.filter(e => e.tinh_id === p.id) })
        this.getWard(this.state.listDistrict[0])
      })
      .catch((error) => {
        console.error(error);
      });

  }
  getWard(d) {
    return fetch('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/json/xa.json')
      .then((response) => response.json())
      .then((json) => {
        this.setState({ listWard: json.filter(e => e.huyen_id === d.id) })
      })
      .catch((error) => {
        console.error(error);
      });
  }
  componentDidMount() {
    this.getProvince()
  }

  render() {
    return (
      <Container>
        <NormalHeader title="Add New Address" navigation={this.props.navigation} />
        <Content>
          <View style={{ margin: 10 }}>
            <Label>Province(*)</Label>
            <Form>
              <Picker
                selectedValue={this.state.province}
                onValueChange={(province) => { this.setState({ province }); this.getDistrict(province); }}
              >
                {this.state.listProvince.map(e => (
                  <Picker.Item label={e.name} value={e} />
                ))}
              </Picker>
            </Form>
            <Label>District(*)</Label>
            <Form>
              <Picker
                selectedValue={this.state.district}
                onValueChange={(district) => { this.setState({ district }); this.getWard(district) }}
              >
                {this.state.listDistrict.map(e => (
                  <Picker.Item label={e.name} value={e} />
                ))}
              </Picker>
            </Form>
            <Label>Ward(*)</Label>
            <Form>
              <Picker
                selectedValue={this.state.ward}
                onValueChange={(ward) => this.setState({ ward })}
              >
                {this.state.listWard.map(e => (
                  <Picker.Item label={e.name} value={e} />
                ))}
              </Picker>
            </Form>

            <Input
              label="Street, buiding, area, etc(*)"
              defaultValue={this.state.street}
              placeholder="" onChangeText={(street) => { this.setState({ street }) }} />
            <Input
              label="Floor No, House No, etc(*)"
              defaultValue={this.state.house}
              placeholder="" onChangeText={(house) => { this.setState({ house }) }} />
            <Button style={{ alignSelf: 'flex-end', margin: 5 }} onPress={this.writeUserInfo}>
              <Text>Save</Text>
            </Button>
          </View>
        </Content>
      </Container>
    )
  }
}
