import type { DocsSidebarSection } from '../../toc';

export const ECOSYSTEM_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: 'Ecosystem Docs',
    items: [
      {
        title: 'Home',
        path: '/ecosystem',
        icon: 'ic-dashboard',
        product: 'ecosystem',
      },
      {
        title: 'Huawei (Ascend)',
        path: '/ecosystem/huawei',
        icon: 'ic-file',
        product: 'ecosystem',
        children: [
          { title: 'Drivers & Runtime', path: '/ecosystem/huawei/driver-runtime' },
          {
            title: 'MindCluster',
            path: '/ecosystem/huawei/mindcluster',
            children: [
              { title: 'Packages', path: '/ecosystem/huawei/mindcluster/packages' },
              { title: 'Ascend Docker Runtime', path: '/ecosystem/huawei/mindcluster/ascend-docker-runtime' },
              { title: 'NPU Exporter', path: '/ecosystem/huawei/mindcluster/npu-exporter' },
              { title: 'Ascend Device Plugin', path: '/ecosystem/huawei/mindcluster/ascend-device-plugin' },
              { title: 'NodeD', path: '/ecosystem/huawei/mindcluster/noded' },
            ],
          },
        ],
      },
      {
        title: 'Hygon (DCU)',
        path: '/ecosystem/hygon',
        icon: 'ic-product',
        product: 'ecosystem',
        children: [
          { title: 'Driver Installation', path: '/ecosystem/hygon/driver-runtime' },
          {
            title: 'Kubernetes Components',
            path: '/ecosystem/hygon/k8s-components',
            children: [
              { title: 'Overview', path: '/ecosystem/hygon/k8s-overview' },
              { title: 'DCU-Label-Node', path: '/ecosystem/hygon/k8s-label-node' },
              { title: 'DCU-Exporter', path: '/ecosystem/hygon/k8s-exporter' },
              { title: 'DCU Device Plugin (Standard)', path: '/ecosystem/hygon/k8s-device-plugin-standard' },
              { title: 'DCU Device Plugin (MIG)', path: '/ecosystem/hygon/k8s-device-plugin-mig' },
              { title: 'vDCU Dynamic Splitting', path: '/ecosystem/hygon/k8s-vdcu-dynamic-splitting' },
              { title: 'FAQ', path: '/ecosystem/hygon/k8s-faq' },
            ],
          },
        ],
      },
      {
        title: 'NVIDIA (GPU)',
        path: '/ecosystem/nvidia',
        icon: 'ic-analytics',
        product: 'ecosystem',
        children: [
          { title: 'Drivers & Runtime', path: '/ecosystem/nvidia/driver-runtime' },
          {
            title: 'GPU Operator',
            path: '/ecosystem/nvidia/gpu-operator',
            children: [
              { title: 'Install & Verify', path: '/ecosystem/nvidia/gpu-operator/install' },
              { title: 'Node Labels (NFD / GFD)', path: '/ecosystem/nvidia/gpu-operator/node-labels' },
              { title: 'Device Plugin', path: '/ecosystem/nvidia/gpu-operator/device-plugin' },
              { title: 'DCGM Exporter', path: '/ecosystem/nvidia/gpu-operator/dcgm-exporter' },
              { title: 'MIG Partitioning', path: '/ecosystem/nvidia/gpu-operator/mig-manager' },
            ],
          },
          { title: 'Volcano & vGPU', path: '/ecosystem/nvidia/volcano-vgpu' },
          { title: 'FAQ', path: '/ecosystem/nvidia/faq' },
        ],
      },
      {
        title: 'Alibaba Cloud (PPU)',
        path: '/ecosystem/aliyun',
        icon: 'ic-banking',
        product: 'ecosystem',
        children: [
          { title: 'PPU Basics', path: '/ecosystem/aliyun/ppu-basics' },
          { title: 'Lingjun Node Pool', path: '/ecosystem/aliyun/lingjun-nodepool' },
          {
            title: 'Device Plugin',
            path: '/ecosystem/aliyun/device-plugin',
            children: [
              { title: 'Install & Verify', path: '/ecosystem/aliyun/device-plugin/install' },
              { title: 'Scheduling', path: '/ecosystem/aliyun/device-plugin/scheduling' },
              { title: 'MIG Partitioning', path: '/ecosystem/aliyun/device-plugin/mig' },
            ],
          },
          { title: 'Using PPU on the Platform', path: '/ecosystem/aliyun/platform-usage' },
          { title: 'FAQ', path: '/ecosystem/aliyun/faq' },
        ],
      },
      {
        title: 'Open Source Communities',
        path: '/ecosystem/open-source',
        icon: 'ic-course',
        product: 'ecosystem',
        children: [
          { title: 'Containers & Orchestration', path: '/ecosystem/open-source/container-orchestration' },
          { title: 'Frameworks & Inference', path: '/ecosystem/open-source/framework-inference' },
          { title: 'Observability & Operations', path: '/ecosystem/open-source/observability-ops' },
          { title: 'Artifacts & Security', path: '/ecosystem/open-source/artifacts-security' },
          { title: 'FAQ', path: '/ecosystem/open-source/faq' },
        ],
      },
    ],
  },
];
