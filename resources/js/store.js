import Vue from "vue";
import Vuex from "vuex"
import axios from "axios";
import el from "element-ui/src/locale/lang/el";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    intro: 'Welcome to templates',
    storedUploads: []
  },
  getters: {
    returnIntro: state => {
        return state.intro;
    },
    returnAllStoredCsvUploadUrls: state => {
      console.warn('returnAllStoredCsvUploadUrls');
      return state.storedUploads;
    }

  },
  mutations: {
    storeNewFileDetails: (state, payload) => {
      console.log('storeNewFileDetails');
      console.log(payload.details);
      state.storedUploads.push(payload.details);
    },
    queueCsvTemplateFiles: (state, payload) => {
      /*
      * baseUrl String
      * files Array
      * */
      console.log('Mutation: queueCsvTemplateFiles', payload);
      state.storedUploads = payload.files.map( el => {
        return payload.baseUrl + el;
      })
    }
  },
  actions: {
    storeNewFileDetails: (context, payload) => {
      context.commit('storeNewFileDetails', {details: payload})
    },
    async queueCsvTemplateFiles(context) {
      let result = await axios.get('/files');
      context.commit("queueCsvTemplateFiles", result.data);
    }
  }
})
