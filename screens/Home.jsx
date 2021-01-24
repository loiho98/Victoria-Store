import {
  Icon,
  Button,
  Item,
  Input,
  Text,
  Card,
  CardItem,
  Container,
  Thumbnail,
  Right,
} from "native-base";
import React, { Component } from "react";
import { SliderBox } from "react-native-image-slider-box";
import Firebase from "../firebase/config";
import * as firebase from 'firebase'
import {
  View,
  Dimensions,
  ScrollView,
  ToastAndroid,
  RefreshControl,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground
} from "react-native";
import Products from "../component/Products";
import { heightPercentageToDP, widthPercentageToDP as wp } from "react-native-responsive-screen";
import HomeHeader from "../component/HomeHeader";
const itemPerPage = 10;
let endCursor = 0, maxIndex = 0;
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: new Array(),
      isTypeReady: false,
      products: new Array(),
      isProductReady: false,
      isLoadMoreFinish: false,
      mostView: new Array(),
      isMostViewReady: false,
      mostRating: new Array(),
      isMostRatingReady: false,
      specialDiscount: [],
      specialDiscountReady: false,
      key: "",
      refreshing: false,
      images: [
        require("../assets/images/fashion-sale-banner-template_23-2148102424.jpg"),
        require("../assets/images/a0047c6fbe7355ce655176da3b4cba5e.jpg")
      ]
    };
    this.getProductInCategory = this.getProductInCategory.bind(this)
    this.handleLoadMore = this.handleLoadMore.bind(this)
  }
  async getType() {
    this.setState({ isTypeReady: false });
    var temp = [];
    await Firebase.database()
      .ref("/category/")
      .once("value", (snapshot) => {
        snapshot.forEach((item) => {
          var i = item.val()
          i.key = item.key
          temp.push(i)
        })
      });
    this.setState({ type: temp, isTypeReady: true });
  }
  async getProduct() {
    var temp = [];
    await Firebase.database()
      .ref("/product/")
      .orderByKey().startAt(endCursor + "").once("value").then(snapshot => {
        snapshot.forEach((item) => {
          if (item) {
            var i = item.val();
            i.key = item.key;
            temp.push(i);
          }
        })
        this.setState({ products: temp.reverse(), isProductReady: true, isLoadMoreFinish: true });
      });
  }
  async getMaxIndex() {
    await Firebase.database()
      .ref("/product/").orderByKey().limitToLast(1)
      .once("value", (snapshot) => {
        snapshot.forEach((item) => {
          maxIndex = item.key
        })
        endCursor = maxIndex - itemPerPage + 1
      });
  }
  handleLoadMore() {
    this.setState({ isLoadMoreFinish: false })
    endCursor -= itemPerPage
    this.getProduct()
  };

  async getMostView() {
    var temp = []
    await Firebase.database()
      .ref("/product/").orderByChild('view').limitToLast(8)
      .once("value", (snapshot) => {
        snapshot.forEach((item) => {
          if (item.val().view > 0) {
            var i = item.val();
            i.key = item.key;
            temp.push(i);
          }
        })
        this.setState({ mostView: temp.reverse(), isMostViewReady: true });
      });
    console.log("render mostView");
  }
  async getSpecialDiscount() {
    var temp = []
    await Firebase.database()
      .ref("/product/").orderByChild('discount').limitToLast(16)
      .once("value", (snapshot) => {
        snapshot.forEach((item) => {
          if (item.val().discount > 0) {
            var i = item.val();
            i.key = item.key;
            temp.push(i);
          }
        })
        this.setState({ specialDiscount: temp.reverse(), specialDiscountReady: true });
      });
  }
  getProductInCategory = (name) => () => {
    var itemInCategory = []
    Firebase.database().ref('/product/').orderByChild('category').equalTo(name).once("value", snap => {
      snap.forEach(item => {
        var i = item.val()
        i.key = item.key
        itemInCategory.push(i)
      })
      this.props.navigation.navigate("Search", { data: itemInCategory })
    })
  }
  load() {
    this.setState({ refreshing: true })
    this.getType()
    this.getMaxIndex().then(() => this.getProduct())
    this.getMostView()
    this.getSpecialDiscount()
    this.setState({ refreshing: false })
  }
  componentDidMount() {
    this.load()
    console.log(firebase.database.ServerValue.TIMESTAMP);
  }
  _renderType(item) {
    return (
      <TouchableOpacity
        onPress={this.getProductInCategory(item.name)}
        style={{ justifyContent: 'center', alignItems: 'center', margin: 15 }}>
        <Thumbnail source={{ uri: item.image }} />
        <Text style={{ textTransform: 'capitalize', fontSize: 11 }}>{item.name}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    // var test = new Timestamp(1, 2)
    if (this.state.isTypeReady && this.state.isProductReady && this.state.isMostViewReady && this.state.specialDiscountReady)
      return (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.load.bind(this)}
            />}
        >
          <HomeHeader navigation={this.props.navigation} />
          <Item rounded>
            <Icon name="md-search" />
            <Input
              style={{ height: 41 }}
              placeholder="Type to search"
              autoCapitalize={"none"}
              onFocus={() => { this.props.navigation.navigate("SearchPage") }}
            />
            <Text>or {`    `}</Text>
            <Icon name="ios-mic" onPress={() => this.props.navigation.navigate("Voice")} />
            <Text>{`  `}</Text>
          </Item>
          <Card>
            <SliderBox images={this.state.images} circleLoop />
          </Card>
          <CardItem style={{ justifyContent: 'space-around' }}>
            <FlatList
              maxToRenderPerBatch={3}
              initialNumToRender={4}
              updateCellsBatchingPeriod={3}
              windowSize={8}
              horizontal
              data={this.state.type}
              renderItem={({ item }) => this._renderType(item)}
            ></FlatList>
          </CardItem>
          <Card>
            <CardItem header>
              <Icon name="ios-list" />
              <Text>Special Offer</Text>
            </CardItem>
            <Products
              products={this.state.specialDiscount}
              navigation={this.props.navigation}
            />
          </Card>

          <Card>
            <CardItem header>
              <Icon name="ios-list" />
              <Text>Most view</Text>
            </CardItem>
            <Products
              products={this.state.mostView}
              navigation={this.props.navigation}
            />
          </Card>
          <Card>
            <CardItem header>
              <Icon name="ios-list" />
              <Text>All products</Text>
            </CardItem>
            <Products
              products={this.state.products}
              navigation={this.props.navigation}
            // type={allProduct}
            />
            {
              !this.state.isLoadMoreFinish ?
                <View style={{ justifyContent: 'center', alignItems: 'center', width: wp("100%") }}>
                  <Image source={require('../assets/images/loading-page.gif')} style={{ width: 80, height: 120 }} />
                </View> :
                <CardItem style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Button small dark bordered onPress={this.handleLoadMore}>
                    <Icon name="ios-arrow-down" />
                  </Button>
                </CardItem>

            }
          </Card>
        </ScrollView>
      );
    else return (
      <Container style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Image
          source={require('../assets/images/loading-page.gif')}
          style={{ width: 80, height: 120 }} />
      </Container>
    )
  }
}

