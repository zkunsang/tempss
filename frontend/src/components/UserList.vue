<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
    <v-overlay :value="updating">
      {{updating}}
    </v-overlay>
    <v-dialog
      v-model="dialog"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          class="mb-2"
          v-bind="attrs"
          v-on="on"
        >
          New Item
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline"></span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="editedItem.uid"
                  label="아이디"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="editedItem.email"
                  label="이메일"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="editedItem.provider"
                  label="로그인"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="editedItem.status"
                  label="상태"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="editedItem.lastLoginDate"
                  label="최종 로그인"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="editedItem.createDate"
                  label="가입일"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="editedItem.fcmToken"
                  label="fcmToken"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="8">
                <v-data-table
                  :headers="itemHeaders"
                  :items="itemList"
                >
                <template v-slot:body="{ items }">
                  <tbody>
                    <tr cols=6
                      v-for="(item) in items" 
                      :class="item.isChanged ? 'custom-highlight-row' : ''" 
                      :key="item.name"
                    >
                      <td >{{ item.itemId }}</td>
                      <td style="width:10%">
                        <v-text-field
                          v-model="item.itemQny"
                          @change="onItemQnyChange(item)"
                          type="number"
                        >
                        </v-text-field>
                      </td>
                      <td>{{ item.createDate }}</td>
                      <td>{{ item.updateDate }}</td>
                    </tr>
                  </tbody>
                </template>
                </v-data-table>
              </v-col>
              <v-col cols="4">
                <v-row>
                  <v-col>
                    <v-autocomplete
                      label="itemId"
                      :items="ITEM_LIST.map(item => item.itemId)"
                      v-model="addItem.itemId"
                    >
                    itemId
                    </v-autocomplete>
                  </v-col>
                  <v-col>
                    <v-text-field
                      label='itemQny'
                      v-model="addItem.itemQny"
                      type="number"
                    >
                    itemQny
                    </v-text-field>
                  </v-col>
                  <v-col>
                    <v-btn
                      @click="onAddItem"
                      :disabled='!this.addItem.itemId || !this.addItem.itemQny || this.addItem.itemQny == 0'
                    >추가
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-data-table
                    :headers="newItemHeaders"
                    :items="newItemList"
                  >
                  <template v-slot:[`item.delete`]="{item}">
                    <v-icon
                      small
                      @click="deleteItem(item)"
                    >
                      mdi-delete
                    </v-icon>
                  </template>
                  </v-data-table>
                </v-row>
                <v-row>
                  <v-textarea
                    label="변경 사유"
                    v-model="editedItem.reason"
                  ></v-textarea>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="onSave"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-container>
    <v-data-table
      :headers="headers"
      :items="userList"
      @click:row="editItem"
    >
    <!-- <template v-slot:[`item.uid`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
      </v-icon>
    </template> -->
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
const { updateDataTable } = require('../util/dataTableUtil');

const no_image = require(`../assets/no_image.jpg`);
const ArrayUtil = require('../util/ArrayUtil');

export default {
  data() {
    return {
      dialog: false,
      userList: [],
      itemList: [],
      newItemList: [],
      updating: '',
      editedItem: {},
      addItem: {},
      addError: false,
      selectedRow: null,
      editUid: "",
      headers: [
        { text: '아이디', value: 'uid' },
        { text: '이메일', value: 'email' },
        { text: '로그인 방법', value: 'provider' },
        { text: '상태', value: 'status' },
        { text: '로그인', value: 'lastLoginDate' },
        { text: '가입일', value: 'createDate' },
      ],
      itemHeaders: [
        { text: '아이템', value: 'itemId' },
        { text: '개수', value: 'itemQny' },
        { text: '획득 일자', value: 'createDate' },
        { text: '수정 일자', value: 'updateDate' },
      ],
      newItemHeaders: [
        { text: '아이템', value: 'itemId' },
        { text: '개수', value: 'itemQny' },
        { text: '삭제', value: 'delete' },
      ],
    }
  },
  computed: {
    ...mapState({
        CDN_URL: 'CDN_URL',
        ITEM_LIST: 'ITEM_LIST'
    }),
  },
  async created() {
    await this.getUserList();
  },
  
  methods: {
    ...mapActions([
      'GET_USER_LIST',
      'GET_USER_INVENTORY',
      'USER_EDIT'
    ]),
    async getUserList() {
      const body = await this.GET_USER_LIST();
      if(!this.ITEM_LIST) {
        await this.LIST_ITEM();
      }

      this.userList = body.userList;
    },
    async editItem(item) {
      this.dialog = true;
      this.editedItem = item;
      this.editUid = item.uid;

      const uid = item.uid;
      
      this.newItemList = [];
      const body = await this.GET_USER_INVENTORY({uid});
      
      for(const item of body.inventoryList) {
        item.originalCount = item.itemQny;
        item.isChanged = false;
      }
      this.itemList = body.inventoryList;
    },
    rowSelect(idx) {
      this.selectedRow = idx;
    },
    onItemQnyChange(item) {
      item.itemQny = parseInt(item.itemQny);
      item.isChanged = item.originalCount !== item.itemQny;
      console.log(item.isChanged, item.originalCount, item.itemQny);
    },
    onAddItem() {
      if(!this.addItem.itemId || !this.addItem.itemQny)  {
        return;
      }
      
      console.log(this.addItem);
      this.newItemList.push(this.addItem);
      this.addItem = {};
    },
    deleteItem(item) {
      this.newItemList = this.newItemList.filter((i) => i !== item);
    },
    async onSave() {
      // 변경 아이템 확인
      let itemList = this.itemList.filter(item => item.originalCount !== item.itemQny);

      // input, delete아이템 분리
      itemList = itemList.map(item => {return {itemId: item.itemId, itemQny: item.itemQny - item.originalCount}});
      
      for(const item of this.newItemList) {
        itemList.push(item);
      }

      const inputItemMap = ArrayUtil.getMapArrayByKey(itemList, 'itemId');
      const itemKeyList = Object.keys(inputItemMap);

      const newItemList = [];
      for(const itemId of itemKeyList) {
        const specificItemList = inputItemMap[itemId];

        const newItem = { itemId, itemQny: 0};
        
        for(const item of specificItemList) {
          newItem.itemQny += parseInt(item.itemQny);
        }

        newItemList.push(newItem);
      }
      const uid = this.editUid;
      const inventory = newItemList;
      const reason = this.editedItem.reason;
      const userInfo = { uid, inventory, reason };
      await this.USER_EDIT(userInfo);
    }
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
