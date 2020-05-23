import { action } from "mobx";
import { state } from "./state";

export const incrIndiaScore = action(() => {
  let matches = state.indiaTotalMatches.get();
  state.indiaTotalMatches.set(++matches);
});

export const incrAustraliaScore = action(() => {
  let matches = state.australiaTotalMatches.get();
  state.australiaTotalMatches.set(++matches);
});

export const incrKohli = action(() => {
  let score = state.score.india.kohli;
  score += 1;
  state.score.india = {
    kohli: score
  };
  // state.score.india.kohli++;
});

export const incrStuart = action(() => {
  state.score.australia.stuart++;
});

export const addIndiaScores = action(() => {
  state.indiaScores.push(Math.round(Math.random() * (400 - 200)));
});
