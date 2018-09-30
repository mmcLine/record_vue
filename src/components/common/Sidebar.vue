<style lang="less">
    @import url("//at.alicdn.com/t/font_849033_hqj24opjl55.css");
</style>
<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>


<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'iconfont icon-yemian recordicon',
                        index: 'dashboard',
                        title: '系统首页'
                    },
                    {
                     icon: 'iconfont icon-jilu recordicon',
                        index: '1',
                        title: '记录生活',
                        subs: [
                            {
                                index: 'trade_list',
                                title: '消费记录'
                            },
                            {
                                index: 'study_list',
                                title: '学习记录'
                            },
                            {
                                index: 'menstruation_list',
                                title: '姨妈记录'
                            },
                            {
                                index: 'tradeType_list',
                                title: '消费类型'
                            }
                        ]
                    },
                    {
                     icon: 'iconfont icon-denglurizhi recordicon',
                        index: '2',
                        title: '日志管理',
                        subs: [
                            {
                                index: 'loginlog_list',
                                title: '登录日志'
                            }
                        ]
                    },
                     {
                     icon: 'iconfont icon-baobiao1 recordicon',
                        index: '3',
                        title: '报表中心',
                        subs: [
                            {
                                index: 'menstruation_chart',
                                title: '大姨妈走势图'
                            }
                        ]
                    },
                     {
                     icon: 'iconfont icon-guanli recordicon ',
                        index: '4',
                        title: '系统管理',
                        subs: [
                            {
                                index: 'user_list',
                                title: '用户管理'
                            },
                            {
                                index: 'marriage_list',
                                title: '家庭组建'
                            },
                        ]
                    },
                    // {
                    //     icon: 'el-icon-date',
                    //     index: '3',
                    //     title: '表单相关',
                    //     subs: [
                    //         {
                    //             index: 'form',
                    //             title: '基本表单'
                    //         },
                    //         {
                    //             index: 'editor',
                    //             title: '富文本编辑器'
                    //         },
                    //         {
                    //             index: 'markdown',
                    //             title: 'markdown编辑器'
                    //         },
                    //         {
                    //             index: 'upload',
                    //             title: '文件上传'
                    //         }
                    //     ]
                    // },
                    // {
                    //     icon: 'el-icon-star-on',
                    //     index: 'charts',
                    //     title: 'schart图表'
                    // },
                    // {
                    //     icon: 'el-icon-rank',
                    //     index: 'drag',
                    //     title: '拖拽列表'
                    // },
                    // {
                    //     icon: 'el-icon-warning',
                    //     index: 'permission',
                    //     title: '权限测试'
                    // },
                    // {
                    //     icon: 'el-icon-error',
                    //     index: '404',
                    //     title: '404页面'
                    // }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .recordicon{
        margin-right: 10px;
    }
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
