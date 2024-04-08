<template>
    <div class='informationRelease'>
        <!-- <h5>资讯发布管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="资讯管理" content="资讯发布管理" hidden-breadcrumb />
        </div>
        <div class="inforRelease">
            <Space size="large">
                <strong style="font-size: 17px;">
                    <Icon type="md-menu" />数据列表
                </strong>
                <TreeSelect v-model="search.categoryId" :data="categoryList" placeholder="请选择分类"
                    @on-change="getPolicyPage" clearable>
                    <!-- <Option v-for="item in categoryList" :key="item.id" :value="item.id">
                        {{ item.name }}
                    </Option> -->
                </TreeSelect>
                <Button type="primary" @click="jumpNew()">增加</Button>
                <!-- <Poptip confirm transfer title="确认删除所选择的吗?" @on-ok="allRemove">
                    <Button type="error" icon="ios-trash" ghost>删除</Button>  'policy', 'news', 'outcome'
                </Poptip> -->
            </Space>
            <!-- 表格 -->
            <div class="tab-main">
                <Table border :columns="columns" :data="data" :loading="loading" @on-selection-change="selectionChange">
                    <template #statusSlot="{ row }">
                        <Switch v-model="row.status.code" true-value="enabled" false-value="disabled"
                            @on-change="(value) => batchStatusFn(value, [row], true)"></Switch>
                    </template>
                    <template #rankSlot="{ row, index }">
                        <div v-if="!rankFlag || index != rankObj.show">
                            {{ row.rank }}
                            <Icon type="md-build" title="点击修改" @click="editRankFn(row, index)" />
                        </div>
                        <div v-if="rankFlag && index == rankObj.show" class="table_rank_ipt">
                            <InputNumber v-model="rankObj.value" :min="1" v-width="70" />
                            <div class="table_action">
                                <Icon type="md-checkmark" color="#2ea043" @click="rankSaveFn()" />
                                <Icon type="md-close" color="#dc362e" @click="rankFlag = false; rankObj.show = null;" />
                            </div>
                        </div>
                    </template>
                    <template #action="{ row }">
                        <div>
                            <Button type="info" size="small" style="margin-right: 10px"
                                @click="detailFn(row.id)">查看</Button>
                            <Button size="small" style="margin-right: 10px"
                                @click="batchStatusFn(row.status.code, [row], false)">下架</Button>
                            <Button type="primary" size="small" style="margin-right: 10px"
                                @click="jumpNew(row.id)">编辑发布</Button>
                            <Poptip confirm transfer title="您确认删除吗?" @on-ok="batchRemoveFn([row])">
                                <Button type="error" size="small" v-show="row.status.code != 'enabled'">删除</Button>
                            </Poptip>
                        </div>
                    </template>
                </Table>
            </div>
            <div class="tab_btn">
                <Space>
                    <Poptip confirm transfer title="您确认删除吗?" @on-ok="batchRemoveFn(seleMore)">
                        <Button type="error" size="small" :disabled="seleMore.length == 0">批量删除</Button>
                    </Poptip>

                    <Button type="success" size="small" :disabled="seleMore.length == 0"
                        @click="modal = true;">批量修改分类</Button>

                    <Poptip confirm transfer title="您确认下架吗?" @on-ok="batchStatusFn('disabled', seleMore, true)">
                        <Button type="info" size="small" :disabled="seleMore.length == 0">批量下架</Button>
                    </Poptip>
                </Space>
            </div>
            <!-- 分页器 -->
            <div class="tab-foot-page">
                <Page :total="total" show-total size="small" show-elevator show-sizer @on-change="changePage"
                    :page-size-opts="[5, 10, 20, 30, 50]" @on-page-size-change="pageSizeChange" />
            </div>
        </div>
        <Modal v-model="modal" title="修改分类" width="360">

            <Form>
                <!-- <FormItem>
                    <RadioGroup v-model="bigCategory" @on-change="changeCategoryFn">
                        <Radio label="policy">
                            <span>助残政策</span>
                        </Radio>
                        <Radio label="news">
                            <span>助残新闻</span>
                        </Radio>
                        <Radio label="outcome">
                            <span>助残成果</span>
                        </Radio>
                    </RadioGroup>
                </FormItem> -->
                <FormItem>
                    <Select v-model="selectCategory" placeholder="请选择分类">
                        <Option v-for="item in categoryList" :key="item.id" :value="item.id">
                            {{ item.name }}
                        </Option>
                    </Select>
                </FormItem>
            </Form>

            <template #footer>
                <Button type="primary" @click="batchCategoryFn()">确认</Button>
                <Button @click="modal = false; selectCategory = '';">取消</Button>
            </template>
        </Modal>

        <Modal v-model="lookModal" title="查看详情" width="430">
            <div class="look_box">
                <h3>{{ list.title }}</h3>
                <p>来源：{{ list.from }}</p>
                <span>{{ $Date(list.timeCreated).format("YYYY-M-D HH:mm:ss") }}</span>
                <hr>
                <div v-html="list.longtext"></div>
            </div>
            <template #footer>
                <p> </p>
            </template>
        </Modal>
    </div>
</template>
<script>
import {
    getCmsContentPolicyPageApi,  // 列表
    postCmsContentPolicyStatusApi,  // 修改状态
    postCmsContentPolicyRemoveApi, // 删除
    postCmsContentPolicyCategoryApi,   // 批量修改分类
    getCmsCategoryPolicyTreeApi,   // 分类列表
    postCmsContentRankApi,   // 排序

    getCmsContentPolicyDetailApi,  // 详情
} from '@/api/account.js'
import { jsonToArray } from "@/libs/util.js";
export default {
    name: 'informationRelease',
    data() {
        return {
            loading: false,
            total: 0,  // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页码数
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '分类',
                    // key: 'name',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', params.row.category.name)
                    }
                },
                {
                    title: '标题',
                    key: 'title',
                    align: 'center'
                },
                {
                    title: '副标题',
                    key: 'subhead',
                    align: 'center'
                },
                {
                    title: '作者',
                    key: 'author',
                    align: 'center'
                },
                {
                    title: '来源',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [params.row.from ? params.row.from : '---'])
                    }
                },
                {
                    title: '发布时间',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', this.$Date(params.row.timeCreated).format("YYYY-M-D HH:mm"))
                    }
                },
                {
                    title: '排序',
                    slot: 'rankSlot',
                    align: 'center',
                    width: 90,
                },
                {
                    title: '状态',
                    slot: 'statusSlot',
                    align: 'center',
                    width: 90,
                },
                {
                    title: '操作',
                    slot: 'action',
                    align: 'center',
                    width: 299
                }
            ], // 表头
            data: [],// 表体 
            list: {},   // 查看
            search: {},
            modal: false,
            lookModal: false,
            rankFlag: false,  // 排序
            rankObj: {},   // 值
            seleMore: [], // 选中的
            selectCategory: '',
            bigCategory: '',
            categoryList: [],   // 分类列表
            essayType: 'information',    // 文章分类 'policy', 'news', 'outcome'
        }
    },
    created() {
        this.changeCategoryFn();
        this.getPolicyPage();
    },
    methods: {
        // 获取列表
        getPolicyPage() {
            this.loading = true;
            let data = {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
                ...this.search,
            };
            getCmsContentPolicyPageApi(data, this.essayType).then(res => {
                this.total = res.totalElements;
                this.data = res.data;
                this.loading = false;
                // console.log(res);
            }).catch(err => {
                console.log(err);
            })
        },
        // 查看
        detailFn(id) {
            getCmsContentPolicyDetailApi(id, 'information').then(res => {
                this.list = res;
                this.lookModal = true;
            })
        },
        // 编辑
        jumpNew(id) {
            // console.log(id);
            this.$router.push({
                path: 'newInformation',
                query: { id, }
            })
        },
        // 修改状态
        batchStatusFn(value, arr, type) {
            if (value != 'disabled' || type) {
                if (value == 'enabled' && !type) {
                    value = 'disabled'
                }
                let formData = new FormData();

                arr.forEach(element => {
                    formData.append('id', element.id);
                });
                formData.append('value', value);

                postCmsContentPolicyStatusApi(formData, false, this.essayType).then(res => {
                    if (res) {
                        this.$Message.success('修改成功！')
                        this.getPolicyPage();
                        this.seleMore = [];
                    }
                }).catch(err => {
                    this.getPolicyPage();
                })
            } else {
                this.$Message.warning('已被下架')
            }
        },
        // 删除
        batchRemoveFn(arr = []) {

            let formData = new FormData();
            arr.forEach(element => {
                formData.append('id', element.id);
            });

            postCmsContentPolicyRemoveApi(formData, false, this.essayType)
                .then(res => {
                    if (res) {
                        this.$Message.success('操作成功！');
                        this.getPolicyPage();
                    }
                }).catch(err => {
                    console.log(err);
                    this.$Message.error('失败！');
                    this.getPolicyPage();
                })
        },
        // 修改分类
        batchCategoryFn() {

            let formData = new FormData();

            if (this.selectCategory)

                this.seleMore.forEach(item => {
                    formData.append('id', item.id);
                })
            formData.append('categoryId', this.selectCategory);

            postCmsContentPolicyCategoryApi(formData, false, this.essayType).then(res => {
                if (res) {
                    this.$Message.success('修改成功！');
                } else {
                    this.$Message.warning('修改失败！')
                };
                this.modal = false;
                this.seleMore = [];
                this.getPolicyPage();
            })
        },
        changeCategoryFn() {
            getCmsCategoryPolicyTreeApi(this.essayType).then(res => {
                this.categoryList = jsonToArray(res, false);
            });
        },
        // 复选框的选中
        selectionChange(selection) {
            this.seleMore = selection;
        },
        // 编辑排序
        editRankFn(row, index) {
            this.rankObj = {
                id: row.id,
                value: row.rank,
                show: index,    // 编辑位置 
            };
            this.rankFlag = true;
        },
        // 保存排序
        rankSaveFn() {
            postCmsContentRankApi(this.rankObj).then(res => {
                // console.log(res);
                this.$Message.success('排序值保存成功！');
                this.rankFlag = false;
                this.rankObj.show = undefined;
                this.getPolicyPage();
            })
        },
        // 分页
        changePage(page) {
            // console.log(page);
            this.pageNumber = page;
            this.getPolicyPage(this.essayType);
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getPolicyPage(this.essayType);
        },
    }
}
</script>
<style scoped lang='less'>
.inforRelease {
    margin-top: 24px;
    padding: 20px 30px;
    box-sizing: border-box;
    background: #fff;

    .tab-main {
        margin-top: 20px;
    }

    .tab_btn {
        margin-top: 15px;
    }

    .tab-foot-page {
        margin-top: 20px;
        margin-bottom: 15px;
    }

    .btn_border {
        border: 1px solid #58a3f3;
        border-radius: 3px;
    }
}

.look_box {
    padding: 0 5px;
    box-sizing: border-box;
    height: 630px;
    overflow-y: auto;

    /*滚动条整体样式*/
    &::-webkit-scrollbar {
        /*高宽分别对应横竖滚动条的尺寸*/
        width: 10px;
        height: 1px;
    }

    /*滚动条里面小方块*/
    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(138, 134, 134, 0.2);
        background: #535353;
    }

    /*滚动条里面轨道*/
    &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(114, 114, 114, 0.2);
        border-radius: 10px;
        background: #EDEDED;
    }

    p {
        margin-top: 15px;
    }

    p,
    span {
        display: block;
        text-align: right;

    }

    hr {
        margin: 10px 0;
    }
}
</style>