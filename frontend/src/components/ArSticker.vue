<template>
  <v-container>
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
    <v-container v-if="conflictList.length">
      crc_conflict 리스트
      <v-chip v-for="item in conflictList" :key="item.resourceId" color="dark gray">
        {{item.resourceId}}
        <v-icon right>{{item.vicon}}</v-icon>
      </v-chip>
    </v-container>
    <v-container v-if="updateList.length || insertList.length">
      <v-btn @click="uploadFile">업로드</v-btn>
    </v-container>
    <v-layout
      text-center
      wrap
    >
      <v-data-table
        dense
        :headers="headers"
        :items="resourceList"
        sort-by="resourceId"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Ar sticker 리소스</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary">Reset</v-btn>
        </template>
      </v-data-table>
      <v-row>
        <v-col>
          <v-file-input multiple label="리소스 데이터" @change="onFileUpload"></v-file-input>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-btn @click="exportCSVResource">리소스 데이터(csv)</v-btn>
          <v-file-input accept=".csv" label="리소스 데이터(csv)" @change="importCSVResource"></v-file-input>
        </v-col>
      </v-row>

    </v-layout>
  </v-container>
</template>
<script src="xlsx.full.min.js"></script>
<script src="js/jhxlsx.js"></script>

<script>

import { mapActions, mapState } from 'vuex';
import _ from 'lodash'

const no_image = require(`../assets/no_image.jpg`);
import config from '../../src/config/config';

var crc = require('crc');
const { s3Upload, onFileDelimiter, importCSV, exportCSV } = require('../util/fileutil');
const { updateDataTable } = require('../util/dataTableUtil');

const tableId = 'arSticker';

export default {
  name: 'resourceList',
  data() {
    return {
      insertProgress: 0,
      updateProgress: 0,
      uploading: false,
      resourceList: [],
      updateList: [],
      insertList: [],
      
      conflictList: [],
      headers: [
        { text: 'resourceId', value: 'resourceId' },
        { text: 'crc32', value: 'crc32' },
        { text: 'size', value: 'size' },
        { text: 'version', value: 'version' },
        { text: 'updateDate', value: 'updateDate' },
      ],
    }
  },
  async created() {
    await this.refreshResourceList();
  },
  computed: {
    ...mapState({
        CDN_URL: 'CDN_URL'
    }),
  },
  watch: {},
  methods: {
    ...mapActions([
      'LIST_ARSTICKER_RESOURCE',
      'UPDATE_ARSTICKER_RESOURCE',
      'UPDATE_TABLE_VERSION',
      'GET_TABLE_VERSION'
    ]),
    async s3Uploads(list) {
      for(let i in list) {
        let item = list[i];

        item.storyId = this.storyId;
        
        await s3Upload(item.file, `ARSticker/${item.version}/${item.resourceId}`);
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

      await this.UPDATE_ARSTICKER_RESOURCE({
        insertList: this.insertList, 
        updateList: this.updateList, 
        storyId: this.storyId
      });

      this.uploading = false;
      await this.getList();
      await updateDataTable(
        this.GET_TABLE_VERSION,
        null,
        this.UPDATE_TABLE_VERSION,
        tableId,
        { resourceList: this.resourceList }
      )
    },
    async getList() {
      this.updateList = [];
      this.insertList = [];
      this.conflictList = [];
      this.resourceList = [];

      await this.refreshResourceList();
    },
    async refreshResourceList() {
      this.resourceList = await this.LIST_ARSTICKER_RESOURCE();
    },
    async onFileUpload(fileList) {
      const { insertList, updateList, conflictList } 
        = await onFileDelimiter(this.resourceList, fileList);

      this.insertList = insertList;
      this.updateList = updateList;
      this.conflictList = conflictList;
    },
    importCSVResource(file) {
      return;
      importCSV(file, 'resourceId', async (resourceList) => {
        await updateDataTable(
          this.GET_TABLE_VERSION,
          this.UPDATE_DNN_RESOURCE_MANY,
          this.UPDATE_TABLE_VERSION,
          tableId,
          { resourceList }
        );

        await this.refreshResourceList();
      })
    },
    exportCSVResource() {
      exportCSV(this.resourceList, 'arSticker.csv');
    },
  }
  
};
</script>
