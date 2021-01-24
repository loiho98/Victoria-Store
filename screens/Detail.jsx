import {
  Button,
  Card,
  CardItem,
  Text,
  Item,
  Input,
  H3,
  Spinner,
  View,
  Left,
  Right,
  Container,
  Content,
  Thumbnail,
  Icon
} from "native-base";
import React, { Component } from "react";
import { ToastAndroid, ScrollView, FlatList, Image, Dimensions } from "react-native";
import { AirbnbRating, Rating, Icon as WL } from "react-native-elements";
import NormalHeader from "../component/NormalHeader";
import Firebase from "../firebase/config";
import Info from "../component/Info";
import moment from 'moment';
var width = Dimensions.get("window").width
export default class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: new Object(),
      rating: 0,
      ownRating: 0,
      ownComment: "",
      comment: "",
      isRatingComplete: false,
      isReady: false,
      review: new Array(),
      recommend: []
    };
  }
  async getOwnRating() {
    var rating = 0,
      comment = "";
    await Firebase.database()
      .ref(
        "/review/" +
        this.props.route.params.key +
        "/" +
        Firebase.auth().currentUser.uid
      )
      .once("value")
      .then((item) => {
        if (item.exists()) rating = item.val().rating;
        if (item.child("comment").exists()) comment = item.val().comment.content;

      }).catch(err => console.log(err))
    this.setState({ ownRating: rating, ownComment: comment });
  }
  async getItemDetail() {
    var temp = new Object();
    await Firebase.database()
      .ref("/product/" + this.props.route.params.key)
      .once("value")
      .then((snapshot) => {
        temp = snapshot.val();
        temp.key = snapshot.key;
      })
    this.setState({ item: temp, isReady: true });
  }
  async getAllReview() {
    var temp = new Array();
    await Firebase.database()
      .ref("/review/" + this.props.route.params.key)
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((item) => {
          if (item.child("comment").exists()) {
            if (item.val().comment.show == "1")
              temp.push(item.val())
          };
        });
      });
    this.setState({ review: temp });
  }
  rating(user, item, rating) {
    Firebase.database()
      .ref("/review/" + item.key + "/" + user.uid)
      .update({
        rating: rating,
      });
    var notRatingYet = this.state.ownRating == 0 ? 1 : 0;
    var s = item.rating.value * item.rating.count;
    s = s - this.state.ownRating + rating;
    var value = s / (item.rating.count + notRatingYet);
    Firebase.database()
      .ref("/product/" + item.key + "/rating/")
      .update({
        value: value,
        count: item.rating.count + notRatingYet,
      });
    this.getItemDetail();
    this.getOwnRating();
    this.setState({ isRatingComplete: true });
    ToastAndroid.show("Thank you so much", ToastAndroid.SHORT);
  }
  comment = (user, item) => () => {
    if (!Firebase.auth().currentUser.displayName) {
      ToastAndroid.show("Please update your name", ToastAndroid.SHORT)
      this.props.navigation.navigate("EditProfile")
    } else
      if (
        this.state.isRatingComplete ||
        this.state.ownRating > 0
      ) {
        if (
          this.state.comment != "" &&
          this.state.comment.length < 30
        ) {
          ToastAndroid.show(
            "Thank you so much",
            ToastAndroid.SHORT
          );
          var time = moment().format('llll').toString()
          Firebase.database()
            .ref("/review/" + item.key + "/" + user.uid + '/comment/')
            .update({
              content: this.state.comment,
              time: time,
              name: user.displayName,
              show: "0"
            });
          if (this.state.ownComment == "") {
            Firebase.database()
              .ref("/product/" + item.key)
              .update({
                comment: item.comment + 1,
              });
          }
          this.setState({ comment: "" })
          this.getOwnRating();
        } else {
          ToastAndroid.show(
            "Your comment is empty or too long",
            ToastAndroid.SHORT
          );
        }
      } else {
        ToastAndroid.show(
          "Please rating before comment",
          ToastAndroid.SHORT
        );
      }
  }
  componentDidMount() {
    this.getOwnRating();
    this.getItemDetail();
    this.getAllReview();
  }
  _render(item) {
    return (
      <Card>
        <CardItem>
          <Left>
            <Thumbnail small source={require('../assets/images/user.png')} />
            <View style={{ flexDirection: 'column' }}>
              <Text style={{ fontSize: 13, fontWeight: 'bold' }}> {item.comment.name}</Text>
              <Text style={{ color: 'grey', fontSize: 9 }}> {item.comment.time}</Text>
            </View>
          </Left>
          <Right>
            <Rating imageSize={12} readonly startingValue={item.rating} />
          </Right>
        </CardItem>
        <Text style={{ paddingLeft: 15, paddingBottom: 10 }}>{item.comment.content}</Text>
        {
          item.comment.reply ?
            (<View style={{ paddingLeft: 12 }}>
              <Text style={{ borderLeftWidth: 1, borderLeftColor: 'grey' }}> {item.comment.reply}</Text>
              <Text style={{ color: 'grey', fontSize: 9 }}>Victoria Store {item.comment.reply_time}</Text>
            </View>
            ) : <View />
        }

      </Card>
    );
  }
  render() {
    const item = this.state.item;
    const user = Firebase.auth().currentUser;
    if (this.state.isReady) {
      return (
        <Container>
          <NormalHeader title={item.name} navigation={this.props.navigation} />
          <Content>
            <Info
              navigation={this.props.navigation}
              item={item}
              totalRating={item.rating.count}
              averageRating={item.rating.value}
            />
            {
              Firebase.auth().currentUser.isAnonymous ?
                <View />
                :
                <View>
                  <CardItem bordered header>
                    <Text>Your review:</Text>
                  </CardItem>
                  <AirbnbRating
                    size={15}
                    defaultRating={this.state.ownRating}
                    onFinishRating={(rating) => {
                      this.rating(user, item, rating)
                    }}
                  />
                  <CardItem>
                    <Text>{this.state.ownComment}</Text>
                  </CardItem>
                  <CardItem>
                    <Item>
                      <Input
                        multiline
                        placeholder="Write your comment (less than 30 characters)"
                        defaultValue={this.state.comment}
                        onChangeText={(comment) => this.setState({ comment })}
                      ></Input>
                      <Button
                        onPress={
                          this.comment(user, item)
                        }
                        icon
                        transparent
                      >
                        <Icon name='md-send'></Icon>
                      </Button>
                    </Item>
                  </CardItem>
                </View>
            }
            <View>
              <CardItem bordered header>
                <Text>Reviews ({this.state.review.length})</Text>
              </CardItem>
              <FlatList
                maxToRenderPerBatch={3}
                initialNumToRender={2}
                updateCellsBatchingPeriod={3}
                windowSize={8}
                data={this.state.review}
                renderItem={({ item }) => this._render(item)}
                keyExtractor={(item, index) => index.toString()}
              ></FlatList>
            </View>
          </Content>
        </Container>
      );
    } else
      return (
        <Container>
          <NormalHeader
            title="Fetching..."
            navigation={this.props.navigation}
          />
          <Content contentContainerStyle={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('../assets/images/loading-page.gif')} style={{ width: 80, height: 120 }} />
          </Content>
        </Container>
      );
  }
}
