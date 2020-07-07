<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
    <v-icon right>mdi-xml</v-icon>xml
    <v-icon right>mdi-music-note</v-icon>사운드
    <v-icon right>mdi-thumb-up-outline</v-icon>썸네일
    <v-icon right>mdi-format-title</v-icon>타이틀
    <v-icon right>mdi-image</v-icon>이미지
    <v-icon right>mdi-alpha-i-circle-outline</v-icon>일러스트
    <v-icon right>mdi-alpha-c-circle-outline</v-icon>Common
    <v-icon right>mdi-debug-step-into</v-icon>인트로
    <v-icon right>mdi-details</v-icon>디테일
    <v-icon right>mdi-source-branch</v-icon>브랜치

    <v-overlay :value="uploading">
      <v-progress-circular
        v-if="this.insert_list.length"
        :rotate="-90"
        :size="100"
        :width="15"
        :value="insert_progress"
        color="primary"
      >
        신규 {{ insert_progress }}
      </v-progress-circular>

      <v-progress-circular
        v-if="this.update_list.length"
        :rotate="-90"
        :size="100"
        :width="15"
        :value="update_progress"
        color="teal"
      >
        업데이트 {{ update_progress }}
      </v-progress-circular>
    </v-overlay>
    <v-container>
      <v-file-input multiple label="File input" @change="onFileUpload"></v-file-input>
    </v-container>
    <v-container v-if="update_list.length">
      업데이트 리스트
      <v-chip v-for="item in update_list" :key="item.id" color="blue">
        <v-avatar left class="blue darken-4">{{item.version}}</v-avatar>
        {{item.id}}
        <v-icon right>{{item.vicon}}</v-icon>
      </v-chip>
    </v-container>
    <v-container v-if="insert_list.length">
      신규 리스트
      <v-chip v-for="item in insert_list" :key="item.id" color="green">
        <v-avatar left class="green darken-4">{{item.version}}</v-avatar>
        {{item.id}}
        <v-icon right>{{item.vicon}}</v-icon>
      </v-chip>
    </v-container>
    <v-container v-if="invalid_list.length">
      잘못된 파일 리스트
      <v-chip v-for="item in invalid_list" :key="item.id" color="red">
        {{item.id}}
        <v-icon right>{{item.vicon}}</v-icon>
      </v-chip>
    </v-container>
    <v-container v-if="crc_conflict_list.length">
      crc_conflict 리스트
      <v-chip v-for="item in crc_conflict_list" :key="item.id" color="dark gray">
        {{item.id}}
        <v-icon right>{{item.vicon}}</v-icon>
      </v-chip>
    </v-container>
    <v-container v-if="update_list.length || insert_list.length">
      <v-btn @click="uploadFile">업로드</v-btn>
    </v-container>
      
      <v-data-table
        :headers="headers"
        :items="resource_list"
        :search="search"
        sort-by="calories"
        class="elevation-1"
      >
        <template v-slot:item.id="{ item }">
          <a :href="`${s3_url}android/${item.url}`">{{item.id}}</a>
        </template>
        
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Aos</v-toolbar-title>
            
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary">Reset</v-btn>
        </template>
      </v-data-table>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import _ from 'lodash'
const {s3_upload, readFileAsync} = require("../util/fileutil");

var crc = require('crc');

export default {
  name: 'PayItemInfo',
  data() {
    return {
      s3_aos_url: '',
      search: '',
      uploading: false,
      overlay: false,
      update_progress: 0,
      insert_progress: 0,
      resource_list: [],
      arranged_resource_object: null,
      arranged_resource_object_crc32: null,
      update_list: [],
      insert_list: [],
      invalid_list: [],
      crc_conflict_list: [],
      dialog: false,
      headers: [
        { text: '아이디', value: 'id' },
        { text: 'version', value: 'version' },
        { text: 'type', value: 'type' },
        { text: 'size', value: 'size' },
        { text: 'crc32', value: 'crc32' },
        { text: 'update_date', value: 'update_date' },
        { text: 'patch_version', value: 'patch_version' },
      ],
      editedItem: {}
    }
  },
  created() {
    this.fetch_list()
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
  },
  methods: {
    ...mapActions([
      'FETCH_AOS_RESOURCE',
      'UPDATE_AOS_RESOURCE'
    ]),
    async uploadFile() {
      this.uploading = true;
      this.update_progress = 0;
      this.insert_progress = 0;
      
      for(var i in this.update_list) {
        let update_file = this.update_list[i]
        await s3_upload(update_file.file, `android/${update_file.id}`)
        this.update_progress = parseInt(( parseInt(i) + 1 ) / this.update_list.length * 100);
      }

      for(var j in this.insert_list) {
        let insert_file = this.insert_list[j]
        await s3_upload(insert_file.file, `android/${insert_file.id}`)
        this.insert_progress = parseInt((parseInt(j) + 1) / this.insert_list.length * 100) ;
      }
      this.UPDATE_AOS_RESOURCE({insert_list: this.insert_list, update_list: this.update_list})
        .then(() => {
          this.uploading = false;
          this.fetch_list();
          
        })
    },
    fetch_list() {
      this.update_list = [];
      this.insert_list = [];
      this.invalid_list = [];
      this.crc_conflict_list = [];
      this.$nextTick(() => {
        this.FETCH_AOS_RESOURCE(this.seq_title)
        .then((body_data) => {
          this.resource_list = body_data.resource_list;
          this.s3_url = body_data.s3_url;
          this.arranged_resource_object =  _.keyBy(this.resource_list, "id")
          this.arranged_resource_object_crc32 = _.keyBy(this.resource_list, "crc32")
        });
      })
    },
    async onFileUpload(file_list) {
      console.log("onFileUpload");
      this.update_list = [];
      this.insert_list = [];
      this.invalid_list = [];
      this.crc_conflict_list = [];

      let temp_conflict_list = [];
      let temp_invalid_list = [];
      let temp_insert_list = [];
      let temp_update_list = [];
      for( var i in file_list) {
        let file_object = {}
        
        let file = file_list[i]
        file_object.file = file
        
        let id = file.name;
        file_object.id = id;

        let file_type = id.split("_")[0]
        
        if( file_type == "image") {file_object.type = "IMAGE"; file_object.vicon="mdi-image";}
        else if( file_type == "sound") {file_object.type = "SOUND"; file_object.vicon="mdi-music-note";}
        else if( file_type == "xml") {file_object.type = "XML"; file_object.vicon="mdi-xml";}
        else if( file_type == "illust") {file_object.type = "ILLUST"; file_object.vicon="mdi-alpha-i-circle-outline";}
        else if( file_type == "title") {file_object.type = "TITLE"; file_object.vicon="mdi-format-title";}
        else if( file_type == "common") {file_object.type = "COMMON"; file_object.vicon="mdi-alpha-c-circle-outline";}
        else if( file_type == "intro") {file_object.type = "INTRO"; file_object.vicon="mdi-debug-step-into";}
        else if( file_type == "detail") {file_object.type = "DETAIL"; file_object.vicon="mdi-details";}
        else if( file_type == "illustthumb") {file_object.type = "ILLUST_THUMB"; file_object.vicon="mdi-alpha-i-circle";}
        else if( file_type == "branch") {file_object.type = "BRANCH"; file_object.vicon="mdi-source-branch";}
        else {
          file_object.type = "INVALID_TYPE"
          file_object.vicon="mdi-alert-circle"
          temp_invalid_list.push(file_object);
          continue;
        }

        let file_buffer = await readFileAsync(file);
        file_object.crc32 = crc.crc32(file_buffer).toString(16);
        file_object.size = file.size;

        let crc_file = this.arranged_resource_object_crc32[file_object.crc32] 
        if (crc_file) {
          file_object.vicon = "mdi-emoticon-confused"
          temp_conflict_list.push(file_object)
          continue;
        }

        let update_file = this.arranged_resource_object[file_object.id];

        if(update_file) {
          file_object.version = update_file.version + 1
          temp_update_list.push(file_object);
          continue;
        }

        file_object.version = 1;
        temp_insert_list.push(file_object)
      }
      this.invalid_list = temp_invalid_list;
      this.insert_list = temp_insert_list;
      this.update_list = temp_update_list;
      this.crc_conflict_list = temp_conflict_list;
    },
  }
};
</script>
