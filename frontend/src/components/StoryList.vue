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
    <v-btn color="primary" dark class="mb-2" @click.prevent="createStory">신규 스토리 등록</v-btn>
    <v-btn color="primary" dark class="mb-2" @click.prevent="exportCSVStory">스토리 데이터 출력</v-btn>
    <v-file-input accept=".csv" label="스토리 데이터(csv)" @change="importCSVStory"></v-file-input>
    <v-dialog v-model="dialog">
      <TemplateStoryVue></TemplateStoryVue>
    </v-dialog>
    </v-container>
    <v-card v-for="(story, index) in storyList" :key="index" >
      <router-link :to="`/story-info/${story.storyId}`">
        <v-img :src="getSrcUrl(story)" width=212px height=212px>
        </v-img>
      </router-link>
      {{story.storyId}}
    </v-card>
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
export default {
  data() {
    return {
      dialog: false,
      storyList: null,
      updating: '',
      storyData: {},
      patchInfo: {},
    }
  },
  components: {
    TemplateStoryVue
  },
  computed: {
    ...mapState({
        CDN_URL: 'CDN_URL'
    }),
  },
  async created() {
    await this.getStoryList();
  },
  
  methods: {
    ...mapActions([
      'GET_STORY_LIST',
      'UPDATE_MANY_STORY',
      'GET_TABLE_VERSION',
      'UPDATE_TABLE_VERSION'
    ]),
    async getStoryList() {
      const body = await this.GET_STORY_LIST()
      
      this.storyList = body;
      this.patchInfo = 'patchInfo';
    },
    getSrcUrl(storyData) {
      return storyData.thumbnail ? `${this.CDN_URL}${storyData.storyId}/thumbnail/${storyData.thumbnailVersion}/${storyData.thumbnail}` :no_image;
    },
    createStory() {
      this.dialog=true;
      this.saveError='';

      this.$nextTick(() => {
        eventBus.$emit('createStory', this.storyData, true);
      })
      
      this.storyData = {
        status: 0,
      }
    },
    exportCSVStory() {
      exportCSV(this.storyList, 'story.csv');
    },
    importCSVStory(file) {
      importCSV(file, 'storyId', async (storyList) => {
        const tableId = 'story';

        await updateDataTable(
          this.GET_TABLE_VERSION,
          this.UPDATE_MANY_STORY,
          this.UPDATE_TABLE_VERSION,
          tableId,
          { storyList }
        );

        await this.getStoryList();
      })
    },
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
  width: 512px;
  height: 512px;
}
</style>
