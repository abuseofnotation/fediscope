const development = window.location.hostname === "localhost";
export const createElement =
  (type) =>
  ({ className, text, onClick, disabled, ...props }, children) => {
    const div = document.createElement(type);
    if (className) {
      div.classList.add(className);
    }
    if (text) {
      let textNode = document.createTextNode(text);
      div.appendChild(textNode);
    }
    if (children) {
      div.replaceChildren(...children);
    }
    if (onClick) {
      div.addEventListener("click", onClick);
    }
    if (disabled) {
      div.setAttribute("disabled", true);
    }
    Object.keys(props).forEach((propName) => {
      div.setAttribute(propName, props[propName]);
    });
    return div;
  };

// Functions for creating html elements
// (Right now they create DOM elements directly, but they
// can be made to work with with some virtual DOM lib

export const div = createElement("div");
export const button = createElement("button");
export const span = createElement("span");
export const input = createElement("input");
export const a = createElement("a");
export const form = createElement("form");
export const img = createElement("img");

const appName = "fediScope";

export const renderComponent = (
  component,
  state = JSON.parse(localStorage.getItem(appName)) || {},
  params,
) => {
  console.log("Rendering app with state", state);
  document.getElementById("app").replaceChildren(
    component({
      state,
      setState: (stateUpdate) => {
        const newState = { ...state, ...stateUpdate };
        localStorage.setItem(appName, JSON.stringify(newState));
        renderComponent(component, newState, params);
      },
      ...params,
    }),
  );
};
export const get = (url) =>
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      throw error;
    });

export const renderPromise = (promise) => {
  const loader = div({ className: "loading", text: "Loading" });
  promise.then((newDiv) => {
    loader.parentElement.replaceChildren(newDiv);
  });
  return loader;
};

const cache = {}

export const cachedGet = (url) => {
  if (cache[url]) {
    return cache[url]
  } else {
    const result = get(url)
    cache[url] = result
    return result
  }
}


export const assertEqual = (a, b) => {
  if (development) {
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      console.error("values are not equal", a, b);
    }
  }
};
