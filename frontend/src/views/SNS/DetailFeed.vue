<template>
  <div id="detailFeed">
    <div class="wrapB" style="position: relative;">
      <Navbar></Navbar>

      <!-- 수정삭제 부분 -->
      <div class="ud-button">
        <b-icon-three-dots-vertical @click="udButton" class="fixed"></b-icon-three-dots-vertical>
      </div>
      <div v-if="udOn" class="ud-part">
        <router-link :to="{ name: 'FeedUpdate', params: { pId: postId }}" replace>
          <li class="update-button"><b-icon-pencil class="mr-3"></b-icon-pencil>수정</li>
        </router-link>
        <li @click="deletePost"><b-icon-trash class="mr-3"></b-icon-trash>삭제</li>
      </div>
      <div class="feedpage">
        <!-- title 부분 -->
        <div class="d-flex align-items-center">
          <div class="page-title">
            {{ article.title }}
          </div>
        </div>

        <!-- user 부분 -->
        <div class="user-part d-flex flex-row align-items-center justify-content-between">
          <div class="d-flex flex-row align-items-center user-low-part">
            <div class="user-img">
              <img v-if="!userImg" src="@/assets/images/default_image.png" alt="user_default_image" @click="goUserProfile">
              <img :src="'data:image/png;base64, ' + article.userFile" alt="user-image" @click="goUserProfile">
            </div>
            <div class="user-name" @click="goUserProfile">{{ article.userNickname }}</div>
            <div class="user-diff-time">{{ article.diffTime }}</div>
          </div>
          <div class="user-count">
            <span>조회수</span>
            <span class="ml-2">{{ article.viewCount }}</span>
          </div>
        </div>

        <!-- SNS 이미지 -->
        <div class="SNS-img">
          <img :src="'data:image/png;base64, ' + article.file" alt="image" class="img-part">
        </div>

        <!-- content 부분. -->
        <!-- content에 <br/>를 넣었으므로 {{}}이 아닌 v-html로 출력 -->
        <div class="page-content">
          {{ article.content }}
        </div>

        <!-- 좋아요 부분 -->
        <div class="icon-part d-flex justify-content-center">
          <div>
            <b-icon icon="heart-fill" font-scale="1.2" :color="likeChange" @click="likeButton"></b-icon>
            <span class="ml-2">{{ article.likeCount }}</span>
          </div>
        </div>
        
        <hr>
        <!-- 해시태그 -->
        <div class="hash-tags d-flex flex-wrap">
          <div v-for="hashtag in article.tags" :key="hashtag.id">
            {{ hashtag }}</div>
        </div>

        <!-- 댓글 part -->
        <div class="comment-part">
          <Comment v-for="reply in article.replies" :reply="reply" :key="reply.id" @delete-reply="refreshOn()"></Comment>
        </div>

        <!-- 댓글 작성창 -->
        <div class="fixed-bottom comment-add d-flex align-items-center">
          <input v-model="comment.content" type="text"
            placeholder="댓글을 작성해주세요."
            class="flex-fill"
            style="border:none;"
            maxlength="255" 
            @keyup.enter="commentOn"/>
          <button class="px-3" @click="commentOn">
            작성
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../../components/common/Navigation.vue';
import Comment from '../../components/SNS/SNSCommentItem.vue';
import http from "../../util/http-common.js";
import axios from 'axios';

const storage = window.sessionStorage;
var now = new Date(); // 현재 시간 받아오기


export default {
  name: "detailFeed",
  props: ["postId"],
  components: {
    Navbar,
    Comment,
  },

  computed: {
    // 좋아요 바뀌는 것 감지
    likeChange() {
      this.likeCheck();
      return this.likeColor
    },

  },
  
  data() {
    return {
      imgUrl: 'https://cdn.pixabay.com/photo/2020/07/10/20/45/sparrow-5392119__340.jpg',
      likeColor: '',
      udOn: false,
      article: {
        content: "",
        date: "",
        file: "",
        likeCount: 0,
        likeFlag: 0,
        pid: 0,
        tags: [],
        title: "",
        userEmail:"",
        userNickname: "",
        userFile: "",
        viewCount: 0,
        diffTime: "",
      },
      userImg: false,
      comment: {
        content: "",
      },
    }
  },

  created() {
    this.dataReceive();
    this.likeCheck();
  },

  methods: {
    // 좋아요 체크
    likeCheck() {
      if (this.article.likeFlag) {
        this.likeColor = '#FF0000';
      } else {
        this.likeColor = '#C4BCB8';
      }
    },

    // 댓글 작성 버튼 눌림
    commentOn() {
      if (this.comment.content === "") {
        this.errorMsg();
      } else {
        this.commentSubmit()
      }
    },

    dataReceive() {
      http
      .get(`/post/detail/${this.postId}/${storage.getItem("NickName")}`)
      .then((res) => {
        // 받아온 데이터를 집어 넣기
        this.article = res.data

        // 받아온 시간(string) - date (형식 변환)
        var postDate = new Date(this.article.date)
        this.article.date = postDate
        this.article.diffTime = this.dateCheck(this.article.date);

        if (this.article.userFile == null) {
          this.userImg = false
        } else {
          this.userImg = true
        }
      })
      .catch((err) => {
        console.log(err)
        if (err.response.status == 404) {
          this.$router.replace({ name: 'NotFound' })
        } else if (err.response.status == 400) {
          this.$router.replace({ name: 'NotFound' })
        } else {
          console.log (err)
        }
      })
    },

    // 날짜 체크
    dateCheck(date) {
      var diff = now - date
      var diff_sec = Math.floor(diff / 1000)
      var diff_min = Math.floor(diff_sec / 60)
      var diff_hour = Math.floor(diff_min / 60)
      var diff_day = Math.floor(diff_hour / 24)
      var diff_month = Math.floor(diff_day / 30)
      var diff_year = Math.floor(diff_month / 12)

      if (diff_year > 0) {
        var calyear = diff_year + '년 전'
        return calyear
      } else if (diff_month > 0) {
        var calmonth = diff_month + '달 전'
        return calmonth
      } else if (diff_day > 0) {
        var calday = diff_day + '일 전'
        return calday
      } else if (diff_hour > 0) {
        var calhour = diff_hour + '시간 전'
        return calhour
      } else if (diff_min > 0) {
        var calmin = diff_min + '분 전'
        return calmin
      } else if(diff_sec > 0) {
        var caltime = diff_sec + '초 전'
        return caltime
      } else {
        return '0초 전'
      }
    },
    
    // 에러메세지
    errorMsg() {
      alert("댓글 내용을 입력해주세요.")
    },

    // 댓글 작성
    commentSubmit() {
      let formData = new FormData();
      formData.append("email", storage.getItem("User"));
      formData.append("content", this.comment.content);
      formData.append("pid", this.article.pid)
      
      http
      .post('/reply/create', formData)
      .then((res) => {
        this.comment.content = "";
        this.dataReceive();

        // 댓글 알람
        if (this.article.userNickname != storage.getItem("NickName")){
          let AlarmData = new FormData();
          AlarmData.append("mynickname", storage.getItem("NickName"))
          AlarmData.append("tonickname", this.article.userNickname)
          AlarmData.append("pid", this.article.pid)
          
          http.post("/alarm/replyAlarm", AlarmData)
        }
        

      })
      .catch((err) => {
        console.log(err);
      })
    },

    // 좋아요 누름
    likeButton(event) {
      let formData = new FormData();
      formData.append("email", storage.getItem("User"));
      formData.append("postid", this.article.pid);

      http
      .post('/like/post', formData)
      .then((res) => {
        this.article.likeCount = res.data.count
        this.article.likeFlag = res.data.flag
      })
      .catch((err) => {
        console.log(err)
      })
    },
    // 수정, 삭제 버튼
    udButton(event) {
      var requestUser = storage.getItem("User")
      if (requestUser === this.article.userEmail) {
        this.udOn = !this.udOn;
      }
    },

    // 글 삭제
    deletePost() {
      
      http
      .delete(`/post/${this.article.pid}`)
      .then((res) => {
        this.$router.replace({ name: 'FeedMain' });
      })
      .catch((err) => {
        console.log(err)
      })

    },

    // 댓글 삭제
    refreshOn() {
      this.dataReceive();
    },

    
    // 유저 사진, 닉네임 눌렀을 때 그 유저의 프로필 페이지로 보낸다.
    goUserProfile() {
      this.$router.push({ name: 'profile', params: { nickname: this.article.userNickname }});
    },

  }
}


</script>

<style scoped>
.feedpage {
  margin: 65px 5px 55px 5px;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
}

.user-img {
  display: block;
  background-color: #EDECEA;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  overflow: hidden;
}

.user-img img {
  margin: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.page-title {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: #464545;
  font-weight: bold;
  font-size: 20px;
  width: 92%;
  white-space: normal;
  word-break: break-all;
}

.user-part > div {
  margin-top: 5px;
}

.user-low-part > div {
  margin-right: 13px;
}

.user-name {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: #464545;
  font-weight: bold;
  font-size: 14px;
}

.user-diff-time {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: #E2DFD8;
  font-size: 14px;
}

.user-count span {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: #E2DFD8;
  font-size: 14px;
}

/* 페이지 밖으로 나가지 않도록 하기 */
.page-content {
  margin-top: 5px;
  width: 98%;
  white-space: pre-wrap;
  word-break: break-all;
}

.SNS-img > img {
  width: 100%;
  margin: 5px 0px 5px 0px;
}

.icon-part {
  margin-top: 10px;
}

.icon-heart-data {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: #E2DFD8;
  margin-left: 10px;
}

.comment-add {
  width: 100%;
  background-color: #f7f7f7;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.hash-tags {
  width: 100%;
  margin-bottom: 5px;
}

.hash-tags > div {
  background-color: #c6dfd6;
  border-radius: 20px;
  padding: 7px;
  font-size: 13px;
  margin-right: 10px;
  margin-bottom: 7px;
}
.up-parent{
  position: relative;
}
.ud-part {
  position: absolute;
  right: 15px;
  top: 40px;
  background-color: #f7f7f7;
  border-radius: 3px;
}
.ud-part > li {
  margin: 20px;
}
.ud-button {
  position: absolute;
  right: 25px;
  top: 13px;
}

.img-part {
  width: 95%;
  margin: 10px;
  border-radius: 2px;
}

.update-button {
  color: #464545;
  margin: 20px;
}
</style>