// User
import Login from './views/user/Login.vue'
import getAbility from './views/user/Join/getAbility.vue'
import step1 from './views/user/Join/step1.vue'
import step2 from './views/user/Join/step2.vue'
import step3 from './views/user/Join/step3.vue'
import step4 from './views/user/Join/step4.vue'
import step5 from './views/user/Join/step5.vue'

import findPassword from './views/user/FindPassword.vue'
import modifyPassword from './views/user/modifyPassword.vue'
import profile from './views/user/profile.vue'
import followList from './views/user/followinglist.vue'
import myPost from './views/user/myPost.vue'
import myLikePost from './views/user/myLikePost.vue'
import UserModify from './views/user/UserModify.vue'
import modifyAbility from './views/user/modifyAbility.vue'
// Feed
import FeedMain from './views/SNS/IndexFeed.vue'
import FeedDetail from './views/SNS/DetailFeed.vue'
import FeedCreate from './views/SNS/CreateFeed.vue'

// Main
import Main from './views/Main.vue'
import Notice from './views/Notice.vue'

// team
import teamMatch from './views/team/teamMatch.vue'
import createTeam from './views/team/createTeam.vue'
import SubjectForm from './views/team/subjectForm.vue'
import TeamInfo from './views/team/TeamInfo.vue'
import MatchMember from './views/team/MatchMember.vue'

// chat
import Chat from './views/chat/Chat.vue'

// Search
import SearchMain from './views/search/SearchMain.vue'
import TagResult from './views/search/TagResult.vue'
// etc

import Components from './views/Components.vue'
import NotFound from './views/NotFound.vue'

export default [
    // User
    {
        path : '/',
        name : 'Login',
        component : Login
    },
    {
        path : '/user/join/1',
        name : 'step1',
        component : step1,
        props: true
    },    
    {
        path : '/user/join/2',
        name : 'step2',
        component : step2,
        props: true
    },    
    {
        path : '/user/join/3',
        name : 'step3',
        component : step3,
        props: true
    },    
    {
        path : '/user/join/4',
        name : 'step4',
        component : step4,
        props: true
    },
    {
        path : '/user/join/5',
        name : 'step5',
        component : step5,
        props: true
    },
    {
        path : '/find/password',
        name : 'findPassword',
        component : findPassword
    },
    {
        path : '/modify/password',
        name : 'modifyPassword',
        component : modifyPassword
    },
    {
        path : '/getAbility',
        name : 'getAbility',
        component : getAbility
    },
    {
        path : '/user/profile/:nickname',
        name : 'profile',
        component : profile,
        props: true,
    },
    {
        path : '/user/modify',
        name : 'UserModify',
        component : UserModify
    },
    {
        path : '/user/modify/ability',
        name : 'modifyAbility',
        component : modifyAbility,
        props: true,
    },
    {
        path : '/user/profile/:nickname/follow',
        name : 'followList',
        component : followList,
        props: true,
    },
    {
        path : '/user/profile/:nickname/myPost',
        name : 'myPost',
        component : myPost,
        props: true,
    },
    {
        path : '/user/profile/:nickname/myLikePost',
        name : 'myLikePost',
        component : myLikePost,
        props: true,
    },
    // Main
    {
        path : '/main',
        name : 'Main',
        component : Main
    },
    {
        path : '/notice',
        name : 'Notice',
        component : Notice
    },
    // Feed
    {
        path : '/feed',
        name : 'FeedMain',
        component : FeedMain
    },

    {
        path : '/feed/:postId/detail',
        name : 'FeedDetail',
        component : FeedDetail,
        props: true,
    },
    {
        path : '/feed/create',
        name : 'FeedCreate',
        component : FeedCreate
    },
    {
        path : '/feed/update',
        name : 'FeedUpdate',
        component : FeedCreate,
        props: true,
    },
    // Team
    {
        path : '/team/create',
        name : 'createTeam',
        component : createTeam,
        props: true,
    }, 
    {
        path : '/team/update',
        name : 'updateTeam',
        component : createTeam,
        props: true,
    }, 
    {
        path : '/team/match',
        name : 'teamMatch',
        component : teamMatch
    },
    {
        path: '/team/match/list',
        name: 'MatchMember',
        component: MatchMember,
        props: true,
    },
    {
        path: '/team/subject',
        name: 'SubjectForm',
        component: SubjectForm,
    },
    {
        path: '/team/leader',
        name: 'LeaderForm',
        component: SubjectForm,
        props: true,
    },
    {
        path: '/team/leader/update',
        name: 'LeaderUpdateForm',
        component: SubjectForm,
        props: true,
    },
    {
        path: '/team/info/:teamId',
        name: 'TeamInfo',
        component: TeamInfo,
        props: true,
    },

    //chat
    {
        path: '/chat/:teamId',
        name: 'chat',
        component: Chat,
        props: true
    },

    // search
    {
        path: '/search',
        name: 'SearchMain',
        component: SearchMain,
    },

    {
        path: '/search/:tag',
        name: 'TagResult',
        component: TagResult,
        props: true,
    },

    // Component
    {
        path : '/components',
        name : 'Components',
        component : Components
    },

    // NotFound
    {
        path : '*',
        name : 'NotFound',
        component : NotFound
    },
]