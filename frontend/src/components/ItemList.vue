<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      <v-data-table
        dense
        :headers="headers"
        :items="itemList"
        sort-by="itemId"
        class="elevation-1"
      >
      <template v-slot:top>
        <v-alert v-if="isLive" type="info" dense>데이터 수정 -> 디자인 적용</v-alert>    
          <v-toolbar flat color="white">
            <v-toolbar-title>아이템 리스트</v-toolbar-title>
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
                    <v-col cols="12" sm="4">
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field :disabled="!insert" v-model="itemEdit.reward_index" label="일련번호"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="itemEdit.reward_desc" label="아이템 설명"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>  
                    <v-col cols="12" sm="8">
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="4">
                            <v-select
                                v-model="addItem.itemId"
                                :items="itemList"
                                item-text="text"
                                item-value="value"
                                label="아이템 아이디"
                                persistent-hint
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="4">
                            <v-select
                                v-model="addItem.materialId"
                                :items="itemList"
                                item-text="text"
                                item-value="value"
                                label="재료 아이템"
                                persistent-hint
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="4">
                            <v-text-field v-model="addItem.materialQny" label="재료 개수"></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="4">
                            <v-btn @click="addExchangeItem">추가</v-btn>
                          </v-col>
                          </v-row>
                        <v-divider></v-divider>
                        <div v-for="(item, index) in itemExchangeEditList" :key="index">
                          {{item.reward_type}}
                          X {{item.reward_value}}
                          {{get_title_name(item.seq_title)}}
                          <v-btn @click="deleteExchangeItem(item)">삭제</v-btn>
                        </div>
                      </v-container>
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
        <template v-slot:item.item="{ item }">
          <div v-for="(product_item, index) in attendance_item_arranged_map[item.reward_index]" :key="index">
            {{product_item.reward_type}}
            {{product_item.item_category}}
            {{product_item.item_id}}
            {{!!product_item.reward_value ? `${product_item.reward_value} 개` : ''}}
            {{product_item.seq_title ? `[${get_title_name(product_item.seq_title)}]` : ''}}
          </div>
        </template>
        <template v-slot:item.action="{ item }">
          <v-icon small class="mr-2" @click="editExchangeItem(item)"> edit </v-icon>
          <v-icon small @click="deleteExchangeItem(item)"> delete </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary">Reset</v-btn>
        </template>
      </v-data-table>
      
      <v-row>
        <v-col>
          <v-btn @click="exportItem">아이템 데이터</v-btn>
          <v-file-input label="아이템 입력" @change="importItem"></v-file-input>
        </v-col>
        <v-col>
          <v-btn @click="exportExchangeItem">교환 아이템</v-btn>
          <v-file-input label="교환 아이템 입력" @change="importExchangeItem"></v-file-input>
          <v-alert v-if="errorFile" type="error">{{errorFile}}</v-alert>
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
const {s3Upload, excelExport, excelImport} = require("../util/fileutil");

export default {
  name: 'itemList',
  data() {
    return {
      itemList: [],
      itemExchangeList: [],
      itemArrangedMap: {},
      addItem: {},
      itemExchangeEditList: [],
      itemEdit: {},
      itemEditIndex: -1,
      errorFile: '',
      insert: false,
      dialog: false,
      headers: [
        { text: '아이디', value: 'itemId' },
        { text: '카테고리', value: 'itemCategory' },
        { text: '그룹코드', value: 'groupCode' },
        { text: '사용가능', value: 'useable' },
        { text: '겹치기', value: 'overlap' },
        { text: '최대 개수', value: 'maxQny' },
        { text: '소멸(초)', value: 'volatileSeconds' },
        { text: '사용우선순위', value: 'priority' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      
    }
  },
  created() {
    this.getItemList();
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
      'LIST_ITEM',
      'DELETE_ITEM',
      'CREATE_ITEM',
      'UPDATE_ITEM',
      'UPDATE_MANY_ITEM'
    ]),
    addExchangeItem() {
      this.itemExchangeEditList.push(Object.assign({}, this.addItem));
      this.addItem = {}
    },
    editExchangeItem(item) {
      this.insert = false;
      this.itemEditIndex = this.itemList.indexOf(item)
      this.itemEdit = Object.assign({}, item)
      this.addItem = {}
      
      this.itemExchangeEditList = this.itemArrangedMap[item.itemId];
      if(!this.itemExchangeEditList) this.itemExchangeEditList = [];
      
      this.dialog = true
    },
    deleteExchangeItem(item) {
      const index = this.itemExchangeEditList.indexOf(item)
      this.itemExchangeEditList.splice(index, 1)
    },
    async getItemList() {
      const result = await this.LIST_ITEM();
      this.itemList = result.itemList;
      this.itemExchangeList = result.itemExchangeList;

      this.itemArrangedMap = {};
      for(const item of itemList) {
        let exchangeItemList = this.itemArrangedMap[item.itemId];
        if(exchangeItemList) {
          exchangeItemList.push(item);
        }
        else {
          this.itemArrangedMap[item.itemId] = []
          this.itemArrangedMap[item.itemId].push(item);
        }
      }
    },
    async deleteItem(item) {
      if(!confirm('해당 아이템을 삭제 하시겠습니까?')) return;
      await this.DELETE_ITEM(item);
      await this.getItemList();
        
    },
    onCreate(item) {
      this.insert = true;
      this.dialog = true;
      this.itemEdit = {}
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.itemEdit = Object.assign({}, this.defaultItem)
        this.itemEditIndex = -1
      }, 300)
    },
    async save () {
      const saveFunc = this.insert ? this.INSERT_ITEM: this.UPDATE_ITEM;
      await saveFunc({itemInfo: this.itemEdit, itemList: this.itemExchangeEditList});

      await this.getItemList();
      this.close();
    },
    importItem(file) {
      importExcel(file, async (jsonObject) => {
        await this.updateItem({ itemList: jsonObject });
        await this.getItemList();
      }) 
    },
    importExchangeItem(file) {
      importExcel(file, async (jsonObject) => {
        await this.updateItem({ itemExchangeList: jsonObject });
        await this.getItemList();
      }) 
    },
    exportItem() {
      exportExcel(this.itemList, 'item', 'item.xlsx');
    },
    exportExchangeItem() {
      exportExcel(this.itemExchangeList, 'item', 'itemExchange.xlsx');
    },
    importItem(file) {
      if(!file) return;
      var reader = new FileReader();
      reader.onload = (e) => {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
            type: 'binary'
          });
          
          workbook.SheetNames.forEach((sheetName) => {
          var jsonOPbject = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
          this.UPDATE_ATTENDANCE_ITEM_LIST({attendance_item_list: jsonOPbject})
            .then((response_body) => {
              let wrong_product = response_body.wrong_product;

              console.log(response_body);
              if(wrong_product && wrong_product.length) {
                this.errorFile = `${wrong_product.join(',')} - 잘못된 reward_index `
              }

              this.getItemList();
            });
        })
      };

      reader.onerror = function(ex) { console.log(ex);};

      reader.readAsBinaryString(file);
    },
  }
};
</script>
