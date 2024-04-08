const pre = '/benefitCard/';

export default {
    path: '/benefitCard',
    title: '权益卡管理',
    header: 'home',
    custom: 'i-icon-demo i-icon-demo-dashboard',
    icon: 'md-card',
    children: [
        {
            path: `${pre}sincerityCard`,
            // icon: 'ios-home',
            title: '诚益卡管理'
        },
        {
            path: `${pre}goodwillCard`,
            // icon: 'ios-home',
            title: '善益卡管理'
        },
    ]
}