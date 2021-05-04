import { runApp, IAppConfig, config, history } from 'ice';
import React from 'react';
import { message } from 'antd';

const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
    parseSearchParams: true
  },
  router: {
    fallback: <div>loading...</div>
  },
  /* @ts-ignore */
  request: {
    // 可选的，全局设置 request 是否返回 response 对象，默认为 false
    withFullResponse: false,
    baseURL: config.baseURL,
    // baseURL: '/magicdata',
    headers: {},
    // ...RequestConfig 其他参数

    // 拦截器
    interceptors: {
      request: {
        onConfig: (config: any) => {
          // 发送请求前：可以对 RequestConfig 做一些统一处理
          // eslint-disable-next-line no-param-reassign
          // config.headers = { a: 1 };
          const requestUrl = config.url;
          if(requestUrl !== '/login') {
            config.headers.token = sessionStorage.getItem('token');
          }
          return config;
        },
        onError: (error) => {
          return Promise.reject(error);
        }
      },
      response: {
        onConfig: (response) => {
          // 请求成功：可以做全局的 toast 展示，或者对 response 做一些格式化
          // console.log(response.data)
          if(Number(response.data.code) === 401) {
              history.push('/login');
              return Promise.reject(response.data.msg);
          }
          if (Number(response.data.code) !== 200) {
            message.error(response.data.msg);
            return Promise.reject(response.data.msg)
          }
          return response;
        },
        onError: (error) => {
          // 请求出错：服务端返回错误状态码
          console.log(error?.response?.data);
          console.log(error?.response?.status);
          console.log(error?.response?.headers);
          return Promise.reject(error);
        }
      },
    }

  }
};

runApp(appConfig);
