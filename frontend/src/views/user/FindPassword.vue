<template>
  <div class="JoinView">
      <div class="progress-container">
        <ul class="progressbar">
          <button id="Step1" :disable="!isActiveStep1" :class="{'active':isActiveStep1}">이메일 입력</button>
          <button id="Step2" :disable="!isActiveStep2" :class="{'active':isActiveStep2}">이메일 인증</button>
          <button id="Step3" :disable="!isActiveStep3" :class="{'active':isActiveStep3}">새 비밀번호 입력</button>
        </ul>
      </div>

      <div v-if="isActiveStep2">
        <div v-if="isActiveStep3">
          <Password3 @Complete3="moveLogin" :email="email"></Password3>
        </div>
        <div v-else>
          <Password2 @Complete2="Gostep3" :email="email"></Password2>
        </div>
      </div>

      <div v-else>
        <Password1 @Complete1="Gostep2"></Password1>
      </div>
      <div class="loading"></div>
  </div>
</template>

<script>
import Password1 from '../../components/user/step1.vue'
import Password2 from '../../components/user/step2.vue'
import Password3 from '../../components/user/passwordform.vue'
import http from "../../util/http-common.js";
import axios from 'axios';


export default {
  name: 'FindPassword',
  components: {
    Password1,
    Password2, 
    Password3,
  },
  data: () => {
    return {
      email: "",
      isActiveStep1 : true,
      isActiveStep2 : false,
      isActiveStep3 : false,
      passwordType: "password",
      passwordConfirmType: "password",
    };
  },
  created(){
  },
  methods:{
    Gostep2(email){
      this.email = email
      this.isActiveStep2 = true;
    },
    Gostep3() {
      this.isActiveStep3 = true;
      
    },
    moveLogin(){
      this.$router.push("/");
    }
    
  },
}
</script>

<style scoped>
.progress-container{
  width:100%;
  position: absolute;
  top:30px;
  z-index: 1;
}
.progressbar{
  counter-reset: step;
}
.progressbar button{
  float: left;
  width: 33.333%;
  position: relative;
  text-align: center;
  border: 0;
  outline: 0;
  cursor: default;
}
.progressbar button.active{
  cursor: pointer;
}
.progressbar button:before{
  content:counter(step);
  counter-increment: step;
  width:30px;
  height:30px;

  border: 2px solid #E2DFD8;
  color: #E2DFD8;
  display: block;
  margin: 0 auto 10px auto;
  border-radius: 50%;
  line-height: 27px;
  background:  #f7f7f7;
  text-align: center;
  font-weight: bold;
}
.progressbar button:after{
  content: '';
  position: absolute;
  width:100%;
  height: 3px;
  background: #E2DFD8;
  top: 15px;
  left: -50%;
  z-index: -1;
}
.progressbar button:first-child:after{
content: none;
}
button.active{
  cursor : hand;
}
.progressbar button.active:before{
border-color: #ACCCC4;
background: #ACCCC4;
color: white
}
.progressbar button.active:after{
 background: #ACCCC4;
}


#step1, #step2, #step3{
  position: absolute;
  width:100%;
  top:134px;
  padding: 0px 30px 30px 30px;
}
.input-with-label{
  width: 100%;
}

.btn-input{
  position: fixed;
  bottom:0;
  left: 0;
  background-color: #464545;
  height: 50px;
  border-radius: 3px;
  color: #f7f7f7;
  font-weight: bold;
  width:100%;
}
</style>