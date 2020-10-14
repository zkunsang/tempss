<template>
  <v-container>
    <v-layout text-center wrap>
      <TemplateStoryVue></TemplateStoryVue>
    </v-layout>
  </v-container>
</template>

<script>

import TemplateStoryVue from './TemplateStory.vue';
import {mapActions, mapState} from 'vuex'
import {eventBus} from '../util/eventBus';

var crc = require('crc');

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
  async created() {
    
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
