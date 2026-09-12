---
title: Cluster
updated: '2026-09-12'
description: 'Connect Kubernetes clusters: list columns, create/edit form, connection test, terminal, and cluster detail subpage navigation.'
---

## Overview

All computing power on the Rune platform comes from Kubernetes clusters connected through BOSS. Administrators perform the full lifecycle management of clusters here: **adding clusters**, **publishing**, **detail monitoring**, and **terminal operations**.

## Access Path

BOSS Console → Cluster Management

Frontend route: `/rune/clusters`

---

## Cluster List

### Columns

| Column | Field Path | Display | Description |
| --- | --- | --- | --- |
| Name | `name` | Link + description | Click to open the cluster overview; description shown underneath |
| Version | `status.version.gitVersion` | Text | Kubernetes version; shows `-` when unavailable |
| Published | `published` | Icon | Online / offline; only published clusters are visible to tenants |
| Connection Status | `status` | Status component | Rendered by `ObjectStatus` (namespace `cluster`) |
| Created At | `creationTimestamp` | Time | Time the cluster was connected |

### Available Actions

| Action | Description |
| --- | --- |
| Terminal | Open the cluster's kubectl terminal |
| Publish / Unpublish | Toggle `published`, with a confirmation dialog |
| Edit | Open the edit page |
| Delete | Delete the cluster with a confirmation dialog |

> ⚠️ Note: **There is no "Test Connection" in the list actions.** The connection test only appears inside the create/edit form.

---

## Add / Edit Cluster

### Form Fields

| Field | Field Name | Type | Required | Description |
| --- | --- | --- | --- | --- |
| Name | `name` | IdField (name + auto-generated ID) | ✅ | Display name; the ID can be edited manually and cannot be changed after creation |
| Description | `description` | Textarea (4 rows) | — | Supplementary notes such as purpose or location |
| Cluster Type | `type` | Fixed value | — | Fixed to `Kubernetes` |
| KubeConfig | `kube.config` | Textarea (8 rows, monospace) | ✅ | kubeconfig YAML content |

> 💡 Tip: In edit mode the cluster ID cannot be modified.

### Test Connection (Inside the Form)

- The **Test Connection** button is enabled only when both `name` and `kube.config` are filled in.
- On success, a success message is shown at the top of the form along with the detected cluster version `gitVersion`.
- On failure, the error details are shown.

KubeConfig is the core configuration for connecting to a cluster. Example:

```yaml
apiVersion: v1
kind: Config
clusters:
  - cluster:
      server: https://your-k8s-api-server:6443
      certificate-authority-data: <base64-ca>
    name: my-cluster
contexts:
  - context:
      cluster: my-cluster
      user: admin
    name: my-context
current-context: my-context
users:
  - name: admin
    user:
      client-certificate-data: <base64-cert>
      client-key-data: <base64-key>
```

> ⚠️ Note: KubeConfig contains sensitive credentials. Use a dedicated ServiceAccount and grant only the minimum required permissions.

---

## Publish / Unpublish

`published` determines whether the cluster is visible to tenants:

| Action | Effect |
| --- | --- |
| Publish | The cluster becomes visible to tenants and can be used for resource allocation and deployment |
| Unpublish | Hidden from tenants; already deployed instances are unaffected, but new deployments are no longer allowed |

---

## kubectl Terminal

The **Terminal** action in the list opens a built-in web terminal already configured with the target cluster's context, where you can run `kubectl` commands directly.

```bash
kubectl get nodes
kubectl get pods -A
kubectl top nodes
```

> ⚠️ Note: The terminal has cluster administrator privileges. Operate with caution and avoid running destructive commands on production clusters.

---

## Cluster Detail and Subpage Navigation

Click a cluster name to open the detail page (frontend route `/rune/clusters/:cluster/:domain`). The sidebar contains **11 subpages**:

| Group | Subpage | Frontend Route |
| --- | --- | --- |
| Cluster Info | Cluster Info (Overview) | `/rune/clusters/:cluster/overview` |
| Cluster Info | Node Status | `/rune/clusters/:cluster/nodes` |
| Cluster Info | Accelerator Info | `/rune/clusters/:cluster/gpu-dashboard` |
| Resource Management | Resource Pools | `/rune/clusters/:cluster/resource-pools` |
| Resource Management | Flavors | `/rune/clusters/:cluster/flavors` |
| Resource Management | Tenant Quotas | `/rune/clusters/:cluster/tenant-quotas` |
| Operations Management | Workloads | `/rune/clusters/:cluster/resources` |
| Operations Management | Storage Clusters | `/rune/clusters/:cluster/storages` |
| Operations Management | System Apps | `/rune/clusters/:cluster/systems` |
| Operations Management | Scheduler Management | `/rune/clusters/:cluster/schedulers` |
| Operations Management | Log Management | `/rune/clusters/:cluster/logs` |

### Overview

The overview page renders dashboards whose names contain `basic`, i.e. **basic dashboards**. It does not include a separate accelerator dashboard (that lives on the "Accelerator Info" subpage).

### Node Status / Accelerator Info

Both pages are **monitoring dashboards aggregated by name**, not node inventories:

- Node Status: aggregates dashboards whose names contain `node`.
- Accelerator Info: aggregates dashboards whose name or title (lowercased) contains `gpu` or `npu`; an NPU dashboard originally listed after an NVIDIA GPU dashboard is moved ahead of it.

> ⚠️ Note: These two pages have **no node table** and do not show node roles, IPs, CPU/memory details, labels, or taints. For node-level object information, use the Nodes tab on the "Workloads" subpage or the kubectl terminal.

### Workloads (Kubernetes Resource Browser)

There are 14 built-in resource tabs: Pods, Nodes, Deployments, StatefulSets, DaemonSets, Jobs, CronJobs, Services, Ingresses, IngressClasses, StorageClasses, ConfigMaps, Secrets, PersistentVolumeClaims. See [Kubernetes Resource Browser](./resources).

### Storage Clusters / System Apps

Both are rendered as instance lists (`category = storage` / `system`) with identical columns: `name`, `product.version`, `status.phase`, `creationTimestamp`. See [Storage and Runtime Services](./storage-runtime) and [System Instance Management](./systems).

The **Add** button on the System Apps / Storage Clusters page navigates to the system template market (`/rune/clusters/:cluster/system-market`) to pick a template and deploy.

### Log Management

Loki-based cluster log query (`LogViewer`), supporting query statements, label suggestions, label-value lookup, and WebSocket real-time log streaming, with a switch between the "All / Nodes" scopes.

### Scheduler Management

A drag-and-drop editor for Volcano scheduling configuration: it loads `actions` / `plugins` / `tiers`, which are edited locally and then saved and pushed.

### Routes Not in the Sidebar

The following routes exist but are **not in the detail subpage navigation**:

| Route | Status |
| --- | --- |
| `/rune/clusters/:cluster/metrics` | Reserved page, a ComingSoon placeholder in the frontend |
| `/rune/clusters/:cluster/events` | Reserved page, a ComingSoon placeholder in the frontend |
| `/rune/clusters/:cluster/dynamic-dashboard` | Cluster dashboard editor (entered from overview dashboard configuration) |
| `/rune/clusters/:cluster/system-market` | Entered from the "Add" button on System Apps / Storage Clusters |

---

## Permission Requirements

Requires the **System Administrator** role. You can view the list, add/edit/delete clusters, publish/unpublish, use the terminal, and access all detail subpages.
