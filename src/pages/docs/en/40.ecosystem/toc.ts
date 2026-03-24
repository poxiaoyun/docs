import type { DocsSidebarSection } from '../../toc';

export const ECOSYSTEM_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: 'Ecosystem Docs',
    items: [
      {
        title: 'Home',
        path: '/docs/ecosystem',
        icon: 'ic-dashboard',
        product: 'ecosystem',
      },
      {
        title: 'Huawei (Ascend)',
        path: '/docs/ecosystem/huawei',
        icon: 'ic-file',
        product: 'ecosystem',
        children: [
          { title: 'Drivers & Runtime', path: '/docs/ecosystem/huawei/driver-runtime' },
          {
            title: 'MindCluster',
            path: '/docs/ecosystem/huawei/mindcluster',
            children: [
              { title: 'Packages', path: '/docs/ecosystem/huawei/mindcluster/packages' },
              { title: 'Ascend Docker Runtime', path: '/docs/ecosystem/huawei/mindcluster/ascend-docker-runtime' },
              { title: 'NPU Exporter', path: '/docs/ecosystem/huawei/mindcluster/npu-exporter' },
              { title: 'Ascend Device Plugin', path: '/docs/ecosystem/huawei/mindcluster/ascend-device-plugin' },
              { title: 'NodeD', path: '/docs/ecosystem/huawei/mindcluster/noded' },
            ],
          },
        ],
      },
      {
        title: 'Hygon (DCU)',
        path: '/docs/ecosystem/hygon',
        icon: 'ic-file',
        product: 'ecosystem',
        children: [
          { title: 'Driver Installation', path: '/docs/ecosystem/hygon/driver-runtime' },
          {
            title: 'Kubernetes Components',
            path: '/docs/ecosystem/hygon/k8s-components',
            children: [
              { title: 'Overview', path: '/docs/ecosystem/hygon/k8s-overview' },
              { title: 'DCU-Label-Node', path: '/docs/ecosystem/hygon/k8s-label-node' },
              { title: 'DCU-Exporter', path: '/docs/ecosystem/hygon/k8s-exporter' },
              { title: 'DCU Device Plugin (Standard)', path: '/docs/ecosystem/hygon/k8s-device-plugin-standard' },
              { title: 'DCU Device Plugin (MIG)', path: '/docs/ecosystem/hygon/k8s-device-plugin-mig' },
              { title: 'vDCU Dynamic Splitting', path: '/docs/ecosystem/hygon/k8s-vdcu-dynamic-splitting' },
              { title: 'FAQ', path: '/docs/ecosystem/hygon/k8s-faq' },
            ],
          },
        ],
      },
      {
        title: 'Open Source Communities',
        path: '/docs/ecosystem/open-source',
        icon: 'ic-course',
        product: 'ecosystem',
        children: [
          { title: 'Containers & Orchestration', path: '/docs/ecosystem/open-source/container-orchestration' },
          { title: 'Frameworks & Inference', path: '/docs/ecosystem/open-source/framework-inference' },
          { title: 'Observability & Operations', path: '/docs/ecosystem/open-source/observability-ops' },
          { title: 'Artifacts & Security', path: '/docs/ecosystem/open-source/artifacts-security' },
          { title: 'FAQ', path: '/docs/ecosystem/open-source/faq' },
        ],
      },
    ],
  },
];
