<template>
  <v-container>
    <v-layout text-center wrap>
      <TemplateStoryVue 
        :story-data="storyData" 
        :is-new="false">
      </TemplateStoryVue>
    </v-layout>
  </v-container>
</template>

<script>

import TemplateStoryVue from './TemplateStory.vue';
import {mapActions, mapState} from 'vuex'

var crc = require('crc');
const {s3_upload} = require("../util/fileutil");

const no_image = require(`../assets/no_image.jpg`);
export default {
  data() {
    return {
      storyData: {},
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
    this.storyId = this.$route.params.storyId;
    this.GET_STORY_INFO(this.storyId)
        .then((result) => {
            this.storyData = result;
        });
  },
  methods: {
    ...mapActions([
      'GET_STORY_INFO',
    ]),
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
