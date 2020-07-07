<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
    <v-overlay :value="updating">
      {{updating}}
    </v-overlay>
    <v-container>
    <v-btn color="primary" dark class="mb-2" @click.prevent="createNewTitle">신규 스토리 등록</v-btn>
    <v-dialog v-model="dialog" >
      <v-card>
        <v-card-title>
          <span class="headline">신규 스토리 등록</span>
        </v-card-title>
        <v-alert v-if="save_error" type="error">{{save_error}}</v-alert>
        <v-container outline class="grey lighten-5">
        <v-row>
          <v-col>
            <v-card>
              <v-row>
                <v-col >
                  활성화
                </v-col>
                <v-col>
                  <v-switch  class="flag" v-model="title_info.active_flag" :label="get_switch_flag()"></v-switch>
                </v-col>
              </v-row>
            </v-card>
            <v-divider/>
            <v-card>
              <v-row>
                <v-col >
                  무료
                </v-col>
                <v-col>
                  <v-switch  class="flag" v-model="title_info.active_flag" :label="get_switch_flag()"></v-switch>
                </v-col>
              </v-row>
            </v-card>
            <v-divider/>
            <v-card>
              <v-row>
                <v-col>
                  제목
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="title_info.name"
                    placeholder="타이틀 제목"
                    ref="inputTitle"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card>
            <v-divider/>
            <v-card>
              <v-row>
                <v-col>
                  이미지
                </v-col>
                <v-col>
                  <img v-if="!!thumb_img" :src="thumb_img" width="212px"/>
                  <img v-else :src="thumb_img" width="212px"/>
                  <v-file-input accept="image/*" label="File input" @change="onThumbChange"></v-file-input>
                </v-col>
              </v-row>
            </v-card>
            <v-divider/>
            <v-card>
              <v-row>
                <v-col>
                  <v-textarea
                    label="줄거리"
                    v-model="title_info.summary"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-card>
            <v-divider/>
          </v-col>
        </v-row>
      </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="onSave">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-container>
    <v-card v-for="title in title_list" :key="title.seq_title" >
      <router-link :to="`/title_info/${title.seq_title}/title_info`">
        <v-img :src="get_src_url(title)" max-width=212px>
        </v-img>
      </router-link>
    </v-card>
    </v-layout>
  </v-container>
</template>

<script>
import {mapActions, mapState} from 'vuex'

var crc = require('crc');
const {s3_upload} = require("../util/fileutil");

const no_image = require(`../assets/no_image.jpg`);
export default {
  data() {
    return {
      updating: "",
      thumb_file: null,
      thumb_img: null,
      new_thumb_file: null,
      new_thumb_img: null,
      dialog: false,
      title_list: null,
      title_info: {},
      save_error: '',
      day_items: [
        {text: "없음", value: "none"},
        {text: "월", value: "mon"},
        {text: "화", value: "tue"},
        {text: "수", value: "wed"},
        {text: "목", value: "thr"},
        {text: "금", value: "fri"},
        {text: "토", value: "sat"},
        {text: "일", value: "sun"},
        {text: "완결", value: "comp"},
      ],
    }
  },
  computed: {
    ...mapState({
        CDN_URL: 'CDN_URL'
    }),
    swatchStyle() {
      const { title_color, title_color_menu } = this.title_info
      return {
        backgroundColor: title_color,
        cursor: 'pointer',
        height: '30px',
        width: '30px',
        borderRadius: title_color_menu ? '50%' : '4px',
        transition: 'border-radius 200ms ease-in-out',
      }
    }
    
  },
  watch: {
    title_info(val) {
      console.log("watch!")
    },
    thumb_img(val) {
      console.log("thumb_img")
    }
  },
  created() {
    this.FETCH_TITLE_LIST()
      .then((body_data) => {
        this.title_list = body_data.title_list;
        this.patch_info = body_data.patch_info;
      });

    
  },
  methods: {
    ...mapActions([
      'FETCH_TITLE_LIST',
      'INSERT_TITLE',
      'META_TITLE_UPDATE',
      'OPERATE_SERVER'
    ]),
    async metaDataUpdate() {
      this.updating = "메타 파일 업데이트 중 잠시만 기다려 주세요"
      await this.META_TITLE_UPDATE();
      this.updating = "서버 중지중...."
      await this.OPERATE_SERVER({server: "test", operation: "stop"});
      this.updating = "서버 재시작...."
      await this.OPERATE_SERVER({server: "test", operation: "start"});
      this.updating = ""
    },
    createNewTitle() {
      this.dialog=true;
      this.thumb_img=null;
      this.thumb_file=null;
      this.new_thumb_file=null;
      this.new_thumb_img=null;
      this.save_error='';

      this.title_info={
        active_flag: false,
        title_color: "#ffffff",
        label_type: "NONE",
        view_rating: "ALL",
        closet_active_yn: "N",
        publish_day: {
          value: 'none'
        }
      }
    },
    onThumbChange(upload_file) {
      if(!upload_file) {
        this.thumb_img = null;
        this.thumb_file = null;
        return;
      }
      
      upload_file.arrayBuffer().then((data) => {
        this.thumb_file = upload_file;
        this.thumb_file.crc = crc.crc32(data).toString(16);
        this.thumb_img = URL.createObjectURL(upload_file);
      }) 
    },
    onNewThumbChange(upload_file) {
      if(!upload_file) {
        this.new_thumb_img = null;
        this.new_thumb_file = null;
        return;
      }

      upload_file.arrayBuffer().then((data) => {
        this.new_thumb_file = upload_file;
        this.new_thumb_file.crc = crc.crc32(data).toString(16);
        this.new_thumb_img = URL.createObjectURL(upload_file);
      }) 
    },
    get_src_url(title_info) {
      return title_info.thumb ? `${this.CDN_URL}${title_info.thumb}` :no_image;
    },
    get_switch_flag() {
      return this.title_info.active_flag ? "활성" : "비활성"
    },
    async onSave() {
      if( !this.title_info.name ) {
        this.$nextTick(() => this.$refs.inputTitle.focus())
        this.save_error = '타이틀을 입력해주세요';
        return;
      }

      this.dialog = false

      // 기타 데이터 세팅
      if(this.thumb_file) {
        this.title_info.thumb = `images/${this.patch_info}/${this.thumb_file.name}`;
        this.title_info.crc_thumb = this.thumb_file.crc;
      }
      
      this.title_info.publish_day = this.title_info.publish_day.value;
      this.title_info.active_flag = this.title_info.active_flag ? "Y" : "N";
      this.title_info.patch_version = this.patch_info;

      this.INSERT_TITLE(this.title_info).then( async () => {

        this.dialog = false
        // 성공하면 파일 업로드
        if( this.thumb_file ) await s3_upload(this.thumb_file, `images/${this.patch_info}/${this.thumb_file.name}`);
        if( this.new_thumb_file ) await s3_upload(this.new_thumb_file, `images/${this.patch_info}/${this.new_thumb_file.name}`);
      })
    }
  }
};
</script>

<style>
.card {
  width: 75px;
  height: 100px;
  float: left;
  margin-right: 5px;
  margin-bottom: 5px;
  border-radius: 2px;
}
</style>
