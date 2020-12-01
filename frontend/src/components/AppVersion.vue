<template>
  <v-container>
    <v-layout>
      <v-row>
        <v-col cols=12 sm=3 md=3>
          <v-text-field 
            label="aosVersion"
            v-model="aosVersion"
            disabled>
          </v-text-field>
        </v-col>    
        <v-col cols=12 sm=3 md=3>
          <v-text-field 
            label="aosVersion"
            v-model="newAosVersion"></v-text-field>
        </v-col>
        <v-col cols=12 sm=3 md=3>
          <v-btn
            @click="applyAosVersion"
          >적용</v-btn>
        </v-col>
        <v-col cols=12 sm=3 md=3>
          <v-alert v-if="aosVersionError" type="error">{{aosVersionError}}</v-alert>
        </v-col>
      </v-row>
    </v-layout>
  </v-container>
</template>

<script>

import {mapActions, mapState} from 'vuex';
import {eventBus} from '../util/eventBus';
const ArrayUtil = require('../util/ArrayUtil');

var crc = require('crc');

const no_image = require(`../assets/no_image.jpg`);
export default {
  data() {
    return {
      storyData: {},
      aosVersion: "",
      newAosVersion: "",
      aosVersionError: ""
    }
  },
  computed: {
    ...mapState({
        CDN_URL: 'CDN_URL'
    }),
  },
  watch: {
    newAosVersion(val) {
      if(this.aosVersionError.length > 0) {
        this.aosVersionError = ""
      }
    }
  },
  async created() {
    await this.getVersionList();
  },
  methods: {
    ...mapActions([
      'GET_VERSION_LIST',
      'UPDATE_VERSION',
    ]),
    async applyAosVersion() {
      // 시멘틱 버져닝 관리
      const osType = "aos";
      if(!this.aosVersion) {
        await this.insertVersion(this.newAosVersion, osType);
        return;
      }

      await this.updateVersion(this.aosVersion, this.newAosVersion, osType);
    },
    async insertVersion(version, osType) {
      console.log('insertVersion');
      const newVersion = this.parseSematicVersion(version);
      if(!newVersion) {
        this.aosVersionError = "version을 확인하세요";
        return;
      }

      await this.UPDATE_VERSION({osType, version: newVersion.version });
      await this.getVersionList();
    },
    async updateVersion(version, newVersion, osType) {
      const updateVersion = this.checkVersion(version, newVersion);
      console.log('updateVersion', updateVersion);
      if(updateVersion == null) {
        this.aosVersionError = "version을 확인하세요";
        return;
      }
      
      await this.UPDATE_VERSION({ version: updateVersion, osType: "aos" });
      await this.getVersionList();
    },
    checkVersion(version, newVersion) {
      const parsedNewVersion = this.parseSematicVersion(newVersion);
      const parsedVersion = this.parseSematicVersion(version);

      if(parsedNewVersion == null) return null;
      if(parsedVersion == null) return null;

      if(parsedVersion.major > parsedNewVersion.major) return null;
      if(parsedVersion.minor > parsedNewVersion.minor) return null;
      if(parsedVersion.patch > parsedNewVersion.patch) return null;

      if(parsedVersion.major == parsedNewVersion.major 
        && parsedVersion.minor == parsedNewVersion.minor
        && parsedVersion.patch == parsedNewVersion.patch ) return null;

      return parsedNewVersion.version;
    },
    parseSematicVersion(version) {
      const versionList = version.split(".");
      if(versionList.length !== 3) return null;

      if(isNaN(versionList[0])) return null;
      if(isNaN(versionList[1])) return null;
      if(isNaN(versionList[2])) return null;

      const major = parseInt(versionList[0]);
      const minor = parseInt(versionList[1]);
      const patch = parseInt(versionList[2]);

      version = `${major}.${minor}.${patch}`;
      console.log(version);
      return { major, minor, patch, version };

    },
    async getVersionList() {
      const versionInfo = await this.GET_VERSION_LIST();
      console.log(versionInfo);
      this.aosVersion = versionInfo["aosAppVersion"].value;
      this.iosVersion = versionInfo["iosAppVersion"].value;
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
