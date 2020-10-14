<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      <v-data-table
        dense
        :headers="headers"
        :items="resourceList"
        sort-by="storyId"
        class="elevation-1"
      >
      <template v-slot:top>
        <v-alert v-if="isLive" type="info" dense>데이터 수정 -> 디자인 적용</v-alert>
          <v-toolbar flat color="white">
            <v-toolbar-title>리소스 리스트</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary">Reset</v-btn>
        </template>
      </v-data-table>

      <!-- <v-row>
        <v-col>
          <v-btn @click="exportItem">아이템 데이터</v-btn>
          <v-file-input label="아이템 입력" @change="importItem"></v-file-input>
        </v-col>
        <v-col>
          <v-btn @click="exportExchangeItem">교환 아이템</v-btn>
          <v-file-input label="교환 아이템 입력" @change="importExchangeItem"></v-file-input>
          <v-alert v-if="errorFile" type="error">{{errorFile}}</v-alert>
        </v-col>

      </v-row> -->
      <v-row>
        <v-col>
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
const { importCSV, exportCSV } = require('../util/fileutil');
const { updateDataTable } = require('../util/dataTableUtil');

export default {
  name: 'resourceList',
  data() {
    return {
      resourceList: [],
      headers: [
        { text: 'storyId', value: 'storyId' },
        { text: 'resourceId', value: 'resourceId' },
        { text: 'crc32', value: 'crc32' },
        { text: 'size', value: 'size' },
        { text: 'version', value: 'version' },
        { text: 'updateDate', value: 'updateDate' },
      ],

    }
  },
  async created() {
    await this.getResourceList();
  },
  computed: {
    ...mapState({
        CDN_URL: 'CDN_URL'
    }),
    isLive(){
      return config.isLive;
    },
  },
  watch: {},
  methods: {
    ...mapActions([
      'LIST_AOS_RESOURCE',
      'UPDATE_AOS_RESOURCE',
      'UPDATE_TABLE_VERSION',
      'GET_TABLE_VERSION'
    ]),
    async getResourceList() {
      this.resourceList = await this.LIST_AOS_RESOURCE();
    },
    importCSVResource(file) {
      importCSV(file, 'storyId', async (resourceList) => {
        console.log(resourceList);
        const tableId = 'resource';

        await updateDataTable(
          this.GET_TABLE_VERSION,
          this.UPDATE_AOS_RESOURCE,
          this.UPDATE_TABLE_VERSION,
          tableId,
          { resourceList }
        );

        await this.getResourceList();
      })
    },
    exportCSVResource() {
      exportCSV(this.resourceList, 'resource.csv');
    },
  }
};
</script>
