import { observer } from 'mobx-react';
import { Button, Card, CardItem, Col, Container, Content, Grid, Icon, Item, Left, Picker, Right, Row, Text } from 'native-base';
import React, { Component } from 'react';
import { FlatList, Image, ScrollView, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { Input } from 'react-native-elements';
import NormalHeader from '../component/NormalHeader';
import Cart from '../mobx/Cart';
import Firebase from '../firebase/config';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import PleaseSignIn from './../component/PleaseSignIn';
@observer
export default class AddToCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buy_size: this.props.route.params.item.size[0],
      buy_quantity: 1,
      buy_color: this.props.route.params.item.color[0],
      buy_variant: {}
    }
    this.addButtonPress = this.addButtonPress.bind(this)
  }

  findVariant() {
    return this.props.route.params.item.variant.find(e => e.name == this.state.buy_color.name + "/" + this.state.buy_size.name);
  }
  addButtonPress() {
    if (Cart.isInstock(this.state.buy_quantity, this.findVariant())) {
      Cart.addToCart(this.props.route.params.item, this.state.buy_quantity, this.findVariant(), this.state.buy_color, this.state.buy_size);
      this.props.navigation.goBack()
    } else {
      alert("Please check the quantity!")
    }
  }
  _render(item) {
    return (
      <Button small dark bordered={this.state.size != item.name} style={{ margin: 2 }} onPress={() => this.setState({ size: item.name, sizeDetail: item.detail })}>
        <Text>{item.name}</Text>
      </Button>
    )
  }
  _renderSizeButton(item) {
    return (
      <Button small dark
        onPress={() => { this.setState({ buy_size: item, buy_variant: this.findVariant() }); }}
        bordered={item.name != this.state.buy_size.name}
        style={{ margin: 5 }}>
        <Text>{item.name}</Text>
      </Button>
    )
  }
  _renderColorButton(item) {
    return (
      <TouchableOpacity onPress={() => { this.setState({ buy_color: item, buy_variant: this.findVariant() }); }}>
        <Image source={{ uri: item.image }} style={{ width: 50, height: 62.5, marginRight: 10, borderColor: "black", borderWidth: (item == this.state.buy_color) ? 1 : 0 }} />
      </TouchableOpacity>
    )
  }
  // componentDidMount() {
  //   this.setState({buy_variant:this.findVariant()})
  // }

  render() {
    const item = this.props.route.params.item
    if (Firebase.auth().currentUser.isAnonymous)
      return (
        <PleaseSignIn navigation={this.props.navigation} />
      )
    else
      return (
        <Container>
          <NormalHeader title={item.name} navigation={this.props.navigation} />
          <Content>
            <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
              <Image source={{ uri: this.state.buy_color.image }} style={{ width: 100, height: 125, }} />
              <View style={{ flexDirection: 'column', justifyContent: 'flex-end', marginLeft: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Icon name="logo-usd" style={{ color: '#E70C58' }} />
                  <Text style={{ color: "#E70C58", fontSize: 20, fontWeight: 'bold', marginBottom: 15 }}>{item.price}</Text>
                </View>
                <Text style={{ fontSize: 10, borderBottomWidth: 1 }}>SKU: {this.findVariant().sku}</Text>
                <Text style={{ fontSize: 10, color: 'grey' }}>Color: {this.state.buy_color.name}. Size: {this.state.buy_size.name}</Text>
                <Text style={{ fontSize: 10, color: 'grey' }}>Quantity: {this.state.buy_quantity}</Text>
                <Text style={{ fontSize: 10, color: (Cart.isInstock(this.state.buy_quantity, this.findVariant()) == 1 ? "grey" : "red") }}>{Cart.isInstock(this.state.buy_quantity, this.findVariant()) == 1 ? "In stock" : "Not available"}</Text>
              </View>
            </View>
            <Text style={{ marginLeft: 16 }}>Color:</Text>
            <CardItem bordered>
              <FlatList
                maxToRenderPerBatch={3}
                updateCellsBatchingPeriod={3}
                data={Object.values(this.props.route.params.item.color)}
                renderItem={({ item }) => this._renderColorButton(item)}
                horizontal
                keyExtractor={(item, index) => index.toString()}
              ></FlatList>
            </CardItem>
            <CardItem>
            </CardItem>
            <Text style={{ marginLeft: 16 }}>Size:</Text>
            <CardItem bordered>
              <FlatList
                maxToRenderPerBatch={3}
                updateCellsBatchingPeriod={3}
                data={Object.values(this.props.route.params.item.size)}
                renderItem={({ item }) => this._renderSizeButton(item)}
                horizontal
                keyExtractor={(item, index) => index.toString()}
              ></FlatList>
            </CardItem>
            <CardItem>
            </CardItem>
            <Text style={{ marginLeft: 16 }}>Quantity:</Text>
            <CardItem style={{ justifyContent: 'center' }}>
              <Button small transparent onPress={() => { this.setState({ buy_quantity: Number(this.state.buy_quantity) - 1 }) }}><Icon name='md-remove' /></Button>
              <TextInput
                inputStyle={{ textAlign: 'center' }}
                containerStyle={{ width: widthPercentageToDP("15%") }}
                keyboardType="numeric"
                value={this.state.buy_quantity + ""}
                onChangeText={(buy_quantity) => { this.setState({ buy_quantity }) }}
              />
              <Button small transparent onPress={() => { this.setState({ buy_quantity: Number(this.state.buy_quantity) + 1 }) }}><Icon name='md-add' /></Button>
            </CardItem>
          </Content>
          <CardItem >
            <Left>
              <Button small bordered onPress={() => this.props.navigation.goBack()}>
                <Text>Close</Text>
              </Button>
            </Left>
            <Right>
              <Button
                icon
                bordered
                info
                onPress={this.addButtonPress}
              >
                <Text>Add to</Text>
                <Icon name="ios-basket"></Icon>
              </Button>
            </Right>
          </CardItem>
        </Container>

      )
  }
}
