---
title: 'Batch inference'
updated: '2026-10-21'
description: 'Process a batch of data in S3 with a batch inference job: create the job, read its status and progress, and cancel or resubmit it.'
tags:
  - rune
  - console
  - batch
---

# Batch inference

Batch inference solves the case where **you have a large batch of data to process but do not need a service running all the time**.
You put the data in object storage (S3), submit a job that states the input, the output, and the inference parameters, and the platform walks the queue of data with an available worker and writes the results back to your bucket.
After reading this page you will be able to create a batch inference job yourself, read its status and progress, and know how to retry one that failed.

:::tip Think of it as an assembly line
An inference service is "opening a shop that answers whenever someone walks in"; batch inference is "sending a crate of raw material into the workshop and getting it back packed".
The workshop (worker) is not yours alone, so jobs take turns — that is why **Queued** is a normal state.
:::

## Core concepts

| Term | Plain explanation | Think of it as |
| --- | --- | --- |
| Batch inference | A job that processes a batch of data and finishes; it does not produce a callable instance | Sending a whole crate into the workshop |
| Job | One submitted batch run with its own name, status, and execution history | A work order |
| Input data | The files or directory prefix to process, stored in S3 | The raw material going in |
| Output location | The S3 directory results are written to; same-named files are overwritten | Which shelf the finished goods go to |
| Worker | The unit that actually does the work, using its own configured model and credentials | The worker who accepts this order |
| Execution record | One attempt at running the job; a resubmission adds a new one | One pass of the work order |

:::info A job is not an instance
Batch inference **does not** leave an instance with an endpoint in the Inference list, so it occupies no compute while idle and does not appear in the home page workload counts.
:::

## Before you start

- Your tenant role must be **Administrator** or **Developer**. If **Batch inference** is missing from the left sidebar, the feature is not enabled in this environment.
- **Region** and **Workspace** are selected in the top left.
- You have the S3 **service endpoint, bucket, and object path**, plus an **access key ID / secret access key** pair; private buckets may also need a session token (optional).
- The data and results must live in a bucket the worker can reach; if unsure, ask the platform administrator which storage the workers are configured for.

## Reading the job list

In the left **Workbench** group, click **Batch inference**. The page header carries the title and a **Refresh** button; below it are the filter bar and the job table.

![Batch inference list: status and task-type filters, five-column table, Create job in the top right](/assets/screenshots/rune/batch-inference-01.png)

| Column | What to look at |
| --- | --- |
| Job name | Click the name to open the job detail |
| Status | See the status table below |
| Task type | **LLM text generation** or **Object detection** |
| Created at | When it was submitted |
| Completed at | When it finished (succeeded, failed, or cancelled); empty while still running |

The filter bar has two dropdowns and a search box:

| Control | Options |
| --- | --- |
| Status | Queued / Running / Cancelling / Cancelled / Succeeded / Partially succeeded / Failed |
| Task type | LLM text generation / Object detection |
| Search | Search by job name |

There are seven states, and they mean quite different things:

| Status | Meaning | What you can do next |
| --- | --- | --- |
| Queued | Waiting for a matching **worker** and a free concurrency slot | Wait; if it stays there too long, ask an administrator to check the workers |
| Running | A worker is processing the data | Wait, or cancel if needed |
| Cancelling | Stop requested; waiting for the current execution to end or the cancellation deadline | Wait until it becomes Cancelled |
| Cancelled | Stopped; results already written are kept | Resubmit or delete |
| Succeeded | Every input was processed successfully | Delete |
| Partially succeeded | Some inputs succeeded, some failed | Read the failure reason and resubmit, or delete |
| Failed | The run failed overall | Read the failure reason and resubmit, or delete |

## Create a batch inference job

1. Click **Create job** in the top right of the list.
2. The page first loads the available task types; if there are none it reports "No task types available. Ask your administrator to check the Batch service".
3. Fill in the form using the four steps below; on submit you land on the job detail page.

### Step 1 Basics

| Field | What to enter | Notes |
| --- | --- | --- |
| Job name | For example `qwen-batch-0715` | Required, up to 256 characters |
| Task type | **LLM text generation** or **Object detection** | Required; switching it resets the parameters below |
| Description | For example "July support corpus labelling" | Optional, up to 4096 characters |

### Step 2 Fill in the input data

| Field | What to enter | Notes |
| --- | --- | --- |
| S3 endpoint | For example `https://s3.example.com` | Required; must be an http(s) address without username, password, query string, or fragment |
| Bucket | For example `my-dataset` | Required; must not contain a slash |
| Object path / prefix | For text generation, a JSONL file or a directory containing JSONL files | Required |
| Access key ID | The S3 access key ID | Required |
| Secret access key | The S3 secret key | Required, never echoed back |
| S3 region | For example `cn-east-1` | Optional, under **Additional settings** |
| Addressing style | **Path style** or **Virtual-hosted style** | Path style by default; change it when the bucket domain style differs |
| Session token | Only for temporary credentials | Optional, also under **Additional settings** |

The input card has an **Input template** action in its top-right that opens a copyable example:

- **LLM text generation**: one JSON object per line, with a unique `id` and `request_body.messages` (`messages` at the top level also works). Parameters inside `request_body` override the job-level parameters, and **the model is chosen by the worker**.
- **Object detection**: a single image, an image directory prefix, or a JSONL manifest; each manifest line contains a unique non-negative integer `id` and `image.path`, resolved relative to the input bucket.

### Step 3 Fill in the output location

The fields are the same as for the input: endpoint, bucket, path, credentials, and additional settings. Only two things differ:

- The output path may be left empty; but **when it shares a bucket with the input they must be separated**, otherwise submission fails with "input and output paths in the same bucket must not be the same or contain each other".
- Results are **written directly** into the directory you enter, and same-named files are overwritten.

### Step 4 Tune the inference parameters

The panel is titled **Inference parameters** and carries a note: the job is claimed by a matching worker, which uses the model and credentials it is configured with; a re-run may use a different model.

The common LLM text generation parameters:

| Parameter | Default | How to use it |
| --- | --- | --- |
| Temperature | See the form default | Controls randomness, range 0–2; lower is steadier, higher is more varied. Usually adjust either this or top_p, not both |
| Nucleus sampling probability (top_p) | See the form default | Samples from candidates whose cumulative probability reaches this value, range 0–1; lower narrows the pool |
| System prompt | Empty | Sets a shared role and instruction for every input, replacing the existing system message; a per-line `request_body.system` can override it |
| Max generated tokens | See the form default | How many tokens each input may generate; must fit the worker's output budget |

Object detection jobs use **confidence threshold** instead of the text parameters above.

When the model supports extra parameters, click **Add custom parameter** and fill in **name / value type / value**:

- The name must start with a letter or underscore and contain only letters, digits, or underscores, up to 128 characters.
- It must not collide with a platform-managed parameter.
- Value types are text / number / boolean / JSON; JSON may hold an array or object.

:::warning Two hard validations before submitting
1. The **S3 endpoint** must be http(s) and must not carry credentials, query parameters, or a fragment.
2. **Input and output paths in the same bucket must not overlap** (identical or nested both count). Use two buckets, or put one under `input/` and the other under `output/`.
:::

## What the job detail shows

After submitting you land on the **job detail** page, with five blocks from top to bottom:

| Block | Content |
| --- | --- |
| Basics | Status, task type, created at, completed at, **job ID** (copyable), description; **Refresh** in the top right |
| Inference parameters | The parameters this job actually used (right column) |
| Latest execution | **Progress** (processed / total), succeeded count, failed count, worker, actual model / version, started at, execution ID |
| Data and results | Input path, output directory, input / output S3 endpoint, result directory, result files |
| Execution history | Table: execution ID / status / progress / worker / failure reason / started at |

A few ways to read it:

- **Processed / total** is the progress; when the total is not counted yet it reads "pending count", which does not mean the job is stuck.
- Result files should be read in object storage. They may be incomplete before the job finishes, or after a failure or cancellation.
- While queued, the page says the job is waiting for a matching worker and a free concurrency slot; while cancelling, it says it is waiting for the execution to end. If it stays queued a long time, ask an administrator to check worker status and configuration.
- Before a worker claims the job, the execution history is empty and says "no worker assigned yet".


## Cancel, resubmit, delete

All three actions live on the job detail page, and availability depends on the current state:

| Action | Available when | What happens |
| --- | --- | --- |
| Cancel job | Queued, Running | A queued job is cancelled immediately; a running job receives a stop request and finishes cancelling once the current execution ends or the cancellation deadline arrives. Results already written are kept |
| Resubmit | Cancelled, Failed, Partially succeeded | Requeues with the original parameters and locations and **reprocesses every input**, which may incur inference cost again. The job ID and execution history are kept, new results are written to the original output directory and **overwrite same-named files** |
| Delete job | Succeeded, Cancelled, Failed, Partially succeeded | Permanently deletes the job and its whole execution history; **cannot be undone**. Input data and generated result files in S3 are kept |

:::warning Check three things before resubmitting
1. **Are the credentials still valid?** If the storage credentials expired, expand **Replace storage credentials** in the dialog and enter a new access key ID / secret access key / session token.
2. **Will the output directory be overwritten?** Same-named results are overwritten directly; change the output directory first if you want to keep the previous run.
3. **Will it cost again?** A resubmission reprocesses all inputs and is billed again through the worker's usage.
:::

If the state changed after you opened the dialog (someone cancelled it, or it finished), the page reports that the current state does not support the action; close the dialog and refresh.

## Billing and quota notes

Batch inference is accounted for differently from "keeping an instance running". Three things to keep in mind:

| Point | Explanation |
| --- | --- |
| No instance is created | The job finishes and leaves nothing behind in the Inference list, so it does not hold a long-term compute quota in the workspace |
| A re-run costs again | **Resubmit** reprocesses every input, which is another full run and may incur inference cost again; change the output directory to keep the previous results |
| Queueing is about workers | Queued means waiting for a **worker** and one of its concurrency slots — not a workspace quota shortage. If it reports no free concurrency slot, ask an administrator to check the worker configuration |

:::warning Result files are overwritten
In the same output directory, a resubmission overwrites same-named files. To keep an archive, use another output directory or create a subdirectory for the results.
:::

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The job stays Queued for a long time | No worker matches the task type and parameters, or no concurrency slot is free | Ask an administrator to check worker status and configuration, or check again later |
| Submission fails with "input and output paths in the same bucket must not be the same or contain each other" | Input and output use the same or nested directories in one bucket | Use separate directories or separate buckets |
| Submission reports an invalid endpoint | The S3 endpoint carries a query string, credentials, or is not http(s) | Enter only protocol plus host, for example `https://s3.example.com` |
| The job reads Partially succeeded | Some inputs failed while the rest succeeded | Read the **failure reason** in the execution history and resubmit after fixing the data |
| After resubmitting it fails again with a credential error | The original access key expired | Expand **Replace storage credentials** in the resubmit dialog and enter a new pair |
| No files in the result directory | The job has not finished, or a failure / cancellation left results incomplete | Wait for Succeeded, or check the execution history for the failure reason |
| **Batch inference** is missing from the sidebar | The feature is not enabled in this environment | Ask an administrator whether it should be enabled |

## Related

- [Inference](/rune/console/inference)
- [Storage](/rune/console/storage)
- [Logs](/rune/console/logging)
- [Quota](/rune/console/quota)
