<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      <v-data-table
        dense
        :headers="headers"
        :items="productGroupList"
        sort-by="itemId"
        class="elevation-1"
      >
      <template v-slot:top>
        <v-alert v-if="isLive" type="info" dense>데이터 수정 -> 디자인 적용</v-alert>    
          <v-toolbar flat color="white">
            <v-toolbar-title>상품 그룹 관리</v-toolbar-title>
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
                          <v-text-field 
                            :disabled="!insert" 
                            v-model="groupItem.groupId" 
                            label="그룹 아이디"
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field 
                            v-model="groupItem.startDate" 
                            label="시작 시간"
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field 
                            v-model="groupItem.endDate" 
                            label="종료 시간"
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field 
                            type="number"
                            v-model="groupItem.serverLimit" 
                            label="서버 제한"
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field 
                            type="number"
                            v-model="groupItem.userLimit" 
                            label="유저 제한"
                          ></v-text-field>
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
          <v-btn @click="exportItem">상점 그룹 데이터</v-btn>
          <v-file-input label="상점 그룹 데이터 입력" @change="importItem"></v-file-input>
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
const {s3Upload, exportExcel, importExcel} = require("../util/fileutil");

export default {
  name: 'productGroupList',
  data() {
    return {
      productGroupList: [],
      groupItem: {},
      categoryItemIndex: -1,
      errorFile: '',
      insert: false,
      dialog: false,
      headers: [
        { text: '그룹 아이디', value: 'groupId' },
        { text: '시작 일시', value: 'startdate' },
        { text: '종료 일시', value: 'endDate' },
        { text: '서버 제한', value: 'serverLimit' },
        { text: '유저 제한', value: 'userLimit' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
    }
  },
  created() {
    this.getGroupList();
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
      'LIST_GROUP',
      'CREATE_GROUP',
      'UPDATE_GROUP',
      'DELETE_GROUP',
      'UPDATE_GROUP_MANY'
    ]),
    async getGroupList() {
      const result = await this.LIST_GROUP();
      console.log(result);
      this.productGroupList = result.productGroupList || [];
    },
    async onDelete(item) {
      if(!confirm('해당 아이템을 삭제 하시겠습니까?')) return;
      await this.DELETE_GROUP(item);
      await this.getGroupList();
    },
    onCreate(item) {
      this.insert = true;
      this.dialog = true;
      this.groupItem = {};
    },
    onEdit(item) {
      this.insert = false;
      this.dialog = true;
      this.groupItem = Object.assign({}, item);
    },
    close () {
      this.dialog = false
    },
    async save() {
      const saveFunc = this.insert ? this.CREATE_GROUP: this.UPDATE_GROUP;
      this.groupItem.startDate = Number(this.groupItem.startDate);
      this.groupItem.endDate = Number(this.groupItem.endDate);
      this.groupItem.serverLimit = Number(this.groupItem.serverLimit);
      this.groupItem.userLimit = Number(this.groupItem.userLimit);

      await saveFunc(this.groupItem);

      await this.getGroupList();
      this.close();
    },
    importItem(file) {
      importExcel(file, async (jsonObject) => {
        console.log(jsonObject);
        await this.UPDATE_GROUP_MANY({ productGroupList: jsonObject });
        await this.getGroupList();
      }) 
    },
    exportItem() {
      exportExcel(this.productGroupList, 'category', 'category.xlsx');
    },

  }
};
</script>
