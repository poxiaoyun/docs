---
title: Kunlunxin
updated: '2026-09-17'
author: Rune Docs Team
description: What to install to bring a Kunlunxin XPU server into the platform, and how to define a flavor when the platform has nothing pre-registered for the vendor.
tags:
  - ecosystem
  - kunlunxin
  - xpu
---

# Kunlunxin

Kunlunxin is Baidu's AI chip company, 59.45% owned by Baidu. It raised independently in April 2021 and closed a
Series D in July 2025 at a post-money valuation of about RMB 21 billion; in December 2025 it converted to a joint
stock company, raising registered capital from RMB 21.28 million to RMB 400 million; on 1 January 2026 it filed
confidentially for a Main Board listing in Hong Kong, confirmed by Baidu in an announcement, and it remains a Baidu
subsidiary after the spin-off. At Baidu World in November 2025 it announced M100 (planned for 2026) and M300
(planned for 2027).

Its position on the platform is unlike the other ecosystem sections: **nothing is pre-registered for the vendor**.
The accelerator list for image registration has no Kunlunxin entry, model metadata registers no Kunlunxin model,
flavors carry no vendor icon, and System Apps has no scheduling package. Flavor definition is the only path that
works, and it has one vendor-specific trap.

:::info Where the platform stands
Nothing at all is pre-registered for Kunlunxin, and even automatic recognition from the resource key fails. The
item-by-item comparison and the way around that trap are on
[Platform support](/ecosystem/kunlunxin/platform-support).
:::

## Terms to keep apart

| Term | In plain words |
| --- | --- |
| XPU | Kunlunxin's blanket name for its own AI accelerator cards, not a generic term for other vendors' cards |
| Kunlunxin | The company name, owned by Baidu, converted to a joint stock company in December 2025 |
| P800 | Third-generation model, 96 GB of memory, PCIe 5.0, 400 W TDP |
| XRE | The umbrella name for the software stack, covering the kmd kernel driver, the user-space runtime and `xpu-smi` |
| `xpu-device-plugin` | The Kubernetes device plugin that registers the card as a schedulable resource |
| vXPU | The official name for sharing one card, built on SR-IOV. The splitting parameters on both the platform side and the cloud vendor side are not in effect yet |

## Installation order

1. **Kernel driver (kmd inside XRE)**: install on every machine that has a card, until `xpu-smi` shows it.
2. **Container runtime**: make the card visible inside containers; cluster nodes usually run containerd.
3. **Cluster components (`xpu-device-plugin` and `xpu-exporter`)**: turn the card into a schedulable resource and expose metrics.
4. **Flavor on the platform**: define a flavor against `kunlunxin.com/xpu` and set the flavor's **type** field to GPU.

The first two steps are host work, the third is cluster work, and only the fourth comes back to the platform.
Reverse the order and the device plugin will not see the card.

## Pages in this section

| Page | What it covers |
| --- | --- |
| [Products & software stack](/ecosystem/kunlunxin/products) | Three generations of models, the layers of the stack, official entry points, availability of material |
| [Drivers & container runtime](/ecosystem/kunlunxin/driver-runtime) | Host prerequisites, driver layers, verifying with `xpu-smi` |
| [Kubernetes components](/ecosystem/kunlunxin/k8s-components) | The reported resource key, the legacy key, the metrics port, where vXPU stands |
| [Platform support](/ecosystem/kunlunxin/platform-support) | Layer-by-layer comparison, the vendor-specific trap, the manual sequence |
| [FAQ](/ecosystem/kunlunxin/faq) | Card not recognised, not visible in containers, flavor not detected |

## Related

- [Ecosystem Docs Home](/ecosystem)
- [Hygon (DCU)](/ecosystem/hygon): also has no one-click installation entry on the platform
- [AMD (Instinct / ROCm)](/ecosystem/amd): also requires installing the device plugin by hand
