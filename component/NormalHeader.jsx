import React, { Component } from "react";
import { Button, Header, Icon, Text } from "react-native-elements";
export default class NormalHeader extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Header
        backgroundColor="white"
        placement='left'
        leftComponent={
          <Button
            onPress={() => {
              this.props.navigation.goBack();
            }}
            type="clear"
            icon={
              <Icon type='ionicon' name='ios-arrow-back' color="black" />
            }
          />
        }
        centerComponent={
          <Text
            style={{ textTransform: "uppercase", fontSize: 13, color: "black", fontWeight: "bold" }}>
            {this.props.title}
          </Text>
        }
        rightComponent={
          <Button
            onPress={() => {
              this.props.navigation.navigate("Home");
            }}
            type="clear"
            icon={
              <Icon type='ionicon' name='md-home' color='black' />
            }
          />
        }
      />
    );
  }
}
