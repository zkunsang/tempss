<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      <v-row>
        <v-col>
          쿠폰
          <v-row>
            <v-col>
              <v-text-field
                label="couponId"
                v-model="newCoupon.couponId"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="userLimit"
                v-model="newCoupon.userLimit"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="startDate"
                v-model="newCoupon.startDate"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="endDate"
                v-model="newCoupon.endDate"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-btn
                @click="onCouponAdd"
                color='primary'
              >적용</v-btn>
            </v-col>
          </v-row>
          <v-dialog v-model="dialog">
            <v-card>
              <v-card-title>
                <span class="쿠폰 편집"></span>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols=12 sm=3>
                    <v-container>
                      <v-text-field 
                        disabled
                        v-model="editCoupon.couponId" 
                        label="쿠폰 아이디"
                      ></v-text-field>
                      <v-text-field 
                        v-model="editCoupon.userLimit" 
                        label="유저 제한"
                      ></v-text-field>
                      <v-text-field 
                        v-model="editCoupon.startDate" 
                        label="시작"
                      ></v-text-field>
                      <v-text-field 
                        v-model="editCoupon.endDate" 
                        label="종료"
                      ></v-text-field>
                    </v-container>
                  </v-col>
                  <v-col>
                    <v-container>
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
                        <v-col cols="12" sm="4">
                          <v-btn @click="addReward">추가</v-btn>
                        </v-col>
                      </v-row>
                      <v-divider></v-divider>
                      <v-data-table
                        :headers="couponRewardHeaders"
                        :items="editCouponRewardList"
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
                    </v-container>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols=12 sm=11>
                  </v-col>
                  <v-col>
                    <v-btn
                      @click="editSave"
                    >
                      수정
                    </v-btn>
                    <v-btn
                      @click="editCancel"
                    >
                      취소
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-data-table
            dense
            :headers="couponHeaders"
            :items="couponList"
            sort-by="tableId"
            class="elevation-1"
          >
          <template v-slot:body="{ items }">
            <tbody>
              <tr cols=5
                v-for="(item) in items" 
                :class="item.selected ? 'custom-highlight-row' : ''" 
                :key="item.couponId"
                @click="activerow(item)"
              >
                <td>{{ item.couponId }}</td>
                <td>{{ item.userLimit }}</td>
                <td>{{ item.startDate }}</td>
                <td>{{ item.endDate }}</td>
                <td>
                  <v-icon small class="mr-2" @click="onEditCoupon(item)"> edit </v-icon>
                  <v-icon small @click="onDeleteCoupon(item)"> delete </v-icon>
                </td>
              </tr>
            </tbody>
          </template>
          </v-data-table>
        </v-col>
        <v-col>
          <v-col>
            <v-file-input accept=".csv" label="아이템 데이터(csv)" @change="importCSVItem"></v-file-input>
          </v-col>
          <v-data-table
            dense
            :headers="couponCodeHeaders"
            :items="couponCodeList"
            sort-by="tableId"
            class="elevation-1"
          >
          </v-data-table>

        </v-col>
      
      </v-row>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
const { exportCSV, importCSV } = require("../util/fileutil");
const DateUtil = require('../util/DateUtil');
const ArrayUtil = require('../util/ArrayUtil');

export default {
  name: 'coupon',
  data() {
    return {
      addItem: {},
      dialog: false,
      addRewardItem: {},
      newCoupon: {},
      editCoupon: {},
      editCouponRewardList: [],
      selectedCoupon: {},
      couponList: [],
      couponCodeList: [],
      couponRewardList: [],
      couponRewardMap: {},
      couponHeaders: [
        { text: '쿠폰', value: 'couponId' },
        { text: '유저 제한', value: 'userLimit' },
        { text: 'startDate', value: 'startDate' },
        { text: 'endDate', value: 'endDate' },
        { text: 'action', value: 'action' }
      ],
      couponRewardHeaders: [
        { text: 'itemId', value: 'itemId' },
        { text: 'itemQny', value: 'itemQny' },
      ],
      couponCodeHeaders: [
        { text: 'couponCode', value: 'couponCode' },
        { text: 'uid', value: 'uid' },
        { text: 'updateDate', value: 'updateDate' },
      ]
    }
  },
  created() {
    this.getCouponList();
  },
  computed: {
    ...mapState({
        ITEM_LIST: 'ITEM_LIST'
    }),
  },
  methods: {
    ...mapActions([
      'LIST_COUPON',
      'CREATE_COUPON',
      'DELETE_COUPON',
      'UPDATE_COUPON',
      'LIST_COUPON_CODE',
      'INSERT_COUPON_CODE'
    ]),
    async getCouponList() {
      const result = await this.LIST_COUPON();
      this.couponList = result.couponList || [];
      this.couponRewardList = result.couponRewardList || [];

      this.couponRewardMap = ArrayUtil.getMapArrayByKey(this.couponRewardList, "couponId");
    },
    async getCouponCodeList(couponId) {
      const result = await this.LIST_COUPON_CODE({couponId});
      this.couponCodeList = result.couponCodeList || [];
    },
    async onCouponAdd() {
      const createCoupon = {}
      createCoupon.couponId = this.newCoupon.couponId;
      createCoupon.startDate = DateUtil.dsToUts(this.newCoupon.startDate, 'YYYY-MM-DD');
      createCoupon.endDate = DateUtil.dsToUts(this.newCoupon.endDate, 'YYYY-MM-DD');
      createCoupon.userLimit = parseInt(this.newCoupon.userLimit);

      await this.CREATE_COUPON(createCoupon);
      await this.getCouponList();
    },
    async onDeleteCoupon(item) {
      const couponId = item.couponId;
      await this.DELETE_COUPON({couponId});
      await this.getCouponList();
    },
    onEditCoupon(item) {
      this.dialog = true;
      this.editCoupon = Object.assign({}, item);
      this.editCouponRewardList = [...this.couponRewardMap[this.editCoupon.couponId]];
    },
    addReward() {
      if(!this.addItem.itemId)
        return;
      
      if(!this.addItem.itemQny) 
        return;
      
      this.addItem.itemQny = parseInt(this.addItem.itemQny);
      this.editCouponRewardList.push(this.addItem);
      this.addItem = {};
    },
    async editSave() {
      const couponInfo = {}
      couponInfo.couponId = this.editCoupon.couponId;
      couponInfo.startDate = DateUtil.dsToUts(this.editCoupon.startDate, 'YYYY-MM-DD');
      couponInfo.endDate = DateUtil.dsToUts(this.editCoupon.endDate, 'YYYY-MM-DD');
      couponInfo.userLimit = parseInt(this.editCoupon.userLimit);
      
      await this.UPDATE_COUPON({
        couponInfo,
        couponRewardList: this.editCouponRewardList
      });
    },
    editCancel() {
      this.dialog = false;
      this.editCoupon = {};
    },
    async activerow(item) {
      this.$set(this.selectedCoupon, 'selected', false);
      this.$set(item, 'selected', true)

      this.selectedCoupon = item;

      await this.getCouponCodeList(this.selectedCoupon.couponId);
    },
    importCSVItem(file) {
      console.log(file);
      importCSV(file, 'couponId', async (couponCodeList) => {
        const couponId = this.selectedCoupon.couponId;
        await this.INSERT_COUPON_CODE({couponId, couponCodeList});
        await this.LIST_COUPON_CODE({couponId});
        this.couponCodeList = couponCodeList;
      })
    },
  }
}
</script>

<style>
.custom-highlight-row{
  background-color: pink
}

</style>
