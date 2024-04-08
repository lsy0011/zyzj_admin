<template>
    <div class='classify_manage'>
        <!-- <h5>广场分类管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="广场管理" content="广场分类管理" hidden-breadcrumb />
        </div>
        <div class="main_box">
            <div class="top_search_box">
                <Space size="large">
                    <div v-font="16">
                        <Icon type="md-list"></Icon>
                        分类列表
                    </div>
                    <Button v-for="(item, index) in typeList" :key="index"
                        :class="{ 'checked_btn_box': nowClass == item.code }"
                        @click="nowClass = item.code; modalTitle = item.title;">
                        {{ item.title }}
                    </Button>
                    <Button type="primary" @click="modal = true;">新建分类</Button>
                </Space>
            </div>
            <div class="table_box">
                <Table border :columns="columns" :data="data" :loading="loading">
                    <template #actionSlot>
                        <Button type="primary" size="small" v-margin="5">修改</Button>
                        <Button type="error" size="small" v-margin="5">删除</Button>
                        <Button size="small" v-margin="5">上移</Button>
                        <Button size="small" v-margin="5">下移</Button>
                    </template>
                </Table>
            </div>
            <div class="footer_box">
                <Page :total="100" />
            </div>
        </div>
        <Modal :title="'新建 ' + modalTitle + ' 分类'" v-model="modal">

            <Form :model="list" label-position="right" :label-width="100">
                <FormItem label="分类名称：">
                    <Input v-model="list.title"></Input>
                </FormItem>
                <FormItem label="分类图标：">
                    <div>
                        <img :src="list.pic" alt="" :data-source="list.pic" style="width:120px" />
                    </div>
                    <Upload ref="upload" action="" :before-upload="handleBeforeLicenseUrlUpload">
                        <Button icon="ios-cloud-upload-outline">上传</Button>
                    </Upload>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
export default {
    name: 'classify_manage',
    data() {
        return {
            columns: [
                {
                    title: '排序',
                    key: 'age',
                    align: 'center',
                    width: 90,
                },
                {
                    title: '分类名',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '分类图标',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '文章数',
                    key: 'address',
                    align: 'center'
                },
                {
                    title: '新建时间',
                    key: 'address',
                    align: 'center'
                },
                {
                    title: '修改时间',
                    key: 'address',
                    align: 'center'
                },
                {
                    title: '操作',
                    key: 'address',
                    align: 'center',
                    slot: 'actionSlot',
                    width: 260
                }
            ],
            data: [
                {
                    name: 'John Brown',
                    age: 18,
                    address: 'New York No. 1 Lake Park',
                    date: '2016-10-03'
                },
                {
                    name: 'Jim Green',
                    age: 24,
                    address: 'London No. 1 Lake Park',
                    date: '2016-10-01'
                },
                {
                    name: 'Joe Black',
                    age: 30,
                    address: 'Sydney No. 1 Lake Park',
                    date: '2016-10-02'
                },
                {
                    name: 'Jon Snow',
                    age: 26,
                    address: 'Ottawa No. 2 Lake Park',
                    date: '2016-10-04'
                }
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
    methods: {

        handleBeforeLicenseUrlUpload(file) {
            this.pic = file;
            this.list.pic = window.URL.createObjectURL(file);
            return false;
        },
    }
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

}

.checked_btn_box {
    border: 1px solid #57a3f3;
    color: #57a3f3;
}
</style>