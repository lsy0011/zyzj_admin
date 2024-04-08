<template>
    <div class='square'>
        <!-- <h5>广场内容管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="广场管理" content="广场内容管理" hidden-breadcrumb />
        </div>
        <div class="main_box">
            <div class="top_search_box">
                <Space size="large">
                    <div v-font="16">
                        <Icon type="md-list"></Icon>
                        内容列表
                    </div>
                    <Button v-for="(item, index) in typeList" :key="index"
                        :class="{ 'checked_btn_box': nowClass == item.code }"
                        @click="nowClass = item.code; modalTitle = item.title;">
                        {{ item.title }}
                    </Button>
                    <!-- <Button type="primary">新建分类</Button> -->
                </Space>
            </div>
            <div class="table_box">
                <Table border :columns="columns" :data="data" :loading="loading">
                    <template #actionSlot>
                        <Button type="primary" size="small" v-margin="5">通过</Button>
                        <Button type="error" size="small" v-margin="5">驳回</Button>
                        <Button size="small" v-margin="5" @click="modal = true;">详情</Button>
                    </template>
                </Table>
            </div>
            <div class="footer_box">
                <Page :total="100" />
            </div>
        </div>
        <Modal v-model="modal" :title="modalTitle + ' 详情'">
            <!-- 动态广场 ，婚恋广场 -->
            <div class="details_box" v-if="nowClass != 'activity'">
                <div class="box_half">
                    <span>标题：</span>
                    <strong v-font="17">爱你不问归期因为你不值</strong>
                </div>
                <div class="box_half">
                    <span>发布时间：</span>
                    <strong>2024-01-09 08:09:10</strong>
                </div>
                <div class="box_half">
                    <span>发布人昵称：</span>
                    <strong>小小小</strong>
                </div>
                <div class="box_half">
                    <span>发布人类型：</span>
                    <strong>残疾人</strong>
                </div>
                <div class="box_half">
                    <span>发布形式：</span>
                    <strong>视频 / 图片</strong>
                </div>
                <div class="box_half">
                    <span>评论数：</span>
                    <strong>34</strong>
                </div>
                <div class="box_half">
                    <span>分享数：</span>
                    <strong>14</strong>
                </div>
                <div class="box_half">
                    <span>点赞数：</span>
                    <strong>34</strong>
                </div>
                <div class="box_line">
                    <span>作品描述：</span>
                    <strong>如果你问我爱不爱你，我可能会说不爱你，因为你不值得如果你问我爱不爱你，我可能会说不爱你，因为你不值得如果你问我爱不爱你，我可能会说不爱你，因为你不值得如果你问我爱不爱你，我可能会说不爱你，因为你不值得</strong>
                </div>
                <div class="box_line">
                    <span>媒体：</span>
                    <strong>如果你问我爱不爱你，我可能会说不爱你，因为你不值得，因为你不值得如果你问我爱不爱你，我可能会说不爱你，因为你不值得如果你问我爱不爱你</strong>
                </div>
            </div>
            <!-- 活动详情 -->
            <div class="details_box" v-else>
                <div class="box_half">
                    <span>标题：</span>
                    <strong v-font="17">爱你不问归期因为你不值</strong>
                </div>
                <div class="box_half">
                    <span>活动时间：</span>
                    <strong>2024-01-09 08:09:10</strong>
                </div>
                <div class="box_half">
                    <span>活动人数：</span>
                    <strong>6 人 </strong>
                </div>
                <div class="box_half">
                    <span>具体地址：</span>
                    <strong>上海上海市静安区新疆路</strong>
                </div>
                <div class="box_half">
                    <span>消费形式：</span>
                    <strong> AA制 </strong>
                </div>
                <div class="box_half">
                    <span>活动费用：</span>
                    <strong>￥66/人</strong>
                </div>
                <div class="box_half">
                    <span>人群类型：</span>
                    <strong>听力、肢体</strong>
                </div>
                <div class="box_half">
                    <span>报名截止时间：</span>
                    <strong>2024-02-04</strong>
                </div>
                <div class="box_half">
                    <span>发布人昵称：</span>
                    <strong>小哪吒</strong>
                </div>
                <div class="box_half">
                    <span>发布人手机号：</span>
                    <strong>190349384590</strong>
                </div>
                <div class="box_line">
                    <span>活动说明：</span>
                    <strong>如果你问我爱不爱你，我可能会说不爱你，因为你不值得如果你问我爱不爱你，我可能会说不爱你，因为你不值得如果你问我爱不爱你，我可能会说不爱你，因为你不值得如果你问我爱不爱你，我可能会说不爱你，因为你不值得</strong>
                </div>
                <div class="box_line">
                    <span>活动图片：</span>
                    <strong>如果你问我爱不爱你，我可能会说不爱你，因为你不值得，因为你不值得如果你问我爱不爱你，我可能会说不爱你，因为你不值得如果你问我爱不爱你</strong>
                </div>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {
    name: 'square',
    data() {
        return {
            columns: [
                {
                    key: 'age',
                    align: 'center',
                    width: 60,
                },
                {
                    title: '标题',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '具体地址',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '活动时间',
                    key: 'address',
                    align: 'center'
                },
                {
                    title: '活动人数',
                    key: 'address',
                    align: 'center'
                },
                {
                    title: '消费形式',
                    key: 'address',
                    align: 'center'
                },
                {
                    title: '活动费用',
                    key: 'address',
                    align: 'center'
                },
                {
                    title: '报名截止时间',
                    key: 'address',
                    align: 'center'
                },
                {
                    title: '人群类型',
                    key: 'address',
                    align: 'center'
                },
                {
                    title: '发起人昵称',
                    key: 'address',
                    align: 'center'
                },
                {
                    title: '手机号',
                    key: 'address',
                    align: 'center'
                },
                {
                    title: '审核状态',
                    key: 'address',
                    align: 'center'
                },
                {
                    title: '操作',
                    key: 'address',
                    align: 'center',
                    slot: 'actionSlot',
                    width: 200
                }
            ],
            data: [
                {
                    name: 'John',
                    age: 18,
                    address: 'New York',
                    date: '2016-10-03'
                },
                {
                    name: 'Jim',
                    age: 24,
                    address: 'London',
                    date: '2016-10-01'
                },
                {
                    name: 'Joe',
                    age: 30,
                    address: 'Sydney',
                    date: '2016-10-02'
                },
            ],
            modal: false,
            loading: false,
            typeList: [
                { title: '动态广场', code: 'dynamic' },
                { title: '活动广场', code: 'activity' },
                { title: '婚恋广场', code: 'marriage' },
            ],      //  动态 dynamic  ， 活动 activity ， 婚恋 marriage
            nowClass: 'dynamic',
            modalTitle: '动态广场',   // 弹窗标题
            list: {},   // 添加
            pic: '',
        }
    },
}
</script>
<style scoped lang='less'>
.main_box {
    margin-top: 24px;
    padding: 20px;
    box-sizing: border-box;
    background-color: #fff;

    .top_search_box {
        margin-bottom: 16px;
    }

    .footer_box {
        margin-top: 16px;
    }

    .checked_btn_box {
        border: 1px solid #57a3f3;
        color: #57a3f3;
    }
}

.details_box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    .box_half {
        width: 50%;
        margin-bottom: 15px;
    }

    .box_line {
        margin-bottom: 15px;
        display: flex;

        span {
            display: block;
            width: 15%;
            text-align: center;
        }

        strong {
            display: block;
            width: 84%;
        }
    }
}
</style>