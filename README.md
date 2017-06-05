# penguin

## Domain Object
* 庭审信息`info`
* 法庭纪律`discipline`
* 信息核对`verify`
  * 诉讼参与人`verify_participant`
  * 异议及理由`verify_objection`
  * 缺席审理`verify_absence`
  * 是否有证人出庭`verify_witness`
* 庭审序言`preface`
  * 庭审组织`preface_organization`
  * 告知诉讼权利`preface_right`
  * 告知事项`preface_inform`
  * 是否申请回避`preface_withdrawal`
  * 举证期限异议`preface_time_limit`
* 法庭调查`investigate`
  * 诉辩意见`investigate_opinion`
  * 法庭询问`investigate_inquiry`
  * 归纳争点`investigate_conclude`
    * 无争议归纳`investigate_conclude_without_dispute`
    * 争议归纳  `investigate_conclude_in_dispute`
  * 举证质证`investigate_evidence`
* 法庭辩论`debate`
  * 原告方辩论意见`debate_accuser`
  * 被告方辩论意见`debate_defendant`
  * 第三人辩论意见`debate_third`
* 最后陈述`statement`
* 法庭调解`conciliation`
* 休庭宣读`announce`
* 其他`other`

## Installation and deployment
1. git clone http://192.168.13.21/zhengh/hummingbird.git
2. cd penguin
3. npm i
4. gulp
5. Open browser http://localhost:5005/wiserv or http://localhost:5006

## Thirdparty Library
* [Angular 1.6.2](https://angularjs.org/)
* [NodeJS 6.9.4](https://nodejs.org/)
* [UI Router 0.3.1](https://github.com/angular-ui/ui-router/tree/legacy)
* [Lodash 4.17.2](https://lodash.com/)

## Transfer Protocol

> head
* status: (Integer)，Server-side status
  1. 200：Http response success.
  2. 201：Warning infomation.
  3. 202：Login timeout.
  4. 400: Bad request.
  5. 404: No page found.
  6. 405: Request method is not support.
  7. 415: Unsupported media type.
  8. 500：Server-side exceptions.
* token: (String)，Encryption key。
* message: (String)，Server-side infomation for current http request.
* total: (Integer)，Sum of business logic result (if the results as the object then total equals 1, as an array equals length of the array).

> body
* (Object/Array)，Realistic & available datas.

```javascript
  {
    head: {
      status: 200,
      token: "ghco9xdnaco31gmafukxchph",
      message: "Login Success!",
      total: 1
    },
    body: {
      username: "admin",
      password: "admin"
    }
  }
```

## Project Release

1. Update penguin/sources/partials/common/http.js

> Update base url for global ajax connection

2. gulp clean

> remove all of thing within the build & release folder 

3. gulp build

> compile source code

4. gulp release --tar/zip

> compress build folder to the release