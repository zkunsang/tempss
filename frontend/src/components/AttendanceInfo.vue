<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      <v-data-table
        dense
        :headers="headers"
        :items="attendance_list"
        sort-by="calories"
        class="elevation-1"
      >
      <template v-slot:top>
        <v-alert v-if="isLive" type="info" dense>데이터 수정 -> 디자인 적용</v-alert>    
          <v-toolbar flat color="white">
            <v-toolbar-title>출석 리스트</v-toolbar-title>
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
                          <v-text-field :disabled="!insert" v-model="editedItem.reward_index" label="일련번호"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="editedItem.reward_desc" label="출석 설명"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>  
                    <v-col cols="12" sm="8">
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="4">
                            <v-select
                                v-model="add_item.reward_type"
                                :items="reward_type_list"
                                item-text="text"
                                item-value="value"
                                label="보상 타입"
                                persistent-hint
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="4">
                            <v-select
                                v-model="add_item.reward_category"
                                :items="item_category_list"
                                item-text="text"
                                item-value="value"
                                label="아이템 카테고리"
                                persistent-hint
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="4">
                            <v-text-field v-model="add_item.reward_value" label="아이템 개수"></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="4">
                            <v-select
                                v-model="add_item.seq_title"
                                :items="title_list"
                                item-text="name"
                                item-value="seq_title"
                                label="타이틀 리스트"
                                persistent-hint
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="4">
                            <v-btn @click="addItem">추가</v-btn>
                          </v-col>
                          </v-row>
                        <v-divider></v-divider>
                        <div v-for="(item, index) in itemEditList" :key="index">
                          {{item.reward_type}}
                          X {{item.reward_value}}
                          {{get_title_name(item.seq_title)}}
                          <v-btn @click="deleteAttendanceItem(item)">삭제</v-btn>
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
          <v-icon small class="mr-2" @click="editItem(item)"> edit </v-icon>
          <v-icon small @click="deleteItem(item)"> delete </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary">Reset</v-btn>
        </template>
      </v-data-table>
      
      <v-row>
        <v-col>
          <v-btn @click="export_file">출석 리스트</v-btn>
          <v-file-input label="출석 리스트" @change="import_file"></v-file-input>  
        </v-col>
        <v-col>
          <v-btn @click="export_item_file">출석 아이템 리스트</v-btn>
          <v-file-input label="출석 아이템 리스트" @change="import_item_file"></v-file-input>  
          <v-alert v-if="error_file_item" type="error">{{error_file_item}}</v-alert>
        </v-col>
      </v-row>
    
    </v-layout>
  </v-container>
</template>
<script src="xlsx.full.min.js"></script>
<script src="js/jhxlsx.js"></script>

<script>
import XLSX from 'xlsx';
import { mapActions, mapState } from 'vuex';
import _ from 'lodash'

const no_image = require(`../assets/no_image.jpg`);
import config from '../../src/config/config';
var crc = require('crc');
const {s3_upload} = require("../util/fileutil");

const attendance_file_name = `ATTENDANCE.xlsx`;
const attendance_item_file_name = `ATTENDANCE_ITEM.xlsx`;


export default {
  name: 'ProductInfo',
  data() {
    return {
      add_item: {},
      item_list: [],
      itemEditList: [],
      title_list: [],
      title_arranged_map: null,
      image_url: "",
      image_file: {},
      patch_info: null,
      error_file_item: '',
      item_category_list: [
        {text: "재화", value: "GOOD"},
        {text: "티켓", value: "TICKET"},
      ],
      attendance_list: [],
      reward_type_list: [
        {text: "젬", value: "GEM"},
        {text: "무료젬", value: "FREE_GEM"},
        {text: "에너지", value: "ENERGY"},
      ],
      good_item_list: [
        {text: "젬", value: "GEM"},
        {text: "무료젬", value: "FREE_GEM"},
        {text: "에너지", value: "ENERGY"},
      ],
      insert: false,
      dialog: false,
      headers: [
        { text: '일련번호(일차)', value: 'reward_index' },
        { text: '보상 이름', value: 'reward_desc' },
        { text: '보상 아이템', value: 'item' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      editedItem: {}
    }
  },
  created() {
    this.fetch_attendance_list();
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
      'FETCH_ATTENDANCE',
      'UPDATE_ATTENDANCE',
      'UPDATE_ATTENDANCE_LIST',
      'UPDATE_ATTENDANCE_ITEM_LIST',
      'INSERT_ATTENDANCE',
      'DELETE_ATTENDANCE'
    ]),
    get_title_name(seq_title) {
      if(seq_title) {
        return this.title_arranged_map[seq_title].name;
      }
    },
    addItem() {
      this.itemEditList.push(Object.assign({}, this.add_item));
      this.add_item = {}
    },
    getItemId() {
      if(this.add_item.item_category == "TICKET") {
        return this.ticket_item_list;
      }
      else if(this.add_item.item_category == "GOOD") {
        return this.good_item_list;
      }
      else if(this.add_item.item_category == "STAT_LIMIT") {
        return this.stat_limit_list;
      }
    },
    fetch_attendance_list() {
      // this.attendance_list = [];
      // this.item_list = [];

      this.FETCH_ATTENDANCE()
        .then((body_data) => {
          this.attendance_list = body_data.attendance_list;
          this.item_list = body_data.attendance_item_list;

          console.log(this.attendance_list);
          console.log(this.item_list);
          this.attendance_item_arranged_map = {};

          this.item_list.forEach((item) => {
            let seq_item_list = this.attendance_item_arranged_map[item.reward_index];
            if(seq_item_list) {
              seq_item_list.push(item);
            }
            else {
              this.attendance_item_arranged_map[item.reward_index] = []
              this.attendance_item_arranged_map[item.reward_index].push(item);
            }
          });

          this.title_list = body_data.title_list;
          this.title_arranged_map = _.keyBy(this.title_list, "seq_title");
        });
    },
    onImageChange(upload_file) {
      if(!upload_file) {
        this.image_file = {};
        return;
      }
      
      upload_file.arrayBuffer().then((data) => {
        this.image_file.file = upload_file;
        this.image_file.crc = crc.crc32(data).toString(16);
        this.image_file.thumb = URL.createObjectURL(upload_file);
        this.image_url = URL.createObjectURL(upload_file);
      }) 
    },
    editItem (item) {
      this.insert = false;
      this.editedIndex = this.attendance_list.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.image_url = this.editedItem.banner_img;


      this.itemEditList = this.attendance_item_arranged_map[item.reward_index];
      console.log(this.itemEditList);
      if(!this.itemEditList) this.itemEditList = [];
      
      this.dialog = true
    },
    deleteItem(item) {
      if(!confirm('해당 출석을 삭제 하시겠습니까?')) return;
      this.DELETE_ATTENDANCE(item)
        .then(() => {
          this.fetch_attendance_list();
        })
    },
    deleteAttendanceItem(item) {
      const index = this.itemEditList.indexOf(item)
      this.itemEditList.splice(index, 1)
    },
    onCreate(item) {
      this.insert = true;
      this.dialog = true;
      this.editedItem = {}
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    async save () {
      this.insert ?
        await this.INSERT_ATTENDANCE({attendance_info: this.editedItem, attendance_item_list: this.itemEditList}):
        await this.UPDATE_ATTENDANCE({attendance_info: this.editedItem, attendance_item_list: this.itemEditList});

      await this.fetch_attendance_list();
      this.close();
    },
    import_file(file) {
      if(!file) return;
      var reader = new FileReader();
      reader.onload = (e) => {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
            type: 'binary'
          });
          
          workbook.SheetNames.forEach((sheetName) => {
          var json_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
          this.UPDATE_ATTENDANCE_LIST({attendance_list: json_object})
            .then(() => {
              this.fetch_attendance_list();
            });
        })
      };

      reader.onerror = function(ex) { console.log(ex);};

      reader.readAsBinaryString(file);
    },
    export_file() {
        var ws = XLSX.utils.json_to_sheet(this.attendance_list);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws,"attendance");
        XLSX.writeFile(wb, attendance_file_name);
    },
    import_item_file(file) {
      if(!file) return;
      var reader = new FileReader();
      reader.onload = (e) => {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
            type: 'binary'
          });
          
          workbook.SheetNames.forEach((sheetName) => {
          var json_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
          this.UPDATE_ATTENDANCE_ITEM_LIST({attendance_item_list: json_object})
            .then((response_body) => {
              let wrong_product = response_body.wrong_product;

              console.log(response_body);
              if(wrong_product && wrong_product.length) {
                this.error_file_item = `${wrong_product.join(',')} - 잘못된 reward_index `
              }

              this.fetch_attendance_list();
            });
        })
      };

      reader.onerror = function(ex) { console.log(ex);};

      reader.readAsBinaryString(file);
    },
    export_item_file() {
        var ws = XLSX.utils.json_to_sheet(this.item_list);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws,"attendance_item");
        XLSX.writeFile(wb, attendance_item_file_name);
    },

  }
};
</script>
