<template>
  <div id="NoTeam">
    <div class="d-flex flex-column subjectArea">
      <div class="d-flex justify-content-center">
        현재 <span class="subjectDesign mx-2">{{ subjectCheck }}</span> 를 선택 중입니다
      </div>
      <div class="d-flex justify-content-center">
        - <span style="font-weight: bold;">매칭 시스템에 등록</span>되었습니다 -
      </div>
    </div>

    <div v-if="noMatch" class="teamDes d-flex justify-content-center align-items-center align-content-center flex-column" style="min-height: 400px;">
      <b-icon-file-earmark-break-fill scale="4" class="mb-5" style="color:#464545;"></b-icon-file-earmark-break-fill>
      해당 주제로 프로젝트를 진행 중인 팀이 없습니다
    </div>

    <div v-if="!noMatch">
      <div class="teamDes d-flex justify-content-center">해당 주제로 프로젝트를 진행 중인 팀 목록입니다</div>
      <TeamUser v-for="team in teamDatas" 
        :key="team.leaderNickname.nickname" 
        :teamData="team"/>
    </div>

    
    <!-- 무한스크롤 -->
    <infinite-loading 
      @infinite="infiniteHandler" 
      ref="InfiniteLoading"
      spinner="waveDots">
      <div slot="no-results">
        <div v-if="!noMatch" style="font-size: 14px; padding: 10px 0px;">해당 주제로 진행 중인 팀이 없습니다</div>
      </div>
      <div slot="no-more" style="font-size: 14px; padding: 10px 0px;">더 이상 해당 주제로 진행 중인 팀이 없습니다</div>
    </infinite-loading>

    <div style="height:50px;"></div>

    <button class="closeTeam" @click="closeTeam">팀원 시작 취소</button>
  
  </div>
</template>

<script>
import TeamUser from './TeamUser.vue'
import http from "../../util/http-common.js";
import axios from 'axios';
import InfiniteLoading from 'vue-infinite-loading';

const storage = window.sessionStorage;

export default {
    name: "NoTeam",
    props: ["userData"],
    components: {
      TeamUser,
      InfiniteLoading,
    },
    data() {
      return {
        basic: {
            subjects: [
            '웹 기술 프로젝트',
            '웹 디자인 프로젝트',
            'IOT 프로젝트',
          ],
        },
        subjectCheck: '',
        noMatch: true,
        teamDatas: [],
        limit: 2,
      }
    },

    created() {
      var num = Number(this.userData.preferProject) - 1
      this.subjectCheck = this.basic.subjects[num]

      this.teamDatas = this.teamDatas.concat(this.userData.teamdates)

      if (this.userData.teamdates.length == 0) {
          this.noMatch = true
      } else {
          this.noMatch = false
      }
    },
    
    methods: {
      closeTeam() {
        let formData = new FormData;
        formData.append("nickname", storage.getItem("NickName"))

        http
        .post('/team/memberCancel', formData)
        .then((res) => {
          this.$router.go({ name: 'Main' }).catch(()=>{})
        })
        .catch((err) => {
          console.log(err)
        })
      },
      
      // 무한 스크롤
      infiniteHandler($state) {
        const EACH_LEN = 10

        http
        .get(`/team/${storage.getItem("NickName")}/${this.limit}`)
        .then((res) => {
          setTimeout(() => {
            if(res.data.teamdates.length) {
              this.teamDatas = [...this.teamDatas, ...res.data.teamdates]
              $state.loaded()
              this.limit++
              // console.log("after", this.teamDatas, this.limit)
              // 끝 지정(No more data) - 데이터가 EACH_LEN개 미만이면 
              if(res.data.teamdates.length / EACH_LEN < 1) {
                $state.complete()
              }
            } else {
              // 끝 지정(No more data)
              $state.complete()
            }
          }, 400)
        })
        .catch((err) => {
            console.log(err)
        })
        
      },
      
    },
}
</script>

<style scoped>
#noTeam {
  margin: 60px 20px 50px 20px;
}

.subjectArea {
  border: 2px dashed #ACCCC4;
  padding:10px;
  font-size: 15px;
  color: #C4BCB8;
  margin: 20px 10px 20px 10px;
}

.subjectDesign {
  font-weight: bold;
  color: #464545;
}

.teamDes {
  font-size: 15px;
  margin: 10px;
}

.closeTeam {
  position: fixed;
  bottom: 70px;
  left: 50%;
  transform:translate(-50%, 0%);
  padding: 7px;
  color: white;
  background-color:#C4BCB8;
  border-radius: 10px;
}

</style>