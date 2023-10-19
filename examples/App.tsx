import { Deck } from "../src/Deck";
import { Slide } from "../src/Slide";

function App() {
  return (
    <Deck startAt={0} horizontal onScroll={console.log}>
      <Slide
        onEnterViewport={() => console.log("enter First!!")}
        onExitViewport={() => console.log("exit first!!")}
        style={{ flexBasis: "100%", backgroundColor: "black" }}
      />
      <Slide
        onEnterViewport={() => console.log("enter second!!")}
        onExitViewport={() => console.log("exit second!!")}
        style={{ backgroundColor: "white" }}
      />
      <Slide
        onEnterViewport={() => console.log("enter third!!")}
        onExitViewport={() => console.log("exit third!!")}
        style={{ backgroundColor: "red" }}
      />
    </Deck>
  );
}

export default App;
