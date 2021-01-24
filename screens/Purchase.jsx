import React, { Component } from 'react'
import { ToastAndroid, View } from 'react-native';
import StripeCheckout from './../component/StripeCheckout';
import Firebase from './../firebase/config';
import PaystackWebView from "react-native-paystack-webview";
import PayPal from '../component/PayPal';
export default class Purchase extends Component {
  constructor(props) {
    super(props)
    // this.onPaymentSuccess = this.onPaymentSuccess.bind(this)
  }

  onPaymentSuccess = (token) => {
    alert("true")
  }

  onClose = () => {
    // this.props.navigation.goBack()
    alert("ksjdh")
  }
  render() {
    return (
      <StripeCheckout
        publicKey="pk_test_51Hlb4AKbPDtYodl45d8yIfEpDTNoYrIGo3aOPZK8onjyXJRZBoQnpTYLQtnqZVgKiQMTcLEHQ5HZ5nxHHwTsjAJD00rsYJqc2B"
        amount={(this.props.route.params.amount) * 100}
        imageUrl="https://cdn3.iconfinder.com/data/icons/avatar-93/140/avatar__girl__teacher__female__women-512.png"
        storeName="Stripe Checkout"
        description="Test"
        currency="USD"
        navigation={this.props.navigation}
        allowRememberMe={false}
        prepopulatedEmail={Firebase.auth().currentUser.email}
        onClose={this.onClose}
        onPaymentSuccess={this.onPaymentSuccess}
        style={{ width: 500 }}
      />
      // <PayPal />
      // <View style={{ flex: 1 }}>
      //   <PaystackWebView
      //     buttonText="Pay Now"
      //     showPayButton={true}
      //     paystackKey="pk_test_51Hlb4AKbPDtYodl45d8yIfEpDTNoYrIGo3aOPZK8onjyXJRZBoQnpTYLQtnqZVgKiQMTcLEHQ5HZ5nxHHwTsjAJD00rsYJqc2B"
      //     amount={120000}
      //     billingEmail="paystackwebview@something.com"
      //     billingMobile="09787377462"
      //     billingName="Oluwatobi Shokunbi"
      //     ActivityIndicatorColor="green"
      //     SafeAreaViewContainer={{ marginTop: 5 }}
      //     SafeAreaViewContainerModal={{ marginTop: 5 }}
      //     onCancel={(e) => {
      //       // handle response here
      //     }}
      //     onSuccess={(res) => {
      //       // handle response here
      //     }}
      //     autoStart={false}
      //   />
      // </View>
    )
  }
}
