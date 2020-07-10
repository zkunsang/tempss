<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
    <v-overlay :value="uploading">
      <v-progress-circular
        v-if="this.insertList.length"
        :rotate="-90"
        :size="100"
        :width="15"
        :value="insertProgress"
        color="primary"
      >
        신규 {{ insertProgress }}
      </v-progress-circular>

      <v-progress-circular
        v-if="this.updateList.length"
        :rotate="-90"
        :size="100"
        :width="15"
        :value="updateProgress"
        color="teal"
      >
        업데이트 {{ updateProgress }}
      </v-progress-circular>
    </v-overlay>
    <v-container>
      <v-file-input multiple label="File input" @change="onFileUpload"></v-file-input>
    </v-container>
    <v-container v-if="updateList.length">
      업데이트 리스트
      <v-chip v-for="item in updateList" :key="item.resourceId" color="blue">
        <v-avatar left class="blue darken-4">{{item.version}}</v-avatar>
        {{item.resourceId}}
        <v-icon right>{{item.vicon}}</v-icon>
      </v-chip>
    </v-container>
    <v-container v-if="insertList.length">
      신규 리스트
      <v-chip v-for="item in insertList" :key="item.resourceId" color="green">
        <v-avatar left class="green darken-4">{{item.version}}</v-avatar>
        {{item.resourceId}}
        <v-icon right>{{item.vicon}}</v-icon>
      </v-chip>
    </v-container>
    <v-container v-if="invalidList.length">
      잘못된 파일 리스트
      <v-chip v-for="item in invalidList" :key="item.resourceId" color="red">
        {{item.resourceId}}
        <v-icon right>{{item.vicon}}</v-icon>
      </v-chip>
    </v-container>
    <v-container v-if="crcConflictList.length">
      crc_conflict 리스트
      <v-chip v-for="item in crcConflictList" :key="item.resourceId" color="dark gray">
        {{item.resourceId}}
        <v-icon right>{{item.vicon}}</v-icon>
      </v-chip>
    </v-container>
    <v-container v-if="updateList.length || insertList.length">
      <v-btn @click="uploadFile">업로드</v-btn>
    </v-container>
      
      <v-data-table
        :headers="headers"
        :items="resourceList"
        :search="search"
        sort-by="update_date"
        class="elevation-1"
      >
        <template v-slot:item.resourceId="{ item }">
          <a :href="`aos/${item.url}`">{{item.resourceId}}</a>
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
const {s3Upload, readFileAsync} = require("../util/fileutil");

var crc = require('crc');

export default {
  name: 'AosUpload',
  data() {
    return {
      search: '',
      uploading: false,
      overlay: false,
      updateProgress: 0,
      insertProgress: 0,
      resourceList: [],
      arrangedResourceObject: null,
      arrangedResourceObjectCrc32: null,
      updateList: [],
      insertList: [],
      invalidList: [],
      crcConflictList: [],
      dialog: false,
      headers: [
        { text: '아이디', value: 'resourceId' },
        { text: 'version', value: 'version' },
        { text: 'size', value: 'size' },
        { text: 'crc32', value: 'crc32' },
        { text: 'updateDate', value: 'updateDate' },
        { text: 'patchVersion', value: 'patchVersion' },
      ],
      editedItem: {}
    }
  },
  created() {
    if(this.storyData.storyCode) {
      console.log('aosUpload: ', this.storyData);
      this.getList();
    }
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
    storyData() {
      this.getList();
    }
  },
  props: ['storyData'],
  methods: {
    ...mapActions([
      'GET_AOS_RESOURCE',
      'UPDATE_AOS_RESOURCE'
    ]),
    async s3Uploads(list) {
      for(let i in list) {
        let item = list[i];
        
        item.storyId = this.storyData.storyId;
        await s3Upload(item.file, `${this.storyData.storyId}/aos/${item.version}/${item.resourceId}`);
        this.updateProgress = parseInt(( parseInt(i) + 1 ) / list.length * 100);
        delete item.file;
      }
      
    },
    async uploadFile() {
      this.uploading = true;
      this.updateProgress = 0;
      this.insertProgress = 0;
      
      await this.s3Uploads(this.updateList);
      await this.s3Uploads(this.insertList);

      this.UPDATE_AOS_RESOURCE({
          insertList: this.insertList, 
          updateList: this.updateList, 
          storyId: this.storyId
        }).then(() => {
          this.uploading = false;
          this.getList();
        })
    },
    getList() {
      this.updateList = [];
      this.insertList = [];
      this.invalidList = [];
      this.crcConflictList = [];
      this.$nextTick(() => {
        this.GET_AOS_RESOURCE(this.storyData.storyId)
        .then((result) => {
          this.resourceList = result;
          this.arrangedResourceObject =  _.keyBy(this.resourceList, "resourceId");
          this.arrangedResourceObjectCrc32 = _.keyBy(this.resourceList, "crc32");
        });
      })
    },
    async onFileUpload(fileList) {
      console.log("onFileUpload");
      this.updateList = [];
      this.insertList = [];
      this.invalidList = [];
      this.crcConflictList = [];

      let tempConflictList = [];
      let tempInvalidList = [];
      let tempInsertList = [];
      let tempUpdateList = [];

      for( var i in fileList) {
        let fileObject = {}
        
        let file = fileList[i]
        fileObject.file = file
        
        let resourceId = file.name;
        fileObject.resourceId = resourceId;

        // let fileType = id.split("_")[0]
        
        // if( fileType == "image") {fileObject.type = "IMAGE"; fileObject.vicon="mdi-image";}
        // else if( fileType == "sound") {fileObject.type = "SOUND"; fileObject.vicon="mdi-music-note";}
        // else if( fileType == "xml") {fileObject.type = "XML"; fileObject.vicon="mdi-xml";}
        // else if( fileType == "illust") {fileObject.type = "ILLUST"; fileObject.vicon="mdi-alpha-i-circle-outline";}
        // else if( fileType == "title") {fileObject.type = "TITLE"; fileObject.vicon="mdi-format-title";}
        // else if( fileType == "common") {fileObject.type = "COMMON"; fileObject.vicon="mdi-alpha-c-circle-outline";}
        // else if( fileType == "intro") {fileObject.type = "INTRO"; fileObject.vicon="mdi-debug-step-into";}
        // else if( fileType == "detail") {fileObject.type = "DETAIL"; fileObject.vicon="mdi-details";}
        // else if( fileType == "illustthumb") {fileObject.type = "ILLUST_THUMB"; fileObject.vicon="mdi-alpha-i-circle";}
        // else if( fileType == "branch") {fileObject.type = "BRANCH"; fileObject.vicon="mdi-source-branch";}
        // else {
        //   fileObject.type = "INVALID_TYPE"
        //   fileObject.vicon="mdi-alert-circle"
        //   tempInvalidList.push(fileObject);
        //   continue;
        // }

        let file_buffer = await readFileAsync(file);
        fileObject.crc32 = crc.crc32(file_buffer).toString(16);
        fileObject.size = file.size;

        let crcFile = this.arrangedResourceObjectCrc32[fileObject.crc32];
        if (crcFile) {
          fileObject.vicon = "mdi-emoticon-confused"
          tempConflictList.push(fileObject)
          continue;
        }

        let updateFile = this.arrangedResourceObject[fileObject.resourceId];

        if(updateFile) {
          fileObject.version = updateFile.version + 1
          tempUpdateList.push(fileObject);
          continue;
        }

        fileObject.version = 1;
        tempInsertList.push(fileObject)
      }
      this.invalidList = tempInvalidList;
      this.insertList = tempInsertList;
      this.updateList = tempUpdateList;
      this.crcConflictList = tempConflictList;
    },
  }
};
</script>
