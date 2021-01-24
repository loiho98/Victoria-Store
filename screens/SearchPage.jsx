import { CardItem, Container, Form, Icon, Input, Item, Picker, Text, Right, Button, Card } from 'native-base'
import React, { Component } from 'react'
import { FlatList, Image, ScrollView, View } from 'react-native'
import NormalHeader from '../component/NormalHeader'
import { SearchBar } from 'react-native-elements';
import Products from './../component/Products';
import Firebase from './../firebase/config';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Highlighter from 'react-native-highlight-words';
export default class SearchPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      key: '',
      suggest: [],
      searchField: 'name',
      isSuggestFinish: true
    }
  }
  _render(item) {
    switch (this.state.searchField) {

      case "color":
        return (
          <CardItem button onPress={() => { this.props.navigation.navigate("Detail", { key: item.key }) }}>
            <Image style={{ width: 40, height: 50 }} source={{ uri: item.image[0] }}></Image>
            <View>
              <Text style={{ textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold' }}>  {item.name}</Text>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#E70C58' }}>  ${item.price}</Text>
            </View>
            <Right>
              <Highlighter
                highlightStyle={{ color: 'tomato', fontWeight: 'bold' }}
                searchWords={[this.state.key]}
                textToHighlight={item.color}
                style={{ fontSize: 12 }}
              />
            </Right>
          </CardItem>
        )
        break;
      case "material":
        return (
          <CardItem button onPress={() => { this.props.navigation.navigate("Detail", { key: item.key }) }}>
            <Image style={{ width: 40, height: 50 }} source={{ uri: item.image[0] }}></Image>
            <View>
              <Text style={{ textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold' }}>  {item.name}</Text>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#E70C58' }}>  ${item.price}</Text>
            </View>
            <Right>
              <Highlighter
                highlightStyle={{ color: 'tomato', fontWeight: 'bold' }}
                searchWords={[this.state.key]}
                textToHighlight={item.material}
                style={{ fontSize: 12 }}
              />
            </Right>
          </CardItem>
        )
        break;
      case "category":
        return (
          <CardItem button onPress={() => { this.props.navigation.navigate("Detail", { key: item.key }) }}>
            <Image style={{ width: 40, height: 50 }} source={{ uri: item.image[0] }}></Image>
            <View>
              <Text style={{ textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold' }}>  {item.name}</Text>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#E70C58' }}>  ${item.price}</Text>
            </View>
            <Right>
              <Highlighter
                highlightStyle={{ color: 'tomato', fontWeight: 'bold' }}
                searchWords={[this.state.key]}
                textToHighlight={item.category}
                style={{ fontSize: 12 }}
              />
            </Right>
          </CardItem>
        )
        break;
      default:
        return (
          <CardItem button onPress={() => { this.props.navigation.navigate("Detail", { key: item.key }) }}>
            <Image style={{ width: 40, height: 50 }} source={{ uri: item.image[0] }}></Image>
            <View>
              <Highlighter
                highlightStyle={{ color: 'tomato' }}
                searchWords={[this.state.key]}
                textToHighlight={item.name}
                style={{ textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', paddingLeft: 5 }}
              />
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#E70C58' }}>  ${item.price}</Text>
            </View>
          </CardItem>
        )
        break;
    }

  }
  async getSuggest(key) {
    this.setState({ key })
    this.setState({ isSuggestFinish: false })
    var temp = []
    if (key != '') {
      if (this.state.searchField == "price" || this.state.searchField == "les" || this.state.searchField == "gre") {
        await Firebase.database().ref('/product/').orderByChild('price').once("value", snap => {
          snap.forEach(item => {
            switch (this.state.searchField) {
              case 'price':
                if (item.val().price == key.trim()) {
                  var i = item.val()
                  i.key = item.key
                  temp.push(i)
                }
                break;
              case 'les':
                if (item.val().price <= key.trim()) {
                  var i = item.val()
                  i.key = item.key
                  temp.push(i)
                }
                break;
              case 'gre':
                if (item.val().price >= key.trim()) {
                  var i = item.val()
                  i.key = item.key
                  temp.push(i)
                }
                break;
            }
          })
        })
        this.setState({ suggest: temp, isSuggestFinish: true })
      }
      else {
        await Firebase.database().ref('/product/').orderByChild('name').once("value", snap => {
          snap.forEach(item => {
            switch (this.state.searchField) {
              case 'name':
                if (item.val().name
                  .trim()
                  .toLowerCase()
                  .includes(key.trim().toLowerCase())) {
                  var i = item.val()
                  i.key = item.key
                  temp.push(i)
                }
                break;
              case 'color':
                if (item.val().color.name
                  .trim()
                  .toLowerCase()
                  .includes(key.trim().toLowerCase())) {
                  var i = item.val()
                  i.key = item.key
                  temp.push(i)
                }
                break;
              case 'material':
                if (item.val().material
                  .trim()
                  .toLowerCase()
                  .includes(key.trim().toLowerCase())) {
                  var i = item.val()
                  i.key = item.key
                  temp.push(i)
                }
                break;
              case 'category':
                if (item.val().category
                  .trim()
                  .toLowerCase()
                  .includes(key.trim().toLowerCase())) {
                  var i = item.val()
                  i.key = item.key
                  temp.push(i)
                }
                break;

            }

          })
        })
        this.setState({ suggest: temp, isSuggestFinish: true })
      }

    }
  }
  render() {
    return (
      <Container>
        <ScrollView>
          <NormalHeader title="Search" navigation={this.props.navigation} />
          <Item rounded>
            <Icon name="md-search" />
            <Input
              placeholder="Type here..."
              onChangeText={(key) => this.getSuggest(key)}
              value={this.state.key}
              lightTheme={true}
              autoCapitalize={"none"}
            />

            <Form>
              <Picker
                mode="dropdown"
                style={{ width: wp("45%") }}
                selectedValue={this.state.searchField}
                onValueChange={(searchField) => {
                  this.setState({ searchField }); this.setState({ key: '', suggest: [] })
                }}
              >
                <Picker.Item label={"Name"} value={"name"} />
                <Picker.Item label={"Category"} value={"category"} />
                <Picker.Item label={"Color"} value={"color"} />
                <Picker.Item label={"Material"} value={"material"} />
                <Picker.Item label={"Price"} value={"price"} />
                <Picker.Item label={"Price less than"} value={"les"} />
                <Picker.Item label={"Price greater than"} value={"gre"} />
              </Picker>
            </Form>
          </Item>
          {
            this.state.isSuggestFinish ?
              <FlatList
                maxToRenderPerBatch={4}
                updateCellsBatchingPeriod={3}
                data={this.state.suggest}
                renderItem={({ item }) => this._render(item)}
                keyExtractor={(item, index) => index.toString()}
              ></FlatList>
              :
              <View style={{ justifyContent: 'center', alignItems: 'center', width: wp("100%") }}>
                <Image source={require('../assets/images/loading-page.gif')} style={{ width: 80, height: 120 }} />
              </View>
          }
        </ScrollView>
      </Container >
    )
  }
}
