import { form, span, get, div, button, input, a } from "./helpers.js";
import { ServerList } from "./serverlist.js";

export const Favourites = ({ state, setState, userName }) =>
  ServerList({
    list: (state.favourites || (userName.server ? [userName.server] : [])).map((domain) => ({domain})),
    state: state || {},
    setState: (favourites) => setState(favourites),
    userName,
  });
