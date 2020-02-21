<template>
    <div class="container">
        <div class="row">
            <div class="col-5 text-center">

              <el-upload
                class="upload-demo"
                drag
                :data="{_token: csrf}"
                action="/upload"
                name="file_upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-change="handleChange"
                :on-success="handleSuccess"
                :file-list="fileList"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
                <div class="el-upload__tip" slot="tip">jpg/png files with a size less than 500kb</div>
              </el-upload>
            </div>
            <div class="col-7">
                <el-alert v-show="errors.success"
                    title="Success! Your file has been uploaded. Use the Template tab to work with your files."
                    type="success">
                </el-alert>
                <el-alert v-show="errors.error"
                    title="Error! Your item could not be uploaded. Try again."
                    type="error">
                </el-alert>
                <el-alert
                    v-show="errors.invalid"
                    title="Invalid file type uploaded."
                    type="warning">
                </el-alert>
            </div>
        </div>
    </div>

</template>

<script>
import axios from "axios";
import {mapActions} from "vuex";
  export default {
    name: "FileUpload",
    props: {
      _t: String
    },
    mounted(){
      console.warn(typeof this._t, ' ------ ', this._t);
    },
    data(){
      return {
        csrf: document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        fileList: [],
        file: '',
        errors: {
          success: '',
          invalid: '',
          error: ''
        }
      }
    },
    methods: {
      ...mapActions(['storeNewFileDetails']),
      handlePreview(file) {
        console.log(this.fileList)
      },
      handleRemove() {
        console.log('handleRemove')
      },
      handleChange(file) {
        console.log('handleChange', file);
      },
      handleSuccess(res) {
        console.log('handleSuccess');
        console.log(res);
        switch (res.status) {
          case 201:
            /*
            * Store filename and file URL inside store for Templates page
            * */
            console.log(res.data.filename);
            console.log(res.data.url);
            this.storeNewFileDetails({ filename: res.data.filename, url: res.data.url });
            this.errors.success = res.status === 201;
            break;
          case 400:
            this.errors.invalid = res.status === 400;
            break;
          case 500:
            this.errors.error = res.status === 500;
              break;

        }

      }
    }
  }
</script>

<style scoped>

</style>
