import { observable } from "mobx";

const indiaTotalMatches = observable.box(100);
const australiaTotalMatches = observable.box(100);

const score = observable({
  india: {
    kohli: 0,
    sehwag: 0
  },
  australia: {
    stuart: 0,
    david: 0
  }
});

const indiaScores = observable([215, 305]);

export const state = {
  indiaTotalMatches,
  australiaTotalMatches,
  score,
  indiaScores
};
