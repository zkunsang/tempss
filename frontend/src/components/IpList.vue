<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
    <v-container>
      화이트리스트
      <v-row>
        <v-col cols=12 md=3 sm=3>
          <v-text-field
            label="아이피"
            v-model="addWhite.ip"
          ></v-text-field>
        </v-col>
        <v-col cols=12 md=8 sm=8>
          <v-text-field
            label="메모"
            v-model="addWhite.memo"
          ></v-text-field>
        </v-col>
        <v-col cols=12 md=1 sm=1>
          <v-btn @click="onInsert('white')">추가</v-btn>
        </v-col>
      </v-row>
      
      <v-data-table
        :headers="headers"
        :items="whiteList"
      >
        <template v-slot:[`item.delete`]="{ item }">
          <v-icon small @click="onDelete('white', item)"> delete </v-icon>
        </template>
      </v-data-table>
    </v-container>
    <v-container>
      블랙리스트
      <v-row>
        <v-col cols=12 md=3 sm=3>
          <v-text-field
            label="아이피"
            v-model="addBlack.ip"
          ></v-text-field>
        </v-col>
        <v-col cols=12 md=8 sm=8>
          <v-text-field
            label="메모"
            v-model="addBlack.memo"
          ></v-text-field>
        </v-col>
        <v-col cols=12 md=1 sm=1>
          <v-btn @click="onInsert('black')">추가</v-btn>
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="blackList"
      >
      </v-data-table>
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
const { utsToDsObj } = require('../util/DateUtil');
const { updateDataTable } = require('../util/dataTableUtil');

const no_image = require(`../assets/no_image.jpg`);
const ArrayUtil = require('../util/ArrayUtil');

export default {
  data() {
    return {
      addWhite: {},
      addBlack: {},
      blackList: [],
      whiteList: [],
      headers: [
        { text: '아이피', value: 'ip' },
        { text: '등록일자', value: 'updateDate' },
        { text: '등록자', value: 'adminId' },
        { text: 'memo', value: 'memo' },
        { text: 'delete', value: 'delete' },
      ],
    }
  },
  async created() {
    await this.getList();
  },
  methods: {
    ...mapActions([
      'LIST_IP',
      'INSERT_IP',
      'DELETE_IP',
      'EDIT_IP',
    ]),
    async onInsert(type) {
      this.addWhite.type = type;
      this.addWhite.status = 1;
      await this.INSERT_IP(this.addWhite);
      await this.getList();
    },
    async onDelete(type, item) {
      const deleteObj = {}
      deleteObj.type = type;
      deleteObj.ip = item.ip;
      
      await this.DELETE_IP(deleteObj);
      await this.getList();
    },
    async getList() {
      const result = await this.LIST_IP();
      
      const whiteList = [];
      const blackList = [];

      utsToDs(result.ipList);

      for(const ip of result.ipList) {
        
        if(ip.type == 'white') whiteList.push(ip);
        else blackList.push(ip);
      }

      this.whiteList = whiteList;
      this.blackList = blackList;
    }
    
  }
};

function utsToDs(ipList) {
  for(const ip of ipList) {
    utsToDsObj(ip, 'updateDate');
  }
}
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
