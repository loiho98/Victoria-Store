import React, { Component } from 'react';
import { View } from 'react-native';
import Cart from "../mobx/Cart";
import { Avatar, Badge, Header, Icon, withBadge, Button } from 'react-native-elements'
import { observer } from 'mobx-react';
import { Card, Badge as Ba, Button as B, Icon as I, Text as T, Spinner } from 'native-base';
@observer
export default class HomeHeader extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    Cart.loadCartFromServer()
  }

  render() {
    var length = 0
    if (Cart.cart.length) { length = Cart.cart.length }
    const BadgedIcon = withBadge(length)(Button)
    return (
      <Header
        backgroundImage={require("../assets/images/header.png")}
        leftComponent={
          <Button
            onPress={() => this.props.navigation.openDrawer()}
            type="clear"
            icon={
              <Icon type='ionicon' name="md-list" color="white" />
            }
          />

        }
        rightComponent={
          <View style={{ paddingRight: 10 }}>
            <BadgedIcon
              onPress={() => this.props.navigation.navigate("CartView")}
              icon={
                <Icon type='ionicon' name="ios-basket" color="white" />
              }
              type="clear"
            >

            </BadgedIcon>
          </View>
        }
        centerComponent={<View />}
      />
    )
  }
}
