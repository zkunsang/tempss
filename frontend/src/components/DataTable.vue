<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      <v-data-table
        dense
        :headers="headers"
        :items="dataTableList"
        sort-by="tableId"
        class="elevation-1"
      >
      <template v-slot:top>
        </template>
        <!-- 
        <template v-slot:[`item.action`]="{ item }">
          <v-icon small class="mr-2" @click="onEdit(item)"> edit </v-icon>
          <v-icon small @click="onDelete(item)"> delete </v-icon>
        </template>
         -->
        <template v-slot:no-data>
          <v-btn color="primary">Refresh</v-btn>
        </template>
      </v-data-table>
      <v-row>
      </v-row>
    </v-layout>
  </v-container>
</template>
<script src="xlsx.full.min.js"></script>
<script src="js/jhxlsx.js"></script>

<script>

import { mapActions, mapState } from 'vuex';
import _ from 'lodash'

import config from '../../src/config/config';
var crc = require('crc');
const { exportCSV, importCSV } = require("../util/fileutil");

export default {
  name: 'dataTable',
  data() {
    return {
      dataTableList: [],
      headers: [
        { text: '테이블 아이디', value: 'tableId' },
        { text: 'version', value: 'version' },
        { text: 'crc32', value: 'crc32' },
        { text: '수정일자', value: 'updateDate' },
      ],
    }
  },
  created() {
    this.getDataTableList();
  },
  methods: {
    ...mapActions([
      'LIST_DATA_TABLE',
    ]),
    async getDataTableList() {
      const result = await this.LIST_DATA_TABLE();
      this.dataTableList = result.dataTableList || [];
    },
  }
};
</script>
