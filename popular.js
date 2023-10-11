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
import { ServerList } from "./serverlist.js";

export const Popular = ({ state, setState, userName }) => {
  return div({ className: "serverList" }, [
    renderPromise(
      get(
        "https://api.joinmastodon.org/servers?language=en&category=general&region=&ownership=&registrations=",
      ).then((list) => {
        return ServerList({
          state: state || {},
          setState: (favourites) => setState(favourites),
          userName,
          list,
        });
      }),
    ),
  ]);
};
