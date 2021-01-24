import React, { Component } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import Detail from "../screens/Detail";
import CartView from "../screens/CartView";
import Search from "../screens/Search";
import Person from './../screens/Person';
import Chat from './../screens/Chat';
import EditProfile from './../screens/EditProfile';
import AddToCart from './../screens/AddToCart';
import Order from "./Order";
import EditOrder from "../screens/EditOrder";
import Purchase from './../screens/Purchase';
import PlaceOrder from './../screens/PlaceOrder';
import SearchPage from './../screens/SearchPage';
import Voice from './../screens/Voice';
import AddAddress from './../screens/AddAddress';
import AddPhone from './../screens/AddPhone';
import ManageAddress from './../screens/ManageAddress';
import ManagePhone from './../screens/ManagePhone';
const Stack = createStackNavigator();

export default class Product extends Component {
  render() {
    return (
      <Stack.Navigator initialRouteName="Home" headerMode="none">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="CartView" component={CartView} />
        <Stack.Screen name="Detail" component={Detail} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Person" component={Person} />
        <Stack.Screen name="ManageAddress" component={ManageAddress} />
        <Stack.Screen name="ManagePhone" component={ManagePhone} />
        <Stack.Screen name="AddAddress" component={AddAddress} />
        <Stack.Screen name="AddPhone" component={AddPhone} />
        {/* <Stack.Screen name="Person" component={AddPhone} /> */}
        <Stack.Screen name="PlaceOrder" component={PlaceOrder} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="AddToCart" component={AddToCart} />
        <Stack.Screen name="Order" component={Order} />
        <Stack.Screen name="EditOrder" component={EditOrder} />
        <Stack.Screen name="Purchase" component={Purchase} />
        <Stack.Screen name="SearchPage" component={SearchPage} />
        <Stack.Screen name="Voice" component={Voice} />
      </Stack.Navigator>
    );
  }
}
