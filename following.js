import {
  renderPromise,
  form,
  span,
  get,
  div,
  button,
  input,
  a,
  assertEqual,
} from "./helpers.js";
import { ServerList } from "./serverlist.js";
import { getUserInfo, getUserFollowing } from "./model.js";

const serverList = (followers) => {
  const dict = followers.reduce((dict, { acct }) => {
    const [user, domain] = acct.split("@");
    dict[domain] = dict[domain] ? dict[domain].concat([user]) : [user];
    return dict;
  }, {});
  delete dict.undefined;
  return Object.keys(dict)
    .map((domain) => ({
      domain,
      followers: dict[domain],
      description: "With " + dict[domain].join(", "),
    }))
    .sort((a, b) => b.followers.length - a.followers.length);
};

const sampleList = [
  { acct: "dan@mastodon.social" },
  { acct: "ivan@mastodon.social" },
  { acct: "ivan@mastodon.xyz" },
];

const sampleOutput = [
  { domain: "mastodon.social", followers: ["dan", "ivan"] },
  { domain: "mastodon.xyz", followers: ["ivan"] },
];

assertEqual(serverList(sampleList).map(({domain, followers}) => ({domain, followers})), sampleOutput);

export const Following = ({ state, setState, userName }) => {
  const showFollowerServers = (info) =>
    getUserFollowing(info).then((followers) =>
      ServerList({
        state: state || {},
        setState: (favourites) => setState(favourites),
        userName,
        list: serverList(followers),
      }),
    );

  return div({ className: "serverList" }, [
    renderPromise(
      getUserInfo(userName).then((info) => showFollowerServers(info)),
    ),
  ]);
};
