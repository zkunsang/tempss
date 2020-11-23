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
      
      <v-data-table
        :headers="headers"
        :items="resourceList"
        :search="search"
        sort-by="updateDate"
        class="elevation-1"
      >
        <template v-slot:[`item.resourceId`]="{ item }">
          <a :href="`${getDownloadUrl(item)}`">{{item.resourceId}}</a>
        </template>
        <template v-slot:[`item.patchVersion`] = "{ item }">
          <v-icon small class="mr-2" @click="onDelete(item)"> delete </v-icon>
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
          <v-btn color="primary" @click="getList">Reset</v-btn>
        </template>
        

      </v-data-table>
      <v-btn color="primary" @click="getList">Reset</v-btn>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import _ from 'lodash'
const {getS3Url, s3Upload, onFileDelimiter} = require('../util/fileutil');
const {updateDataTable} = require('../util/dataTableUtil');

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
      updateList: [],
      insertList: [],
      conflictList: [],
      dialog: false,
      storyId: null,
      isNew: false,
      headers: [
        { text: '아이디', value: 'resourceId' },
        { text: 'version', value: 'version' },
        { text: 'size', value: 'size' },
        { text: 'crc32', value: 'crc32' },
        { text: 'updateDate', value: 'updateDate' },
        { text: 'patchVersion', value: 'patchVersion' },
      ],
      editedItem: {},
    }
  },
  async created() {
    this.storyId = this.$route.params.storyId;
    if(this.storyId) {
      await this.getList();
    }

    this.isNew = !this.storyId;
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
      'LIST_AOS_RESOURCE',
      'LIST_AOS_STORY_RESOURCE',
      'UPDATE_AOS_RESOURCE',
      'GET_TABLE_VERSION',
      'UPDATE_TABLE_VERSION',
      'DELETE_AOS_RESOURCE'
    ]),
    getDownloadUrl(item) {
      const {storyId, version, resourceId} = item;
      const url = `${getS3Url()}${storyId}/aos/${version}/${resourceId}`;
      return url;
    },
    async s3Uploads(list) {
      for(let i in list) {
        let item = list[i];

        item.storyId = this.storyId;
        
        await s3Upload(item.file, `${this.storyId}/aos/${item.version}/${item.resourceId}`);
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

      await this.UPDATE_AOS_RESOURCE({
        insertList: this.insertList, 
        updateList: this.updateList, 
        storyId: this.storyId
      });

      this.uploading = false;

      const tableId = 'resource';

      await this.getList();
      const totalResourceList = await this.allResourceList();
      
      await updateDataTable(
        this.GET_TABLE_VERSION,
        null,
        this.UPDATE_TABLE_VERSION,
        tableId,
        { resourceList: totalResourceList }
      )
    },
    async getList() {
      this.updateList = [];
      this.insertList = [];
      this.conflictList = [];

      this.resourceList = [];
      if(this.isNew) return;
      this.resourceList = await this.LIST_AOS_STORY_RESOURCE(this.storyId);
    },
    async allResourceList() {
      return await this.LIST_AOS_RESOURCE();
    },
    async onFileUpload(fileList) {
      const { insertList, updateList, conflictList } = await onFileDelimiter(this.resourceList, fileList);
      this.insertList = insertList;
      this.updateList = updateList;
      this.conflictList = conflictList;
    },
    async onDelete(item) {
      const storyId = this.storyId;
      const resourceId = item.resourceId;
      
      await this.DELETE_AOS_RESOURCE({ storyId, resourceId });
      await this.getList();
    }
  }
};
</script>