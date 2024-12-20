import {
  get,
  renderPromise,
  form,
  div,
  button,
  input,
  a,
  img,
  video,
  source,
  span,
  assertEqual,
} from "./helpers.js";
export const ServerPreview = ({ info, userName, remove, add, isFavourite }) => {
  const container = div({ className: "serverPosts" }, [
    div({ className: "loading", text: "Loading" }),
  ]);

  return div({ className: "serverPreview" }, [
    div({ className: "header" }, [
      span({ text: info.domain, title: info.domain }),
      div({ className: "right" }, [
        isFavourite
          ? button({ class: "icon", text: "★", onClick: remove })
          : button({ class: "icon", text: "☆", onClick: add }),
      ]),
    ]),
    info.description &&
      div({
        className: "description",
        text: info.description,
        title: info.description,
      }),
    div({ className: "serverPosts" }, [
      /*
      div({}, [
        renderPromise(
          get("https://" + info.domain + "/api/v1/trends/tags").then((tags) =>
            div(
              { className: "postTags" },
              tags.map(({ name, url }) =>
                a({
                  className: "tag",
                  href: url,
                  text: "#" + name,
                  target: "_blank",
                }),
              ),
            ),
          ),
        ),
      ]),
      */
      div({}, [
        renderPromise(
          get(
            "https://" +
              info.domain +
              "/api/v1/timelines/public?local=true&only_media=false&limit=200",
            //  '/api/v1/trends/statuses?&limit=40'
          )
            .then((result) => {
              const resultSorted = result.sort(
                (a, b) => b.reblogs_count - a.reblogs_count,
              );
              return div(
                {},
                resultSorted.map((post) =>
                  Post({ post, userName, domain: info.domain }),
                ),
              );
            })
            .catch((error) => {
              return div({ className: "loading", text: error });
            }),
        ),
      ]),
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
    ...post.media_attachments.map(({ url, type }) => {
      if (type === "image") {
        return img({ class: "postImage", src: url });
      } else if (type === "video") {
        console.log('video', url)
        return video({ class: "postImage", controls: true }, [
          source({src: url})
        ]);
      }
    }),
    a({
      text: `⤺${post.replies_count} ★${post.favourites_count} ⇅${post.reblogs_count}`,
      href: `${postHref}`,
      target: "_blank",
      className: "postInfo",
    }),
  ]);
};
