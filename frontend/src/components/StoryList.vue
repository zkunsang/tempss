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
    <v-dialog v-model="dialog" >
      <TemplateStoryVue :story-data="storyData" :is-new="true"></TemplateStoryVue>
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

var crc = require('crc');
const {s3Upload} = require("../util/fileutil");

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
  created() {
    this.GET_STORY_LIST()
      .then((body) => {
        this.storyList = body;
        // this.patchInfo = body.patchInfo;
        this.patchInfo = 'patchInfo';
      });
  },
  methods: {
    ...mapActions([
      'GET_STORY_LIST'
    ]),
    getSrcUrl(storyData) {
      return storyData.thumb ? `${this.CDN_URL}${storyData.thumb}` :no_image;
      // return no_image;
    },
    createStory() {
      this.dialog=true;
      this.saveError='';

      this.storyData={
        status: 0,
      }
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
