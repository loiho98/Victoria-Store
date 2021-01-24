import React, { Component } from "react";
import { FlatList, View, Image, Dimensions, Alert, TouchableOpacity, TextInput } from "react-native";
import { Card, CardItem, Text, Left, Right, Button, Container, Content, Body, Icon } from 'native-base';
import Firebase from "../../firebase/config";
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
export default class Pending extends Component {
  constructor(props) {
    super(props)
    this.state = {
      order: [],
      isReady: false
    }
  }

  cancelOrder = (item) => () => {
    Alert.alert(
      "Comfirm Cancel Order",
      "Are you sure to cancel this order!",
      [
        {
          text: "Confirm",
          onPress: () => {
            item.cart.forEach(product => {
              Firebase.database().ref('/product/' + product.key + '/quantity').once("value", snap => {
                var new_quantity = snap.val()[product.buy_size] + product.buy_quantity
                var obj = new Object()
                obj[product.buy_size] = new_quantity
                Firebase.database().ref('/product/' + product.key + '/quantity/').update(obj)
              })
            })
            Firebase.database().ref("/order/" + item.key).update({ status: "canceled" }); this.props.navigation.goBack()
          }
        },
        {
          text: "No, i'm not",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
      ],
      { cancelable: false }
    );

  }
  async getOrder() {
    var temp = []
    await Firebase.database().ref('/order/').orderByChild("uid").equalTo(Firebase.auth().currentUser.uid).once("value", snap => {
      if (snap.val()) {
        snap.forEach(item => {
          if (item.val().status == 0) {
            var i = item.val()
            i.key = item.key
            temp.push(i)
          }
        })
      }
    })
    this.setState({ order: temp, isReady: true })
  }
  _renderCart(item) {
    return (
      <View key={item.key}>
        <View style={{ flexDirection: "row", margin: 20 }}>

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
        </View>
      </View >
    );
  }
  _render(item) {
    return (
      <Card key={item.key}>
        <Text style={{ marginLeft:16,marginRight:16,marginBottom:10,marginTop:10, borderBottomWidth: 1, borderBottomColor: 'grey', color: 'orange', fontSize: 10 }}>Pending</Text>
        <View style={{ flexDirection: "row", marginLeft:16,marginBottom:10 }}>
          <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', width: wp("20%") + 10 }}>
            <Image
              source={{ uri: item.cart[0].image[0] }}
              style={{ width: wp("20%"), height: 1.25 * wp("20%") }}
            >
            </Image>
          </View>
          <View
            style={{ flexDirection: 'column', justifyContent: 'space-between',flex:1 }}>
            <Text style={{ fontWeight: 'bold',fontSize:12 }}>{item.cart.length == 1 ? item.cart[0].name.toUpperCase() : item.cart[0].name.toUpperCase() + " and " + (item.cart.length - 1) + " OTHER(s)"}</Text>
            <Text style={{ color: 'grey', fontSize: 12, textTransform: 'capitalize' }}>{item.cart.length} {item.cart.length == 1 ? "product" : "products"}</Text>
            <View style={{ flexDirection: 'row'}}>
              <Text style={{ color: "#E70C58" , fontSize: 12, textTransform: 'capitalize',fontWeight:"bold" }}>Total: ${item.amount}</Text>
            
            </View>
          </View>
        </View>
        <Button style={{position:'absolute',right:0,bottom:16}} small  transparent onPress={()=>this.props.navigation.navigate("EditOrder",{order:item})}>
                <Text style={{fontSize:12}}>View Detail</Text>
              </Button>
      </Card>
    )
  }
  async componentDidMount() {
    await this.getOrder()
  }

  render() {
    if (this.state.isReady)
      return (
        <View>
          {
            this.state.order.length > 0 ?
              <FlatList
                maxToRenderPerBatch={3}
                initialNumToRender={2}
                updateCellsBatchingPeriod={3}
                windowSize={2}
                data={this.state.order}
                renderItem={({ item }) => this._render(item)}
                keyExtractor={(item, index) => index.toString()}
              ></FlatList> :
              <Card>
                <CardItem>
                  <Text>No pending order</Text>
                </CardItem>
              </Card>

          }

        </View>
      )
    else
      return (
        <Container>
          <Content contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Image source={require('../../assets/images/loading-page.gif')} style={{ width: 80, height: 120 }} />
          </Content>
        </Container>
      )
  }
}
