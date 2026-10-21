---
title: 'App Market'
updated: '2026-10-21'
description: 'Pick a template from the shelf and deploy it in one click as your own instance.'
tags:
  - rune
  - console
---

# App Market

App Market is the platform's **template shelf**: ready-made templates for inference, fine-tuning, development, experiment, evaluation, and applications are displayed here. There is only one thing to do here: pick a suitable template, click **Deploy**, and turn it into your own instance. This page covers how to browse, how to read a detail page, how to deploy in one click, and how it differs from **Application Instances**.

:::tip One line to tell the market from what you deploy

- **App Market** is the shelf: templates are recipes made by others, and leaving them there costs you no resources.
- **Application Instances** are the dishes you cook from those recipes: they consume compute and quota, and they appear in the matching instance list.

Pick a template in the market, then manage the running result in the instance list.

:::

## Before you start

- App Market belongs to the **Home** group and is browsable by all members; no extra role is required.
- Pick your **region** and **workspace** in the upper-left corner first; deployments create the instance in the current workspace.
- To actually deploy a template, your tenant role needs the permission for that template type (workbench-type templates generally require **Administrator** or **Developer**).

## Browse the market

In the left **Home** group, click **Marketplace**. The recommended carousel sits at the top, with the category buttons and template cards below:

![Marketplace: the recommended template carousel on top, category buttons and a grid of template cards below](/assets/screenshots/rune/app-market-01.png)

This market holds 50 templates; the small number after each category button is how many templates are in that category.

| Area | How to use it |
| --- | --- |
| Recommended carousel | The recommended templates sit at the very top and rotate automatically every 10 seconds; hover to show left/right arrows and page through manually |
| Category buttons | Choose All / Inference / Fine-tuning / Development / Experiment / Evaluation / App; each button shows the number of templates after it |
| Sort | Switch between "recommended" and "recently updated" |
| Search box | Type a keyword for a fuzzy search over template names and descriptions; results appear automatically after a short pause |
| Refresh button | Pulls the template list again |
| Template cards | Show the icon, name, summary, category, and version; click to open the detail page |
| Loading more | Scroll down and more templates load automatically (there is no pager) until the category is exhausted |

:::tip What if you cannot find a template
The market supports only "category + keyword search"; there are no tags for language, framework, operating system, or tool. If you cannot locate something, try another keyword, or open the detail page to read the template description.
:::

## View template details

Click any template card to open its detail page. The page is split into two columns and has no top tabs:

| Area | Content |
| --- | --- |
| Left column | The template's README: what it does, how to use it, and sometimes screenshots |
| Button group at the top right | **Deploy**, plus three information dialogs: **Default values**, **Values schema**, and **Changelog** |
| Info card on the right | Template name, the **Version** dropdown, the description; creation time and category below |

What each dialog shows:

| Button | What is inside |
| --- | --- |
| **Default values** | The parameter defaults for this version with nothing overridden — useful as a reference |
| **Values schema** | Which parameters this version accepts, with the type and description of each |
| **Changelog** | What changed in this version compared with the previous one |

The **Version** button shows the currently selected version; click it to open the dropdown and switch. After you switch versions, the description on the right and the parameters used at deployment change with it, so **confirm the version before deploying**.

## Deploy in one click from the market

1. On the template detail page, open the **Version** dropdown and choose a version.
2. Click **Deploy**.
3. The page jumps to the instance list of the matching type and opens the deployment form automatically (already carrying the template and version you chose).
4. Fill in the basic information:

   | Field | What to enter | Notes |
   | --- | --- | --- |
   | Name | For example `my-service` | Required, for display only; the ID below is generated to match |
   | ID | Generated automatically by default | Click the pencil icon to customize it; cannot be changed after creation |
   | Description | For example "template trial" | Optional |

5. Fill in the template parameters. How many there are depends on the template; **default values** in the parameter card's top-right corner shows each default with an explanation, and the code icon switches to **JSON mode** if you want to edit the raw parameters.
6. Click **Confirm** at the bottom to submit.

:::tip You can also enter from the feature menus
You do not have to browse the market first: go straight to **Inference**, **Training & Fine-tuning**, **Runebox**, or **Application Instances** and click the **Create ...** button at the top right. You land on the template selection page just the same; pick a template and click **Deploy**.
:::

## Confirm it worked

After you submit, the page returns to the **instance list** of the matching type:

1. The newly created instance appears, and its **Status** column first shows **Pending** or **Installing**.
2. It later changes to **Running** or **Healthy**, which means deployment succeeded.
3. From then on you can find and manage it in the matching menu on the left.

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Clicking Deploy does nothing, or it asks you to pick a workspace first | No workspace was selected in the upper-left corner | Select the **region** and **workspace** before deploying |
| The deployment form fields differ from what you expected | The parameters come from the template of the selected **version** | Go back to the detail page and confirm the version; different versions have different parameters |
| There is no tag filter | The market has no tag filtering | Use category + keyword search instead |
| Search does not return results immediately | The search box has a short input delay | Pause for a moment and let the results refresh |

## Related

- [Application Instances](/rune/console/app)
- [Inference](/rune/console/inference)
- [Training & Fine-tuning](/rune/console/finetune)
- [Runebox](/rune/console/devenv)
- [Presets](/rune/resources/presets)
