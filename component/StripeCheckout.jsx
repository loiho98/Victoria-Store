import React, { Component } from 'react';
import { Platform, View, ViewPropTypes } from 'react-native';
import { WebView } from 'react-native-webview'
import { PropTypes } from 'prop-types';
import { Container } from 'native-base';
import NormalHeader from './NormalHeader';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

class StripeCheckout extends Component {
  render() {
    const {
      publicKey,
      amount,
      allowRememberMe,
      currency,
      description,
      imageUrl,
      storeName,
      prepopulatedEmail,
      style,
      onPaymentSuccess,
      onClose,
      navigation
    } = this.props;

    const jsCode = `(function() {
                    var originalPostMessage = window.postMessage;
                    var patchedPostMessage = function(message, targetOrigin, transfer) {
                      originalPostMessage(message, targetOrigin, transfer);
                    };
                    patchedPostMessage.toString = function() {
                      return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
                    };
                    window.postMessage = patchedPostMessage;
                  })();`;
    return (
      <Container>
        <NormalHeader title="Purchase" navigation={this.props.navigation} />
        <WebView
          javaScriptEnabled={true}
          scrollEnabled={false}
          bounces={false}
          injectedJavaScript={jsCode}
          source={{
            html: `<script src="https://checkout.stripe.com/checkout.js"></script>
            <script src="https://js.stripe.com/v3/"></script>
            // <script>
            // const product = await stripe.products.create({
            //   name: 'T-shirt',
            // });
            // const price = await stripe.prices.create({
            //   product: 'test',
            //   unit_amount: 2000,
            //   currency: 'usd',
            // });
            // var stripe = Stripe('${publicKey}');
            // stripe.redirectToCheckout({
            //   lineItems: [{
            //     price: '{{PRICE_ID}}', // Replace with the ID of your price
            //     quantity: 1,
            //   }],
            //   mode: 'payment',
            //   // successUrl: 'https://example.com/success',
            //   // cancelUrl: 'https://example.com/cancel',
            // }).then(function (result) {
             
            // });
            
            var handler = StripeCheckout.configure({
              key: '${publicKey}',
              image: '${imageUrl}',
              locale: 'auto',
              token: function(token) {
                // window.postMessage(token.id, token.id);
                // alert(token.id)
                alert("Payment Success!")
              },
              // opened: function() {
              //   alert("Form opened");
              // },
              closed: function() {
                alert("Form closed");
              }
            });
            window.onload = function() {
              handler.open({
                image: '${imageUrl}',
                name: '${storeName}',
                description: '${description}',
                amount: ${amount},
                currency: '${currency}',
                allowRememberMe: ${allowRememberMe},
                email: '${prepopulatedEmail}',
                closed: function() {
                  window.postMessage("WINDOW_CLOSED", "*");
                }
              });
            };
            </script>`, baseUrl: ''
          }}
          onMessage={event => event.nativeEvent.data === 'WINDOW_CLOSED' ? alert("close") : alert("success")}
          scalesPageToFit={Platform.OS === 'android'}
        />
      </Container>
    );
  }
}

StripeCheckout.propTypes = {
  publicKey: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  imageUrl: PropTypes.string.isRequired,
  storeName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  allowRememberMe: PropTypes.bool.isRequired,
  onPaymentSuccess: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  currency: PropTypes.string,
  prepopulatedEmail: PropTypes.string,
  style: ViewPropTypes.object,
  navigation: PropTypes.object,
};

StripeCheckout.defaultProps = {
  prepopulatedEmail: '',
  currency: 'USD',
};

export default StripeCheckout;
