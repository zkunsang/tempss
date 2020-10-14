<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      <v-data-table
        dense
        :headers="headers"
        :items="categoryList"
        sort-by="itemId"
        class="elevation-1"
      >
      <template v-slot:top>
        <v-alert v-if="isLive" type="info" dense>데이터 수정 -> 디자인 적용</v-alert>    
          <v-toolbar flat color="white">
            <v-toolbar-title>카테고리 리스트</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-btn color="primary" dark class="mb-2" @click="onCreate">New Item</v-btn>
            <v-spacer></v-spacer>
          <v-dialog v-model="dialog">
            <v-card>
              <v-card-title>
                <span class="headline"></span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-row>
                        <v-col>
                          <v-text-field :disabled="!insert" v-model="categoryItem.itemCategory" label="아이템 카테고리"></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field v-model="categoryItem.categoryName" label="카테고리 설명"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>  
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-icon small class="mr-2" @click="onEdit(item)"> edit </v-icon>
          <v-icon small @click="onDelete(item)"> delete </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary">Reset</v-btn>
        </template>
      </v-data-table>
      
      <v-row>
        <v-col>
          <v-btn @click="exportCSVCategory">카테고리 데이터</v-btn>
          <v-file-input label="카테고리 데이터 입력" @change="importCSVCategory"></v-file-input>
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

import config from '../../src/config/config';
var crc = require('crc');
const { importCSV, exportCSV } = require('../util/fileutil');
const { updateDataTable } = require('../util/dataTableUtil');

export default {
  name: 'categoryList',
  data() {
    return {
      categoryList: [],
      categoryItem: {},
      categoryItemIndex: -1,
      errorFile: '',
      insert: false,
      dialog: false,
      headers: [
        { text: '아이템 카테고리', value: 'itemCategory' },
        { text: '카테고리 명', value: 'categoryName' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
    }
  },
  created() {
    this.getCategoryList();
  },
  computed: {
    ...mapState({
        CDN_URL: 'CDN_URL'
    }),
    isLive(){
      return config.isLive;
    },
  },
  watch: {
  },
  methods: {
    ...mapActions([
      'LIST_CATEGORY',
      'CREATE_CATEGORY',
      'UPDATE_CATEGORY',
      'DELETE_CATEGORY',
      'UPDATE_MANY_CATEGORY',
      'GET_TABLE_VERSION',
      'UPDATE_TABLE_VERSION'
    ]),
    async getCategoryList() {
      const result = await this.LIST_CATEGORY();
      this.categoryList = result.categoryList || [];
    },
    async onDelete(item) {
      if(!confirm('해당 아이템을 삭제 하시겠습니까?')) return;
      await this.DELETE_CATEGORY(item);
      await this.getCategoryList();
    },
    onCreate(item) {
      this.insert = true;
      this.dialog = true;
      this.categoryItem = {};
    },
    onEdit(item) {
      this.insert = false;
      this.dialog = true;
      this.categoryItem = Object.assign({}, item);
    },
    close () {
      this.dialog = false
      // setTimeout(() => {
      //   // this.categoryItemIndex = -1
      // }, 300)
    },
    async save() {
      const saveFunc = this.insert ? this.CREATE_CATEGORY: this.UPDATE_CATEGORY;
      await saveFunc(this.categoryItem);

      await this.getCategoryList();
      this.close();
    },
    exportCSVCategory() {
      exportCSV(this.categoryList, 'itemCategory.csv');
    },
    importCSVCategory(file) {
      importCSV(file, 'itemCategory', async (categoryList) => {
        const tableId = 'itemCategory';

        await updateDataTable(
          this.GET_TABLE_VERSION,
          this.UPDATE_MANY_CATEGORY,
          this.UPDATE_TABLE_VERSION,
          tableId,
          { categoryList }
        );

        await this.getCategoryList();
      })
    },
  }
};
</script>
