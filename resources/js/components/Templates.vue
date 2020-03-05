<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h3>{{ returnIntro }}</h3>
        <h6>Additional options and settings here. Also the final export button.</h6>
      </div>
      <div class="col-6">
        <!--Title & Color-->
        <span class="demonstration font-weight-bold">Adjust event title size 1: Largest 6: Smallest</span>
        <el-slider
          v-model="titleSize"
          :step="1"
          :min="1"
          :max="6"
          @input="updateTitleSize"
          show-stops>
        </el-slider>

        <span class="demonstration font-weight-bold">Highlight Color</span>
        <div class="color-picker"></div>

        <span class="demonstration font-weight-bold d-block mt-3">Use custom selectable header. Toggle to turn on</span>
        <el-switch
          v-model="toggleCustomHeader"
          active-text="Use custom header"
          inactive-text="Use default highlight">
        </el-switch>

        <span class="demonstration font-weight-bold d-block mt-3">Stored Event Files</span>
        <el-dropdown @command="hasCommand">
                <span class="el-dropdown-link">
                  Selectable saved files<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(url,index) in storedFileUrls" :key="index" :command="url">{{ url }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

          <span class="demonstration font-weight-bold d-block mt-2">Current selected file</span>
          <span v-show="selectedFile">{{selectedFile.slice().split('/')[4]}} <el-button type="danger" @click="deleteFilePermanently">Delete current file</el-button> </span>

        <el-alert
          v-show="meta.success"
          class="mt-3"
          :title='`File has generated a total of ${meta.total} events`'
          type="success"
          close-text="Gotcha">
        </el-alert>

      </div>
      <div class="col-6">
        <!--Header template and Header dropdown-->
<!--        <span class="demonstration font-weight-bold d-block">Select a saved Header template</span>-->
<!--        <el-dropdown @command="hasCommandHeader">-->
<!--                <span class="el-dropdown-link">-->
<!--                  Selectable saved Headers<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
<!--                </span>-->
<!--          <el-dropdown-menu slot="dropdown">-->
<!--            <el-dropdown-item v-for="(lht, index) in localHeaderTemplates" :key="index">-->
<!--              <span v-html="lht"></span>-->
<!--            </el-dropdown-item>-->
<!--          </el-dropdown-menu>-->
<!--        </el-dropdown>-->

        <span class="demonstration font-weight-bold d-block mb-3">Paste in a new Header template below</span>

        <el-alert v-show="errors.headerTemplateError"
                  title="Error! There is no Header present."
                  class="mb-2 mt-2"
                  type="error">
        </el-alert>

        <el-alert v-show="errors.headerTemplateSuccess"
                  title="Success! Your template was saved."
                  type="success"
                  class="mb-2 mt-3"
                  close-text="Gotcha">
        </el-alert>
        <froala :tag="'textarea'" :config="config" v-model="headerTemplate" />

      </div>

      <!--WYSIWYG Editor-->
      <div class="col-6 mt-2" id="CustomWeChatHeader">
        <froala :tag="'textarea'" :config="config" v-model="model" />
      </div>

      <div class="col-6 bg-white mt-2">
        <div class="row p-2">
          <div class="col-6 my-auto">
            Event(s) template will be generated below
          </div>
          <div class="col-6" v-show="selectedFile !== ''">
            <el-button class="copyToClipboard float-right" data-clipboard-action="copy"
                       data-clipboard-target="#event_data">Copy
            </el-button>
            <el-button class="copyToClipboard float-right mr-2" type="primary" @click="synchronizeEditor">Re-Synchronize
            </el-button>
          </div>

          <!--Generated Events Content-->
          <div class="col-12 bg-white overflow-auto" style="max-height: 65vh">

            <div class="row mt-2" id="event_data">
              <div class="col-12 mb-3" v-for="(_event, index) in csvData" :key="index">
                <div v-if="toggleCustomHeader">
                  <span class="text-left d-block" v-html="replaceTitleOnCustomHeader(_event[0], index)"></span>
                </div>
                <h4 v-else class="variableTitle">
                  <span :style="{ 'backgroundColor': highlightColor }" :class="'tt'+index">️{{ translateText(_event[0], index, 'title')}}</span>
                </h4>
                <div>"{{ _event[0] }}" –
                  <span :class="'tb'+index">{{ translateText(_event[4], index, 'body')}}</span>
                </div>
                <img :src="_event[1]" class="img-fluid w-50">
                <div>
                  <!--Date-->
                  <span>日期: </span> <strong :style="{ 'backgroundColor': highlightColor }">{{ _event[3] }}</strong>
                </div>
                <div>
                  <!--Address-->
                  <span>地址: </span> {{ _event[2] }}
                </div>
                <div>
                  <!--Price-->
                  <span>价钱: </span> {{ _event[5] }}
                </div>
                <div>
                  <!--Official Website-->
                  <span>官方网站: </span> {{ _event[6] }}
                </div>

                <hr>

              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import Papa from "papaparse";
  import ClipboardJS from "clipboard"
  import Pickr from '@simonwep/pickr';
  import axios from "axios";
  import * as $ from "jquery";
  import {mapGetters, mapActions} from "vuex";

  export default {
    name: "Templates",
    props: {
      api_key: String
    },
    data() {
      return {
        // csvUrl: 'https://shiftdownbucket.s3-us-west-1.amazonaws.com/cvsreader/event-parser-demo.csv',
        // csvUrl: 'https://vue-cvs.dev/_uploads/event-parser-demo.csv',
        yandex: {
          baseUrl: `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${this.api_key}`,
          lang: "&lang=en-zh"
        },
        pickr: '',
        highlightColor: '#FFC107',
        csvData: null,
        storedFileUrls: null,
        selectedFile: '',
        copyFrom: new ClipboardJS('.copyToClipboard'),
        titleSize: 4,
        meta: {
          success: false,
          total: 0
        },
        config: {
          events: {
            'froalaEditor.initialized': function () {
            }
          },
          charCounterCount: true
        },
        errors: {
          headerTemplateError: false,
          headerTemplateSuccess: false,
        },
        toggleCustomHeader: false,
        model: 'Edit Your Content Here!',
        headerTemplate: '<section style="box-sizing: border-box; font-style: normal; font-weight: 400; text-align: justify; font-size: 16px;"><section style="position: static; transform: rotate(0deg); -webkit-transform: rotate(0deg); -moz-transform: rotate(0deg); -o-transform: rotate(0deg); box-sizing: border-box;"><section style="text-align: center; margin: 10px 0%; position: static; box-sizing: border-box;"><section style="display: inline-block; width: auto; vertical-align: top; min-width: 10%; max-width: 100%; height: auto; background-position: 0% 0%; background-repeat: repeat; background-size: auto; background-attachment: scroll; border-style: solid; border-width: 1px; border-radius: 6px; border-color: rgb(62, 62, 62); overflow: hidden; box-shadow: rgb(0, 0, 0) 0px 0px 0px; background-image: url(&quot;https://statics.xiumi.us/stc/images/templates-assets/tpl-paper/image/d2e2a5ddebffcaea31012e371a7363ec-sz_351.png&quot;); box-sizing: border-box;"><section style="margin: 0px 0% 6px; position: static; box-sizing: border-box;"><section style="display: inline-block; width: auto; vertical-align: top; min-width: 10%; max-width: 100%; height: auto; border-style: solid; border-width: 5px; border-radius: 6px; border-color: rgb(255, 255, 255); box-shadow: rgb(0, 0, 0) 0px 1px 0px; background-color: rgb(255, 255, 255); overflow: hidden; box-sizing: border-box;"><section style="position: static; box-sizing: border-box;"><section style="display: inline-block; width: auto; vertical-align: top; min-width: 10%; max-width: 100%; height: auto; box-shadow: rgb(0, 0, 0) 0px 0px 0px; border-width: 0px; border-radius: 4px; border-style: none; border-color: rgb(62, 62, 62); overflow: hidden; background-color: rgb(216, 98, 34); box-sizing: border-box;"><section style="margin: 5px 0%; position: static; box-sizing: border-box;"><section style="text-align: justify; color: rgb(252, 242, 241); padding: 0px 20px; line-height: 1.6; letter-spacing: 0px; box-sizing: border-box;"><p style="white-space: normal; margin: 0px; padding: 0px; box-sizing: border-box;">Autumn Rain Indus leaves</p></section></section></section></section></section></section></section></section></section></section>',
        localHeaderTemplates: [
          `<section style="margin: 10px 0%; position: static; box-sizing: border-box;">
          <section
            style="display: inline-block; width: 100%; vertical-align: top; background-position: 50% 50%; background-repeat: no-repeat; background-size: cover; background-attachment: scroll; border-style: solid; border-width: 1px; border-radius: 0px; border-color: rgb(172, 210, 135); padding: 5px; background-image: url(&quot;https://statics.xiumi.us/stc/images/templates-assets/tpl-paper/image/d720c129dea17f9f7baa1550bd343e6d-sz_416721.jpg?x-oss-process=style/xmorient&quot;); box-sizing: border-box;">
            <section style="position: static; box-sizing: border-box;">
              <section
                style="display: inline-block; width: 100%; vertical-align: top; border-width: 1px; border-radius: 0px; border-style: dashed; border-color: rgb(172, 210, 135); background-color: rgba(255, 255, 255, 0); box-sizing: border-box;">
                <section style="margin: 0px 0%; position: static; box-sizing: border-box;">
                  <section
                    style="font-size: 14px; color: rgb(106, 177, 17); line-height: 1.8; letter-spacing: 1.8px; padding: 0px 10px; box-sizing: border-box;">
                    <p
                      style="text-align: center; white-space: normal; margin: 0px; padding: 0px; box-sizing: border-box;">
                      On that <strong style="box-sizing: border-box;"><span
                      style="font-size: 17px; box-sizing: border-box;">spring</span></strong> day</p></section>
                </section>
                <section style="margin: 0px 0%; position: static; box-sizing: border-box;">
                  <section
                    style="font-size: 14px; color: rgb(106, 177, 17); line-height: 1.8; letter-spacing: 1.8px; padding: 0px 10px; box-sizing: border-box;">
                    <p
                      style="text-align: center; white-space: normal; margin: 0px; padding: 0px; box-sizing: border-box;">
                      On that <strong style="box-sizing: border-box;"><span
                      style="font-size: 17px; box-sizing: border-box;">spring</span></strong> day</p></section>
                </section>
              </section>
            </section>
          </section>
        </section>`,
          `<section style="box-sizing: border-box; font-style: normal; font-weight: 400; text-align: justify; font-size: 16px;"><section style="position: static; transform: rotate(0deg); -webkit-transform: rotate(0deg); -moz-transform: rotate(0deg); -o-transform: rotate(0deg); box-sizing: border-box;"><section style="display: flex; flex-flow: row nowrap; margin: 10px 0%; position: static; box-sizing: border-box;"><section style="display: inline-block; vertical-align: top; width: auto; flex: 0 0 auto; align-self: stretch; min-width: 10%; max-width: 100%; height: auto; background-color: rgb(17, 112, 243); box-sizing: border-box;"><section style="margin: 6px 0% 0px; position: static; box-sizing: border-box;"><section style="font-size: 14px; color: rgb(255, 255, 255); line-height: 1; letter-spacing: 2px; padding: 0px 15px; box-sizing: border-box;"><p style="white-space: normal; margin: 0px; padding: 0px; box-sizing: border-box;"><strong style="box-sizing: border-box;">Epidemic Alert &nbsp;&nbsp;</strong><span style="font-size: 12px; box-sizing: border-box;">February 03, 2020</span></p></section></section></section><section style="display: inline-block; vertical-align: top; width: 30px; align-self: stretch; flex: 0 0 auto; height: auto; line-height: 0; letter-spacing: 0px; box-sizing: border-box;"><section style="text-align: left; margin: 0px 0%; justify-content: flex-start; position: static; box-sizing: border-box;"><section style="max-width: 100%; vertical-align: middle; display: inline-block; line-height: 0; width: 60%; height: auto; box-sizing: border-box;"><br></section></section></section></section></section></section>`
        ],
      }
    },
    methods: {
      ...mapActions(['queueCsvTemplateFiles', 'deleteStoredFile']),
      ...mapGetters(['returnAllStoredCsvUploadUrls']),
      hasCommand(command) {
        /*
        * Update csv url
        * Download and parse file
        * Generate live file template
        * Display generated live template
        * */
        console.warn('hasCommand ', command);
        this.selectedFile = command;
        this.parseCsvFile(command);
      },
      parseCsvFile: function (_url) {
        const that = this;
        Papa.parse(_url, {
          download: true,
          complete: function (results) {
            results.data.shift(); // Remove first element which is the header fields.

            /* TODO Convert the array to an Array of Objects */

            that.meta.total = results.data.length;
            that.meta.success = true;
            that.csvData = results.data;
            that.model = '';
            results.data.forEach( (_event, index) => {
              const defaultHighlightedTitle =
                `<h4 class="variableTitle"><span class="tt${index}" style="background-color: ${that.highlightColor}">️${_event[0]}</span></h4>`;
              const showCustomHeader = (that.toggleCustomHeader) ? that.replaceTitleOnCustomHeader(_event[0], index) : defaultHighlightedTitle;
              that.model += `<div class="col-12 mb-3">
                    ${showCustomHeader}
                    <div>${_event[0]} –
                      <span class="tb${index}">${ that.translateText(_event[4], index, 'body')}</span>
                    </div>
                    <img src="${_event[1]}" class="img-fluid w-50">
                    <div>
                      <span>日期: </span> <strong style="background-color: ${that.highlightColor}">${_event[3]}</strong>
                    </div>
                    <div>
                      <span>地址: </span> ${_event[2]}
                    </div>
                    <div>
                      <span>价钱: </span> ${_event[5]}
                    </div>
                    <div>
                      <span>官方网站: </span> ${_event[6]}
                    </div>

                    <hr>

                  </div>`
            })
          }
        });
      },
      updateTitleSize(value) {
        const _updatedValue = value === 0 ? 1 : value;
        const tagAndSize = `<h${ _updatedValue } class="variableTitle"></h${_updatedValue}`;
        $('.variableTitle').contents().unwrap().wrap(tagAndSize);

      },
      copyToEditor() {
        this.model = 'Copied something'
      },
      replaceTitleOnCustomHeader(_eventTitle, index) {
        const _mutated =
          `<p class="variableTitle" style="white-space: normal; margin: 0px; padding: 0px; box-sizing: border-box;"><strong style="box-sizing: border-box;" class="tt${index}">${this.translateText(_eventTitle, index, 'title')}</strong></p>`;
        return this.headerTemplate.slice().replace(/https/g, 'http').replace(/<p( *\w+=("[^"]*"|'[^']'|[^ >]))*>(.*)<\/p>/g, _mutated);
      },
      synchronizeEditor() {
        this.parseCsvFile(this.selectedFile);
      },
      async deleteFilePermanently() {
        const fileWithUrl = this.selectedFile;
        const _file = this.selectedFile.slice().split('/');
        const filePath = _file[3] + '/' + _file[4];

        await this.deleteStoredFile({fileWithUrl, filePath});

        this.storedFileUrls = this.returnAllStoredCsvUploadUrls();
      },
      async translateText(text, index, titleOrBody) {
        axios.post(`${this.yandex.baseUrl}&text=${text}${this.yandex.lang}`).then( result => {
          switch(titleOrBody){
            case 'title':
              $(`.tt${index}`).text(result.data.text[0]);
              break;
            case 'body':
              $(`.tb${index}`).text(result.data.text[0]);
              break;
          }
        })
      }
    },
    computed: {
      ...mapGetters(['returnIntro']),
    },
    watch: {
      headerTemplate: function () {
        /*
        * ✅ Check if the item is empty
        * Grabs the current graphic inside the Froala box
        * Add unique ID
        * Dispatch element to Vuex to store
        * */
        if (this.headerTemplate === ''){
          this.errors.headerTemplateError = true;
          this.errors.headerTemplateSuccess = false;
          return;
        }
        // Update HTTPS to HTTP for pasted in templates
        this.headerTemplate = this.headerTemplate.slice().replace(/https/g, 'http');

        // Reset error alert
        this.errors.headerTemplateError = false;
        this.errors.headerTemplateSuccess = true;
      }
    },
    async created() {
      await this.queueCsvTemplateFiles();
      this.storedFileUrls = this.returnAllStoredCsvUploadUrls();
    },
    mounted(){
      this.pickr = Pickr.create({
        el: '.color-picker',
        theme: 'monolith', // or 'monolith', or 'nano'
        components: {

          // Main components
          preview: true,
          opacity: true,
          hue: true,

          // Input / output Options
          interaction: {
            hex: true,
            input: true,
            clear: true
          }
        }
      });
      this.pickr.on('change', (color, instance) => {
        $('.pcr-button').css("color", color.toHEXA().toString());
        this.highlightColor = color.toHEXA().toString();
      });
    }
  }
</script>

<style scoped>

</style>
