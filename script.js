import {
  form,
  span,
  get,
  div,
  button,
  input,
  renderComponent,
  a,
} from "./helpers.js";
import { ServerList } from "./serverlist.js";
import { LoginForm } from "./loginform.js";
import { MainScreen } from "./mainscreen.js";

const App = ({ state, setState }) => {
  const userName = state.userName || {
    error:
      "Please enter your Mastodon username, in the format @<username>@<server>",
  };
  if (userName.error === undefined) {
    return MainScreen({ userName, state, setState });
  } else {
    return LoginForm({
      name: userName,
      setName: (name) => {
        setState({
          userName: name,
        });
      },
    });
  }
};

window.onload = renderComponent(App);



  document.addEventListener("keydown", function (event) {
    console.log(event)
    if (event.keyCode === 37 || event.key === "ArrowLeft") {
      document.getElementById('left-arrow').click()
    }
    // Check if the pressed key is the right arrow key
    else if (event.keyCode === 39 || event.key === "ArrowRight") {
      document.getElementById('right-arrow').click()
    }
  });
