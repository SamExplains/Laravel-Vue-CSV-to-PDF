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
      </div>
      <div class="col-6">
        <!--Header template and Header dropdown-->
        <span class="demonstration font-weight-bold d-block">Select a saved Header template</span>
        <el-dropdown @command="hasCommand">
                <span class="el-dropdown-link">
                  Selectable saved Headers<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(lht, index) in localHeaderTemplates" :key="index">
              <span v-html="lht"></span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <span class="demonstration font-weight-bold d-block mt-3">Save a new Header template</span>
        <froala :tag="'textarea'" :config="config" v-model="headerTemplate" />
        <el-button type="success" class="float-right mt-2">Save new Header</el-button>

      </div>
      <div class="col-6 mt-2">
        <span class="demonstration font-weight-bold d-block">Stored Event Files</span>
        <el-dropdown @command="hasCommand">
                <span class="el-dropdown-link">
                  Selectable saved files<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(url,index) in storedFileUrls" :key="index" :command="url">{{ url }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

<!--        <span class="demonstration font-weight-bold d-block mt-2">Current selected file</span>-->
<!--        <span v-show="selectedFile">{{selectedFile}} <el-button type="danger">Delete</el-button> </span>-->

        <el-alert
          v-show="meta.success"
          class="mt-3"
          :title='`File has generated a total of ${meta.total} events`'
          type="success"
          close-text="Gotcha">
        </el-alert>

      </div>
      <div class="col-6 bg-white">
        <div class="row p-2">
          <div class="col-10 my-auto">
            Event(s) template will be generated below
          </div>
          <div class="col-2">
            <el-button class="copyToClipboard float-right" data-clipboard-action="copy"
                       data-clipboard-target="#event_data">Copy
            </el-button>
          </div>
        </div>
      </div>

      <!--WYSIWYG Editor-->
      <div class="col-6 mt-2" id="CustomWeChatHeader">
        <froala :tag="'textarea'" :config="config" v-model="model" />
      </div>

      <!--Generated Events Content-->
      <div class="col-6 bg-white overflow-auto" style="max-height: 65vh">

        <div class="row mt-2" id="event_data">
          <div class="col-12">
            <section style="margin: 10px 0%; position: static; box-sizing: border-box;">
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
            </section>
          </div>
          <div class="col-12 mb-3" v-for="(_event, index) in csvData" :key="index">
            <h4 class="variableTitle">
              <span :style="{ 'backgroundColor': highlightColor }">️{{ _event[0] }}</span>
            </h4>
            <div>{{ _event[0] }} – {{ _event[4] }}</div>
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
</template>

<script>
  import Papa from "papaparse";
  import ClipboardJS from "clipboard"
  import Pickr from '@simonwep/pickr';
  import * as $ from "jquery";
  import {mapGetters, mapActions} from "vuex";

  export default {
    name: "Templates",
    data() {
      return {
        // csvUrl: 'https://shiftdownbucket.s3-us-west-1.amazonaws.com/cvsreader/event-parser-demo.csv',
        // csvUrl: 'https://vue-cvs.dev/_uploads/event-parser-demo.csv',
        pickr: '',
        highlightColor: '#FFC107',
        csvUrl: null,
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
              console.log('initialized')
            }
          },
          charCounterCount: true
        },
        model: 'Edit Your Content Here!',
        headerTemplate: `<section style="margin: 10px 0%; position: static; box-sizing: border-box;">
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
        ]
      }
    },
    methods: {
      ...mapActions(['queueCsvTemplateFiles']),
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
            console.log(results.errors);
            console.log(results.data);
            results.data.shift(); // Remove first element which is the header fields.

            /* TODO Convert the array to an Array of Objects */

            that.meta.total = results.data.length;
            that.meta.success = true;
            that.csvData = results.data;
            that.model = '';
            results.data.forEach( _event => {
              console.log('Foreach Hihghlight Color is ', that.highlightColor)
              that.model += `<div class="col-12 mb-3">
                    <h4 class="variableTitle">
                      <span style="background-color: ${that.highlightColor}">️${_event[0]}</span>
                    </h4>
                    <div>${_event[0]} – ${_event[4]}</div>
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
        console.warn('updateTitleSize ', value);
        const _updatedValue = value === 0 ? 1 : value;
        const tagAndSize = `<h${ _updatedValue } class="variableTitle"></h${_updatedValue}`;
        $('.variableTitle').contents().unwrap().wrap(tagAndSize);

      },
      copyToEditor() {
        this.model = 'Copied something'
      }
    },
    computed: {
      ...mapGetters(['returnIntro']),
    },
    watch: {
      headerTemplate: function () {
      console.warn(this.headerTemplate);
      }
    },
    async created() {
      await this.queueCsvTemplateFiles();
      console.log('OK to retrieve');
      this.storedFileUrls = this.returnAllStoredCsvUploadUrls();
      console.log('Stored File URLS', this.storedFileUrls);
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
