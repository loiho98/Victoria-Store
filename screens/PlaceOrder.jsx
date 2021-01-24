import { observer } from 'mobx-react'
import moment from 'moment'
import { Body, Button, Card, CardItem, Icon, Left, ListItem, Radio, Right, Text } from 'native-base'
import React, { Component } from 'react'
import { Dimensions, FlatList, Image, ScrollView, ToastAndroid, View, TouchableOpacity } from 'react-native'
import NormalHeader from '../component/NormalHeader'
import Firebase from '../firebase/config'
import Cart from '../mobx/Cart'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
var width = Dimensions.get("window").width
var shippingFee = 10
@observer
export default class PlaceOrder extends Component {
  constructor() {
    super();
    this.state = {
      itemSelected: 1,
      address: ''
    }
    this.writeOrder = this.writeOrder.bind(this)
  }
  writeOrder() {
    if (this.state.itemSelected == 1) {
      var user = Firebase.auth().currentUser
      var time = moment().format('llll').toString()
      Firebase.database().ref('/order/').push().set({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        phone: this.props.route.params.phone,
        address: this.props.route.params.address,
        amount: Cart.getCheckoutTotal() + shippingFee,
        transaction: {
          type: 'COD',
          payment_info: '',
          status: 0
        },
        order_time: time,
        status: 0,
        cart: Cart.cart
      })
      Cart.onOrderSuccess()
      Cart.emptyCart()
      ToastAndroid.show("Order success! Thank you so much for choosing Victoria Store!", ToastAndroid.SHORT)
      this.props.navigation.navigate('Home')
    } else {
      this.props.navigation.navigate("Purchase", { amount: Cart.getCheckoutTotal() + shippingFee })
    }

  }
  _renderCart(item) {
    return (
      <View key={item.key}>
        <View style={{ flexDirection: "row", margin: 20 }}>
          <Button
            small
            dark
            transparent
            style={{ position: 'absolute', top: 0, right: 0 }}
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
            style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
            <Text style={{ textTransform: 'capitalize', fontWeight: '900' }}>{item.name}</Text>
            <Text style={{ color: 'grey', fontSize: 12 }}>Color: {item.buy_color.name}. Size: {item.buy_size.name}</Text>
            <Text style={{ color: '#E70C58', fontWeight: 'bold' }}>${item.price}</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: "row", position: 'absolute', right: 0, bottom: 0 }}>
            <Button small transparent onPress={() => {
              Cart.descrease(item);
            }}>
              <Text>-</Text>
            </Button>
            <Button transparent small>
              <Text>{item.buy_quantity}</Text>
            </Button>
            <Button small transparent onPress={() => { Cart.inscrease(item) }}>
              <Text>+</Text>
            </Button>
          </View>
        </View>
      </View >
    );
  }
  render() {
    return (
      <ScrollView>
        <NormalHeader title="Place Order" navigation={this.props.navigation}></NormalHeader>
        <Card>
          <CardItem header bordered>
            <Text style={{ fontWeight: 'bold' }}>Info</Text>
          </CardItem>
          <CardItem>
            <Text>Phone: {this.props.route.params.phone}</Text>
          </CardItem>
          <CardItem>
            <Text>Address: {this.props.route.params.address}.</Text>
          </CardItem>
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
          </ListItem>
          <ListItem onPress={() => { this.setState({ itemSelected: 2 }) }}>
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
        </Card>
        <Card>
          <CardItem bordered header >
            <Text style={{ fontWeight: 'bold' }}>Basket</Text>
          </CardItem>
          <FlatList
            maxToRenderPerBatch={3}
            initialNumToRender={2}
            updateCellsBatchingPeriod={3}
            windowSize={8}
            data={Cart.cart}
            renderItem={({ item }) => this._renderCart(item)}
            keyExtractor={(item, index) => index.toString()}
          ></FlatList>
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
              <Text style={{ fontWeight: 'bold' }}>${Cart.getCheckoutTotal()}</Text>
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
          <CardItem>
            <Left>
              <Text>VAT(10%)</Text>
            </Left>
            <Right>
              <Text style={{ fontWeight: 'bold' }}>Included</Text>
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
        <Card>
          <Button full warning onPress={this.writeOrder}>
            <Text>Accept</Text>
          </Button>
        </Card>

      </ScrollView>
    )
  }
}
