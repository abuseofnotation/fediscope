import { get, div, button, input, renderComponent, a } from "./helpers.js";
import { ServerList } from "./serverlist.js";

const App = ({ state, setState }) => {
  const userName = state.userName || { error: "Please enter a username" };
  if (userName.error === undefined) {
    return Servers({ userName, state, setState });
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

const Servers = ({ userName, state, setState }) => {
  console.log("Rendering server list", state);
  return div({ className: "container" }, [
    div({ className: "header" }, [
      div({ text: `Hello ${userName.handle}` }),
      button({
        text: "Quit",
        onClick: () =>
          setState({ userName: localStorage.removeItem("userName") }),
      }),
    ]),

    ServerList({
      state: state.favourites,
      setState: (favourites) => setState({ favourites }),
      userName,
    }),
    div({ className: "footer" }, []),
  ]);
};

const LoginForm = ({ name, setName }) => {
  const parseName = (name) => {
    const [prefix, handle, server] = name.split("@");
    if (prefix !== "") {
      return {
        error: `Your handle is invalid, handles should begin with "@", yours begins with "${prefix}`,
      };
    } else if (/\./.test(handle)) {
      return {
        error: `Your handle is invalid, "${handle} contains special characters, it should be alphanumeric`,
      };
    } else if (server === undefined) {
      return {
        error: `Your handle is invalid, it does not contain the server URL`,
      };
    } else {
      return { handle, server };
    }
  };
  const field = input({ placeholder: "Write your server" });
  return div({}, [
    div({ text: name.error }),
    field,
    button({ text: "Go", onClick: () => setName(parseName(field.value)) }),
  ]);
};

window.onload = renderComponent(App);
