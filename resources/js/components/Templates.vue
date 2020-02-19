<template>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <h3>{{ returnIntro }}</h3>
                <h6>Additional options and settings here. Also the final export button.</h6>
            </div>
            <div class="col-6">
                <div v-for="ev in csvData">
                    {{ ev[0] }}
                </div>
            </div>
            <div class="col-6">
                Live template here ...
            </div>
        </div>
    </div>
</template>

<script>
  import Papa from "papaparse";
  import { mapGetters } from "vuex";
  export default {
    name: "Templates",
    computed: {
      ...mapGetters(['returnIntro'])
    },
    created(){
      // console.warn(this.csvUrl);
      // Papa.parse(this.csvUrl, {
      //   download: true,
      //   step: function(row) {
      //     console.log("Row:", row.data);
      //   },
      //   complete: function(results) {
      //     console.log("All done!");
      //     // console.log(this.csvData)
      //     console.log(results);
      //     console.log(results.data)
      //   }
      // });
      const that = this;
      Papa.parse(this.csvUrl, {
        download: true,
        complete: function(results) {
          console.log(results.errors);
          console.log(results.data);
          results.data.shift(); // Remove first element which is the header fields.
          that.csvData = results.data;
        }
      });
    },
    data(){
      return {
        csvUrl: 'https://shiftdownbucket.s3-us-west-1.amazonaws.com/cvsreader/event-parser-demo.csv',
        // csvUrl: 'https://vue-cvs.dev/_uploads/event-parser-demo.csv',
        csvData: null
      }
    }
  }
</script>

<style scoped>

</style>
