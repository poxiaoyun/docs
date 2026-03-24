---
title: 'Model Comparison'
updated: '2026-03-23'
---

## Overview

The Compare page allows you to send the same prompt to multiple models simultaneously and view their responses side by side. This is useful for selecting the best model for a task, A/B testing prompt variations, or evaluating the effect of fine-tuning.

## Navigation

**ChatApp → Compare**

## Interface Overview

![Model Comparison](/assets/screenshots/console/chatapp-compare.png)

The comparison interface shows multiple columns — one per model — with a shared input at the bottom.

## Setting Up a Comparison

1. Click **Add Model** to add a model column (up to 4 models simultaneously).
2. In each column header, select the model to use.
3. Optionally adjust per-column parameters (temperature, max tokens, etc.).
4. Type your prompt in the shared input box.
5. Click **Send to All** to submit the prompt to all selected models at once.

## Comparison Features

| Feature | Description |
|---------|-------------|
| Synchronized Prompts | One input sent to all models simultaneously |
| Per-column Parameters | Each model column can have independent parameter settings |
| Response Latency | Each column shows time-to-first-token and total completion time |
| Token Count | Shows prompt and completion token counts per model |
| Copy Response | Copy any individual model's response |
| Clear All | Reset all columns to start a new comparison |

## Example Use Cases

### Model Selection

Compare `llama-3-8b`, `llama-3-70b`, and `qwen2-7b` on your task — choose the best quality/cost tradeoff.

### Fine-tuning Validation

Compare `base-model` vs `finetuned-model` on the same prompt to verify that fine-tuning improved responses.

### Prompt Engineering

Test different system prompt variations across the same model to find the most effective instruction.

## Saving Comparisons

Click **Export Results** to download the comparison as a JSON or Markdown report, including all prompts, responses, and latency metrics.

## Permissions

| Action | Required Role |
|--------|--------------|
| Use model comparison | Developer or Admin |
