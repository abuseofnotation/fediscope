import {
  get,
  div,
  button,
  input,
  renderComponent,
  a,
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
  return div(
    { className: "serverList" },
    trimList(
      page,
      pageSize,
      list
        .map((name) => ServerPreview({ name, userName }))
        // Add a window for managing servers
        .concat(
          AddServerWindow((name) =>
            setState({
              list: (list || []).concat([name]),
            }),
          ),
        )
        // Add a few empty windows, for layout purposes
        .concat([div({}), div({}), div({})]),
    ),
  );
};

const ServerPreview = ({ name, userName }) => {
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
    div({ className: "serverHeader", text: name }),
    container,
  ]);
};

const Post = ({ post, userName, name }) => {
  const serverHref = `https://${userName.server}/`;
  const userHref = `${serverHref}@${post.account.username}${
    userName.server !== name ? "@" + name : ""
  }`;

  const postHref = `${serverHref}/authorize_interaction?uri=${post.uri}`;
  const content = document.createElement("div");
  content.innerHTML = post.content;

  //mastodon.art/users/datGestruepp/statuses/111209048265884242

  https: return div({ className: "post" }, [
    a({
      href: userHref,
      text: post.account.display_name,
      target: "_blank",
    }),
    content,
    a({
      text: `⤺${post.replies_count} ★${post.favourites_count} ⇅${post.reblogs_count}`,
      href: `${postHref}`,
      target: "_blank",
    }),
  ]);
};

const AddServerWindow = (addServer) => {
  const field = input({ placeholder: "Write the name of your server" });
  return div({ className: "serverPreview" }, [
    field,
    button({ text: "Go", onClick: () => addServer(field.value) }),
  ]);
};
