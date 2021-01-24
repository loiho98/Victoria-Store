import { observable } from "mobx";
import { ToastAndroid } from 'react-native';
import Firebase from './../firebase/config';
class Cart {
  @observable cart = [];
  // @observable discount=[];
  addToCart(item, buy_quantity, buy_variant, buy_color, buy_size) {
    if (!this.checkExist(buy_variant.sku)) {
      item.buy_quantity = buy_quantity
      item.buy_variant = buy_variant
      item.buy_color = buy_color
      item.buy_size = buy_size
      this.cart.push(item);
      ToastAndroid.show("Successful Added To Your Basket",
        ToastAndroid.SHORT
      );
    } else {
      ToastAndroid.show(
        "Already added",
        ToastAndroid.SHORT
      );
    }
    this.writeCartToServer()
  }
  onOrderSuccess() {
    for (let i = 0; i < this.cart.length; i++) {
      const element = this.cart[i];
      var variant_key = ""
      Firebase.database().ref('/product/').child(element.key).child('variant').orderByChild('sku').equalTo(element.buy_variant.sku).once("value", snap => {
        var old_quantity = Object.values(snap.val())[0].quantity
        Firebase.database().ref('/product/').child(element.key).child('variant').child(Object.keys(snap.val())[0]).update({ quantity: old_quantity - element.buy_quantity })
      })
    }
    Firebase.database().ref('/reload/').update({ order: "true" })
  }
  isInstock(buy_quantity, buy_variant) {
    console.log(buy_quantity + "<" + buy_variant.quantity)
    return (buy_quantity <= buy_variant.quantity)
  }
  removeFromCart(item) {
    var uid = Firebase.auth().currentUser.uid
    Firebase.database().ref('/cart/' + uid + "/" + item.key).remove()
    this.cart = this.cart.filter((i) => i.key !== item.key && i.buy_variant.sku !== item.buy_variant.sku)
    Firebase.database().ref('/cart/' + uid + "/" + item.buy_variant.sku).remove()
  }
  setQuantity(item, number) {
    if (this.isInstock(number, item.buy_variant)) {
      item.buy_quantity = number;
      this.writeCartToServer()
    }
    else { alert("Not available!") }
  }
  descrease(item) {
    if (item.buy_quantity > 1) { item.buy_quantity-- } else { this.removeFromCart(item) }
    this.writeCartToServer()
  }
  inscrease(item) {
    if (this.isInstock(item.buy_quantity + 1, item.variant.find(e => e.name == item.buy_color.name + "/" + item.buy_size.name))) {
      item.buy_quantity++;
    }
    else {
      alert("Can't add more!")
    }
    this.writeCartToServer()
  }
  checkExist(sku) {
    return this.cart.some((i) => (i.buy_variant.sku == sku));
  }
  getTotal(item) {
    return "$ " + item.price * item.buy_quantity;
  }
  getCheckoutTotal() {
    let total = 0;
    this.cart.forEach(item => {
      total += item.price * item.buy_quantity
    })
    return total;
  }
  getItem(key) {
    return this.cart.find((e) => e.key == key);
  }
  writeCartToServer() {
    var uid = Firebase.auth().currentUser.uid
    for (let i = 0; i < this.cart.length; i++) {
      var item = this.cart[i]
      Firebase.database().ref('/cart/' + uid + "/" + item.buy_variant.sku).update({ key: item.key, buy_quantity: item.buy_quantity, buy_size: item.buy_size, buy_color: item.buy_color })
    }
  }
  async loadItemFromServer(key, value_in_cart, sku) {
    var item = {}
    await Firebase.database().ref('/product/' + key).once("value", snap => {
      if (snap.val()) {
        item = Object.assign(snap.val(), value_in_cart);
        item.buy_variant = snap.val().variant.find(e => e.sku == sku)
      }
    })
    return item
  }
  async loadCartFromServer() {
    this.cart = []
    var uid = Firebase.auth().currentUser.uid
    await Firebase.database().ref('/cart/' + uid).once("value", snap => {
      snap.forEach(item => {
        var sku = item.key
        this.loadItemFromServer(item.val().key, item.val(), sku).then(snap => { this.cart.push(snap) })
      })
    }).catch(err => console.log(err))
  }
  emptyCart() {
    var uid = Firebase.auth().currentUser.uid
    Firebase.database().ref('/cart/' + uid).remove()
    this.cart = []
  }
  // getDiscount(){
  // this.cart.forEach(item=>{
  //   if (item.discount) {
  //     if (!this.discount.some(e=>e.type==item.discount.type&&e.)) {
  //       this.discount.push({})
  //     }
  //   }
  // })
  // }
}
export default new Cart();
