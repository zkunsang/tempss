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
                텍스트 파일
            </v-col>
            <v-col>
              <v-btn :disabled="!storyData.textFile" @click="downloadTextFile">파일 다운로드</v-btn>
              <v-file-input accept="xml/*" label="File input" @change="onTextFileChange"></v-file-input>
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
              <AosUploadVue></AosUploadVue>
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
const {s3Upload} = require("../util/fileutil");
const {eventBus} = require('../util/eventBus');

const no_image = require(`../assets/no_image.jpg`);
export default {
  
  data() {
    return {
      thumbFile: null,
      thumbImg: null,
      textFile: null,
      dialog: false,
      patchInfo: 'temp',
      saveError: '',
      storyData: {},
      originStoryData: {},
      isNew: false
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
  async created() {
    this.storyId = this.$route.params.storyId;
    console.log(this.storyId);
    if( this.storyId ) {
      
      this.storyData =  await this.GET_STORY_INFO(this.storyId)
      this.originStoryData = Object.assign(this.storyData);
      this.thumbImg = this.getSrcUrl(this.storyData);
    }

    this.isNew = !this.storyId;
    console.log(this.isNew);
  },
  watch: {
  },
  methods: {
    ...mapActions([
      'GET_STORY_INFO',
      'CREATE_STORY',
      'UPDATE_STORY'
    ]),
    getStatusLabel() {
      return this.storyData.status ? "활성" : "비활성"
    },
    getSrcUrl(storyData) {
      if(!storyData) return no_image;
      const thumbUrl = `${this.CDN_URL}${storyData.storyId}/thumbnail/${storyData.thumbnailVersion}/${storyData.thumbnail}`;
      return storyData.thumbnail ? thumbUrl : no_image;
    },
    onTextFileChange(textFile) {
      if(!textFile) {
        this.textFile = null;
        return;
      }
      
      textFile.arrayBuffer().then((data) => {
        this.textFile = textFile;
        this.textFile.crc = crc.crc32(data).toString(16);
      });
    },
    getTextFileUrl() {
      if(!this.storyData.textFile) return null; 
      return `${this.CDN_URL}${this.storyData.storyId}/textFile/${this.storyData.textFileVersion}/${this.storyData.textFile}`;
    },
    downloadTextFile() {
      const link = document.createElement('a')
      link.href = this.getTextFileUrl();
      link.setAttribute('download', `${this.storyData.textFile}`)
      document.body.appendChild(link)
      link.click()
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
        this.storyData.thumbnail = `${this.thumbFile.name}`;
        this.storyData.thumbnailCrc32 = this.thumbFile.crc;
        this.storyData.thumbnailVersion = this.originStoryData.thumbnailVersion || 0 + 1;
      }

      let saveFunc = this.isNew ? this.CREATE_STORY : this.UPDATE_STORY;
      this.storyData.status = this.storyData.status ? 1 : 0;

      if(this.textFile) {
        this.storyData.textFile = `${this.textFile.name}`;
        this.storyData.textFileCrc32 = this.textFile.crc;
        this.storyData.textFileVersion = this.originStoryData.textFileVersion || 0 + 1;
      }

      const result = await saveFunc(this.storyData);

      if( this.thumbFile ) {
        await s3Upload(this.thumbFile, `${this.storyData.storyId}/thumbnail/${this.storyData.thumbnailVersion}/${this.storyData.thumbnail}`);
      }

      if(this.textFile) {
        await s3Upload(this.textFile, `${this.storyData.storyId}/textFile/${this.storyData.textFileVersion}/${this.storyData.textFile}`);
      }

      this.dialog = false
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
