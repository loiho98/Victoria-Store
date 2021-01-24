import React, { PureComponent } from "react";
import { View } from "react-native";
import { Icon, Text, Card, CardItem, Container } from "native-base";
import Products from "../component/Products";
import NormalHeader from "../component/NormalHeader";
export default class ListInType extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      result: this.props.route.params.data,
    };
  }
  render() {
    return (
      <Container>
        <NormalHeader
          title={this.props.route.params.data.length + " result(s)"}
          navigation={this.props.navigation}
        />
        <Products
          products={this.state.result}
          navigation={this.props.navigation}
        />
      </Container>
    );
  }
}
