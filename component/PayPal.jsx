import React, { Component } from 'react';
import { Platform, View, ViewPropTypes } from 'react-native';
import { WebView } from 'react-native-webview'
// import { PropTypes } from 'prop-types';
import { Container } from 'native-base';
import NormalHeader from './NormalHeader';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

class PayPal extends Component {
  render() {
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
          // injectedJavaScript={jsCode}
          source={{
            html: `
    <div id="paypal-button-container"></div>

    <!-- Include the PayPal JavaScript SDK -->
    <script src="https://www.paypal.com/sdk/js?client-id=sb&currency=USD"></script>

    <script>
        // Render the PayPal button into #paypal-button-container
        paypal.Buttons({

            // Set up the transaction
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: '88.44'
                        }
                    }]
                });
            },

            // Finalize the transaction
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    // Show a success message to the buyer
                    alert('Transaction completed by ' + details.payer.name.given_name + '!');
                });
            }


        }).render('#paypal-button-container');
    </script>

            `, baseUrl: ''
          }}
        // onMessage={event => event.nativeEvent.data === 'WINDOW_CLOSED' ? onClose() : onPaymentSuccess(event.nativeEvent.data)}
        // scalesPageToFit={Platform.OS === 'android'}
        />
      </Container>
    );
  }
}
export default PayPal;
