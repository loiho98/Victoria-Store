import React, { Component } from "react";
import { View, Text } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Icon, Thumbnail } from "native-base";
import Firebase from "../firebase/config";
import CartView from "../screens/CartView";
import Favorites from "../screens/Favorites";
import Profile from "../screens/Profile";
import Product from "./Product";
import History from "../screens/History";
import Order from "./Order";
import SearchPage from './../screens/SearchPage';
const Drawer = createDrawerNavigator();
export default class Main extends Component {
  render() {
    return (
      <Drawer.Navigator initialRouteName="Start">
        <Drawer.Screen
          name={!Firebase.auth().currentUser.isAnonymous ? Firebase.auth().currentUser.email : "Guest"}
          component={Profile}
          options={{
            unmountOnBlur: true,
            drawerIcon: ({ }) => (
              <View>
                <Thumbnail source={require("../assets/images/images.jpg")} />
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="Start"
          component={Product}
          options={{
            drawerIcon: ({ }) => (
              <Icon name="md-home" style={{ color: "#E70C58" }} />
            ),
          }}
        />
        <Drawer.Screen
          name="Search"
          component={SearchPage}
          options={{
            drawerIcon: ({ }) => (
              <Icon name="md-search" style={{ color: "#E70C58" }} />
            ),
          }}
        />
        <Drawer.Screen
          name="Orders"
          component={Order}
          options={{
            unmountOnBlur: true,
            drawerIcon: ({ }) => (
              <Icon name="ios-clipboard" style={{ color: "#E70C58" }} />
            ),
          }}
        />
        <Drawer.Screen
          name="Basket"
          component={CartView}
          options={{
            drawerIcon: ({ }) => (
              <Icon name="ios-basket" style={{ color: "#E70C58" }} />
            ),
          }}
        />
      </Drawer.Navigator>
    );
  }
}
