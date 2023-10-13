import { form, span, get, div, button, input, a } from "./helpers.js";

import { Favourites } from "./favourites.js";
import { Following } from "./following.js";
import { Popular } from "./popular.js";
import { VolumeControl } from "./components/volumecontrol.js";

const menuItems = ["Popular", "Following", "Favourites"];

const items = [Popular, Following, Favourites];

export const MainScreen = ({ userName, state, setState }) => {
  return div({ className: "container" }, [
    div({ className: "header" }, [
      div(
        { className: "menu" },
        menuItems.map((name, i) =>
          a({
            text: name,
            className: (state.page || 0) === i ? "selected" : "",
            onClick: () => {
              setState({
                page: i,
                favourites: { ...state.favourites, page: 0 },
              });
            },
          }),
        ),
      ),

      div({ className: "right" }, [
        span({ text: `${userName.handle ? userName.handle : "No account"}` }),
        button({
          class: "icon",
          text: "¬",
          onClick: () => setState({ userName: undefined }),
        }),
      ]),
    ]),
    items[state.page || 0]({
      state: state.favourites || {},
      setState: (favourites) => setState({ favourites }),
      userName,
    }),
    /*
    [
      () => Popular({
        state: state.favourites || {},
        setState: (favourites) => setState({ favourites }),
        userName,
      }),

      Following({
        state: state.favourites || {},
        setState: (favourites) => setState({ favourites }),
        userName,
      }),

      Favourites({
        state: state.favourites || {},
        setState: (favourites) => setState({ favourites }),
        userName,
      }),
    ][state.page || 0],
    */
    div({ className: "footer" }, [
      span({text:'Display'}),
      VolumeControl({
        volume: state.favourites.pageSize,
        setVolume: (pageSize) =>
          setState({ favourites: { ...state.favourites, pageSize } }),
      }),

      span({text:'instances per screen.'})
    ]),

    div({ className: "footer" }, [
      a({
        href: "https://github.com/abuseofnotation/fediscope/",
        target: "_blank",
        text: "README / Project Github",
      }),

      a({
        href: "https://abuseofnotation.github.io/",
        target: "_blank",
        text: "Author page",
      }),
      a({
        href: "https://ko-fi.com/abuseofnotation",
        target: "_blank",
        text: "Support in Ko-fi",
      }),

      a({
        href: "https://patreon.com/borismarinov",
        target: "_blank",
        text: "Support in Patreon",
      }),
    ]),
  ]);
};
