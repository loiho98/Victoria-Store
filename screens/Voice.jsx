import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { SpeechToText } from 'react-native-watson';

export default class Voice extends Component {
  constructor(props) {
    super(props)
    SpeechToText.initialize("hol loi", "loihodhtvB16")
  }
  componentDidMount() {
    // will transcribe microphone audio
    SpeechToText.startStreaming((error, text) => {
      console.log(text)
    })

    SpeechToText.stopStreaming()
  }

  render() {
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    )
  }
}
