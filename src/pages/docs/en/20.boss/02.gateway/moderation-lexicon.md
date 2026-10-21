---
title: Sensitive Word Management
updated: '2026-10-21'
description: 'Maintain the screening word list: add terms, score them, filter by category and risk, and import or export in bulk.'
tags:
  - boss
  - gateway
---

# Sensitive Word Management

Sensitive Word Management maintains the **word list** used for content screening: which words to watch and how sensitive each one is. The gateway matches every request and response against this list, and the resulting score is handed to [Policy Management](/boss/gateway/moderation-policies) to decide whether to pass, rewrite or block.

After reading this you can create and edit terms, find words by category and risk, import a batch, export a backup, and enable or disable many terms at once.

:::tip The word list is the contraband list
A security scanner needs two things: a **list of contraband** (this page) and **handling rules** (Policy Management). The list only says "what counts as sensitive and how much"; the rules say "what to do when it matches". Changing the list never touches the rules, and vice versa.
:::

## Before you start

- Permission: a platform administrator account (able to open the BOSS admin console).
- Confirm the master switch is on: go to **Model Gateway → Platform Settings → Gateway Configuration** and check that **Enable content moderation** is on. Turning it off suspends both the word list and the policies (nothing is lost).

## Understand the concepts

| Term | Plain explanation |
| --- | --- |
| Term | One sensitive word to be detected |
| Score | How sensitive the word is, `1`–`10`. Scores add up into the total risk score of a call |
| Risk level | The band a score falls into: High (≥ 8) / Medium (≥ 5) / Low |
| Category | Which group the word belongs to; several allowed. Used for grouping and filtering only, never for matching |
| Part of speech | A linguistic attribute (noun, verb…) — optional, descriptive only |
| Tags | Free-form labels; several allowed, handy for filtering |

## The four stat cards

Four stat cards sit at the top of the page:

| Stat card | Meaning |
| --- | --- |
| Total Terms | How many terms the list holds |
| Enabled | How many are enabled, with the enabled ratio |
| New This Month | How many were added this month |
| Hits in 7 Days | How often these words were hit in the last 7 days |

![Sensitive word management: four stat cards, keyword search and category filter, the term table below](/assets/screenshots/boss/gateway-lexicon-01.png)

The top row holds the four stat cards, then a search box and the **All Categories** dropdown, then three more filters: **Risk Level**, **Tag** and **Updated At**. The **Term**, **Category** and **Tags** columns are blurred in the screenshot — this page only explains how the columns work, since the actual terms should not appear in public documentation.

## The list and its filters

| Column | Meaning |
| --- | --- |
| Term | The word itself |
| Enabled Status | Enabled / Disabled |
| Risk Score | High (≥ 8) / Medium (≥ 5) / Low, coloured by score |
| Category | Which group the word belongs to; several allowed, collapsed when too wide |
| Tags | Free-form labels; several allowed, collapsed when too wide |
| Hits | How many times the word has been hit |
| Updated At | When it was last changed |

| Filter | Options |
| --- | --- |
| Keyword Search | Matches the term, its categories or its tags |
| Category | All Categories, or one specific category |
| Risk Level | High / Medium / Low |
| Tag | One specific tag |
| Updated At | Today / Last 7 days / Last 30 days |

## Creating and editing a term

1. Click **Create Sensitive Word** in the top right corner.
2. Fill in the form:

   | Field | How to fill it | Notes |
   | --- | --- | --- |
   | Term | The word to detect | Required and **immutable** after creation |
   | Score | For example `5` | Required, `1`–`10`, defaults to `5`; higher is more sensitive |
   | Category | Pick a preset or type your own | Several allowed; press Enter to add |
   | Part of Speech | For example "noun" | Optional |
   | Tags | Pick a common tag or type your own | Several allowed |

3. Click **Confirm**.

**Common categories** (stored as shown): 政治, 暴恐, 民生, 涉枪涉爆, 色情, 非法网站, 广告, GFW, 反动.

**Common tags** (stored as shown): 中文, 英文, 拼音, 政治敏感, 选举相关, 人名, 个人信息, 网址, 营销, 高风险.

:::info Matching uses terms, not regular expressions
Detection matches each **term** in the list one by one. Categories and tags exist for grouping and filtering and never take part in matching. There is no place in the UI to write a regular expression.
:::

## Batch import and export

- **Batch Import**: click **Batch Import**, then **Select File** in the dialog and upload a JSON file. A successful parse reports "Parsed N entries"; click **Batch Import** to submit. The file must be a JSON array and at most 2MB.
- **Batch Export**: click **Batch Export** and confirm; the whole list downloads as one JSON file (named like `moderation-lexicon-<date>.json`) for backup or migration.

:::warning Export before importing
An import only adds terms and does not warn about duplicates. Export a copy with **Batch Export** before changing the list so you have something to compare against.
:::

## Batch enable, disable and delete

Selecting terms shows an action bar reading "N entries selected" with three operations:

| Operation | Effect |
| --- | --- |
| Batch Enable | Switches every selected term to enabled |
| Batch Disable | Switches every selected term to disabled, pausing detection for them |
| Batch Delete | Removes the selected terms from the list |

:::warning Batch delete cannot be undone
Deleted terms leave the detection scope immediately and cannot be restored. Run **Batch Export** first.
:::

## Troubleshooting

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Hit Records stays empty | The master switch is off, no term is enabled, or no policy exists | Check "Enable content moderation", confirm the term is enabled, and create a rule in Policy Management |
| The term cannot be edited | Terms are immutable after creation | Create the term you need and delete the old one |
| The import fails | The file is not a JSON array, or exceeds 2MB | Export, edit and import again in the right shape |
| No place to write a regex | Detection matches terms | Add each string you need to catch as its own term |
| One word racks up many hits | It really is being hit repeatedly | Expected; tune its score or the policy threshold if it is noisy |

## Related

- [Policy Management](/boss/gateway/moderation-policies): defines what happens on a match
- [Hit Records](/boss/gateway/sensitive-hits): what was hit and how it was handled
- [Gateway Configuration](/boss/gateway/config): the content moderation master switch
