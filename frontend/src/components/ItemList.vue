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
                    <v-col cols="12" sm="6">
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            :disabled="!insert"
                            v-model="itemEdit.itemId"
                            label="아이템 아이디"
                            @change="itemIdChange"
                            ref="itemId"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-select
                            v-model="itemEdit.itemCategory"
                            :items="categoryList"
                            item-text="categoryName"
                            item-value="itemCategory"
                            label="아이템 카테고리"
                            persistent-hint
                            ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                          v-model="itemEdit.groupId"
                          label="그룹 아이디"
                          ref="groupId"
                        ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-select
                            v-model="itemEdit.useable"
                            :items="yesOrNo"
                            item-text="text"
                            item-value="value"
                            label="사용 가능"
                            persistent-hint
                            ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-select
                            v-model="itemEdit.overlap"
                            :items="yesOrNo"
                            item-text="text"
                            item-value="value"
                            label="겹치기"
                            persistent-hint
                            @change="overlapChange"
                            ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            type="number"
                            v-model="itemEdit.maxQny"
                            label="최대 개수"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            :disabled="!!itemEdit.overlap"
                            type="number"
                            v-model="itemEdit.volatileSeconds"
                            label="소멸 시간"
                            @change="volatileChange"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field type="number" v-model="itemEdit.priority" label="우선 순위"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="4">
                            <v-select
                                v-model="addMaterialItem.materialId"
                                :items="itemList"
                                item-text="itemId"
                                item-value="itemId"
                                label="재료 아이템"
                                persistent-hint
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="4">
                            <v-text-field
                              type="number"
                              v-model="addMaterialItem.materialQny"
                              label="재료 개수"
                              ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="4">
                            <v-btn @click="addMaterial">추가</v-btn>
                          </v-col>
                          </v-row>
                        <v-divider></v-divider>
                        <div v-for="(item, index) in materialItemList" :key="index">
                          {{item.materialId}}
                          X {{item.materialQny}}
                          <v-btn @click="deleteMaterial(item)">삭제</v-btn>
                        </div>
                      </v-container>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="onClose">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="onSave">Save</v-btn>
              </v-card-actions>
            </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.materialItem`]="{ item }">
          <div v-for="(materialItem, index) in itemArrangedMap[item.itemId]" :key="index">
            {{materialItem.materialId}}
            {{materialItem.materialQny}}
          </div>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)"> edit </v-icon>
          <v-icon small @click="deleteItem(item)"> delete </v-icon>
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
          <v-btn @click="exportCSVItem">아이템 데이터(csv)</v-btn>
          <v-file-input accept=".csv" label="아이템 데이터(csv)" @change="importCSVItem"></v-file-input>
        </v-col>
        <v-col>
          <v-btn @click="exportCSVItemExchange">아이템 교환 데이터(csv)</v-btn>
          <v-file-input accept=".csv" label="아이템 교환 데이터(csv)" @change="importCSVItemExchange"></v-file-input>
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
  name: 'itemList',
  data() {
    return {
      itemList: [],
      itemMaterialList: [],
      itemArrangedMap: {},
      addMaterialItem: {},
      materialItemList: [],
      itemEdit: {},
      itemEditIndex: -1,
      categoryList: [],
      errorFile: '',
      insert: false,
      dialog: false,
      yesOrNo: [
        { text: 'Yes', value: 1 },
        { text: 'No', value: 0 },
      ],
      headers: [
        { text: '아이디', value: 'itemId' },
        { text: '카테고리', value: 'itemCategory' },
        { text: '그룹코드', value: 'groupId' },
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
  watch: {},
  methods: {
    ...mapActions([
      'LIST_ITEM',
      'LIST_CATEGORY',
      'DELETE_ITEM',
      'CREATE_ITEM',
      'UPDATE_ITEM',
      'UPDATE_MANY_ITEM',
      'UPDATE_MANY_ITEM_MATERIAL',
      'UPDATE_TABLE_VERSION',
      'GET_TABLE_VERSION'
    ]),
    volatileChange(item) {
    },
    overlapChange(item) {
      this.itemEdit.volatileSeconds = 0;
    },
    itemIdChange(itemId) {
      this.itemEdit.groupId = itemId;
    },
    addMaterial() {
      this.materialItemList.push(this.addMaterialItem);
      this.addMaterialItem = {}
    },
    deleteMaterial(item) {
      const index = this.materialItemList.indexOf(item)
      this.materialItemList.splice(index, 1)
    },
    async getItemList() {
      const itemResult = await this.LIST_ITEM();
      const categoryResult = await this.LIST_CATEGORY();

      this.itemList = itemResult.itemList;
      this.itemMaterialList = itemResult.itemMaterialList;
      this.categoryList = categoryResult.categoryList;

      this.itemArrangedMap = {};
      for(const item of this.itemMaterialList) {
        let materialItemList = this.itemArrangedMap[item.itemId];
        if(materialItemList) {
          materialItemList.push(item);
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
    initEditItem(item) {
      this.itemEdit = {
        volatileSeconds: 0,
        useable: 1,
        overlap: 1,
        maxQny: 0,
        priority: 1000,
        groupId: '',
        itemId: '',
        itemCategory: ''
      }
    },
    editItem(item) {
      this.insert = false;
      this.dialog = true;
      this.itemEdit = Object.assign({}, item);
      this.addMaterialItem = {};
      this.materialItemList = this.itemArrangedMap[item.itemId] || [];
    },
    onCreate(item) {
      this.insert = true;
      this.dialog = true;
      this.initEditItem();
      this.addMaterialItem = {};
      this.materialItemList = [];
    },
    onClose () {
      this.dialog = false
      setTimeout(() => {
        this.itemEdit = Object.assign({}, this.defaultItem)
        this.itemEditIndex = -1
      }, 300)
    },
    checkNullRule(item) {
      if(item) {
        return `입력해주세요`;
      }

      return '';
    },
    addItemId(itemId, materialList) {
      for(const item of materialList) {
        item.itemId = itemId;
        item.materialQny = Number(item.materialQny);
      }
    },
    async onSave () {

      if( !this.checkNull(this.itemEdit, [
        { key:'itemId', text: '아이템 아이디' },
        { key:'groupId', text: '그룹 아이디' }
      ])) return;

      this.addItemId(this.itemEdit.itemId, this.materialItemList);

      const saveFunc = this.insert ? this.CREATE_ITEM: this.UPDATE_ITEM;
      await saveFunc({itemInfo: this.itemEdit, materialItemList: this.materialItemList || []});

      await this.getItemList();
      this.close();
    },
    close () {
      this.dialog = false
    },
    checkNull(obj, checkList) {
      let isPossible = true;
      for(const checkItem of checkList) {
        if(typeof obj[checkItem.key] === 'string') {
          if( obj[checkItem.key].length === 0 ) {
            this.$nextTick(() => {this.$refs[checkItem.key].focus()});
            isPossible = false;
            break;
          }
        }
      }
      return isPossible;
    },
    importCSVItem(file) {
      importCSV(file, 'itemId', async (itemList) => {
        const tableId = 'item';

        await updateDataTable(
          this.GET_TABLE_VERSION,
          this.UPDATE_MANY_ITEM,
          this.UPDATE_TABLE_VERSION,
          tableId,
          {itemList}
        );

        await this.getItemList();
      })
    },
    importCSVItemExchange(file) {
      importCSV(file, 'itemId', async (materialList) => {
        const tableId = 'itemExchange';

        await updateDataTable(
          this.GET_TABLE_VERSION,
          this.UPDATE_MANY_ITEM_MATERIAL,
          this.UPDATE_TABLE_VERSION,
          tableId,
          {materialList}
        );

        await this.getItemList();
      })
    },
    exportCSVItem() {
      exportCSV(this.itemList, 'item.csv');
    },
    exportCSVItemExchange() {
      exportCSV(this.itemMaterialList, 'itemExchange.csv');
    },

    // exportItem() {
    //   exportExcel(this.itemList, 'item', 'item.xlsx');
    // },
    // exportExchangeItem() {
    //   exportExcel(this.itemMaterialList, 'item', 'itemExchange.xlsx');
    // },
    // importItem(file) {
    //   importExcel(file, async (jsonObject) => {
    //     await this.UPDATE_MANY_ITEM({ itemList: jsonObject });
    //     await this.getItemList();
    //   })
    // },
    // importExchangeItem(file) {
    //   importExcel(file, async (jsonObject) => {
    //     await this.UPDATE_MANY_ITEM_MATERIAL({ materialList: jsonObject });
    //     await this.getItemList();
    //   })
    // },
  }
};
</script>
