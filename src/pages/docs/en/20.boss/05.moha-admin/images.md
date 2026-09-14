---
title: Images
updated: '2026-09-14'
description: Browse every container image registry on the platform and unlist, edit or delete the ones that should not be public.
---

# Images

The Images page lists the container image registries every organization on the **whole platform** has created. A container image is a "system-disk template for installing an OS", and users pick one on the AI Platform to decide an instance's environment. Here you can see which images exist, how big they are and how many times they have been pulled, and also unlist or delete images that should not be public.

:::tip An image registry is not a mirror

- **Image registry** (this page) holds **container images**, used as the system disk for container instances.
- **Mirror** is the task that **syncs** models and datasets from HuggingFace and ModelScope into the platform; it has nothing to do with container images.

The two names look alike, but one manages a "system disk" and the other "moves data around".

:::

## Before you start

- You need the **System Administrator** role.
- Click **Moha Hub** in the top navigation bar, then click **Images** under the **Asset Management** group in the left sidebar.

## A few terms first

| Term | Plain explanation |
| --- | --- |
| Repository | A collection of container images you can keep pushing new versions to |
| Organization | The team account this image belongs to |
| Visibility | Who can see this image |
| Framework | The acceleration framework pre-installed in the image, such as CUDA or CANN |
| Architecture | The machine architecture the image suits, X86 or ARM |

Visibility has three values:

| Shown as | Who can see and pull | Who can push new versions |
| --- | --- | --- |
| Public | Anyone, including visitors who are not signed in | Only the creator when the repository is personal; every member of the organization when it belongs to one |
| Tenant Only | Only members of the owning organization | Members of the owning organization |
| Private | Only the creator | Only the creator |

## What is on the list

Above the list are 5 statistics cards. Except for "Total Images", the other cards **count only the images on the current page**, and the numbers change when you turn the page.

| Card | Meaning |
| --- | --- |
| Total Images | The number of image registries on the whole platform; the subtitle shows the total capacity of the current page's images |
| Public Images | How many images on the current page have visibility Public |
| Private Images | How many images on the current page have visibility Private |
| Total Downloads | The combined download count of all images on the current page |
| Hot Images | How many images on the current page have any downloads |

Each row of the list shows:

| Column | Meaning |
| --- | --- |
| Alias / Name | The image name; when there is an info icon next to it, hover to see the description |
| Organization | The organization the image belongs to |
| Visibility | Public / Tenant Only / Private; Private also shows the creator after it |
| Used Capacity | The space the repository already occupies; shows `-` until the statistics finish |
| Download Count | The cumulative pulls |
| Category | The image's use category, such as Network, Database or ML |
| Accelerates | The acceleration frameworks the image supports, collapsed when there are several |
| Architecture | The machine architecture the image suits, X86 or ARM |
| Updated At | The time of the most recent change |

![Image management: stat cards plus organisation / visibility / category / framework filters above the list](/assets/screenshots/boss/moha-images-01.png)

The images page adds one filter dimension over its three siblings — **Framework** — because images are naturally grouped by the framework they ship (PyTorch, TensorFlow and so on). Everything else matches the models and datasets pages.

## Find the image you want to work on

1. Type the image's name or alias into the search box; the search runs as you type.
2. When needed, filter with the **Organization**, **Visibility**, **Category**, **Accelerates** and **Architecture** drop-downs.
3. A filter you have chosen shows directly on its drop-down; choose **All** to clear it.

## Unlist an image (change visibility)

1. On the target image's row, click the **⋯** button on the far right (the actions menu).
2. Click **Update Visibility**.
3. In the **Visibility** drop-down choose the target value: **Public**, **Tenant Only** or **Private**.
4. Click **Confirm**.

Confirming the result: the visibility tag on that row changes immediately; once it is Tenant Only or Private, ordinary users can no longer see or search for the image.

## Edit image information

1. Click the **⋯** button on the far right → **Edit**.
2. The page has four cards, **Image**, **Readme**, **Label** and **Visibility**, which can be collapsed and expanded:
   - **Name** and **Organization** cannot be changed; their input boxes are greyed out.
   - You can change the **Description** and the **Readme** (the repository's long-form text).
   - You can change the tags such as **Category** and **Accelerates**.
   - You can switch Private / Tenant Only / Public under **Visibility**.
3. Click **Confirm** when done and you return automatically to the Images list.

## Delete an image

1. Click the **⋯** button on the far right → **Delete**; you can also tick several rows first and use the batch delete above the list.
2. The confirmation dialog shows "Delete image xxx?".
3. Type the image's name as prompted; only then does **Confirm** become clickable.
4. Click **Confirm**.

:::warning Deleted means gone

Deletion permanently removes this image registry and every version inside it, and **it cannot be recovered**. Make sure you really no longer need it before deleting.

:::

## Common questions

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| There is no Recommendation in the **⋯** menu | Images do not support recommendations | To recommend something, use [Models](/boss/moha-admin/models) or [Datasets](/boss/moha-admin/datasets) |
| Used Capacity keeps showing `-` | The platform is still measuring this repository | Refresh the page and look again later |
| There are no Vulnerability Level or License columns | This information is not shown in the image list | This is normal |

## Related

- [Mirror](/boss/moha-admin/mirrors)
- [Models](/boss/moha-admin/models)
- [Spaces](/boss/moha-admin/spaces)
