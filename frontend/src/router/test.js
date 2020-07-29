import { mapActions, mapState } from 'vuex';
import _ from 'lodash'

const no_image = require(`../assets/no_image.jpg`);
import config from '../../src/config/config';
var crc = require('crc');
const {s3Upload, excelExport, excelImport} = require("../util/fileutil");

export default {
  name: 'ProductInfo',
  data() {
    return {
      add_item: {},
      itemList: [],
      itemExchangeList: [],
      itemEditList: [],
      errorFile: '',
      itemCategoryList: [],
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
    addItem() {
      this.itemEditList.push(Object.assign({}, this.add_item));
      this.add_item = {}
    },
    async getItemList() {
      const result = await this.GET_ITEM_LIST();
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
    editItem(item) {
      this.insert = false;
      this.editedIndex = this.attendance_list.indexOf(item)
      this.editedItem = Object.assign({}, item)
      
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

              this.fetch_attendance_list();
            });
        })
      };

      reader.onerror = function(ex) { console.log(ex);};

      reader.readAsBinaryString(file);
    },
  }
};