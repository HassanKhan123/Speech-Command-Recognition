import React, { useEffect, useState, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as speech from '@tensorflow-models/speech-commands';

import { drawBall } from './utils';
import './App.css';

const App = () => {
  const [model, setModel] = useState(null);
  const [actions, setActions] = useState(null);
  const [labels, setLabels] = useState(null);
  const [x, setX] = useState(300);
  const [y, setY] = useState(300);
  const [r, setR] = useState(10);

  const canvasRef = useRef(null);

  const numberMap = {
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  };
  useEffect(() => {
    // Update position x,y
    const update =
      actions === 'up'
        ? setY(y - 10)
        : actions === 'down'
        ? setY(y + 10)
        : actions === 'left'
        ? setX(x - 10)
        : actions === 'right'
        ? setX(x + 10)
        : '';
    // Update size r
    if (Object.keys(numberMap).includes(actions)) {
      setR(10 * numberMap[actions]);
    }

    canvasRef.current.width = 600;
    canvasRef.current.height = 600;
    const ctx = canvasRef.current.getContext('2d');
    console.log(x, y, r);
    drawBall(ctx, x, y, r);
    setActions('base');
  }, [actions]);
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
        probabilityThreshold: 0.8,
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
      <header className='App-header'>
        <canvas
          ref={canvasRef}
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zindex: 9,
            width: 540,
            height: 540,
          }}
        />
        <button onClick={recognizeCommands}>Commands</button>
        {actions ? <div>{actions}</div> : <div>No action detected</div>}
      </header>
    </div>
  );
};

export default App;
