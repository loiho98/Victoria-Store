import React, { PureComponent } from "react";
import { FlatList, View, Dimensions, TouchableOpacity, ImageBackground } from "react-native";
import Firebase from './../firebase/config';
import {
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Text } from "native-base";
// var itemPerPage=10, startIndex=0
class Products extends PureComponent {
  increaseView = (old_view, key) => () => {
    Firebase.database().ref('/product/' + key).update({ view: old_view + 1 })
    this.props.navigation.navigate("Detail", { key: key });
  }
  _render(item) {
    return (
      <TouchableOpacity key={item.key}
        style={{ margin: 5 }}
        onPress={this.increaseView(item.view, item.key)}>

        <ImageBackground
          source={{ uri: item.image[0] }}
          style={{ width: wp("40%"), height: wp("40%") * 1.25 }}
        >
          {
            item.discount > 0 ?
              <View style={{
                position: 'absolute', top: 0, left: 0,
                backgroundColor: 'red', padding: 2
              }}>
                <Text style={{
                  fontSize: 12, color: 'white'
                }}>- {item.discount}%</Text>
              </View>
              : <View />
          }
        </ImageBackground>
        <View style={{ flexDirection: 'row', padding: 4,overflow:"hidden" }}>
          <View style={{ flexDirection: "row",overflow:"hidden" }}>
            <Text style={{ color: "#E70C58", fontSize: 14, fontWeight: 'bold' }}>${item.price.toLocaleString('en-US', {style: 'currency', currency: 'USD'} )}</Text>
            {item.discount > 0 ?
              <Text style={{ fontSize: 9, paddingLeft: 4, color: 'grey', textDecorationLine: 'line-through' }}>${item.original_price.toLocaleString('en-US', {style: 'currency', currency: 'USD'} )}</Text> :
              <View />
            }
          </View>
          
          <Text style={{ textTransform: 'uppercase', position: 'absolute', right: 2, fontSize: 10, bottom: 2, fontWeight: 'bold'}}>{item.name.length<12?item.name:item.name.slice(0,12)+"..."}</Text>

        </View>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <FlatList
        maxToRenderPerBatch={4}
        updateCellsBatchingPeriod={3}
        data={this.props.products}
        renderItem={({ item }) => this._render(item)}
        keyExtractor={(item, index) => index.toString()}
        columnWrapperStyle={{ justifyContent: 'space-around' }}
        numColumns={2}
        getItemLayout={(data, index) => (
          { length: wp("40%") * 1.25, offset: wp("40%") * 1.25 * index, index }
        )}
      ></FlatList>
    );
  }
}
export default Products;
