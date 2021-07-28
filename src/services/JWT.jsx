import { refreshTokensRoute } from './API';
import ClientJS from 'clientjs';
import request from './AxiosDefaults';

const accessTokenName = 'token'; // Name of the access token in the localStorage
const accessTokenExpiresName = 'tokenExp'; // Name of the access token in the localStorage
const refreshingInProgressName = 'refreshingInProgress'; // Name of the refreshing progress flag in the localStorage

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function AuthHeader(enabledConsoleLog = false) {
  
  let tokenExpires = localStorage.getItem(accessTokenExpiresName);
  // Если время исчетения токена прошло
  if (tokenExpires && tokenExpires <= parseInt(new Date().getTime() / 1000)) {
    // Запустить обновление и подождать
    if (localStorage.getItem(refreshingInProgressName)) {
      if (enabledConsoleLog) console.log("Refreshing in progress, ok, im waiting for");
      await sleep(500);
      let i = 0;
      while (localStorage.getItem(refreshingInProgressName) === 'true'&&i<10) {
        if (enabledConsoleLog) console.log("I'm still waiting");
        await sleep(500);
        i++;
      }
      if (i >= 10) {
        localStorage.removeItem(refreshingInProgressName);
      }
      if (enabledConsoleLog) console.log("Refreshing ends, so let's working");
    } else {
      if (enabledConsoleLog) console.log("I start refreshing and set flag for other processes");
      localStorage.setItem(refreshingInProgressName, 'true');
      await refreshTokens(enabledConsoleLog);
      if (enabledConsoleLog) console.log("I finished refreshing, so need to unset flag, may be other processes waiting for me");
      localStorage.removeItem(refreshingInProgressName);
    }
  }

  let accessToken = localStorage.getItem(accessTokenName);
  if (accessToken) {
    return { Authorization: 'Bearer ' + accessToken };
  } else {
    return {};
  }
}

// Установить токены
export const setTokens = (accessToken, accessTokenExpires) => {
  localStorage.setItem(accessTokenName, accessToken);
  localStorage.setItem(accessTokenExpiresName, accessTokenExpires);
}

// Удалить токены
export const unsetTokens = () => {
  localStorage.removeItem(accessTokenName);
  localStorage.removeItem(accessTokenExpiresName);
}

// Обновить токены
export async function refreshTokens(enabledConsoleLog = false, isRetry = false) {
  var client = new ClientJS();
  return request.post(refreshTokensRoute, {
      device: client.getBrowser()
    }, { headers: { Authorization: 'Bearer ' + getAccessToken() } })
    .then(response => {
      let result = response.data;
      if (result.success) {
        // if (result.status === 'REFRESH_SUCCESS') {
        if (enabledConsoleLog) console.log('Successful refreshing tokens');
        setTokens(result.data.accessToken, result.data.accessTokenExpires);
        return result.status;
        // } else if (enabledConsoleLog) {
        //   console.log('Refreshing tokens failed');
        //   console.log('Received successful response, but something wrong. Server replied:');
        //   console.log(result);
        // }
      } else {
        if (!isRetry) {
          return (async () => {
            await sleep(1000);
            return refreshTokens(enabledConsoleLog, true);
          })();
        } else {
          if (enabledConsoleLog)
            console.log('Refreshing tokens failed, status code: ' + result.status + ' .');
            unsetTokens();
            localStorage.removeItem(refreshingInProgressName);
          if (enabledConsoleLog)
            console.log('All tokens deleted. Need reLogin. FullServer reply:');
          if (enabledConsoleLog)
            console.log(result);
          window.location.replace("/");
        }
      }
    });
}

export const getAccessToken = () => {
  return localStorage.getItem(accessTokenName);
}