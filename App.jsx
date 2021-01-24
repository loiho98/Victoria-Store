import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import React from "react";
import { LogBox, Text } from "react-native";
import { ThemeProvider } from "react-native-elements";
import Store from 'react-native-store';
import Firebase from './firebase/config';
import Main from './navigations/Main';
import SignUp from './screens/SignUp';
import SignIn from './screens/Signin';
import Profile from './screens/Profile';
const DB = {
  'user': Store.model('user'),
}
const Stack = createStackNavigator();
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      isLoginBefore: false,
    };
  }
  async signIn(email, password) {
    await Firebase.auth()
      .signInWithEmailAndPassword(email, password).then(
        () => {
        }
      ).catch(err => alert(err))
    this.setState({ isLoginBefore: true, isReady: true })
  }
  async loadFont() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font,
    });
  }
  componentDidMount() {
    this.loadFont()
      .then(() => {
        DB.user.find().then(resp => {
          if (resp != null) {
            this.signIn(resp[0].email, resp[0].password)
          }
          else {
            this.setState({ isLoginBefore: false, isReady: true })
          }
        })
      })

  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }
    else
      return (
        <ThemeProvider>
          {/* <ExpoStatusBar hidden={true}></ExpoStatusBar> */}
          <NavigationContainer>
            <Stack.Navigator initialRouteName={this.state.isLoginBefore ? "Main" : "Login"} headerMode="none">
              <Stack.Screen name="SignIn" component={SignIn} />
              <Stack.Screen name="Main" component={Main} />
              <Stack.Screen name="SignUp" component={SignUp} />
              <Stack.Screen name="Profile" component={Profile} />
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      );
  }
}
