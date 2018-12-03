Krypton-ui
========

#### Instructions for Local Setup.

* Install `yarn` for your platform.
* Clone the repo and run `yarn install`.
* Setup backend on your local (with tenant based `/etc/hosts` routing working).
* Add something like this to your `api-url-local.js` file (assuming backend is running on `8000` port):

```javascript
const getSite = site => {
  let host = document.location.hostname;
  let hostSplit = host.split(".");
  let domain =
    document.location.protocol +
    "//" +
    hostSplit[0] +
    "." +
    hostSplit[1] +
    "." +
    hostSplit[2] +
    ":8000/api/v1/";
  return domain;
};

const subDomainUrl = site => {
  let host = document.location.hostname;
  let hostSplit = host.split(".");
  let domain = document.location.protocol + "//" + host + "/api/v1/";
  return domain;
};

export const baseUrl = getSite();

export const baseUrl2 = subDomainUrl();
```

* `yarn start` will start development server, and you're done!
