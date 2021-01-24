import { observer } from 'mobx-react'
import { Body, Content, Button, Card, CardItem, Input, Item, Label, Left, ListItem, Radio, Right, Text, Icon, Container } from 'native-base'
import React, { Component } from 'react'
import { Dimensions, Image, ScrollView, ToastAndroid, View, FlatList, TouchableOpacity, Alert } from 'react-native'
import { Button as B, Icon as I } from 'react-native-elements'
import NormalHeader from '../component/NormalHeader'
import Cart from '../mobx/Cart'
import Firebase from './../firebase/config'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { TextInput } from 'react-native'
import moment from 'moment';
var shippingFee = 10
@observer
export default class EditOrder extends Component {
  constructor() {
    super();
    this.state = {
      itemSelected: 1,
      phone: '',
      address: '',
      editUserInfo: false,
      cart: [],
      editCart: false,
      old_quantity: []
    }
    this.editInfo = this.editInfo.bind(this)
  }
  editInfo() {
    Firebase.database().ref('/order/' + this.props.route.params.order.key).update({
      address: this.state.address,
      phone: this.state.phone
    })
    ToastAndroid.show("Success!", ToastAndroid.SHORT)
    this.setState({ editUserInfo: false })
  }
  decrease = (item) => () => {
    if (item.buy_quantity - 1 > 0) {
      item.buy_quantity--
      this.setState({ cart: this.state.cart })
    }
  }
  increase = (item) => () => {
    var item_old = this.state.old_quantity.find(e => e.sku == item.buy_variant.sku)
    this.getMaxQuantity(item.key, item.buy_variant.sku).then((qty) => {
      let increase = item.buy_quantity - item_old.buy_quantity
      console.log(increase)
      if (increase + 1 <= qty) {
        item.buy_quantity++; this.setState({ cart: this.state.cart })
      }
      else {
        alert("Not available!")
      }
    })
  }
  setQty(item) {
    var item_old = this.state.old_quantity.find(e => e.sku == item.buy_variant.sku)
    this.getMaxQuantity(item.key, item.buy_variant.sku).then((qty) => {
      let increase = item.buy_quantity - item_old.buy_quantity
      if (increase <= qty) {
        this.setState({ cart: this.state.cart })
      }
      else {
        alert("Not available!")
        console.log(item_old.buy_quantity)
        item.buy_quantity = item_old.buy_quantity
        this.setState({ cart: this.state.cart })
      }
    })
  }
  cancelOrder() {
    Alert.alert(
      "Cancel Order",
      "Are you sure to cancel this order!",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK", onPress: () => {
            let key = this.props.route.params.order.key
            let amount = this.props.route.params.order.amount
            let uid = Firebase.auth().currentUser.uid
            let time = moment().format('llll').toString()
            Firebase.database().ref('/order/' + key + "/cancel/").update({
              cancel_time: time,
              reason: "Customer changed",
              payment_refund: amount,
            }).then(() => {
              Firebase.database().ref('/order/' + key).update({ status: -1 })
            }).then(() => {
              Firebase.database().ref('/notification/' + uid).push().set({
                time: time,
                content: "Your order " + key + " was canceled. Reason: Customer changed"
              })
            }).then(() => { this.props.navigation.goBack() })
          }
        }
      ],
      { cancelable: false }
    );
  }
  _renderCart(item) {
    return (
      <View key={item.key} style={{ flexDirection: "row", margin: 20 }}>
        <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', width: wp("20%") + 10 }}>
          <Image
            source={{ uri: item.buy_color.image }}
            style={{ width: wp("20%"), height: 1.25 * wp("20%") }}
          >
          </Image>
        </View>
        <TouchableOpacity
          onPress={() => { this.props.navigation.navigate("Detail", { key: item.key }); }}
          style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
          <Text style={{ textTransform: 'capitalize', fontWeight: '900' }}>{item.name}</Text>
          <Text style={{ color: 'grey', fontSize: 12 }}>Color: {item.buy_color.name}. Size: {item.buy_size.name}</Text>
          <Text style={{ color: '#E70C58', fontWeight: 'bold' }}>${item.price}</Text>
        </TouchableOpacity>
        {this.state.editCart ?
          <View style={{ flexDirection: "row", position: 'absolute', right: 0, bottom: 0 }}>
            <Button small transparent onPress={this.decrease(item)}>
              <Text>-</Text>
            </Button>
            {/* <Button transparent small>
              <Text>{item.buy_quantity}</Text>
            </Button> */}
            <TextInput value={item.buy_quantity + ""} onChangeText={(qty) => { item.buy_quantity = qty; this.setState({ cart: this.state.cart }) }} onEndEditing={() => { this.setQty(item) }} />
            <Button small transparent onPress={this.increase(item)}>
              <Text>+</Text>
            </Button>

          </View> :
          <Text style={{ position: 'absolute', right: 0, bottom: 0, fontSize: 13, color: 'green', fontWeight: 'bold' }}>x {item.buy_quantity}</Text>
        }

      </View>
    );
  }
  async getMaxQuantity(key, sku) {
    var quantity = 0
    await Firebase.database().ref('/product/' + key + '/variant/').orderByChild('sku').equalTo(sku).once("value", snap => {
      quantity = Object.values(snap.val())[0].quantity
      console.log(Object.values(snap.val())[0].quantity);
    })
    return quantity
  }
  saveCart() {
    Firebase.database().ref('/order/' + this.props.route.params.order.key).update({
      cart: this.state.cart
    }).then(() => { this.setState({ editCart: false }) })
    for (let i = 0; i < this.state.cart.length; i++) {
      const element = this.state.cart[i];
      Firebase.database().ref('/product/').child(element.key).child('variant').orderByChild('sku').equalTo(element.buy_variant.sku).once("value", snap => {
        var item_old = this.state.old_quantity.find(e => e.sku == element.buy_variant.sku)
        let increase = element.buy_quantity - item_old.buy_quantity
        var old_quantity = Object.values(snap.val())[0].quantity
        Firebase.database().ref('/product/').child(element.key).child('variant').child(Object.keys(snap.val())[0]).update({ quantity: old_quantity - increase })
      })
    }
  }
  componentDidMount() {
    this.setState({ address: this.props.route.params.order.address, phone: this.props.route.params.order.phone, cart: this.props.route.params.order.cart })
    let old_quantity = []
    this.props.route.params.order.cart.forEach(item => {
      old_quantity.push({ sku: item.buy_variant.sku, buy_quantity: item.buy_quantity })
    })
    this.setState({ old_quantity: old_quantity })
  }

  render() {
    const item = this.props.route.params.order
    return (
      <Container style={{ flex: 1 }}>
        <NormalHeader title="Order detail" navigation={this.props.navigation}></NormalHeader>
        <Content>
          <Card>
            <CardItem header bordered>
              <Text style={{ fontWeight: 'bold' }}>Order Info </Text>
            </CardItem>
            <CardItem>
              <Text>Order ID: </Text>
              <Text style={{ color: 'grey' }}>{item.key}</Text>
            </CardItem>
            <CardItem>
              <Text>Order Time: </Text>
              <Text style={{ color: 'grey' }}>{item.order_time}</Text>
            </CardItem>
          </Card>
          <Card>

            <CardItem header bordered>
              <Text style={{ fontWeight: 'bold' }}>User Info</Text>
              {item.status == 0 ?
                <B
                  icon={<I type='ionicon' name='ios-create' color="#E70C58"></I>}
                  type="clear"
                  onPress={() => this.setState({ editUserInfo: !this.state.editUserInfo })}
                  containerStyle={{ position: 'absolute', top: 0, right: 0 }} />
                :
                <View />
              }

            </CardItem>
            {
              this.state.editUserInfo ?
                <View>
                  <Item stackedLabel>
                    <Label>Phone: </Label>
                    <Input value={this.state.phone} onChangeText={(phone) => { this.setState({ phone }) }}></Input>
                  </Item>
                  <Item stackedLabel>
                    <Label>Address:</Label>
                    <Input value={this.state.address} multiline onChangeText={(address) => { this.setState({ address }) }}></Input>
                  </Item>
                  <CardItem>
                    <Right>
                      <Button small info onPress={this.editInfo}
                      >
                        <Text>Accept</Text>
                      </Button>
                    </Right>
                  </CardItem>

                </View>
                :
                <View>
                  <CardItem>
                    <Text>Phone: {this.state.phone}</Text>
                  </CardItem>
                  <CardItem>
                    <Text>Address: {this.state.address}.</Text>
                  </CardItem>
                </View>
            }

          </Card>
          <Card>
            <CardItem header bordered>
              <Text style={{ fontWeight: 'bold' }}>Shipping Method</Text>
            </CardItem>
            <CardItem style={{ justifyContent: 'space-between' }} >
              <View>
                <Text>Victoria Ship</Text>
                <Text style={{ color: 'grey', fontSize: 12 }}>1-2 bussiness day</Text>
              </View>
              <Text style={{ color: '#E70C58', fontWeight: 'bold', textAlign: 'right' }}>${shippingFee}</Text>
            </CardItem>
          </Card>
          <Card>
            <CardItem header bordered>
              <Text style={{ fontWeight: 'bold' }}>Payment method</Text>
            </CardItem>
            {item.transaction.type == "COD" ?
              <ListItem onPress={() => this.setState({ itemSelected: 1 })}>
                <Radio selected={this.state.itemSelected == 1} />
                <Body>
                  <CardItem>
                    <Image
                      style={{ width: 50, height: 25 }}
                      source={require('../assets/images/cash-on-delivery-png-5-Transparent-Images.png')}></Image>
                    <Text> Cash on delivery</Text>
                  </CardItem>

                </Body>
              </ListItem> :
              <ListItem onPress={() => { this.setState({ itemSelected: 2 }); ToastAndroid.show("We're so sorry, this service is unavailable right now!", ToastAndroid.SHORT) }}>
                <Radio selected={this.state.itemSelected == 2} />
                <Body>
                  <CardItem>
                    <Image
                      style={{ width: 90, height: 25 }}
                      source={require('../assets/images/488-4880728_tarjetas-visa-y-mastercard.png')}></Image>
                    <Text> Credit or Debit Cards</Text>
                  </CardItem>

                </Body>
              </ListItem>
            }
          </Card>
          <Card>
            <CardItem bordered header >
              <Text style={{ fontWeight: 'bold' }}>Basket</Text>
              {item.status == 0 ?
                <B
                  icon={<I type='ionicon' name='ios-create' color="#E70C58"></I>}
                  type="clear"
                  onPress={() => this.setState({ editCart: !this.state.editCart })}
                  containerStyle={{ position: 'absolute', top: 0, right: 0 }} />
                :
                <View />
              }
            </CardItem>
            <FlatList
              maxToRenderPerBatch={3}
              initialNumToRender={2}
              updateCellsBatchingPeriod={3}
              windowSize={8}
              data={this.state.cart}
              renderItem={({ item }) => this._renderCart(item)}
              keyExtractor={(item, index) => index.toString()}
            ></FlatList>
            {
              this.state.editCart ?
                <Button small info style={{ alignSelf: 'flex-end', margin: 10 }} onPress={() => this.saveCart()}>
                  <Text>Save</Text>
                </Button> :
                <View />
            }
          </Card>
          <Card>
            <CardItem header bordered>
              <Text style={{ fontWeight: 'bold' }}>Order Total</Text>
            </CardItem>

            <CardItem>
              <Left>
                <Text>Subtotal</Text>
              </Left>
              <Right>
                <Text style={{ fontWeight: 'bold' }}>${item.amount}</Text>
              </Right>
            </CardItem>
            <CardItem>
              <Left>
                <Text>Shipping</Text>
              </Left>
              <Right>
                <Text style={{ fontWeight: 'bold' }}>${shippingFee}</Text>
              </Right>
            </CardItem>
            <CardItem bordered>
              <Left>
                <Text>Grand Total</Text>
              </Left>
              <Right>
                <Text style={{ fontWeight: 'bold', color: '#E70C58' }}>${Cart.getCheckoutTotal() + shippingFee}</Text>
              </Right>
            </CardItem>
          </Card>
          {
            item.status == 0 ?
              <Button danger small iconRight onPress={() => this.cancelOrder()} style={{ alignSelf: 'flex-end', margin: 5 }}>
                <Text>Cancel</Text>
                <Icon name="md-trash" />
              </Button> :
              <View />
          }
        </Content>

      </Container>
    )
  }
}
