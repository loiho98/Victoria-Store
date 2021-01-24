import React, { Component } from "react";
import { ImageBackground, StyleSheet } from "react-native";
import Firebase from "../firebase/config";
import {
  Container,
  Form,
  Item,
  Input,
  Label,
  Button,
  Text,
  View,
  Icon,
} from "native-base";
import { ToastAndroid } from "react-native";
import Store from "react-native-store";
import { TouchableOpacity } from "react-native";
const DB = {
  user: Store.model("user"),
};
export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }
  signInWithEmail(email, password) {
    Firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        DB.user.destroy();
        DB.user.add({
          email: email,
          password: password,
        });
        ToastAndroid.show("Thank you. Have a nice day!...", ToastAndroid.SHORT);
        this.props.navigation.navigate("Main");
      })
      .catch((err) => alert(err));
  }
  signInLater() {
    Firebase.auth().signInAnonymously()
      .then(() => {
        this.props.navigation.navigate("Main");
        console.log(Firebase.auth().currentUser);
      })
      .catch((error) => {
        alert(error)
      });
  }
  render() {
    return (
      <Container>
        <ImageBackground
          source={require("../assets/images/fashion.jpg")}
          style={styles.image}
        >
          <View>
            <Form>
              <Item floatingLabel>
                <Label>Email</Label>
                <Input
                  onChangeText={(email) => this.setState({ email })}
                  autoCompleteType="email"
                />
              </Item>
              <Item floatingLabel last>
                <Label>Password</Label>
                <Input
                  autoCapitalize={"none"}
                  autoCompleteType="password"
                  secureTextEntry={true}
                  onChangeText={(password) => this.setState({ password })}
                />
              </Item>
            </Form>
            <View style={{ paddingTop: 25 }}></View>
            <Button
              block
              success
              onPress={() =>
                this.signInWithEmail(
                  this.state.email.trim(),
                  this.state.password.trim()
                )
              }
            >
              <Text>Sign In</Text>
            </Button>
            <View
              style={{
                paddingTop: 25,
              }}
            >
              <Button
                small
                light
                transparent
                full
                onPress={() => this.props.navigation.navigate("SignUp")}
              >
                <Text>Don't have any account. Sign up!</Text>
              </Button>
            </View>
          </View>
          <TouchableOpacity
            style={{ position: 'absolute', bottom: 50, right: 10, flexDirection: 'row' }}
            onPress={() => { this.signInLater() }}
          >
            <Text style={{ color: 'white', backgroundColor: 'black', padding: 5 }}>Sign In Later</Text>
          </TouchableOpacity>
        </ImageBackground>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
});
