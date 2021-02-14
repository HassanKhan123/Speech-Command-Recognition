import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as speech from '@tensorflow-models/speech-commands';

import './App.css';

const App = () => {
  const [model, setModel] = useState(null);
  const [actions, setActions] = useState(null);
  const [labels, setLabels] = useState(null);

  const loadModels = async () => {
    const recognizer = await speech.create('BROWSER_FFT');
    console.log('model loaded');
    await recognizer.ensureModelLoaded();
    console.log(recognizer.wordLabels());
    setModel(recognizer);
    setLabels(recognizer.wordLabels());
  };

  useEffect(() => {
    loadModels();
  }, []);

  const recognizeCommands = async () => {
    console.log('Listening for commands');
    model.listen(
      (result) => {
        console.log(result);
        setActions(labels[argMax(Object.values(result.scores))]);
        console.log('w===', labels[argMax(Object.values(result.scores))]);
      },
      {
        includeSpectrogram: true,
        probabilityThreshold: 0.9,
      }
    );

    // setTimeout(() => {
    //   model.stopListening();
    // }, 10e3);
  };

  const argMax = (arr) => {
    return arr.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
  };

  return (
    <div className='App'>
      <button onClick={recognizeCommands}>Commands</button>
      {actions ? <div>{actions}</div> : <div>No action detected</div>}
    </div>
  );
};

export default App;
