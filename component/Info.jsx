import { Button, Card, CardItem, Icon, Left, Text } from "native-base";
import React, { Component } from "react";
import { Dimensions, Image, View, ToastAndroid } from "react-native";
import Swiper from "react-native-animated-swiper";
import { Rating, Icon as WL } from "react-native-elements";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
export default class Info extends Component {
  render() {
    const item = this.props.item;
    return (
      <View>
        <Swiper
          dots
          dotsColor="grey"
          dotsColorActive="black"
          dotsBottom={30}
        >
          {item.image.map(e => (
            <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
              {/* <Card> */}
              <Image
                source={{ uri: e }}
                style={{ width: wp("50%"), height: 1.25 * wp("50%") }}
              ></Image>
              {/* </Card> */}
            </View>
          ))}
        </Swiper>
        <View>
          <CardItem>
            <Left >
              <View style={{ flexDirection: 'row' }}>
                <Icon name="logo-usd" style={{ color: '#E70C58' }} />
                <Text style={{ color: "#E70C58", fontSize: 20, fontWeight: 'bold', marginBottom: 15 }}>{Number(item.price)}</Text>

              </View>
            </Left>
            <View style={{ flexDirection: 'row' }}>
              <Rating
                imageSize={25}
                readonly
                startingValue={this.props.averageRating}
              />
              <Text>({item.rating.count})</Text>
            </View>
          </CardItem>
          <CardItem>

            <View style={{ flexDirection: "row" }}>
              <View style={{ paddingLeft: 10 }}>

                <Text style={{ fontWeight: "bold", fontSize: 12 }}>Category:</Text>
                <Text style={{ fontWeight: "bold", fontSize: 12 }}>Material:</Text>
                <Text style={{ fontWeight: "bold", fontSize: 12 }}>Color:</Text>
                <Text style={{ fontWeight: "bold", fontSize: 12 }}>Size:</Text>
              </View>
              <View style={{ paddingLeft: 10 }}>

                <Text style={{ textTransform: 'capitalize', fontSize: 12 }}>{item.category}</Text>
                <Text style={{ textTransform: 'capitalize', fontSize: 12 }}>{item.material}</Text>
                <Text style={{ textTransform: 'capitalize', fontSize: 12 }}>{item.color.map(e => e.name + "  ")}</Text>
                <Text style={{ textTransform: 'capitalize', fontSize: 12 }}>{item.size.map(e => e.name + "  ")}</Text>
              </View>
            </View>

            <Button
              icon
              style={{ position: "absolute", top: 0, right: 3 }}
              bordered
              info
              onPress={() => {
                this.props.navigation.navigate("AddToCart", { item: item })
              }}
            >
              <Text>Add to</Text>
              <Icon name="ios-basket"></Icon>
            </Button>

          </CardItem>

        </View>
        <Card transparent>
          <CardItem>
            <Text style={{ fontSize: 12 }}>{item.description}</Text>
          </CardItem>
        </Card>

      </View>
    );
  }
}
