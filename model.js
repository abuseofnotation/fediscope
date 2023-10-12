import { cachedGet } from "./helpers.js";

export const getUserInfo = (userName) =>
  cachedGet(
    `https://${userName.server}/api/v2/search?q=%40${userName.handle}@${userName.server}&limit=1&type=accounts`,
  ).then((result)=> result.accounts[0]);

export const getUserFollowers = (userInfo) =>
  cachedGet(`https://mathstodon.xyz/api/v1/accounts/${userInfo.id}/followers`);

export const getUserFollowing = (userInfo) =>
  cachedGet(`https://mathstodon.xyz/api/v1/accounts/${userInfo.id}/following`);


export const getServers = () => cachedGet(
        "https://api.joinmastodon.org/servers?language=en&category=general&region=&ownership=&registrations=",
      )
