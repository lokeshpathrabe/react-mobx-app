import React from "react";
import "./styles.css";
import {
  state
  // nameObservable, customState
} from "./state";
import {
  incrIndiaScore,
  incrKohli,
  incrAustraliaScore,
  incrStuart,
  addIndiaScores
} from "./actions";
import { observer } from "mobx-react";
import { toJS } from "mobx";

const MobxApp = observer(() => {
  return (
    <div className="App">
      <h1>React Observables</h1>
      <div>Integer</div>
      <div>
        india Score {state.indiaTotalMatches.get()}
        <button onClick={incrIndiaScore}>+</button>
      </div>
      <div>
        Australia score {state.australiaTotalMatches.get()}
        <button onClick={incrAustraliaScore}>+</button>
      </div>
      <br />
      <div>Nested Object</div>
      <div>
        Kohli score {state.score.india.kohli}
        <button onClick={incrKohli}>+</button>
      </div>
      <div>
        Stuart score {state.score.australia.stuart}
        <button onClick={incrStuart}>+</button>
      </div>
      <br />
      <div>Array</div>
      <div>
        {toJS(state.indiaScores).join(", ")}
        <button onClick={addIndiaScores}>+</button>
      </div>
    </div>
  );
});

function App() {
  return (
    <>
      <MobxApp />
    </>
  );
}

export default App;
