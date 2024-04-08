const pre = '/loveScore/';

export default {
    path: '/loveScore',
    title: '推广奖励规则',
    header: 'home',
    custom: 'i-icon-demo i-icon-demo-dashboard',
    icon: 'md-heart-outline',
    children: [
        {
            path: `${pre}scoreRule`,
            // icon: 'ios-home',
            title: '爱心值规则管理'
        },
        {
            path: `${pre}spreadAwardRule`,
            // icon: 'ios-home',
            title: '善益金奖励规则'
        },
    ]
}