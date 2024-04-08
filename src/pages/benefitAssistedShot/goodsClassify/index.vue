<template>
    <div class='goodsClassify'>
        <!-- <h5>商品分类管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="益助拍管理" content="商品分类管理" hidden-breadcrumb />
        </div>
        <div class="classify_main">
            <div class="search_top" style="text-align: center;">
                <Space size="large">
                    <!-- <Space>
                        <strong>状态</strong>
                        <Select size="small">
                            <Option value="1"></Option>
                        </Select>
                    </Space> -->
                    <Space>
                        <strong>分类名称</strong>
                        <Input v-model="search.keywords" placeholder="请输入首级分类名关键字" size="small"></Input>
                    </Space>
                    <Space>
                        <Button type="primary" size="small" @click="getClassifyList();">查询</Button>
                        <Button size="small" @click="search = {}; getClassifyList()">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="table_title">
                <Space size="large">
                    <strong v-font="16">
                        <Icon type="md-list"></Icon>
                        数据列表
                    </strong>
                    <Button type="primary" size="small" @click="detailsFn(false)">增加</Button>
                    <Poptip confirm transfer title="确认删除所选择的吗?" @on-ok="removeFn(selecAllId)">
                        <Button type="error" icon="ios-trash" ghost size="small"
                            :disabled="!selecAllId.length">删除</Button>
                    </Poptip>
                </Space>
            </div>
            <Table row-key="id" :columns="columns" :data="data" border @on-selection-change="selectionChange">

                <template #statuSlot="{ row }">
                    <div v-if="row.status">
                        <Switch v-model="row.status.code" true-value="enabled" false-value="disabled"
                            @on-change="(i) => changeSatusFn(i, row)"></Switch>
                    </div>
                    <div v-else>
                        <Switch true-value="enabled" false-value="disabled" @on-change="(i) => changeSatusFn(i, row)">
                        </Switch>
                    </div>
                </template>

                <template #actionSlot="{ row }">
                    <Button type="primary" size="small" style="margin-right: 5px" @click="detailsFn(row.id)">编辑</Button>
                    <Poptip confirm transfer title="您确认删除吗?" @on-ok="removeFn([row])">
                        <Button type="error" v-if="row.status.code != 'enabled'" size="small">删除</Button>
                    </Poptip>
                </template>
            </Table>
        </div>
        <!-- 增加的弹框 -->
        <Modal v-model="modal" :title="modalTitle" @on-visible-change="visibleChangeFn">
            <Form ref="form" :model="list" label-position="right" :rules="ruleValidate" :label-width="100">
                <FormItem label="分类级别">
                    <RadioGroup v-model="radioVal">
                        <Radio label="head">
                            <span>首级</span>
                        </Radio>
                        <Radio label="next">
                            <span>次级</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="上级分类" v-if="radioVal !== 'head'">
                    <TreeSelect v-model="list.parentId" :data="data" transfer />
                </FormItem>
                <FormItem label="分类名称" prop="name">
                    <Input placeholder="请输入内容" v-model="list.name"></Input>
                </FormItem>
                <FormItem label="分类编码" prop="code">
                    <Input placeholder="请输入内容" v-model="list.code"></Input>
                </FormItem>
                <FormItem label="权重设定" prop="weight">
                    <Input placeholder="请输入内容" v-model="list.weight" type="number"
                        @on-blur="list.weight = $event.target.value < 0 ? 0 : $event.target.value * 1"></Input>
                </FormItem>
                <FormItem label="分类备注">
                    <Input v-model="list.remark" type="textarea" :rows="3" placeholder="请输入内容" />
                </FormItem>
                <FormItem label="分类图标" prop="icon">
                    <!-- <p>建议尺寸120*120</p> -->
                    <Upload ref="upload" action="" :before-upload="handleBeforeLicenseUrlUploadIcon">
                        <Button icon="ios-cloud-upload-outline">上传</Button>
                    </Upload>
                    <div>
                        <img :src="list.icon" alt="" :data-source="list.icon" style="width:120px" />
                    </div>
                </FormItem>
                <FormItem label="分类图片" prop="pic">
                    <Upload ref="upload" action="" :before-upload="handleBeforeLicenseUrlUploadImg">
                        <Button icon="ios-cloud-upload-outline">上传</Button>
                    </Upload>
                    <div>
                        <img :src="list.pic" alt="" :data-source="list.pic" style="width:120px" />
                    </div>
                </FormItem>
            </Form>

            <template #footer>
                <Button type="primary" @click="confirmFn('form')">确认</Button>
                <Button @click="modal = false; list = {};">取消</Button>
            </template>
        </Modal>
    </div>
</template>

<script>
import {
    getGoodsCategoryTreeApi,
    postGoodsCategoryStatusApi,
    getGoodsCategoryDetailApi,
    postGoodsCategorySaveApi, // 更改添加  携带biz
    postGoodsCategoryDelApi,  // 删除

    getGoodsPropertyDetailApi,     // 属性详情
    postGoodsPropertySaveApi,    // 属性保存
} from '@/api/account.js';
import util from '@/libs/util';
import { jsonToArray } from "@/libs/util.js";
export default {
    name: 'goodsClassify',
    data() {
        return {
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                },
                {
                    title: '序号',
                    width: 90,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [params.row.indexOf_])
                    }
                },
                {
                    title: '分类名称',
                    key: 'name',
                    tree: true,
                    align: 'center'
                },
                {
                    title: '分类ID',
                    key: 'id',
                    align: 'center'
                },
                {
                    title: '分类编码',
                    key: 'code',
                    align: 'center'
                },
                {
                    title: '分类权重',
                    key: 'weight',
                    align: 'center'
                },
                {
                    title: '状态',
                    align: 'center',
                    width: 90,
                    slot: 'statuSlot',
                },
                {
                    title: '操作',
                    slot: 'actionSlot',
                    width: 150,
                    align: 'center',
                    fixed: 'right'
                }
            ],
            data: [],
            modal: false,
            modalTitle: '新建分类',
            list: {},   // 添加
            data: [],
            radioVal: 'head',  // 是否首级
            selecAllId: [],  // 批量操作
            search: {},   // 查询

            sizeId: '',   // 属性id
            propList: {
                categoryId: []
            },     // 属性保存

            // 表单验证
            ruleValidate: {
                name: [
                    { required: true, message: '该项为必填项', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '该项为必填项', trigger: 'blur' }
                ],
                weight: [
                    { required: true, type: "number", message: '该项为必填项', trigger: 'blur' }
                ],
                icon: [
                    { required: true, message: '分类图标必须上传', trigger: 'chnage' }
                ],
                pic: [
                    { required: true, message: '分类图片必须上传', trigger: 'change' }
                ],
            }
        }
    },
    created() {
        this.getClassifyList();
        let appId = util.cookies.get('appId');
        let type = !appId ? process.env.VUE_APP_ID : appId == 'zhuyou' ? 'release:aid-2023' : 'yj:yj20231210';;

        this.sizeId = '';
        if (type == 'release:aid-2023') {
            this.sizeId = '6577becacc15d21536395f01';   // 正式版
        } else if (type == 'demo:aid-2023') {
            this.sizeId = '656565d67b658a63d10cbec4';   // 测试版
        } else {
            this.sizeId = '6577cf65cc15d21536395f09';    // 拥军版
        }
        getGoodsPropertyDetailApi(this.sizeId).then(res => {
            let arr = res.categoryInfo.map(item => {
                return item.id;
            })

            this.propList = {
                id: res.id || '',
                categoryId: arr || '',
                biz: 'auction',
                name: res.name || '',
                rank: res.rank || '',
            };
        })
    },
    methods: {
        // 获取分类数据列表
        getClassifyList() {
            this.loading = true;
            getGoodsCategoryTreeApi({
                biz: 'auction',
                ...this.search
            }).then(res => {
                this.total = res.length
                this.data = []
                let arr = jsonToArray(res, true)
                this.data.push(...arr)
                this.loading = false;
                this.data.forEach((item, index) => {
                    item.indexOf_ = index + 1;

                    if (item.children.length > 0) {
                        item.children.forEach((itm, ind) => {
                            let indx = ind + 1;
                            itm.indexOf_ = index + 1 + '.' + indx;

                            if (itm.children.length > 0) {
                                itm.children.forEach((it, inx) => {
                                    let ix = inx + 1;
                                    it.indexOf_ = itm.indexOf_ + '.' + ix;
                                })
                            }
                        })
                    }
                })
            }).catch(err => {
                this.loading = false;
            })
        },
        // 编辑和添加
        detailsFn(id) {
            if (id) {
                getGoodsCategoryDetailApi(id).then(res => {
                    this.loading = false;
                    // console.log(res);
                    this.modalTitle = '编辑商品分类'
                    this.list = {
                        id: res.id,
                        parentId: res.node.parentId,
                        name: res.name,
                        code: res.code,
                        weight: res.weight,
                        rank: res.rank,
                        remark: res.remark,
                        pic: res.file && res.file.pic ? res.file.pic : '',
                        icon: res.file && res.file.icon ? res.file.icon : '',
                    }
                    this.modal = true
                }).catch(err => {
                    this.loading = false
                    console.log(err);
                })
            } else {
                this.modalTitle = '新增商品分类'
                this.list = {
                    parentId: '',
                    name: '',
                    code: '',
                    weight: '',
                    rank: '',
                    remark: '',
                    pic: '',
                    icon: '',
                }
                this.modal = true
            }
        },
        // 弹框的确认,提交新增/编辑
        confirmFn(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {

                    let formData = new FormData();
                    if (this.pic !== null) {
                        formData.append('upload[pic]', this.pic);
                    };
                    if (this.icon !== null) {
                        formData.append('upload[icon]', this.icon);
                    };

                    formData.append('biz', 'auction');
                    for (const key in this.list) {
                        if (Object.hasOwnProperty.call(this.list, key)) {
                            const element = this.list[key];
                            if (key != 'pic' && key != 'icon') {
                                formData.append(key, element);
                            };
                        };
                    };

                    postGoodsCategorySaveApi(formData, false).then((res) => {
                        if (res.id) {
                            let messageT = '';
                            messageT = this.modalTitle == '新增商品属性' ? '添加成功！' : '修改成功！';
                            this.$Message.success(messageT);
                            this.modal = false;
                            this.propList.categoryId.push(res.id);
                            let formdata2 = new FormData();
                            for (const key in this.propList) {
                                if (Object.hasOwnProperty.call(this.propList, key)) {
                                    const element = this.propList[key];
                                    if (key == 'categoryId') {
                                        element.forEach(itm => {
                                            formdata2.append(key, itm);
                                        });
                                        formdata2.append(key, res.id);
                                    } else {
                                        formdata2.append(key, element);
                                    };
                                };
                            };

                            postGoodsPropertySaveApi(formdata2, false).then(rs => {
                                console.log(res.name + '，已使用默认属性：' + rs.name);
                                this.getClassifyList();
                            })

                        };
                    }).catch((err) => {
                        console.log(err);
                    });
                } else {
                    this.$Message.error('请先补充必填项!');
                }
            })
        },
        // 修改状态
        changeSatusFn(value, row) {
            postGoodsCategoryStatusApi({ id: row.id, value }).then(res => {
                this.$Message.success('操作成功！');
                this.getClassifyList();
            }).catch(err => {
                this.getClassifyList();
            })
        },
        // 删除按钮
        removeFn(row = []) {
            let formData = new FormData();
            row.forEach(item => {
                formData.append('id', item.id)
            })
            postGoodsCategoryDelApi(formData, false)
                .then(res => {
                    if (res) {
                        this.$Message.success('操作成功！');
                        this.getClassifyList();
                    };
                }).catch(err => {
                    console.log(err);
                })
        },
        // 表格选中状态
        selectionChange(selection) {
            this.selecAllId = []
            this.selecAllId.push(...selection)
        },
        // 上传图标
        handleBeforeLicenseUrlUploadIcon(file) {
            this.icon = file;
            this.list.icon = window.URL.createObjectURL(file);
            return false;
        },
        // 上传图片
        handleBeforeLicenseUrlUploadImg(file) {
            this.pic = file;
            this.list.pic = window.URL.createObjectURL(file);
            return false;
        },
        visibleChangeFn(flag) {
            if (!flag) {
                this.$refs['form'].resetFields();
            }
        },
    }
}
</script>

<style scoped lang='less'>
.classify_main {
    margin-top: 24px;
    padding: 20px 30px;
    background: #fff;

    .table_title,
    .search_top {
        margin-bottom: 15px;
    }

    .ivu-table-cell-slot {
        button {
            margin: 5px;
        }
    }
}
</style>