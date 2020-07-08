<template>
    <v-card>
    <v-card-title v-if="isNew">
        <span class="headline">신규 스토리 등록</span>
    </v-card-title>
    <v-alert v-if="saveError" type="error">{{saveError}}</v-alert>
    <v-container outline class="grey lighten-5">
    <v-row>
        <v-col cols=6>
        <v-card>
            <v-row>
            <v-col >
                활성화
            </v-col>
            <v-col>
                <v-switch class="flag" v-model="storyData.status" :label="getStatusLabel()"></v-switch>
            </v-col>
            </v-row>
        </v-card>
        <v-divider/>
        <v-card>
            <v-row>
            <v-col>
                스토리 코드
            </v-col>
            <v-col>
                <v-text-field
                v-model="storyData.storyId"
                placeholder="스토리 코드"
                ref="inputTitle"
                :disabled="!isNew"
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
                <img class="thumbImg" v-if="!!thumbImg" :src="thumbImg" width="1px" />
                <img class="thumbImg" v-else :src="thumbImg" width="1px"/>
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
                v-model="storyData.summary"
                ></v-textarea>
            </v-col>
            </v-row>
        </v-card>
        <v-divider/>
        </v-col>
        <v-col  cols=6>
        <v-card>
            <v-row>
            <v-col>
                리소스
            </v-col>
            <v-col>
              <AosUploadVue :story-data="storyData"></AosUploadVue>
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
</template>


<script>
import {mapActions, mapState} from 'vuex'
import AosUploadVue from './AosUpload.vue';

var crc = require('crc');
const {s3_upload} = require("../util/fileutil");

const no_image = require(`../assets/no_image.jpg`);
export default {
  props: ['storyData', 'isNew'],
  data() {
    return {
      thumbFile: null,
      thumbImg: null,
      dialog: false,
      patchInfo: 'temp',
      saveError: '',
    }
  },
  components: {
    AosUploadVue
  },
  computed: {
    ...mapState({
        CDN_URL: 'CDN_URL'
    }),
  },
  created() {
    this.thumbImg = this.getSrcUrl(this.storyData);
  },
  watch: {
    storyData() {
      this.thumbImg = this.getSrcUrl(this.storyData);
    }
  },
  methods: {
    ...mapActions([
      'CREATE_STORY',
      'UPDATE_STORY',
      'GET_STORY_LIST'
    ]),
    getStatusLabel() {
      return this.storyData.status ? "활성" : "비활성"
    },
    getSrcUrl(storyData) {
      return storyData.thumb ? `${this.CDN_URL}${storyData.thumb}` :no_image;
      //return no_image;
    },
    
    onThumbChange(thumbFile) {
      if(!thumbFile) {
        this.thumbImg = null;
        this.thumbFile = null;
        return;
      }
      
      thumbFile.arrayBuffer().then((data) => {
        this.thumbFile = thumbFile;
        this.thumbFile.crc = crc.crc32(data).toString(16);
        this.thumbImg = URL.createObjectURL(thumbFile);
      });
    },
    async onSave() {
      if( !this.storyData.storyId ) {
        this.$nextTick(() => this.$refs.inputTitle.focus())
        this.saveError = '스토리 코드를 입력해주세요';
        return;
      }

      // 기타 데이터 세팅
      if(this.thumbFile) {
        this.storyData.thumb = `images/${this.patchInfo}/${this.thumbFile.name}`;
        this.storyData.crc = this.thumbFile.crc;
      }

      const saveFunc = this.isNew ? this.CREATE_STORY : this.UPDATE_STORY;
      saveFunc(this.storyData).then( async () => {
        if( this.thumbFile ) {
          await s3_upload(this.thumbFile, `images/${this.patchInfo}/${this.thumbFile.name}`);
        }
        this.dialog = false
        // 성공하면 파일 업로드
      });
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
.thumbImg {
  height: 212px;
  width: 212px;
}
</style>
