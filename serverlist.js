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
  const renderServerPreview = ({ domain }) =>
    ServerPreview({
      domain,
      userName,
      isFavourite:
        favourites.find((theDomain) => domain === theDomain) !== undefined,
      add: () =>
        setState({
          page,
          pageSize,
          favourites: (favourites || []).concat([domain]),
        }),
      remove: () =>
        setState({
          page,
          pageSize,
          favourites: (favourites || []).filter(
            (theDomain) => domain !== theDomain,
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
        favourites: (favourites || []).concat([name]),
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

  return div({ className: "serverList" }, [
    button({
      className: "arrow",
      text: "◄",
      disabled: page === 0,
      onClick: () => setState({ page: page - 1, pageSize, favourites }),
    }),
    ...currentPageServersAndWidgets,

    button({
      className: "arrow",
      text: "►",
      disabled: (page + 1) * pageSize > list.length,
      onClick: () => setState({ page: page + 1, pageSize, favourites }),
    }),
  ]);
};

const ServerPreview = ({ domain, userName, remove, add, isFavourite }) => {
  const container = div({ className: "serverPosts" }, [
    div({ className: "loading", text: "Loading" }),
  ]);

  return div({ className: "serverPreview" }, [
    div({ className: "header" }, [
      span({ text: domain }),
      div({ className: "right" }, [
        isFavourite
          ? button({ class: "icon", text: "★", onClick: remove })
          : button({ class: "icon", text: "☆", onClick: add }),
      ]),
    ]),
    div({ className: "serverPosts" }, [
      renderPromise(
        get(
          "https://" +
            domain +
            "/api/v1/timelines/public?local=true&only_media=false&limit=40",
          //  '/api/v1/trends/statuses?&limit=40'
        )
          .then((result) => {
            const resultSorted = result.sort(
              (a, b) => b.reblogs_count - a.reblogs_count,
            );
            return resultSorted.map((post) => Post({ post, userName, domain }));
          })
          .catch((error) => {
            console.log(error);
            return div({ text: error });
          }),
      ),
    ]),
  ]);
};

const Post = ({ post, userName, domain }) => {
  const serverHref = `https://${userName.server}/`;
  const userHref = userName.server
    ? `${serverHref}@${post.account.username}${
        userName.server !== domain ? "@" + domain : ""
      }`
    : post.account.url;

  const postHref = userName.server
    ? `${serverHref}authorize_interaction?uri=${post.url}`
    : post.url;
  const content = document.createElement("div");
  content.innerHTML = post.content;

  https: return div({ className: "post" }, [
    img({ src: post.account.avatar, className: "avatar" }),
    a({
      href: userHref,
      text: post.account.display_name,
      target: "_blank",
      className: "userName",
    }),
    content,
    a({
      text: `⤺${post.replies_count} ★${post.favourites_count} ⇅${post.reblogs_count}`,
      href: `${postHref}`,
      target: "_blank",
      className: "postInfo",
    }),
  ]);
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
