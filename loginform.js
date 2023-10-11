import {
  form,
  span,
  get,
  div,
  button,
  input,
  renderComponent,
  a,
} from "./helpers.js";

export const LoginForm = ({ name, setName }) => {
  const parseName = (name) => {
    const [prefix, handle, server] = name.split("@");
    if (prefix !== "") {
      return {
        error: `Your handle is invalid, handles should begin with "@", yours begins with "${prefix}`,
      };
    } else if (/\./.test(handle)) {
      return {
        error: `Your handle is invalid, "${handle} contains special characters, it should be alphanumeric`,
      };
    } else if (server === undefined) {
      return {
        error: `Your handle is invalid, it does not contain the server URL`,
      };
    } else {
      return { handle, server };
    }
  };
  const field = input({
    placeholder: "@john_mastodon@mastodon.antisocial",
    autoFocus: true,
  });
  return form({ class: "overlay" }, [
    div({ text: name.error }),
    field,
    input({
      value: "Go",
      type: "submit",
      className: "button",
      onClick: () => setName(parseName(field.value)),
    }),
    button({
      text: "Skip",
      className: "button",
      onClick: () => setName({ server: undefined, handle: undefined }),
    }),
  ]);
};
