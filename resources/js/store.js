import Vue from "vue";
import Vuex from "vuex"

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
    returnAllStoredUploadDetails: state => {
      return state.storedUploads;
    }

  },
  mutations: {
    storeNewFileDetails: (state, payload) => {
      console.log('storeNewFileDetails');
      console.log(payload.details);
      state.storedUploads.push(payload.details);
    }
  },
  actions: {
    storeNewFileDetails: (context, payload) => {
      context.commit('storeNewFileDetails', {details: payload})
    }
  }
})
