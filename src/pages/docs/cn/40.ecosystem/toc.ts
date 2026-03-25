import type { DocsSidebarSection } from '../../toc';

// ----------------------------------------------------------------------

export const ECOSYSTEM_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: '生态文档',
    items: [
      {
        title: '首页',
        path: '/ecosystem',
        icon: 'ic-dashboard',
        product: 'ecosystem',
      },
      {
        title: '华为（昇腾 Ascend）',
        path: '/ecosystem/huawei',
        icon: 'ic-file',
        product: 'ecosystem',
        children: [
          { title: '驱动与运行时', path: '/ecosystem/huawei/driver-runtime' },
          {
            title: 'MindCluster（集群调度组件）',
            path: '/ecosystem/huawei/mindcluster',
            children: [
              { title: '获取软件包', path: '/ecosystem/huawei/mindcluster/packages' },
              { title: 'Ascend Docker Runtime', path: '/ecosystem/huawei/mindcluster/ascend-docker-runtime' },
              { title: 'NPU Exporter', path: '/ecosystem/huawei/mindcluster/npu-exporter' },
              { title: 'Ascend Device Plugin', path: '/ecosystem/huawei/mindcluster/ascend-device-plugin' },
              { title: 'NodeD', path: '/ecosystem/huawei/mindcluster/noded' },
            ],
          },
        ],
      },
      {
        title: '海光（DCU）',
        path: '/ecosystem/hygon',
        icon: 'ic-file',
        product: 'ecosystem',
        children: [
          { title: '驱动安装', path: '/ecosystem/hygon/driver-runtime' },
          {
            title: 'Kubernetes 组件',
            path: '/ecosystem/hygon/k8s-components',
            children: [
              { title: '概述', path: '/ecosystem/hygon/k8s-overview' },
              { title: 'DCU-Label-Node', path: '/ecosystem/hygon/k8s-label-node' },
              { title: 'DCU-Exporter', path: '/ecosystem/hygon/k8s-exporter' },
              {
                title: 'DCU-Device-Plugin（标准模式）',
                path: '/ecosystem/hygon/k8s-device-plugin-standard',
              },
              {
                title: 'DCU-Device-Plugin（MIG 模式）',
                path: '/ecosystem/hygon/k8s-device-plugin-mig',
              },
              { title: 'vDCU 动态切分模式', path: '/ecosystem/hygon/k8s-vdcu-dynamic-splitting' },
              { title: 'FAQ', path: '/ecosystem/hygon/k8s-faq' },
            ],
          },
        ],
      },
      {
        title: '其他开源社区',
        path: '/ecosystem/open-source',
        icon: 'ic-course',
        product: 'ecosystem',
        children: [
          { title: '容器与编排', path: '/ecosystem/open-source/container-orchestration' },
          { title: '框架与推理生态', path: '/ecosystem/open-source/framework-inference' },
          { title: '可观测与运维', path: '/ecosystem/open-source/observability-ops' },
          { title: '制品与安全', path: '/ecosystem/open-source/artifacts-security' },
          { title: 'FAQ', path: '/ecosystem/open-source/faq' },
        ],
      },
    ],
  },
];
