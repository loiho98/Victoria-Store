import { Container, Tab, TabHeading, Tabs, Icon, Text, ScrollableTab } from 'native-base';
import React, { Component } from 'react';
import NormalHeader from '../component/NormalHeader';
import Pending from './../screens/Order/Pending';
import Canceled from './../screens/Order/Canceled';
import Accepted from './../screens/Order/Accepted';
import Shipping from './../screens/Order/Shipping';
import Completed from './../screens/Order/Completed';
import Firebase from './../firebase/config';
import { View } from 'react-native';
import PleaseSignIn from '../component/PleaseSignIn';
export default class Order extends Component {
  render() {
    if (Firebase.auth().currentUser.isAnonymous)
      return (
        <PleaseSignIn navigation={this.props.navigation} />
      )
    else
      return (
        <Container>
          <NormalHeader title="Order" navigation={this.props.navigation} />
          <Tabs tabBarUnderlineStyle={{ backgroundColor: "#E70C58" }} renderTabBar={() => <ScrollableTab />}>
            <Tab
              activeTabStyle={{ backgroundColor: "#E70C58" }}
              heading={<TabHeading style={{ backgroundColor: 'white' }} ><Text style={{ color: "black" }}>Pending</Text></TabHeading>}>
              <Pending navigation={this.props.navigation} />
            </Tab>
            <Tab
              heading={<TabHeading style={{ backgroundColor: 'white' }} ><Text style={{ color: "black" }}>Accepted</Text></TabHeading>}>
              <Accepted navigation={this.props.navigation} />
            </Tab>
            <Tab
              heading={<TabHeading style={{ backgroundColor: 'white' }} ><Text style={{ color: "black" }}>Shipping</Text></TabHeading>}>
              <Shipping navigation={this.props.navigation} />
            </Tab>
            <Tab
              heading={<TabHeading style={{ backgroundColor: 'white' }}><Text style={{ color: "black" }}>Completed</Text></TabHeading>}>
              <Completed navigation={this.props.navigation} />
            </Tab>
            <Tab
              heading={<TabHeading style={{ backgroundColor: 'white' }}><Text style={{ color: "black" }}>Canceled</Text></TabHeading>}>
              <Canceled navigation={this.props.navigation} />
            </Tab>
          </Tabs>
        </Container>
      )
  }
}
