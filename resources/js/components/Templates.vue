<template>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <h3>{{ returnIntro }}</h3>
                <h6>Additional options and settings here. Also the final export button.</h6>
                Additional settings include Shapes, Background Title Shapes & SVG Paths and the Date background color
              <div>Also add a copy all information from this container button for easier and faster</div>

            </div>
            <div class="col-6">
              <el-dropdown @command="hasCommand">
                <span class="el-dropdown-link">
                  Selectable saved files<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown" >
                  <el-dropdown-item v-for="(url,index) in storedFileUrls" :key="index" :command="url">{{ url }}</el-dropdown-item>
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
            <div class="col-6">
                Live template here ...

              <div class="row mt-4">
                <div class="col-12 mb-3" v-for="(_event, index) in csvData" :key="index">
                    <h4>{{ _event[0] }}</h4>
                    <p>{{ _event[0] }} – {{ _event[4] }}</p>
                    <img :src="_event[1]" class="img-fluid" alt="">
                    <div>
                      <span>Date: </span> {{ _event[3] }}
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
                </div>
              </div>

            </div>
        </div>
    </div>
</template>

<script>
  import Papa from "papaparse";
  import { mapGetters, mapActions } from "vuex";
  export default {
    name: "Templates",
    data(){
      return {
        // csvUrl: 'https://shiftdownbucket.s3-us-west-1.amazonaws.com/cvsreader/event-parser-demo.csv',
        // csvUrl: 'https://vue-cvs.dev/_uploads/event-parser-demo.csv',
        csvUrl: null,
        csvData: null,
        storedFileUrls: null,
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
          complete: function(results) {
            console.log(results.errors);
            console.log(results.data);
            results.data.shift(); // Remove first element which is the header fields.

            /* TODO Convert the array to an Array of Objects */

            that.meta.total = results.data.length;
            that.meta.success = true;
            that.csvData = results.data;
          }
        });
      }
    },
    computed: {
      ...mapGetters(['returnIntro']),
    },
    async created(){
      await this.queueCsvTemplateFiles();
      console.log('OK to retrieve');
      this.storedFileUrls = this.returnAllStoredCsvUploadUrls();
      console.log('Stored File URLS', this.storedFileUrls)
    }
  }
</script>

<style scoped>

</style>
