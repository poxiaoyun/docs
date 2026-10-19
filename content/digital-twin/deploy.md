# 在已有 Rune 平台部署数字孪生

本文描述把系统 Chart `rune-digital-twin` 1.0.0 装进一套已经在运行的 Rune 平台。Chart 源码在 `plugins/charts/system/rune-digital-twin/`，打包产物是 `plugins/build/charts/system/rune-digital-twin-1.0.0.tgz`。

页面走网关 `/twin/`，接口走 `/api/digital-twin`。不要另开 Ingress。网关把这两个路径转到同命名空间的 Service `http://rune-digital-twin`，所以 Release 名必须是 `rune-digital-twin`，并且必须装在 apiserver 所在的命名空间。

## 开始之前

| 条件 | 怎么确认 |
| ---- | -------- |
| 平台已经在跑 | 同命名空间里能看到 apiserver、iam、cloud |
| 集群有默认存储类，或平台已经下发 `global.storageClass` | 台账 PVC 不手选存储类。`global.storageClass` 为空时不写 `storageClassName`，由集群默认存储类接管。两者都没有时 PVC 会 Pending |
| 能拉到镜像 | `registry.cn-hangzhou.aliyuncs.com/xiaoshiai/rune-digital-twin:1.0.0`、`registry.cn-hangzhou.aliyuncs.com/xiaoshiai/telegraf-hardware:0.2.0` |
| 节点允许特权 Pod | 硬件采集要读块设备和 `/dev/ipmi0`，DaemonSet 使用 `privileged: true` |
| License 含产品 `DigitalTwin` | 没有该产品时，写台账返回 403，原因 `LicenseProductNotEntitled` |

安装界面只填写平台接入和 IPMI 账号。采集开关、存储类、镜像和探针都用 Chart 默认值：节点硬件采集和带外 Redfish 默认打开，副本数固定为 1。

## 1. 补登记 IAM 应用和角色

IAM bootstrap 只创建当时还没有的资源。平台如果是在孪生加入默认计划之前装的，重跑 bootstrap 不会补上 `rune-digital-twin`。先查：

```sh
iamctl --server http://iam --token "$IAM_TOKEN" applications get rune-digital-twin
```

不存在时，按 IAM Chart 里的声明创建应用。Grant 与 `iam/deploy/iam/values.yaml` 的 `bootstrap.plan.applications` 中 `id: rune-digital-twin` 一致：

```yaml
id: rune-digital-twin
name: Rune Digital Twin
description: Rune digital twin service identity
enabled: true
grants:
  - resourceServer: iam
    allowedScopes:
      - create:authentication-reviews
      - create:authorization-reviews
    defaultScopes:
      - create:authentication-reviews
      - create:authorization-reviews
  - resourceServer: cloud
    allowedScopes:
      - read:clusters
      - read:kubernetes
      - read:observability
    defaultScopes:
      - read:clusters
      - read:kubernetes
      - read:observability
```

```sh
iamctl --server http://iam --token "$IAM_TOKEN" applications create -f rune-digital-twin-app.yaml
iamctl --server http://iam --token "$IAM_TOKEN" applications credentials create rune-digital-twin
```

`credentials create` 只在创建时给出 `clientSecret`。把应用 ID `rune-digital-twin` 和这份 secret 记下来，下一步写入 Kubernetes Secret。丢失后重新创建凭据，不要从 bootstrap 计划里的开发字面量 `password` 猜测生产口令。

同样确认系统角色 `digital-twin-viewer`（`get`/`list`）和 `digital-twin-admin`（`*`）。权限服务是 `digital-twin`，资源是 `**`。声明见 `iam/deploy/iam/values.yaml` 的 `bootstrap.plan.roles`。`admin` 角色的服务是 `*`，系统管理员不用再绑这两个角色。其他用户不授权时登录后是 `RoleNotGranted`。

## 2. 写入应用凭据

Secret 必须含 `clientId`、`clientSecret` 两个键，放在孪生要安装的命名空间：

```sh
kubectl -n <apiserver 所在命名空间> create secret generic rune-digital-twin-platform \
  --from-literal=clientId=rune-digital-twin \
  --from-literal=clientSecret='<上一步拿到的 secret>'
```

## 3. 安装 Chart

`iamURL` 的主机名必须落在 IAM 的 `--oidc-issuerpatterns` 里。与 IAM 同命名空间时用 `http://iam`。写成 `http://iam.<namespace>.svc` 会得到 `OIDC issuer is not allowed`，页面显示 `IamUnavailable`。`apiserverURL` 用集群内地址，端口与 apiserver Service 一致（Chart 默认容器端口是 8080）。

`twin-values.yaml`：

```yaml
global:
  storageClass: ""
platform:
  apiserverURL: http://apiserver:8080
  iamURL: http://iam
  credentialsSecret:
    name: rune-digital-twin-platform
telegraf:
  redfish:
    defaultCredentials:
      username: <BMC 只读账号>
      password: <BMC 只读密码>
```

`global.storageClass` 留空表示用集群默认存储类。平台已经统一指定存储类时，把那个名字填在这里。

```sh
helm upgrade --install rune-digital-twin \
  plugins/charts/system/rune-digital-twin \
  --namespace <apiserver 所在命名空间> \
  --create-namespace=false \
  -f twin-values.yaml
```

已经打好包时，把 Chart 目录换成 `plugins/build/charts/system/rune-digital-twin-1.0.0.tgz`。Release 名不要改成别的：改了之后 Service 不再叫 `rune-digital-twin`，网关仍访问 `http://rune-digital-twin`，页面会 502。

从应用目录安装时，表单字段与上面的 `platform`、`telegraf.redfish.defaultCredentials` 相同。实例名仍然用 `rune-digital-twin`，命名空间仍然是 apiserver 所在命名空间。

## 4. 确认起来了

```sh
kubectl -n <命名空间> get deploy,ds,pvc,svc | grep rune-digital-twin
```

期望：

- Deployment `rune-digital-twin` 就绪，Service 名是 `rune-digital-twin`，端口 80 转到容器 8080。
- PVC 已 Bound。台账在卷里的 `/app/data/ledger.sqlite`。删掉这块 PVC 会清掉机柜编排。
- DaemonSet 采集端在节点上运行。
- Deployment `rune-digital-twin-telegraf-redfish` 就绪。BMC 清单默认是空的，这个 Deployment 会起来，但还没有带外样本。

浏览器打开 `https://<平台域名>/twin/`。系统管理员应能进入。给其他用户授予 `digital-twin-viewer` 或 `digital-twin-admin` 后再访问。

## 5. 补上带外 BMC

带内 IPMI 不使用这份账号，走节点上的 `/dev/ipmi0`。带外电源走 Redfish，需要节点名和 BMC 地址。`node` 必须与 `kubectl get nodes` 的名字一致。iDRAC 固件低于 2.86 的机器不要写入清单。

```yaml
telegraf:
  redfish:
    bmcs:
      - node: develop-01
        address: https://192.168.0.200
```

用同一份 values 再执行一次 `helm upgrade`。清单里的机器没有单独 Secret 时，使用第 3 步的 IPMI 账号。某一台没有可用凭据时，渲染会失败。

## 排障

| 现象 | 原因 |
| ---- | ---- |
| 页面 502，Service 不存在或名字不是 `rune-digital-twin` | Release 名或命名空间不对，网关找不到 `http://rune-digital-twin` |
| 页面 `IamUnavailable` | `iamURL` 的 Host 不在 IAM issuer 允许范围内 |
| Pod 起不来，日志要求平台地址或凭据 | `platform.apiserverURL`、`platform.iamURL` 或 Secret 名是空的 |
| 登录后没有访问权限 | 用户没有 `digital-twin-viewer` / `digital-twin-admin`，也不是系统管理员 |
| 写台账 403，`LicenseProductNotEntitled` | 当前 License 没有产品 `DigitalTwin` |
| 写台账 503，`LicenseNotReady` | apiserver 上的 License 检查不可用 |
| 风扇、电源、盘温是「无数据」 | 采集端没调度上来，或节点没有 `/dev/ipmi0`、SMART 设备 |
| 整机功耗是「无数据」 | 该机型 BMC 没有 DCMI 读数。这不是把 PSU 瓦数加总能补上的 |
| Redfish Pod 在跑，电源仍是「无数据」 | `telegraf.redfish.bmcs` 还是空的，或 `node` 与 Kubernetes 节点名不一致 |
