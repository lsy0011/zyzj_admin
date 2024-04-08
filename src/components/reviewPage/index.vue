<template>
    <div class='reviewPage'>
        <!-- <h5>评价组件</h5> -->
        <div class="search_top" style="text-align: center;">
            <Space size="large">
                <!-- <Select placeholder="请选择评价时间"></Select> -->
                <Input v-model="search.keywords" placeholder="评价内容关键字" clearable></Input>
                <!-- <Select placeholder="评价星级"></Select> -->
                <Select v-model="search.audited" placeholder="审核状况" clearable>
                    <Option value="true">通过</Option>
                    <Option value="false">驳回</Option>
                </Select>
                <Select v-model="search.hasImage" placeholder="是否含有图片" clearable>
                    <Option value="true">含有</Option>
                    <Option value="false">不含</Option>
                </Select>
                <Select v-model="search.hasVideo" placeholder="是否含有视频" clearable>
                    <Option value="true">含有</Option>
                    <Option value="false">不含</Option>
                </Select>
                <!-- <Input placeholder="内容关键字"></Input> -->
                <Space>
                    <Button type="primary" @click=" pageNumber = 1; getReviewPage()">查询</Button>
                    <Button @click="search = {}; pageNumber = 1; getReviewPage()">重置</Button>
                </Space>
            </Space>
        </div>
        <div class="main_box">
            <Space size="large">
                <div>
                    <icon type="md-list"></icon>
                    评论列表
                </div>
                <!-- <Button>添加</Button> -->
            </Space>
            <div style="margin-top: 20px;">
                <Table border :columns="columns" :data="data" :loading="loading">
                    <template #portSlot="{ row }">
                        <div v-if="row.user">
                            <img :src="row.user.portrait" width="80" height="80" alt="">
                        </div>
                    </template>
                    <template #scoresSlot="{ row }">
                        <Rate disabled v-model="row.score" />
                    </template>
                    <template #fileSlot="{ row }">
                        <Button type="primary" size="small" @click="getFileList(row)">查看图片</Button>
                    </template>
                    <template #switchSlot>
                        <Switch></Switch>
                    </template>
                    <template #actionSlot="{ row }">
                        <Button v-if="!row.audited" type="info" size="small" v-margin="5"
                            @click="auditCommentsFn(row, true)">评价通过</Button>
                        <Button v-else type="warning" size="small" v-margin="5"
                            @click="auditCommentsFn(row, false)">评价驳回</Button>
                        <Poptip confirm transfer title="您确认删除吗?" @on-ok="removeManageFn(row)">
                            <!-- v-if="row.status && row.status.code != 'enabled'" -->
                            <Button type="error" size="small" v-margin="5">删除</Button>
                        </Poptip>
                    </template>
                </Table>
            </div>
            <div style="margin-top: 20px;">
                <Page :total="total" v-model="pageNumber" show-total size="small" show-elevator show-sizer
                    @on-change="changePage" :page-size-opts="[5, 10, 20, 30, 50]" @on-page-size-change="pageSizeChange" />
            </div>
        </div>
        <Modal v-model="modal" title="图片列表" width="600">

            <div class="demo-upload-list" v-for="item in fileList" :key="item.id">
                <!-- {{ item.path }} -->
                <Image v-if="item.type.code == 'image'" :src="item.path" fit="cover" width="100%" height="100%" />
                <video v-else :src="item.path" controls v-width="'100%'" v-height="'100%'"></video>
                <div class="demo-upload-list-cover" v-if="!item.audited">
                    <Icon title="审核通过" color="#19be6b" type="md-checkmark-circle-outline"
                        @click="handleAuditFn(item, true)"></Icon>
                    <Icon title="审核驳回" color="#ed4014" type="md-return-right" @click="handleAuditFn(item, false)">
                    </Icon>
                    <Icon type="ios-trash-outline" @click="handleRemove(item)"></Icon>
                </div>
                <div class="file_success" v-else>已通过</div>
                <!-- <template v-else>
                        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template> -->
            </div>

        </Modal>
    </div>
</template>
<script>
import {
    getCommentsPageApi,    // 分页
    getCommentsDetailApi,    // 详情
    postCommentsAuditApi,    // 评论审核
    postCommentsRemoveApi,   // 评论删除
    getCommentsFilesListApi,   // 评论文件列表
    postCommentsFilesAuditApi,    // 评论图片审核
    postCommentsFilesRemoveApi,     // 评论图片删除
} from '@/api/account'

export default {
    name: 'reviewPage',
    data() {
        return {
            loading: false,
            total: 0,  // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页数
            columns: [
                {
                    width: 60,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', params.index + 1)
                    }
                },
                {
                    title: '用户昵称',
                    align: 'center',
                    width: 150,
                    render: (h, params) => {
                        return h('div', params.row.user ? params.row.user.nickName : '')
                    }
                },
                {
                    title: '用户头像',
                    align: 'center',
                    width: 150,
                    slot: 'portSlot'
                },
                {
                    title: '手机号',
                    align: 'center',
                    width: 150,
                    render: (h, params) => {
                        return h('div', params.row.user ? params.row.user.mobile : '')
                    }
                },
                {
                    title: '用户类型',
                    align: 'center',
                    width: 150,
                    render: (h, params) => {
                        return h('div', params.row.user ? params.row.user.type ? params.row.user.type.name || '' : '' : '')
                    }
                },
                {
                    title: '评价分数',
                    align: 'center',
                    width: 200,
                    slot: 'scoresSlot'
                },
                {
                    title: '评价内容',
                    key: 'content',
                    align: 'center',
                    minWidth: 150,
                },
                {
                    title: '图片',
                    align: 'center',
                    width: 150,
                    slot: 'fileSlot'
                },
                {
                    title: '评论时间',
                    align: 'center',
                    width: 200,
                    render: (h, params) => {
                        return h('div', params.row.timeCreated ? this.$Date(params.row.timeCreated).format('YYYY-MM-DD HH:mm:ss') : '')
                    }
                },
                // {
                //     title: '是否显示',
                //     align: 'center',
                //     width: 120,
                //     slot: 'switchSlot'
                // },
                {
                    title: '操作',
                    align: 'center',
                    width: 180,
                    slot: 'actionSlot'
                }
            ],
            data: [],
            targetId: '',   // 当前商品id 
            auditId: '',    // 评论ID
            search: {},    // 搜索
            modal: false,

            fileList: [],    // 文件列表
        }
    },
    created() {
        this.targetId = this.$route.query.id;
        this.getReviewPage();
    },
    methods: {
        // 获取列表
        getReviewPage() {
            let data = {
                targetId: this.targetId,
                // targetId: '6520c4ffdac4077f19754720',
                // targetId: '64c0d8ac6ed801128975b028',
                // targetId: '6520c4ffdac4077f19754720',  // ID 带视频
            };
            this.loading = true;
            for (const key in this.search) {
                if (Object.hasOwnProperty.call(this.search, key)) {
                    const element = this.search[key];
                    data[key] = element || '';
                }
            }

            getCommentsPageApi(data).then(res => {
                this.loading = false;
                this.data = res.data;
                this.total = res.totalElements;
            })
        },
        // 审核评论
        auditCommentsFn(row, key) {
            let data = {
                id: row.id,
                audit: key
            }
            postCommentsAuditApi(data).then(res => {
                if (key) {
                    this.$Message.success('已通过！')
                } else {
                    this.$Message.warning('已驳回！')
                }
                this.getReviewPage();
            })
        },
        // 删除
        removeManageFn(row) {

            postCommentsRemoveApi({ commentId: row.id }).then(res => {
                this.$Message.success('删除成功！');
            })
        },

        // 文件列表
        getFileList(row) {
            this.auditId = row;
            getCommentsFilesListApi({ commentId: row.id }).then(res => {

                this.modal = true;
                this.fileList = res;
            })
        },

        // 文件审核
        handleAuditFn(row, key) {

            postCommentsFilesAuditApi({ fileId: row.id, audit: key }).then(res => {
                if (key) {
                    this.$Message.success('文件通过审核')
                } else {
                    this.$Message.warning('文件审核不通过')
                }

                this.getFileList(this.auditId)
            })
        },

        // 文件删除
        handleRemove(row) {

            postCommentsFilesRemoveApi({
                commentId: this.auditId.id,
                fileId: row.id
            }).then(res => {
                this.$Message.success('文件删除成功！')
            })

        },

        // 分页
        changePage(page) {
            this.pageNumber = page;
            this.getReviewPage();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getReviewPage();
        },
    }
}
</script>
<style scoped lang='less'>
.reviewPage {
    margin-top: 24px;
    background-color: #fff;
    padding: 20px;
    box-sizing: border-box;
}

.main_box {
    margin-top: 20px;
}


.demo-upload-list {
    display: inline-block;
    width: 150px;
    height: 150px;
    text-align: center;
    line-height: 30px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;

    .file_success {
        position: absolute;
        width: 100%;
        height: 30px;
        top: -0;
        bottom: 0;
        left: 0;
        right: 0;
        color: #19be6b;
        font-size: 18px;
        font-weight: 600;
    }
}

.demo-upload-list img {
    width: 100%;
    height: 100%;
}

.demo-upload-list-cover {
    display: none;
    position: absolute;
    width: 100%;
    height: 30px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
}

.demo-upload-list:hover .demo-upload-list-cover {
    display: block;
}

.demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}
</style>