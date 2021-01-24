import { observer } from "mobx-react";
import {
  Button,
  Card,
  CardItem,
  Content,
  Form,
  H3,
  Icon,
  Right,
  Text,
  Container,
  Picker,
  Left
} from "native-base";
import React, { Component } from "react";
import { FlatList, ImageBackground, View, Image, ScrollView, TouchableOpacity, TextInput } from "react-native";
import NormalHeader from "../component/NormalHeader";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Cart from "../mobx/Cart";
import Person from './Person';
import Firebase from './../firebase/config';
import PleaseSignIn from './../component/PleaseSignIn';
import { Button as B, Icon as I } from "react-native-elements";
@observer
export default class CartView extends Component {
  constructor(props) {
    super(props);
    this.checkOutPress = this.checkOutPress.bind(this)
  }
  checkOutPress() {
    Cart.cart.forEach(item => {
      var old_checkOutCount = 0
      if (item.checkOutCount) { old_checkOutCount = item.checkOutCount }
      Firebase.database().ref('/product/' + item.key).update({ checkOutCount: old_checkOutCount + 1 })
    })
    this.props.navigation.navigate("Person", { from: "CartView" })
  }
  componentDidMount() {
    Cart.loadCartFromServer()
  }

  _render(item) {
    return (
      <View key={item.key}>
        <View style={{ flexDirection: "row", margin: 20 }}>
          <Button
            dark
            transparent
            style={{ position: 'absolute', top: 0, right: 0, zIndex: 10 }}
            onPress={() => {
              Cart.removeFromCart(item);
            }}
          >
            <Icon name="md-trash" />
          </Button>
          <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', width: wp("20%") + 10 }}>
            <Image
              source={{ uri: item.buy_color.image }}
              style={{ width: wp("20%"), height: 1.25 * wp("20%") }}
            >
            </Image>
          </View>
          <TouchableOpacity
            onPress={() => { this.props.navigation.navigate("Detail", { key: item.key }); }}
            style={{ flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
            <Text style={{ textTransform: 'capitalize', fontWeight: '900' }} >{item.name}</Text>
            <Text style={{ color: 'grey', fontSize: 12 }}>Color: {item.buy_color.name}. Size: {item.buy_size.name}</Text>
            <Text style={{ color: '#E70C58', fontWeight: 'bold' }}>${item.price}</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: "row", position: 'absolute', right: 0, bottom: 0 }}>
            <Button small transparent onPress={() => {
              Cart.descrease(item);
            }}>
              <Text>-</Text>
            </Button>
            <TextInput
              inputStyle={{ textAlign: 'center' }}
              containerStyle={{ width: wp("15%") }}
              keyboardType="numeric"
              value={item.buy_quantity + ""}
              onChangeText={(buy_quantity) => { Cart.setQuantity(item, buy_quantity) }}
            />
            <Button small transparent onPress={() => { Cart.inscrease(item) }}>
              <Text>+</Text>
            </Button>
          </View>
        </View>
      </View >
    );
  }
  render() {
    if (Firebase.auth().currentUser.isAnonymous)
      return (
        <PleaseSignIn navigation={this.props.navigation} />
      )
    else
      return (
        Cart.cart.length == 0 ?
          <Container>
            <NormalHeader title="My Basket" navigation={this.props.navigation} />
            <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
              <I name="ios-basket" type="ionicon" iconStyle={{ fontSize: 200, color: 'grey', opacity: 0.4 }} />
              <Text style={{ fontSize: 12, color: 'grey', alignSelf: 'center', margin: 12 }}>Your basket is empty</Text>
              <B title="Shopping" buttonStyle={{ width: 100, alignSelf: 'center', backgroundColor: '#E70C58' }} onPress={() => this.props.navigation.navigate("Home")} />
            </View>
          </Container>
          :
          <Container>
            <NormalHeader title="My Basket" navigation={this.props.navigation} />
            <Content>
              <FlatList
                maxToRenderPerBatch={3}
                initialNumToRender={2}
                updateCellsBatchingPeriod={3}
                windowSize={8}
                data={Cart.cart}
                renderItem={({ item }) => this._render(item)}
                keyExtractor={(item, index) => index.toString()}
              ></FlatList>
            </Content>
            <CardItem style={{ position: 'absolute', bottom: 0, right: 0 }}>
              <Left>
                <Text style={{ fontWeight: 'bold' }}>Total:</Text>
                <Text style={{ fontWeight: 'bold', color: "#E70C58" }}> ${Cart.getCheckoutTotal()}</Text>
              </Left>
              <Button info onPress={this.checkOutPress}>
                <Text>Check Out</Text>
              </Button>
            </CardItem>
          </Container>


      );
  }
}
