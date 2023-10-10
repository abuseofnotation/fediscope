import {
  form,
  get,
  div,
  button,
  input,
  renderComponent,
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
  state: { page = 0, pageSize = 3, list = [userName.server] },
  setState,
}) => {
  return div({ className: "serverList" }, [
    button({
      className: "arrow",
      text: "◄",
      disabled: page === 0,
      onClick: () => setState({ page: page - 1, pageSize, list }),
    }),
    ...trimList(
      page,
      pageSize,
      list
        .map((name) =>
          ServerPreview({
            name,
            userName,
            remove: () =>
              setState({
                page,
                pageSize,
                list: list.filter((serverName) => serverName !== name),
              }),
          }),
        )
        // Add a window for managing servers
        .concat(
          AddServerWindow((name) =>
            setState({
              page,
              pageSize,
              list: (list || []).concat([name]),
            }),
          ),
        )
        // Add a few empty windows, for layout purposes
        .concat([
          div({ className: "serverPreview" }),
          div({ className: "serverPreview" }),
          div({ className: "serverPreview" }),
        ]),
    ),
    button({
      className: "arrow",
      text: "►",
      disabled: (page + 1)* pageSize > list.length,
      onClick: () => setState({ page: page + 1, pageSize, list }),
    }),
  ]);
};

const ServerPreview = ({ name, userName, remove }) => {
  const container = div({ className: "serverPosts" }, [
    div({ className: "Loading", text: "Loading" }),
  ]);

  get(
    "https://" +
      name +
      "/api/v1/timelines/public?local=true&only_media=false&limit=40",
    //  '/api/v1/trends/statuses?&limit=40'
  ).then((result) => {
    const resultSorted = result.sort(
      (a, b) => b.reblogs_count - a.reblogs_count,
    );
    container.replaceChildren(
      ...resultSorted.map((post) => Post({ post, userName, name })),
    );
  });
  return div({ className: "serverPreview" }, [
    div({ className: "header" }, [
      span({text:name}),
      div({className:'right'}, [
      button({class: 'icon', text: "★", onClick: remove}) 
      ])
    ]),
    container,
  ]);
};

const Post = ({ post, userName, name }) => {
  const serverHref = `https://${userName.server}/`;
  const userHref = userName.server ? (`${serverHref}@${post.account.username}${
    userName.server !== name ? "@" + name : ""
  }`) : post.account.url;

  const postHref = userName.server ? `${serverHref}authorize_interaction?uri=${post.url}` : post.url;
  const content = document.createElement("div");
  content.innerHTML = post.content;

  https: return div({ className: "post" }, [
    img({src: post.account.avatar, className:"avatar" }),
    a({
      href: userHref,
      text: post.account.display_name,
      target: "_blank",
      className:"userName"
    }),
    content,
    a({
      text: `⤺${post.replies_count} ★${post.favourites_count} ⇅${post.reblogs_count}`,
      href: `${postHref}`,
      target: "_blank",
      className:"postInfo"
    }),
  ]);
};

const AddServerWindow = (addServer) => {
  const field = input({ placeholder: "Type the server URL", style: 'min-width: calc(100% - 82px)' });
  return div({ className: "serverPreview" }, [

    div({ className: "header" }, [
      span({text:'Add new instance'}),
    ]),
    form({ className:'serverPosts'}, [
    field,
    input({
      class: "button",
      type: "submit",
      value: "Add",
      onClick: () =>
        addServer(field.value.replace("https://", "").replace("/", "")),
    }),])
  ]);
};
