import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/pages/index/index';
import NewGame from '@/pages/newGame/index';
import InfiniteSchema from '@/pages/infiniteSchema/index';
import TimeSchema from '@/pages/timeSchema/index';
import ChallengeSchema from '@/pages/challengeSchema/index';
import Introduce from '@/pages/introduce/index';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
    },{
      path: '/new',
      name: 'NewGame',
      component: NewGame,
    },{
      path: '/infiniteSchema',
      name: 'InfiniteSchema',
      component: InfiniteSchema,
    },{
      path: '/timeSchema',
      name: 'TimeSchema',
      component: TimeSchema,
    },{
      path: '/challengeSchema',
      name: 'ChallengeSchema',
      component: ChallengeSchema,
    },{
      path: '/new',
      name: 'NewGame',
      component: NewGame,
    },{
      path: '/introduce',
      name: 'Introduce',
      component: Introduce,
    }
  ],
});
