---
layout: ~/layouts/BlogPostLayout.astro
title: "DPD Algorithm Overview"
date: "2026-05-15"
description: "Digital Pre-Distortion for non-linear power amplifiers in OFDM systems."
tags: ["DPD", "PA", "Linearity"]
category: "projects/OFDM"
---

## Introduction to DPD

Power Amplifiers (PAs) are inherently non-linear devices, and OFDM signals, characterized by a high Peak-to-Average Power Ratio (PAPR), are highly sensitive to these non-linearities. **Digital Pre-Distortion (DPD)** is a widely used technique to linearize the PA by pre-distorting the input signal to negate the PA's distortion.

### Key Concepts

- **Memory Polynomials**: Used to model the PA behavior with memory effects.
- **Indirect Learning Architecture**: A common approach for adapting the DPD coefficients.

We will simulate this in the next post.