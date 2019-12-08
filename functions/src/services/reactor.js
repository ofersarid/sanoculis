"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("firebase/firestore");

require("firebase/auth");

require("firebase/storage");

require("firebase/database");

var _promise = _interopRequireDefault(require("promise"));

var _app = _interopRequireDefault(require("firebase/app"));

var _camelCase = _interopRequireDefault(require("lodash/camelCase"));

var _immutable = require("immutable");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const structuredData = {
  collections: {},
  pages: {}
};
const STORE_DATA = 'REACTOR/STORE_DATA';

if (!_app.default.apps.length) {
  _app.default.initializeApp({
    apiKey: 'AIzaSyCVoJ1fNik-brXSirPwXfzEzpK4HDJyIdE',
    authDomain: 'reactor-dam.firebaseapp.com',
    databaseURL: 'https://reactor-dam.firebaseio.com',
    projectId: 'reactor-dam',
    storageBucket: 'reactor-dam.appspot.com',
    messagingSenderId: '198256799515'
  });
}

const getData = userId => {
  const db = _app.default.firestore();

  return new _promise.default((resolve, reject) => {
    db.collection('users').doc(userId).get().then(doc => {
      const data = doc.data();
      const promises = [];
      data.collections.forEach(collectionId => {
        promises.push(db.collection('collections').doc(collectionId).get());
        promises.push(db.collection('collections').doc(collectionId).collection('data').get());
      });
      data.pages.forEach(pageId => {
        promises.push(db.collection('pages').doc(pageId).get());
      });

      _promise.default.all(promises).then(data => {
        let name;
        let subCollectionOrder;
        data.forEach(d => {
          if (d.data) {
            // if true than this is a document
            const docData = d.data();
            name = docData.name;

            if (docData.data) {
              // this is a page
              structuredData.pages[(0, _camelCase.default)(name)] = docData.data;
            } else {
              // this is collection
              subCollectionOrder = docData.order.split(' | ');
              structuredData.collections[(0, _camelCase.default)(name)] = [];
            }
          } else {
            // this is a sub collection
            const items = [];
            subCollectionOrder.forEach(id => {
              const doc = d.docs.find(doc => doc.id === id).data(); // preloadImages(doc);

              items.push(Object.assign({
                id
              }, doc));
            });
            structuredData.collections[(0, _camelCase.default)(name)] = items;
          }
        });
        resolve(structuredData);
      });
    });
  });
};

const camelize = str => {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
};

const reducer = (state = (0, _immutable.fromJS)({
  collections: {},
  pages: {}
}), action) => {
  switch (action.type) {
    case STORE_DATA:
      return (0, _immutable.fromJS)(action.payload);

    default:
      return state;
  }
};

const actions = {
  fetch: userId => async dispatch => {
    const data = await getData(userId);
    dispatch({
      type: STORE_DATA,
      payload: data
    });
  }
};
const selectors = {
  collectionData: (state, name) => state.getIn(['reactor', 'collections', name]),
  pageData: (state, name) => state.getIn(['reactor', 'pages', camelize(name)])
};
var _default = {
  getData,
  actions,
  reducer,
  selectors
};
exports.default = _default;