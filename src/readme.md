# Understanding Mobx

If you are into front end web development and working on ReactJs, I bet you are using Redux as your state management library as most of us are. Redux is widely popular lib for React applications and why should it not be. It is simple, scalable and solves all your sync and async problems with a wide variety of tools and addons available.

But its not the only one out there. There are a bunch of alternatives that might work for you. One of them is Mobx. I am writing this to discuss my understanding of this library and how it works.

# Pre-requisite

Before we proceed you would need to familiarise with some concepts of Observable pattern and ReactiveJS. Here are a few links to get started quickly.
[Observable Pattern](<[https://en.wikipedia.org/wiki/Observer_pattern](https://en.wikipedia.org/wiki/Observer_pattern)>),  
[RxJS](https://rxjs-dev.firebaseapp.com/guide/observable).

## Introduction to Mobx

Mobx works on Observable pattern where your app state is observable (subject) and your presentation components are observers (subscribers). Observer component would rerender whenever the observable state is mutated.
Thats it! No reducers, action creators, middlewares boilercode. The app look really simple. More on the mobx concepts [here](<[https://mobx.js.org/intro/concepts.html](https://mobx.js.org/intro/concepts.html)>).

## A simple observable state

To understand how mobx reacts and what it reacts to, we will create a small observable state of our own and make our observer component react to its changes. This will help in understanding how mobx works behind the scenes. We would use RxJS to create our state and a React component.

### Create observable state

```
import  {  Observable  }  from  "rxjs";

export  const  person=  {};

export  const  nameObservable  =  new  Observable(observer  =>  {

Object.defineProperty(person,  "firstName",  {

get:  function()  {

return  this._firstName.toUpperCase();

},

set:  function(name)  {

this._firstName  =  name;

observer.next(this._firstName);

}

});

});
```

In the above code snippet `person` is our state. We add a new property `firstName` to it and define `get()` and `set()` methods. We wrap this in a RxJS observable function and craete a new observable object. Whenever we set value on firstName the `observe.next()` is called which would rerender the observer component. How? Let's see.

### Observer component

Now we just need to bind our component to observable state such that whenever the setter function is called our component would rerender. Lets see an example in React.

```
import  React,  {  useState,  useEffect  }  from  "react";
import  {  nameObservable,  person  }  from  "./state";



function  App()  {

const  [, setState] =  useState();

useEffect(()  =>  {

nameObservable.subscribe(()  =>  setState({}));

return  ()  =>  nameObservable.unsubscribe();

},  []);



return  (

<>

<div>Name {person.firstName}</div>

<input

onChange={e => {

person.firstName = e.target.value;

}}

/>

</>

);

}


export  default  App;
```

The flow is like `person.firstName = e.target.value;` --->`observe.next()` ---> `() => setState({})` ---> rerender `<App/>`

So, now that we know how an observable state would work, lets create a mobx app.

## Mobx State

Mobx provides 2 ways to create state and components

1. Observable()
2. @observable annotations.
   In this example we will use functions as annotations are still not part of official ES.

```
import  {  observable  }  from  "mobx";



const  indiaTotalMatches  =  observable.box(100);

const  australiaTotalMatches  =  observable.box(100);



const  score  =  observable({

india:  {

kohli:  0,

sehwag:  0

},

australia:  {

stuart:  0,

david:  0

}

});



const  indiaScores  =  observable([215,  305]);



export  const  state  =  {

indiaTotalMatches,

australiaTotalMatches,

score,

indiaScores

};
```

We created premitive, nested object and array state objects. We need to pay special attention on how we create state and how we mutate it. Because mobx will not react to mutations if this is not done correctly. We discuss this further in the article.

```
import  React  from  "react";

import  "./styles.css";

import  {

state

}  from  "./state";

import  {

incrIndiaScore,

incrKohli,

incrAustraliaScore,

incrStuart,

addIndiaScores

}  from  "./actions";

import  {  observer  }  from  "mobx-react";

import  {  toJS  }  from  "mobx";



const  MobxApp  =  observer(()  =>  {

return  (

<div  className="App">

<h1>React Observables</h1>

<div>Integer</div>

<div>

india Score {state.indiaTotalMatches.get()}

<button  onClick={incrIndiaScore}>+</button>

</div>

<div>

Australia score {state.australiaTotalMatches.get()}

<button  onClick={incrAustraliaScore}>+</button>

</div>

<br  />

<div>Nested Object</div>

<div>

Kohli score {state.score.india.kohli}

<button  onClick={incrKohli}>+</button>

</div>

<div>

Stuart score {state.score.australia.stuart}

<button  onClick={incrStuart}>+</button>

</div>

<br  />

<div>Array</div>

<div>

{toJS(state.indiaScores).join(", ")}

<button  onClick={addIndiaScores}>+</button>

</div>

</div>

);

});



function  App()  {

return  (

<>

<MobxApp  />

</>

);

}



export  default  App;
```

`Observer(<App/>)` creates a observer component. We directly import our state and use it in App. Mobx will keep a watch on all observable state that we use in this app and rerender our component when state mutates.

Couple of points to note:

1. We import observer from `react-mobx` a react specific lib from mobx.
2. We need to call get() method on primitive values created using observable.box() .
3. The observable state is a mobx object wrapping our actuall state values. Notice that we use toJS to get the actual object `toJS(state.indiaScores).join(", ")`

Now we define the actions that will mutate our state

```
import  {  action  }  from  "mobx";

import  {  state  }  from  "./state";



export  const  incrIndiaScore  =  action(()  =>  {

let  matches  =  state.indiaTotalMatches.get();

state.indiaTotalMatches.set(++matches);

});



export  const  incrAustraliaScore  =  action(()  =>  {

let  matches  =  state.australiaTotalMatches.get();

state.australiaTotalMatches.set(++matches);

});



export  const  incrKohli  =  action(()  =>  {

let  score  =  state.score.india.kohli;

score  +=  1;

state.score.india  =  {

kohli:  score

};

// state.score.india.kohli++;

});



export  const  incrStuart  =  action(()  =>  {

state.score.australia.stuart++;

});



export  const  addIndiaScores  =  action(()  =>  {

state.indiaScores.push(Math.round(Math.random()  *  (400  -  200)));

});
```

A couple of points to note when mutating an mobx state.

1. Your action should be wrapped in `action()` or use `@action` annotations. Mobx also provides other apis like runInAction() for inline actions.
2. For primitive properties created using `observable.box()` we need to use set() and get() methods on the property. These are exposed by the observable state created bu mobx.
3. When mutating a property on an nested object we need to be mind the level which we are changing. e.g.
   `state.score.india.kohli++; // triggers rerender`
   ```
   let score = state.score.india.kohli;
   score += 1;
   state.score.india = { kohli: score }; // Does not trigger rerender
   ```
   Reason being the observalbe component is observing property 'kohli'. When the setters on kohli property are called, only then the observer will be notified of the change triggering a rerender. This is clear from our Observalble state [example](##%20A%20simple%20observable%20state) earlier.
