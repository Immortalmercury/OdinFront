/* eslint-disable import/no-anonymous-default-export */
import ClientJS from 'clientjs';
import { AuthHeader, setTokens, unsetTokens, getAccessToken } from './JWT';
import request from './AxiosDefaults';

const secured = true;
const baseRoute = 'http' + (secured ? 's' : '') + '://api.aucfpls.ru';

export const loginRoute = baseRoute + '/auth/signin';
export const refreshTokensRoute = baseRoute + '/auth/refresh';
export const logoutRoute = baseRoute + '/auth/signout';
export const registerRoute = baseRoute + '/auth/register';
export const defaultRoute = baseRoute + '/data';

/**
 * Call to API with authorization
 * @param {path to api} route 
 * @param {object of params} data 
 * @returns Promise
 */
export const call = async (data, route = defaultRoute, enabledConsoleLog = false) => {
    if (route === undefined || route === null) {
        route = defaultRoute;
    }
    var headers = await AuthHeader(enabledConsoleLog);
    return request.post(route, data, {headers})
    .then((response) => {
        let result = response.data;
        if (enabledConsoleLog) {   
            if (result.success) {
                console.log('Successful request to ' + route);
            } else {
                console.log('Failed request to ' + route);
            }
            console.log({requestParameters:{data,headers},resultData:result});
        }
        return result;
    })
    .catch((error) => {
        // console.error(error)
        return error;
    });
}

export const callV2 = async(method, route, data,  enabledConsoleLog = false) => {
    var headers = await AuthHeader(enabledConsoleLog);
    return request({
        method: method,
        url: route,
        baseURL: baseRoute,
        data: data,
        headers: headers
      })
    .then((response) => {
        let result = response.data;
        if (enabledConsoleLog) {   
            if (result.success) {
                console.log('Successful request to ' + route);
            } else {
                console.log('Failed request to ' + route);
            }
            console.log({requestParameters:{data,headers},resultData:result});
        }
        return result;
    })
    .catch((error) => {
        // console.error(error)
        return error;
    });
}


export const filecall = async (data,filename, enabledConsoleLog = false) => {
    var headers = await AuthHeader(enabledConsoleLog);
    return request.request({
        url: defaultRoute,
        method: 'POST',
        responseType: 'blob',
        encoding: "binary", // Important
        headers,
        data
    })
    .then((response) => {
        if (enabledConsoleLog)  console.log(response);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        if (response.status === 200) {
            return {
                success: true,
                message: "FILE_RECEIVED",
            };
        }else{
            return {
                success: false,
                state: 'EXCEPTION',
                message: response,
            }
        }
        
    });
}

export const login = async (login, password, remember = false) => {
    if (getAccessToken() !== null) await logout();
    var client = new ClientJS();

    return request.post(loginRoute, {
        login,
        password,
        remember,
        device: client.getBrowser()
    })
    .then((response) => {
        let result = response.data;
        if (result.success && !!result.data.accessToken) {
            setTokens(result.data.accessToken, result.data.accessTokenExpired);
            // console.log('tokens_setted');
        }
        return result;
    });
}

export const logout = async (tokenSessionId = null) => {
    var headers = await AuthHeader();
    var client = new ClientJS();

    return request.post(logoutRoute, {
        device: client.getBrowser(),
    }, {
        headers
    })
    .then((response) => {
        let result = response.data;
        if (result.success) {
            console.log('Tokens are deleted, result code = ' + result.status);
            unsetTokens();
        } else {
            if (result.status === 'UNAUTHENTICATED') {
                console.log('AccessToken was not provided, result code = ' + result.status);
                console.log('All tokens deleted once again');
                unsetTokens();
            } else if (result.status === 'TOKEN_INVALID') {
                console.log('AccessToken is invalid, result code = ' + result.status);
                console.log('All tokens deleted once again');
                unsetTokens();
            } else if (result.status === 'TOKEN_EXPIRED') {
                console.log('Wow! TOKEN_EXPIRED, I did not think it is possible. Ok... Let\'s retry');
                return logout(tokenSessionId);
            }
        }
        return result;
    });
}

export default {filecall,call,callV2,login,logout};