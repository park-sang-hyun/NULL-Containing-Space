<template>
    <div>
        <Navbar></Navbar>
        <div id="ModifyForm">
            <!-- 프로필 사진 -->
            <div class="image-form" id="image-form">
                <label id="image-preview" for="profileimg">
                    <div class="image-box">
                        <img v-if="previewImg.preview" :src="previewImg.preview">
                        <img v-else-if="User.profileURL" :src="'data:image/png;base64, ' + User.profileURL" alt="image" class="img-part">
                        <img v-else src="@/assets/images/default_image.png">
                    </div>
                    <label for="profileimg">변경 <b-icon-pencil /></label>
                    <div class="profile-border"></div>
                    <br>
                    <!-- 프로필사진 변경 -->
                </label>
                
                <input
                id="profileimg"
                type="file"
                ref="files"
                accept="image/*"
                @change="imageUpload" />
            </div>
        
            <!-- 이메일(수정불가) -->
            <div class="input-form" id="email-form">
                <label for="email">이메일</label>
                <input v-model="User.email" 
                id="email"
                type="text"
                disabled />
            </div>

            <!-- 닉네임 -->
            <div class="input-form">
                <label for="nickname">닉네임</label>
                <input v-model="newnickname" 
                id="nickname"
                type="text"
                maxlength="5"
                @keyup.enter="isDuplicate"/>
                <div class="errorMsg" v-if="error.nickname"><i class="fas fa-exclamation-triangle"></i>{{ error.nickname }}</div>
                <div class="Success" v-if="error.nicknameSuccess && error.nicknameSuccess!='me'"><i class="fas fa-exclamation-triangle"></i>{{ error.nicknameSuccess }}</div>

                <button @click="isDuplicate">중복체크</button>
            </div>

            <!-- git 주소 -->
            <div class="input-form">
                <label for="gitUrl">Git URL</label>
                <input v-model="User.GitURL" 
                id="gitUrl"
                type="text"
                @keyup="checkGitURL" 
                placeholder="https:// 를 제외한 주소를 적어주세요"/>
                <div class="errorMsg" v-if="error.GitURL"><i class="fas fa-exclamation-triangle"></i>{{ error.GitURL }}</div>
            </div>

            <!-- blog 주소 -->
            <div class="input-form">
                <label for="blogUrl">Blog URL</label>
                <input v-model="User.blogURL" 
                id="blogUrl"
                type="text"
                @keyup="checkblogURL"
                placeholder="https:// 를 제외한 주소를 적어주세요" />
                <div class="errorMsg" v-if="error.blogURL"><i class="fas fa-exclamation-triangle"></i>{{ error.blogURL }}</div>
            </div>
            <!-- 자기소개 -->
            <div class="textarea-form">
                <label for="blogUrl">자기소개</label>
                <textarea v-model="User.Introduce"
                id="Introduce" />
            </div>
            <!-- 비밀번호 수정 버튼 -->
            <div class="input-form" id="password-form">
                <label for="email">비밀번호 수정</label>
                <input
                id="password"
                type="text"
                disabled />
                <button @click="goPassword">비밀번호 수정</button>
            </div>
            <!-- 회원탈퇴 버튼 -->
            <div class="input-form" id="delete-form">
                
                <!-- <input id="delete" type="text" disabled/> -->

                <!-- 회원탈퇴 Modal -->
                <div class="Modal-container">
                    <label for="delete-form">회원탈퇴</label>
                    <input id="Modal-toggle" type="checkbox">
                    <button>회원탈퇴</button>


                    <div class="Modal-backdrop">
                        <div class="Modal-content">
                            <label class="Modal-close" for="Modal-toggle">x</label>
                            <h3>회원탈퇴</h3>
                            <hr />
                            <p>회원님과 관련된 모든 정보가 삭제됩니다. <br />정말로 회원탈퇴 하시겠습니까?</p>
                            <label class="Modal-close close-button" for="Modal-toggle">취소</label>
                            <label class="Modal-close delete-button" @click="deleteUser">탈퇴</label>
                        </div>
                    </div>
                </div>

            </div>

            

            <!-- 수정 완료 버튼 -->
            <button id="complete" @click="Modify">수정</button>
        </div>
    </div>
</template>

<script>
import Navbar from '../../components/common/Navigation.vue'
import subNav from '../../components/common/subnav.vue'
import http from "@/util/http-common.js";

const storage = window.sessionStorage;
const domainreg = /(http(s)?:\/\/)((([a-z0-9\w])|([ㄱ-힣]))+\.+)+[a-z0-9ㄱ-힣]{2,}\?*([a-z0-9ㄱ-힣])*/gi

export default {
    name: 'ModifyUser',
    components: {
        Navbar,
    },
    created() {
        this.getInfo()
    },
    data() {
        return {
            User : {
                email: storage.User,
                nickname: "",
                blogURL: "",
                GitURL: "",
                Introduce: "",
                profileURL: null,
            },
            error: {
                nickname: "",
                nicknameSuccess: "",
                GitURL: "",
                blogURL: "",
            },
            previewImg: {
                file: "",
                preview: "",
            },
            newnickname: storage.NickName,
        }
    },
    methods: {
        getInfo() {
            http.get(`/account/myPage/${this.newnickname}/${this.newnickname}`)
            .then(({data}) => {
                this.newnickname = data.nickname
                this.User.Introduce = data.intro
                this.User.profileURL = data.file
                if(!data.blogaddr || data.blogaddr === null) this.User.blogURL = ""
                else this.User.blogURL = data.blogaddr
                if(!data.gitaddr || data.gitaddr === null) this.User.GitURL = ""
                else this.User.GitURL = data.gitaddr
            })
            .catch((err) => {
            })
        },
        // 닉네임 중복 체크
        isDuplicate() {
            if (storage.NickName != this.newnickname){
                http.get(`/account/nickNameDuplicate/${this.newnickname}`)
                .then((data) => {
                    if (data.data.status) {
                    this.error.nicknameSuccess="사용할 수 있는 닉네임입니다."
                    this.error.nickname=""
    
                    }
                })
                .catch(() => {
                    this.error.nickname="사용할 수 없는 닉네임입니다."
                    this.error.nicknameSuccess=""
                })
            } else {
                this.error.nickname=""
                this.error.nicknameSuccess= 'me'
            }
        },
        checkGitURL() {
            if (this.User.GitURL && this.User.GitURL != null){
                if (('https://' + this.User.GitURL).match(domainreg) != null){
                    this.error.GitURL = ""
                } else {
                    this.error.GitURL = "도메인을 정확하게 입력하세요. (https:// 제외)"
                    }
            } else {
                this.error.GitURL = ""
                this.User.GitURL = ""
            }
        },
        checkblogURL() {
            if (this.User.blogURL && this.User.blogURL != null){
                if (('https://' + this.User.blogURL).match(domainreg) != null){
                    this.error.blogURL = ""
                    } else {
                    this.error.blogURL = "도메인을 정확하게 입력하세요. (https:// 제외)"
                }
            } else{
                this.error.blogURL=""
                this.User.blogURL = ""
            } 

        },
        imageUpload() {
            this.previewImg = {
                file: this.$refs.files.files[0],
                preview: URL.createObjectURL(this.$refs.files.files[0]),
            }
            
        },
        Modify() {
            var InputData = new FormData()
            // 수정전 다시 체크
            this.checkGitURL()
            this.checkblogURL()
            this.isDuplicate()
            if (this.error.nickname || !this.error.nicknameSuccess || this.error.GitURL || this.error.blogURL ){
                alert("다시 입력해주세요.")
            } else {
                if (this.previewImg.file) {
                    this.WithProfile()
                } else {
                    this.WithNoProfile()
                    
                }            
            }
        },
        WithProfile() {
            var InputData = new FormData()
            InputData.append("profile", this.previewImg.file)
            InputData.append("email", this.User.email)
            InputData.append("blog", this.User.blogURL)
            InputData.append("git", this.User.GitURL)
            InputData.append("intro", this.User.Introduce)
            http
            .put(`/account/modifyTrue/${this.newnickname}`, InputData)
            .then(({data}) => {
                storage.NickName = this.newnickname
                this.$router.push({name:'profile', params: {nickname: this.newnickname}})
            })
        },
        WithNoProfile() {
            var InputData = new FormData()
            InputData.append("email", this.User.email)
            InputData.append("blog", this.User.blogURL)
            InputData.append("git", this.User.GitURL)
            InputData.append("intro", this.User.Introduce)

            http
            .put(`/account/modifyFalse/${this.newnickname}`, InputData)
            .then(({data}) => {
                storage.NickName = this.newnickname
                this.$router.push({name:'profile', params: {nickname: this.newnickname}})
            })

        },
        deleteUser() {
            http.delete(`/account/${storage.NickName}`)
            .then((data) => {
                alert("회원탈퇴하였습니다.")
                storage.removeItem("NcikName")
                storage.removeItem("User")
                this.$router.push("/")
            })
        },
        goPassword() {
            this.$router.push({name: 'modifyPassword'})
        },    
    },
}
</script>

<style scoped>
#ModifyForm{
    padding-top: 20px;
    width: 100vw;
}
.image-form{
    padding: 10px 0 10px 0;
    text-align: center; 
}
.image-box {
    height: 140px;
    width: 140px;
    border-radius: 100%;
    overflow: hidden;
    /* border: 2px solid #464545; */
}
.profile-border{
    width: 143px;
    height: 143px;
    border: 3px solid #464545;
    border-radius: 100%;
    position: absolute;
    top: -1.5px;
}
.image-box img {
    margin: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.image-form label {
    display: inline-block;
    position: relative;
    padding: 0 0 0 0;
    background-color: #f7f7f7;
    color: #464545;
    vertical-align: middle;
    font-size: 15px;
    cursor: pointer;
    border-radius: 5px;
}
#image-preview label{
    position: absolute;
    bottom: 13px;
    left: 2px;
    width: 140px;
    height: 30px;
    line-height: 30px;
    
}
.image-form input[type='file'] {
    position: absolute;
    width: 0;
    height: 0;
    padding: 0;
    overflow: hidden;
    border: 0;
}

.input-form {
    position: relative;
    margin: 0 20px 30px 20px;
    height: 50px;
}
input[type="text"]{
    padding-left: 80px;
    width: 100%;
    border: 1px solid #464545;
    border-radius: 3px;
}
input[type="text"]:focus{
    border: 0;
    border-bottom: 1.2px solid #464545;
}
.input-form button{
    padding: 4px 6px 4px 6px;
    position: absolute;
    background-color: #464545;
    border-radius: 3px;
    color: #f7f7f7;
    bottom: 8.5px;
    right: 11px;
}
.input-form label {
    position: absolute;
    padding: 0;
    margin: 0;
    font-size: 13px;
    font-weight: bold;
    top: 18px; 
    left: 13px;
}
.textarea-form{
    position: relative;
    margin: 0 20px 20px 20px;
}
.textarea-form textarea{
    resize: none;
    background-color: #EDECEA;
    border: 1px solid #464545;
    border-radius: 3px;
    width: 100%;
    height: 100px;
}
#email-form input {
    color: #C4BCB8;
}
#password, #delete{
    border: 0;
}

#password-form > button{
    background-color: #D52602;
    border: 0;
    outline: 0;
    box-shadow: 0 5px 5px -5px #333;
}

#password-form > label{
    font-size: 16px;
}
#complete{
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #464545;
    color: #f7f7f7;
    height: 50px;
    border-radius: 3px;

}
.errorMsg{
  font-size: 13px;
  color: red;  
}
.Success{
  font-size: 13px;
  color: green;
}

/* for modal */
.Modal-container {
  position: relative;
  width: 100%;
  height: 50px;
}
.Modal-container > label {
    font-size: 16px;
}
.Modal-container hr{
    margin: 0 0 10px 0 ;
    width: 100%;
}
.Modal-container button {
  display: block;
  color: #f7f7f7;
  padding: 5px;
  background: #D52602;
  font-size: 16px;
  border: 0;
  outline: 0;
  border-radius: 3px;
  box-shadow: 0 5px 5px -5px #333;
}
.Modal-container .Modal-backdrop {
  height: 0;
  width: 0;
  opacity: 0;
  overflow: hidden;
  transition: opacity 0.2s ease-in;
}
.Modal-container #Modal-toggle {
    width: 67.1px;
    height: 33.47px;
    position: absolute;
    bottom: 8.5px;
    right: 11px;
    z-index: 9999;
    opacity: 0;
    cursor: pointer;
}


.Modal-container #Modal-toggle:checked {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9;
  opacity: 0;
}
.Modal-container #Modal-toggle:checked ~ .Modal-backdrop {
  background-color: rgba(0, 0, 0, 0.6);
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9;
  pointer-events: none;
  opacity: 1;
}
.Modal-container #Modal-toggle:checked ~ .Modal-backdrop .Modal-content {
  background-color: #fff;
  max-width: 400px;
  width: 100%;
  height: 280px;
  padding: 10px 30px;
  position: relative;
  left: calc(50% - 200px);
  top: 12%;
  border-radius: 4px;
  z-index: 999;
  pointer-events: auto;
  cursor: auto;
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.6);
}

@media (max-width: 400px) {

.Modal-container #Modal-toggle:checked ~ .Modal-backdrop .Modal-content { left: 0; }
}

.Modal-container #Modal-toggle:checked ~ .Modal-backdrop .Modal-content .Modal-close {
  color: #666;
  position: absolute;
  left: 90%;
  right: 0px;
  top: 0;
  padding-top: 15px;
  background: #fff;
  font-size: 16px;
  width: 25px;
  height: 28px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
}

.Modal-container #Modal-toggle:checked ~ .Modal-backdrop .Modal-content .Modal-close.close-button {
  top: initial;
  padding: 3px;
  position: absolute;
  left: 83%;
  bottom: 10px;
  background: #EDECEA ;
  color: #464545;
  width: 50px;
  border-radius: 2px;
  font-size: 16px;
  font-weight: normal;
}
.Modal-container #Modal-toggle:checked ~ .Modal-backdrop .Modal-content .Modal-close.delete-button {
  top: initial;
  padding: 2px;
  position: absolute;
  left: 68%;
  bottom: 10px;
  background: #D52602 ;
  color: #f7f7f7;
  width: 50px;
  border-radius: 2px;
  font-size: 16px;
  font-weight: normal;
}
.Modal-container #Modal-toggle:checked ~ .Modal-backdrop .Modal-content .Modal-close.button:hover {
  color: #fff;
  background: #1E824C;
}

.Modal-container #Modal-toggle:checked ~ .Modal-backdrop .Modal-content .Modal-close:hover { color: #333; }
</style>