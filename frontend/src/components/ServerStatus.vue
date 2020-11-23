<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
    <v-container>
      <v-row>
        <v-col cols=12 md=3>
          <vc-date-picker
            v-model="serverStatus"
            mode="dateTime"
            :masks="masks"
            is-range
          >
            <template v-slot="{ inputValue, inputEvents, isDragging }">
              <v-row>
              <v-col cols=12 md=6>
              <input
                class="flex-grow pl-8 pr-2 py-1 bg-gray-100 border rounded w-full"
                :class="isDragging ? 'text-gray-600' : 'text-gray-900'"
                :value="inputValue.start"
                v-on="inputEvents.start"
              />
              </v-col> 
              <v-col cols=12 md=1>
                =>
              </v-col>
              <v-col cols=12 md=5>
              <input
                class="flex-grow pl-8 pr-2 py-1 bg-gray-100 border rounded w-full"
                :class="isDragging ? 'text-gray-600' : 'text-gray-900'"
                :value="inputValue.end"
                v-on="inputEvents.end"
              />
              </v-col>
              </v-row>
            </template>
          </vc-date-picker>
          
        </v-col>
        <v-col cols=12 md=3>
          
        </v-col>
        <v-col cols=12 md=3>
          <v-switch 
            class="flag" 
            v-model="serverStatus.status" 
            :label="getStatusLabel(serverStatus)"
          ></v-switch>
        </v-col>
        <v-col cols=12 md=3>
          <v-btn 
            @click="onSave"
          >적용</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-textarea
            label="메시지"
            v-model="serverStatus.message"
          >
          </v-textarea>
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

export default {
  data() {
    return {
      serverStatus: {},
      inputValue: {},
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
      'INSERT_SERVER_STATUS'
    ]),
    async getStatusInfo() {
      const body = await this.GET_SERVER_STATUS();
      
      this.serverStatus = body.serverStatus || {};
      this.serverStatus.start = DateUtil.utsToDate(this.serverStatus.startDate);
      this.serverStatus.end = DateUtil.utsToDate(this.serverStatus.endDate);
    },
    async onSave() {
      this.serverStatus.status = this.serverStatus.status ? 1: 0;
      this.serverStatus.startDate = DateUtil.dsToUts(this.serverStatus.start);
      this.serverStatus.endDate = DateUtil.dsToUts(this.serverStatus.end);
    
      console.log(this.serverStatus);
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
