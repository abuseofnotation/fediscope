import {
  get,
  renderPromise,
  form,
  div,
  button,
  input,
  a,
  img,
  span,
  assertEqual,
} from "./helpers.js";

import { ServerPreview } from "./serverpreview.js";

// Show only the portion of the list that corresponds to current page and pageSize
const trimList = (page, pageSize, list) =>
  list.slice(page * pageSize).slice(0, pageSize);

const list = [1, 2, 3, 4, 5];
assertEqual(trimList(0, 2, list), [1, 2]);
assertEqual(trimList(1, 2, list), [3, 4]);

export const ServerList = ({
  userName,
  state: { page = 0, pageSize = 3, favourites = [] },
  setState,
  list,
}) => {
  const renderServerPreview = (info) =>
    ServerPreview({
      info,
      userName,
      isFavourite:
        favourites.find((domain) => info.domain === domain) !== undefined,
      add: () =>
        setState({
          page,
          pageSize,
          favourites: (favourites || []).concat([info.domain]),
        }),
      remove: () =>
        setState({
          page,
          pageSize,
          favourites: (favourites || []).filter(
            (domain) => info.domain !== domain,
          ),
        }),
    });

  // A list of the servers that we are supposed to show in the current page
  const currentPageServers = trimList(page, pageSize, list).map(
    renderServerPreview,
  );

  const additionalWidgets = [
    // Add a window for managing servers
    AddServerWindow((domain) =>
      setState({
        page,
        pageSize,
        favourites: (favourites || []).concat([domain]),
      }),
    ),
    // Add a few empty windows, for layout purposes
    div({ className: "serverPreview" }),
    div({ className: "serverPreview" }),
    div({ className: "serverPreview" }),
  ];

  const currentPageServersAndWidgets = currentPageServers
    .concat(additionalWidgets)
    .slice(0, pageSize);

  const prevPage = () => setState({ page: page - 1, pageSize, favourites });

  const nextPage = () => setState({ page: page + 1, pageSize, favourites });


  const element = div({ className: "serverList", autofocus: true, tabindex: "0"}, [
    button({
      id:"left-arrow",
      className: "arrow",
      text: "◄",
      disabled: page === 0,
      onClick: prevPage,
    }),
    ...currentPageServersAndWidgets,

    button({
      id:"right-arrow",
      className: "arrow",
      text: "►",
      disabled: (page + 1) * pageSize > list.length,
      onClick: nextPage,
    }),
  ]);
  return element;
};

const AddServerWindow = (addServer) => {
  const field = input({
    placeholder: "Type the server URL",
    style: "min-width: calc(100% - 82px)",
  });
  return div({ className: "serverPreview" }, [
    div({ className: "header" }, [span({ text: "Add new instance" })]),
    form({ className: "serverPosts" }, [
      field,
      input({
        class: "button",
        type: "submit",
        value: "Add",
        onClick: () =>
          addServer(field.value.replace("https://", "").replace("/", "")),
      }),
    ]),
  ]);
};
