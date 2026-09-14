---
title: Cluster
updated: '2026-09-14'
description: 'Connect a Kubernetes cluster to the platform: fill in kubeconfig, test the connection, publish it, and confirm its nodes are up.'
---

# Cluster

A cluster (think of a data-centre building) is where the platform's compute comes from. One cluster contains many machines (nodes), and each machine may hold several accelerator cards. Your first job is to connect this "building" to the platform, so that the platform knows about it and can hand its resources to users.

By the end of this page you will be able to: connect a new cluster, test whether the connection works, publish it for tenants, and confirm that all its nodes have come up.

:::tip Three words to keep straight

- **Cluster** ≈ a data-centre building.
- **Node** ≈ one server in that building.
- **Accelerator (GPU / NPU)** ≈ the "engine" inside a server that does the AI maths.

:::

## Before you start

- You need a **system administrator** account.
- Prepare the **kubeconfig** of the target cluster (the "key ring" file used to connect to it — see below).
- Confirm that the platform network can reach the cluster API address (usually `https://<cluster-address>:6443`).

## Reading the cluster list

In the left-hand menu, click **Cluster** under the **AI Platform** group. The list has these columns:

| Column | Meaning |
| --- | --- |
| Name | Click the cluster name to open its details; the description sits underneath the name |
| Version | The Kubernetes version of the target cluster; shows `-` when it cannot be read |
| Publish Status | Published / Unpublished; only **published** clusters are visible to tenants |
| Connect Status | Whether the platform can reach the cluster |
| Created At | When the cluster was connected to the platform |

The actions on each row:

| Action | Meaning |
| --- | --- |
| Terminal | Open the cluster's web terminal and run `kubectl` commands directly |
| Publish / Unpublish | Toggle whether tenants can see the cluster; a confirmation dialog appears |
| Edit | Open the edit page |
| Delete | Delete the cluster; a confirmation dialog appears |

## Connect a new cluster

1. In the left-hand menu, click **AI Platform** → **Cluster**.
2. Click **Create Cluster** in the top-right corner.
3. Fill in the **Cluster Configuration** card in order:

| Field | What to fill in | Notes |
| --- | --- | --- |
| Name | For example `prod-gpu-01` | Fill in the name first and the ID below it is generated automatically; the ID can also be edited by hand, and **cannot be changed after creation** |
| Description | For example "Production GPU room, zone A" | Optional, for your own reference |
| kubeconfig | Paste the kubeconfig contents of the target cluster | Required; the format is shown below |

4. When the fields are filled in, click **Test Connection** to confirm the platform can reach the cluster.
5. Once the connection is fine, click **Confirm** to finish connecting it.

:::warning kubeconfig is a high-privilege key

kubeconfig contains the credentials for reaching that cluster. Create a dedicated service account for the platform and grant it only the permissions the platform needs — do not reuse a cluster administrator's personal credentials.

:::

The two possible test results:

- Success: a **Connection successful** message appears at the top of the form, together with the detected cluster version.
- Failure: the reason appears at the top of the form; check the address, certificate or network as suggested and try again.

:::info The connection test only exists inside the form

There is **no** "Test Connection" in the action column of the list — it only appears in the create and edit forms. In addition, the **Test Connection** button only becomes clickable once both **Name** and **kubeconfig** are filled in.

:::

### Where to get the kubeconfig

kubeconfig is the configuration file used to connect to a cluster and is normally provided by the cluster administrator. On a machine that can reach the cluster, run the command below and copy the whole output:

```bash
kubectl config view --raw
```

It looks like this (the `server`, certificate and key are replaced by real values):

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

## Publish / unpublish a cluster

**Publish Status** decides whether tenants can see and use the cluster:

| Action | Effect |
| --- | --- |
| Publish | The cluster becomes visible to tenants and can be used for resource allocation and deployment |
| Unpublish | Hidden from tenants and no new instances can be deployed; **instances that are already deployed are unaffected** |

## Run commands in the web terminal

Click **Terminal** in the list's action column to open a web terminal that is already connected to the target cluster, where you can type `kubectl` directly:

```bash
kubectl get nodes
kubectl get pods -A
kubectl top nodes
```

:::warning The terminal has very high privileges

The web terminal has cluster administrator privileges. Operate with care and avoid running destructive commands on production clusters.

:::

## After connecting: confirm the nodes have come up

Once the cluster is connected, the platform starts taking over its machines. Follow the steps below to confirm they are all recognised:

1. Click the cluster name to open its detail page.
2. In the left-hand **Operations Management** group, click **Workloads** and switch to the **Node** tab, then check machine by machine that they are all listed.
3. To see the CPU and memory load of each machine, click **Node Status**; to see the accelerator cards, click **Accelerator Status**.

> If not all nodes appear, first check whether the account in the kubeconfig may read nodes, and whether the cluster itself is healthy.

## Sub-pages inside a cluster

After opening a cluster, the left-hand sub-menu is split into three groups:

| Group | Sub-pages |
| --- | --- |
| Cluster Status | Cluster Status, Node Status, Accelerator Status |
| Resource Management | Resource Pool, Flavor, Tenant Quotas |
| Operations Management | Workloads, Storage Cluster, System Apps, Scheduler Management, Log Management |

Among them:

- **Cluster Status** shows only baseline dashboards; **Node Status** looks at machines and **Accelerator Status** looks at cards — see [Nodes & Accelerators](/boss/rune-admin/nodes-gpu).
- **Resource Pool / Flavor / Tenant Quotas** are where resources are allocated — see [Resource Pools](/boss/rune-admin/resource-pools), [Flavors](/boss/rune-admin/flavors) and [Tenant Quotas](/boss/rune-admin/tenants).
- **Workloads** browses the cluster's resources by object type — see [Workloads](/boss/rune-admin/resources).
- **Storage Cluster** and **System Apps** are both one-click entries for deploying middleware and storage — see [Storage & Runtime](/boss/rune-admin/storage-runtime) and [System Apps](/boss/rune-admin/systems).
- **Scheduler Management** and **Log Management** are covered in [Logs & Scheduler](/boss/rune-admin/observability).

## Confirming the result

- The new cluster appears in the list, **Connect Status** shows Connected, and **Publish Status** shows Published if you published it.
- Inside the cluster details, **Workloads → Node** lists that cluster's machines.

## Common questions

| What you see | Likely cause | What to do |
| --- | --- | --- |
| Test Connection fails | Wrong address, certificate or network | Check that the kubeconfig is complete and that the platform can reach the cluster API |
| There is no Test Connection in the list | It only exists in the form | Open the create or edit page and test there |
| The ID cannot be changed while editing | The ID is immutable once created | If it really must change, delete the cluster and connect it again |
| Tenants cannot see the cluster | The cluster is not published | Click **Publish** in the list and confirm |

## Related

- [Cluster Status](/boss/rune-admin/cluster-overview)
- [Nodes & Accelerators](/boss/rune-admin/nodes-gpu)
- [Resource Pools](/boss/rune-admin/resource-pools)
