---
title: 'Spaces'
updated: '2026-09-14'
description: 'What a Space is, how to browse and open one, and how to publish your own app online.'
tags:
  - moha
  - spaces
---

# Spaces

A Space is an **online AI app that you build with code and publish to the web**. It is not a personal home page and not a pile of files: anyone who opens the link can use it right in the browser, with nothing to download and no environment to install. What you put in a Space is runnable application code; the platform builds it, runs it, and gives it an access address.

:::tip How it differs from models and datasets

Model and dataset repositories mainly hold files that others download and use themselves; a Space holds a **runnable app** that others can use simply by opening a link.

:::

## Before you start

- Browsing public Spaces: a signed-in Moha account is enough — no extra permission needed.
- Publishing your own Space: you need an account that can create repositories, plus runnable app code (a Gradio app, a Streamlit app or a Docker app, for example).

## Core concepts

| Term | Plain explanation |
| --- | --- |
| Space | An online app built from code and published to the web; others can use it by opening a link |
| App template | The platform's scaffold, such as Gradio, Streamlit or Docker, that decides how the app runs |
| Publish | Actually start the app and give it an address — the equivalent of opening for business |
| Snapshot | Take an archival photo of the repository's current state so you can return to it later |

![Space list: the four-step strip (Create / Build / Publish / Share) and the Create space button on top, domain and scenario filters below](/assets/screenshots/moha/spaces-list-01.png)

That four-step strip is itself the how-to: create, build, publish, share. Spaces filter by **Domain** and **Scenario**, a taxonomy of their own rather than the categories used by models and datasets.

## Browse Spaces others published

1. Click **Spaces** in the Moha top navigation to open the Space list.
2. The **Featured** section shows recommended Spaces; the **All** section below lists every Space matching the current filters.
3. Type a name in the search box, or use the **Domain** and **Scene** buttons to narrow the range.
4. Click any Space card to open its details page.

Inside a Space's details page the top shows these tabs:

| Tab | What you can do here |
| --- | --- |
| Overview | When the app is running, the app interface appears right here for you to use |
| File | View the code and files in the Space repository |
| Snapshot | Look at archived versions, compare differences or roll back |
| Discussion & Feedback | Ask questions, give feedback, or open a merge request for a code change |
| Settings | Change visibility, members, the cover and deployment parameters (requires permission) |

![Create Space form: the Space block (name, ID, organization, description), the Metadata block (licence, domain, scenario), and the Deploy configuration below](/assets/screenshots/moha/create-space-01.png)

A Space adds a **deploy configuration** block over a model: pick the SDK to use (streamlit / gradio / docker-template) and the resource flavour there, or the Space will never actually run. The other fields match models and datasets.

## Publish your own Space

1. In the Space list, click **Create space**.
2. Fill in the name, alias, description and visibility, and choose a license, domain and scene.
3. In **Deploy Config**, choose the **Product SDK** (the app template), the **Deploy Workspace** (pick a **Region** first, then a **Workspace**) and a **Flavor**; add **Environment Variables** if you need them.
4. After submitting, go into the Space's repository and push your application code.
5. Back on the Space details page, click **Operations** at the top right, choose **Online**, then click **Confirm**.
6. Wait for the app interface to appear on the **Overview** tab. If it is not ready for a long time, click **Log** in the **Operations** menu to see the build output.

## Confirm it worked

- Your new Space card appears in the Space list.
- The app interface shows on the details page's **Overview** tab, which means the publish succeeded.
- A status label at the top right shows the current running state; once published, the **Operations** menu contains **Stop**, **Restart** and **Log**.

:::warning Stop releases resources

**Stop** takes the app offline and releases the compute it was using, and the access address stops working. Click **Restart** when you need it again.

:::

## Related

- [Space List & Filters](/moha/spaces/list)
- [Repository details page](/moha/repository/detail)
- [Snapshot](/moha/repository/freezes)
