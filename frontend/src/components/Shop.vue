<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      <v-data-table
        dense
        :headers="headers"
        :items="productList"
        sort-by="itemId"
        class="elevation-1"
      >
      <template v-slot:top>
        <v-alert v-if="isLive" type="info" dense>데이터 수정 -> 디자인 적용</v-alert>    
          <v-toolbar flat color="white">
            <v-toolbar-title>상품 리스트</v-toolbar-title>
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
                            v-model="productEdit.productId" 
                            label="상품 아이디"
                            ref="productId"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-select
                            v-model="productEdit.groupId"
                            :items="productGroupList"
                            item-text="groupId"
                            item-value="groupId"
                            label="그룹 아이디"
                            persistent-hint
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-select
                            v-model="productEdit.productType"
                            :items="productTypeList"
                            item-text="text"
                            item-value="value"
                            label="프로덕트 타입"
                            persistent-hint
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field 
                            v-model.number="productEdit.costKr" 
                            label="비용(krw)"
                            ref="costKr"
                            type="number"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field 
                            v-model="productEdit.google" 
                            label="구글 키"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field 
                            v-model="productEdit.apple" 
                            label="애플 키"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field 
                            v-model.number="productEdit.startDate" 
                            label="시작 일자"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field 
                            v-model.number="productEdit.endDate" 
                            label="종료 일자"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field 
                            v-model.number="productEdit.serverLimit" 
                            label="서버 제한"
                            type="number"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field 
                            v-model.number="productEdit.userLimit" 
                            label="유저 제한"
                            type="number"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>  
                    <v-col cols="12" sm="6">
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="4">
                            <v-select
                              v-model="addRewardItem.rewardType"
                              :items="rewardTypeList"
                              item-text="text"
                              item-value="value"
                              label="보상 타입"
                              persistent-hint
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="4">
                            <v-select
                              v-model="addRewardItem.rewardId"
                              :items="itemList"
                              item-text="itemId"
                              item-value="itemId"
                              label="보상 아이템"
                              persistent-hint
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="4">
                            <v-text-field 
                              type="number"
                              v-model.number="addRewardItem.rewardQny" 
                              label="보상 개수"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="4">
                            <v-btn @click="addReward">추가</v-btn>
                          </v-col>
                        </v-row>
                        <v-divider></v-divider>
                        <div v-for="(item, index) in rewardItemList" :key="index">
                          {{item.rewardType}}
                          {{item.rewardId}}
                          X {{item.rewardQny}}
                          <v-btn @click="deleteReward(item)">삭제</v-btn>
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
        <template v-slot:[`item.rewardItem`]="{ item }">
          <div v-for="(rewardItem, index) in productArrangedMap[item.productId]" :key="index">
            {{rewardItem.materialId}}
            {{rewardItem.materialQny}}
          </div>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-icon small class="mr-2" @click="editProduct(item)"> edit </v-icon>
          <v-icon small @click="deleteProduct(item)"> delete </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary">Reset</v-btn>
        </template>
      </v-data-table>
      
      <v-row>
        <v-col>
          <v-btn @click="exportCSVProduct">상점 데이터</v-btn>
          <v-file-input accept=".csv" label="상점 데이터 입력" @change="importCSVProdcut"></v-file-input>
        </v-col>
        <v-col>
          <v-btn @click="exportCSVProductReward">교환 아이템</v-btn>
          <v-file-input accept=".csv" label="교환 아이템 입력" @change="importCSVProductReward"></v-file-input>
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
const { importCSV, exportCSV } = require("../util/fileutil");
const { updateDataTable } = require("../util/dataTableUtil");

export default {
  name: 'productList',
  data() {
    return {
      productList: [],
      productGroupList: [],
      productRewardList: [],
      productArrangedMap: {},
      addRewardItem: {},
      rewardItemList: [],
      productEdit: {},
      productEditIndex: -1,
      errorFile: '',
      insert: false,
      dialog: false,
      itemList: [],
      rewardTypeList: [
        { text: '일반', value: 'normal' },
        { text: '보너스', value: 'bonus' },
      ],
      productTypeList: [
        { text: '일반', value: 'normal' },
        { text: '월결제', value: 'month' },
        { text: '월구독', value: 'monthsub' },
      ],
      headers: [
        { text: '아이디', value: 'productId' },
        { text: '그룹 아이디', value: 'groupId' },
        { text: '상품 타입', value: 'productType' },
        { text: '가격(krw)', value: 'costKr' },
        { text: '구글 키', value: 'google' },
        { text: '애플 키', value: 'apple' },
        { text: '시작 시간', value: 'startDate' },
        { text: '종료 시간', value: 'endDate' },
        { text: '서버 제한', value: 'serverLimit' },
        { text: '유저 제한', value: 'userLimit' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
    }
  },
  created() {
    this.getProductList();
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
      'LIST_PRODUCT',
      'LIST_ITEM',
      'DELETE_PRODUCT',
      'CREATE_PRODUCT',
      'UPDATE_PRODUCT',
      'UPDATE_MANY_PRODUCT',
      'UPDATE_MANY_PRODUCT_REWARD',
      'GET_TABLE_VERSION',
      'UPDATE_TABLE_VERSION'
    ]),
    volatileChange(item) {
    },
    overlapChange(item) {
      this.productEdit.volatileSeconds = 0;
    },
    addReward() {
      this.rewardItemList.push(this.addRewardItem);
      this.addRewardItem = {}
    },
    deleteReward(item) {
      const index = this.rewardItemList.indexOf(item)
      this.rewardItemList.splice(index, 1)
    },
    async getProductList() {
      const productResult = await this.LIST_PRODUCT();
      
      this.itemList = productResult.itemList || [];
      this.productList = productResult.productList || [];
      this.productGroupList = productResult.productGroupList || [];
      this.productRewardList = productResult.productRewardList || [];

      this.productArrangedMap = {};
      for(const item of this.productRewardList) {
        let rewardItemList = this.productArrangedMap[item.productId];
        if(rewardItemList) {
          rewardItemList.push(item);
        }
        else {
          this.productArrangedMap[item.productId] = []
          this.productArrangedMap[item.productId].push(item);
        }
      }
    },
    async deleteProduct(product) {
      if(!confirm('해당 상품을 삭제 하시겠습니까?')) return;
      await this.DELETE_PRODUCT(product);
      await this.getProductList();
    },
    initProductEdit() {
      this.productEdit = {
        productId: '',
        groupId: '',
        productType: 'normal',
        costKr: 0,
        google: '',
        apple: '',
        startDate: null,
        endDate: null,
        serverLimit: 0,
        userLimit: 0
      }
    },
    editProduct(product) {
      this.insert = false;
      this.dialog = true;
      this.productEdit = Object.assign({}, product);
      this.addRewardItem = {};
      this.rewardItemList = this.productArrangedMap[product.productId] || [];
    },
    onCreate() {
      this.insert = true;
      this.dialog = true;
      this.initProductEdit();
      this.addRewardItem = {};
      this.rewardItemList = [];
    },
    onClose() {
      this.dialog = false
    },
    addProductId(productId, productList) {
      for(const product of productList) {
        product.productId = productId;
        product.materialQny = Number(product.materialQny);
      }
    },
    async onSave() {
      if( !this.checkNull(this.productEdit, [
        { key:'productId', text: '상품 아이디' }
      ])) return;

      this.addProductId(this.productEdit.itemId, this.rewardItemList);

      const saveFunc = this.insert ? this.CREATE_PRODUCT: this.UPDATE_PRODUCT;
      await saveFunc({productInfo: this.productEdit, productRewardList: this.rewardItemList || []});

      await this.getProductList();
      this.onClose();
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
    importCSVProdcut(file) {
      importCSV(file, 'productId', async (productList) => {
        const tableId = 'product'
        await updateDataTable(
          this.GET_TABLE_VERSION,
          this.UPDATE_MANY_PRODUCT,
          this.UPDATE_TABLE_VERSION,
          tableId,
          { productList } 
        )
        await this.getProductList();
      }) 
    },
    importCSVProductReward(file) {
      importCSV(file, 'productId', async (productRewardList) => {
        const tableId = 'productReward'
        await updateDataTable(
          this.GET_TABLE_VERSION,
          this.UPDATE_MANY_PRODUCT_REWARD,
          this.UPDATE_TABLE_VERSION,
          tableId,
          { productRewardList } 
        )
        await this.getProductList();
      }) 
    },
    exportCSVProduct() {
      exportCSV(this.productList, 'product.csv');
    },
    exportCSVProductReward() {
      exportCSV(this.productRewardList, 'productReward.csv');
    },
  }
};
</script>
