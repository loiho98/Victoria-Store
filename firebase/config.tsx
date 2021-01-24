import * as firebase from "firebase/app";
import "@firebase/auth";
var provider = new firebase.auth.FacebookAuthProvider();
provider.setCustomParameters({
  display: "popup",
});

let Firebase;

const firebaseConfig = {
  apiKey: "AIzaSyAPwQjNHF1SKjdggxEk_vfQCXdsMxaMlF8",
  authDomain: "shop-35888.firebaseapp.com",
  databaseURL: "https://shop-35888.firebaseio.com",
  projectId: "shop-35888",
  storageBucket: "shop-35888.appspot.com",
  messagingSenderId: "110055469672",
  appId: "1:110055469672:web:c642030ba8c59b8b7581dd",
  measurementId: "G-YPBD5YBMN0",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  Firebase = firebase;
}
export default Firebase;
