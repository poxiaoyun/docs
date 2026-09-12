---
title: 'Training & Fine-tuning'
updated: '2026-09-12'
description: 'Submit your first fine-tuning task from scratch: pick a template, choose a model and dataset, mount shared storage, and collect the artifacts.'
tags:
  - rune
  - console
---

# Training & Fine-tuning

Fine-tuning is **giving an existing model extra lessons**: you keep training it on your own data so it understands your business better. This page walks you through submitting your first fine-tuning task from scratch, explains how to fill in the key parameters, where the artifacts go, and how to tell whether training succeeded. Deployment works the same as everywhere else: pick a template, fill in the parameters, submit.

:::tip Three words to remember first

- Base model: the "foundation" that gets the extra lessons, for example an open-source large model.
- Dataset: the textbook you use for those lessons. Prepare it first.
- LoRA: a memory-saving way to give lessons, training only a small number of parameters. Beginners should start with it.

:::

## Before you start

- Your tenant role must be **Administrator** or **Developer**.
- Pick your **region** and **workspace** in the upper-left corner first.
- Prepare your data and model. The dataset must be selectable from the platform datasets; to keep training artifacts long term, create a **Storage** volume first, see [Storage](/rune/console/storage).
- Make sure the quota is sufficient. For LoRA fine-tuning, 7B models need at least 24 GB of VRAM, and 13B models at least 40 GB.

## Submit a fine-tuning task from scratch

1. In the left **Workbench** group, click **Traning&Fine tuning**.
2. Click **Create Jobs** at the top right to open the template selection page.
3. Pick a fine-tuning template, confirm the **Version**, and click **Deploy**.
4. Fill in the basic information:

   | Field | What to enter | Notes |
   | --- | --- | --- |
   | Name | For example `qwen-lora-test` | Required, for display only; the ID below is generated to match |
   | ID | Generated automatically by default | Click the pencil icon to customize it; cannot be changed after creation |
   | Description | For example "customer-service corpus LoRA experiment" | Optional |

5. Fill in the template parameters (see the next section).
6. Click **Confirm** at the bottom of the page to submit.

## How to fill in the parameters

Taking the commonly used LLaMA-Factory fine-tuning template as an example, the form is split into several blocks. Every block can be collapsed, and **anything with a required marker must be filled in**.

| Field | What to enter | Notes |
| --- | --- | --- |
| Resource flavor | Choose an accelerator spec | Required. Choose by model size: 7B needs at least 24 GB VRAM, 13B at least 40 GB |
| Runtime mode | Beginners choose `Quick fine-tuning` | There is also `expert fine-tuning` (shows all advanced parameters) and `WebUI interface` (starts the graphical interface) |
| Model | Pick from the platform model hub, or enter an external model ID | For example `Qwen/Qwen2.5-7B-Instruct` |
| Dataset | Pick one or more from platform datasets | You can also enter a dataset path or a built-in dataset name |
| Training stage | Beginners choose `SFT` | The most common one, for instruction fine-tuning; there is also pre-training, reward modeling, PPO/DPO/KTO and more |
| Fine-tuning method | Beginners choose `LoRA` | Saves VRAM; `QLoRA` saves even more; `Full` gives the best quality but uses the most VRAM |
| Chat template | Default `Auto-detect` | It is inferred from the model name automatically; if nothing conflicts, leave it alone |
| Output directory | Default `output` | Where training artifacts are saved; this has no effect once shared storage is enabled |
| learning rate | Default `5e-05` | LoRA commonly uses 1e-4 to 5e-5; too high will not converge, too low converges slowly |
| Training epochs | Default `3` | Usually 1–5 epochs; too many tends to overfit |
| batch size | Default `2` | Larger is more stable but uses more VRAM; start at 2 and increase gradually |
| gradient steps | Default `8` | Used to simulate a large batch when VRAM is short |
| Cutoff length | Default `1024` | Samples longer than this are truncated |
| validation set ratio | Default `0.1` | Sets aside 10% of the data to monitor training; set it to 0 to skip the split |
| Enable shared storage | Turn on if you want to use the artifacts directly in an inference service | After turning it on you must also choose a **Shared file storage** |
| Shared file storage | Choose the storage volume you created | Training artifacts are written to that storage volume and inference services can load them directly |
| TrackIO service URL | May be left empty | If filled in, training curves are reported to the experiment tracking service |
| push to model repository | Off by default | When on, you must fill in the target repository, model ID, and access token |

:::warning About images and ports
A fine-tuning task's **image is preset by the template** and is usually not something the form lets you choose. There is also **no port you need to expose**, unless you chose `WebUI interface` mode and need to reach the graphical interface, in which case use the button in the **Access** column once the service is ready. Only a few templates additionally expose "image settings" or "network configuration", and only then do you fill them in as the template instructs.
:::

When you are unsure what a parameter means, click **AI Config Guide** at the top right of the form. It explains the key settings, required fields, and risks item by item, based on the current template and what you have already entered. You can also click the icon to switch to JSON mode and edit the underlying parameters directly.

## Confirm it worked

After you submit, go back to the **Training & Fine-tuning** list:

1. You can see the task, and its **Status** column first shows **Pending**, then changes to **Running**.
2. When training finishes it becomes **Succeeded**; if something goes wrong along the way it becomes **Processing failed**.
3. Click the task name to open the detail page: **Monitoring** for the metric curves, **Logging** for the training output, and **Events** to troubleshoot failures.

:::tip How long will it take
It depends on the model size, the amount of data, and the spec you chose, so no fixed duration can be given: LoRA on a small sample is clearly faster than full-parameter training. You can close the page during training; the task keeps running in the background.
:::

## Where to collect the artifacts

After training completes (status **Succeeded**):

1. The artifacts are saved in the output location specified by the template parameters.
2. If **shared storage** was enabled, the artifacts are in the storage volume you chose; otherwise they are under the path given by **Output directory**.
3. Open [Storage](/rune/console/storage), open the file manager of the matching storage volume, and you can browse and download the model files.
4. Training logs and checkpoints are part of these artifacts; the most recent checkpoints are kept according to the save-step setting.

## Day-to-day management

From the row action menu in the list or the **Actions** menu on the detail page:

| Operation | Description |
| --- | --- |
| Edit | Change the name, description, and parameters |
| Start / Stop | Stopping releases compute resources; click **Start** again to resume |
| Save as Task Template | Save the current configuration as a template for one-click reuse next time |
| Delete | After a second confirmation, deletes the task; cannot be undone |

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The status stays Pending | Not enough resources, queued | Check the quota, or switch to a smaller spec |
| Processing failed, and the log reports insufficient VRAM | The spec is too small or the batch size too large | Lower the batch size, enable gradient checkpointing, or switch to a larger spec |
| The artifacts are missing after training | The output path was overlooked, or no shared storage was mounted | Look under the output directory in the matching storage volume's file manager |
| The **Access** column has no button | The current template does not offer web access | This is normal outside WebUI mode; use the logs and monitoring instead |

## Related

- [Inference Service](/rune/console/inference)
- [Storage](/rune/console/storage)
- [Metrics](/rune/console/experiment)
- [Evaluation Management](/rune/console/evaluation)
- [Create Workloads](/rune/guide/workloads)
