<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
    <v-container>
      <v-row>
        <v-col>
          <v-text-field 
            v-model="titleAll"
            label="제목"/>
          <v-text-field 
            v-model="bodyAll"
            label="내용"/>
        </v-col> 
        <v-col>
          전체 발송
        </v-col>
        <v-col>
          <v-btn 
            @click="onPushAll"
          >발송</v-btn>
        </v-col>
      </v-row>
      <v-divider/>
      <v-row>
        <v-col>
          <v-text-field 
            v-model="titleSingle"
            label="제목"/>
          <v-text-field 
            v-model="bodySingle"
            label="내용"/>
          <v-text-field 
            v-model="uidSingle"
            label="uid"/>
        </v-col>
        <v-col>
          개별발송
        </v-col>
        <v-col>
          <v-btn 
            @click="onPushSingle"
          >발송</v-btn>
        </v-col>
      </v-row>
      <!-- <v-data-table
        :headers="headers"
        :items="statusList"
      >
      </v-data-table> -->
    </v-container>
    </v-layout>
  </v-container>
</template>

<script>

import TemplateStoryVue from './TemplateStory.vue';
import {mapActions, mapState} from 'vuex'
import {eventBus} from '../util/eventBus';

var crc = require('crc');
const { importCSV, exportCSV } = require('../util/fileutil');
const { updateDataTable } = require('../util/dataTableUtil');

const no_image = require(`../assets/no_image.jpg`);
const ArrayUtil = require('../util/ArrayUtil');
const DateUtil = require('../util/DateUtil');

const PUSH_TYPE = {
    DEVICE: 1,
    APP: 2,
    GROUP: 3
}

export default {
  data() {
    return {
      titleAll: "",
      bodyAll: "",
      // statusList: [],
      headers: [
        { text: '시작일시', value: 'startDate' },
        { text: '종료일시', value: 'endDate' },
        { text: '표시 메시지', value: 'message' },
        { text: '메모', value: 'memo' },
      ],
      range: {
        start: new Date(),
        end: new Date(),
      },
      masks: {
        input: 'YYYY-MM-DD h:mm',
      },
    }
  },
  computed: {},
  async created() {
    await this.getStatusInfo();
  },
  
  methods: {
    ...mapActions([
      'GET_SERVER_STATUS',
      'INSERT_SERVER_STATUS',
      'INSERT_PUSH_MESSAGE'
    ]),
    async getStatusInfo() {
      const body = await this.GET_SERVER_STATUS();
      
      this.serverStatus = body.serverStatus || {};
      this.serverStatus.start = DateUtil.utsToDate(this.serverStatus.startDate);
      this.serverStatus.end = DateUtil.utsToDate(this.serverStatus.endDate);
    },
    async onPushAll() {
      const title = this.titleAll;
      const body = this.bodyAll;
      const pushType = PUSH_TYPE.APP;
      
      await this.INSERT_PUSH_MESSAGE({title, body, pushType});
    },
    async onPushSingle() {
      const title = this.titleSingle;
      const body = this.bodySingle;
      const uid = this.uidSingle;

      const pushType = PUSH_TYPE.DEVICE;
      
      await this.INSERT_PUSH_MESSAGE({title, body, pushType, uid});
    },
    async onSave() {
      this.serverStatus.status = this.serverStatus.status ? 1: 0;
      this.serverStatus.startDate = DateUtil.dsToUts(this.serverStatus.start);
      this.serverStatus.endDate = DateUtil.dsToUts(this.serverStatus.end);
      this.serverStatus.code = parseInt(this.serverStatus.code);
      
      await this.INSERT_SERVER_STATUS(this.serverStatus);
      this.getStatusInfo();
    },
    getStatusLabel(serverStatus) {
      return serverStatus.status == 1 ? "활성" : "비활성"
    },
  }
};
</script>

<style>
.style-1 {
  background-color: rgb(215,215,44)
}
.style-2 {
  background-color: rgb(114,114,67)
}
.custom-highlight-row{
  background-color: pink
}
</style>
