import React from 'react'

import { Recorder } from 'react-voice-recorder'
import 'react-voice-recorder/dist/index.css'

class RecordAudio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      audioDetails: {
        url: null,
        blob: null,
        chunks: null,
        duration: {
          h: 0,
          m: 0,
          s: 0
        }
      }
    }
  }

  handleAudioStop(data) {
    console.log(data)
    this.setState({ audioDetails: data });
  }
  handleAudioUpload(file) {
    this.setAudio({file});
  }
  handleReset() {
    const reset = {
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: 0,
        m: 0,
        s: 0
      }
    };
    this.setState({ audioDetails: reset });
  }
  render() {
    return (
      <Recorder
        record={true}
        hideHeader
        audioURL={this.state.audioDetails.url}
        showUIAudio
        handleAudioStop={data => this.handleAudioStop(data)}
        handleAudioUpload={data => this.handleAudioUpload(data)}
        handleReset={() => this.handleReset()}
        mimeTypeToUseWhenRecording={`audio/webm`}
      />
    )
  }
}

export default RecordAudio
