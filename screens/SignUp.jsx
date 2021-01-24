import React, { Component } from "react";
import { Image, ImageBackground, StyleSheet } from "react-native";
import Firebase from '../firebase/config';
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Button,
  Text,
  View,
  Body,
  Title,
  Left,
  Icon,
} from "native-base";
import NormalHeader from "../component/NormalHeader";
import { Header, Button as B, Icon as I } from "react-native-elements";
export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      retype: "",
    };
  }
  signUp() {
    if (this.state.password != this.state.retype) {
      alert("Password does not match!");
    } else
      Firebase.auth()
        .createUserWithEmailAndPassword(this.state.email.trim(), this.state.password.trim())
        .then(() => {
          alert("Success!");
          this.props.navigation.navigate("SignIn");
        })
        .catch(function (error) {
          alert(error);
        });
  }
  render() {
    return (
      <Container>
        <Header
          backgroundColor="white"
          placement='left'
          leftComponent={
            <B
              onPress={() => {
                this.props.navigation.goBack();
              }}
              type="clear"
              icon={
                <I type='ionicon' name='ios-arrow-back' color="black" />
              }
            />
          }
          centerComponent={
            <Text
              style={{ textTransform: "uppercase", fontSize: 16, color: "black", fontWeight: "bold" }}>
              Sign Up
            </Text>
          }
        />
        <ImageBackground
          source={require("../assets/images/fashion.jpg")}
          style={styles.image}
        >
          <Content>
            <Form>
              <Item floatingLabel>
                <Label>Email</Label>
                <Input onChangeText={(email) => this.setState({ email })} />
              </Item>
              <Item floatingLabel last>
                <Label>Password</Label>
                <Input
                  textContentType={"password"}
                  multiline={false}
                  secureTextEntry={true}
                  autoCapitalize={"none"}
                  onChangeText={(password) => this.setState({ password })}
                />
              </Item>
              <Item floatingLabel last>
                <Label>Confirm Password</Label>
                <Input
                  textContentType={"password"}
                  multiline={false}
                  autoCapitalize={"none"}
                  secureTextEntry={true}
                  onChangeText={(retype) => this.setState({ retype })}
                />
              </Item>
            </Form>
            <View style={{ paddingTop: 25 }}></View>
            <Button block success onPress={() => this.signUp()}>
              <Text>Sign Up</Text>
            </Button>
          </Content>
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
  container: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  text: {
    color: "grey",
    fontSize: 30,
    fontWeight: "bold",
  },
});
