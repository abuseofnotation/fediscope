import {
  renderPromise,
  form,
  span,
  get,
  div,
  button,
  input,
  a,
} from "./helpers.js";
import { getServers } from "./model.js";
import { ServerList } from "./serverlist.js";

export const Popular = ({ state, setState, userName }) => {
  return div({ className: "serverList" }, [
    renderPromise(
      getServers().then((list) =>
        ServerList({
          state: state || {},
          setState: (favourites) => setState(favourites),
          userName,
          list,
        }),
      ),
    ),
  ]);
};
