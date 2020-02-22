<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h3>{{ returnIntro }}</h3>
        <h6>Additional options and settings here. Also the final export button.</h6>

        <div class="block d-block w-50">
          <span class="demonstration font-weight-bold">Adjust event title size 1: Largest 6: Smallest</span>
          <el-slider
            v-model="titleSize"
            :step="1"
            :min="1"
            :max="6"
            @input="updateTitleSize"
            show-stops>
          </el-slider>

          <div class="color-picker"></div>

        </div>

      </div>
      <div class="col-6">
        <el-dropdown @command="hasCommand">
                <span class="el-dropdown-link">
                  Selectable saved files<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(url,index) in storedFileUrls" :key="index" :command="url">{{ url }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

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

      <!--Generated Events Content-->
      <div class="col-6 offset-6 bg-white overflow-auto" style="max-height: 65vh">

        <div class="row mt-2" id="event_data">
          <div class="col-12 mb-3" v-for="(_event, index) in csvData" :key="index">
            <!--<code><h4>{{ _event[0] }}</h4></code>-->
            <h4 class="variableTitle">
              <span style="color: rgb(0, 0, 0); background-color: #FAC51C">️{{ _event[0] }}</span>
            </h4>
            <p>{{ _event[0] }} – {{ _event[4] }}</p>
            <img :src="_event[1]" class="img-fluid w-50">
            <div>
              <span>Date: </span> <strong>{{ _event[3] }}</strong>
            </div>
            <div>
              <span>Address: </span> {{ _event[2] }}
            </div>
            <div>
              <span>Price: </span> {{ _event[5] }}
            </div>
            <div>
              <span>Official Website: </span> {{ _event[6] }}
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
        csvUrl: null,
        csvData: null,
        storedFileUrls: null,
        copyFrom: new ClipboardJS('.copyToClipboard'),
        titleSize: 4,
        meta: {
          success: false,
          total: 0
        }
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
          }
        });
      },
      updateTitleSize(value) {
        console.warn('updateTitleSize ', value);
        const _updatedValue = value === 0 ? 1 : value;
        const tagAndSize = `<h${ _updatedValue } class="variableTitle"></h${_updatedValue}`;
        $('.variableTitle').contents().unwrap().wrap(tagAndSize);

      }
    },
    computed: {
      ...mapGetters(['returnIntro']),
    },
    async created() {
      await this.queueCsvTemplateFiles();
      console.log('OK to retrieve');
      this.storedFileUrls = this.returnAllStoredCsvUploadUrls();
      console.log('Stored File URLS', this.storedFileUrls)

      this.pickr = Pickr.create({
        el: '.color-picker',
        theme: 'monolith', // or 'monolith', or 'nano'

        swatches: [
          'rgba(244, 67, 54, 1)',
          'rgba(233, 30, 99, 0.95)',
          'rgba(156, 39, 176, 0.9)',
          'rgba(103, 58, 183, 0.85)',
          'rgba(63, 81, 181, 0.8)',
          'rgba(33, 150, 243, 0.75)',
          'rgba(3, 169, 244, 0.7)',
          'rgba(0, 188, 212, 0.7)',
          'rgba(0, 150, 136, 0.75)',
          'rgba(76, 175, 80, 0.8)',
          'rgba(139, 195, 74, 0.85)',
          'rgba(205, 220, 57, 0.9)',
          'rgba(255, 235, 59, 0.95)',
          'rgba(255, 193, 7, 1)'
        ],

        components: {

          // Main components
          preview: true,
          opacity: true,
          hue: true,

          // Input / output Options
          interaction: {
            hex: true,
            rgba: true,
            hsla: true,
            hsva: true,
            cmyk: true,
            input: true,
            clear: true,
            save: true
          }
        }
      });

    }
  }
</script>

<style scoped>

</style>
