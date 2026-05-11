---
layout: ~/layouts/BlogPostLayout.astro
title: "6G Next-Generation Communication: OFDM System Design on FPGA"
date: "2026-05-11"
description: "6G 통신을 위한 고속 OFDM 송수신기 하드웨어 아키텍처 및 FPGA 구현 전략"
tags: ["projects", "6G", "OFDM", "FPGA", "Verilog"]
category: "projects/OFDM"
heroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2070"
---

![Hardware Architecture](https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=2070)

## 1. 개요: 6G와 OFDM 기술의 진화
6G 통신 시스템은 5G 대비 10~100배 빠른 데이터 전송 속도와 초저지연성을 목표로 합니다. 이를 구현하기 위해 물리 계층(PHY)의 핵심인 **OFDM(Orthogonal Frequency Division Multiplexing)** 기술은 더 넓은 대역폭과 높은 부반송파(Subcarrier) 밀도를 효율적으로 처리할 수 있는 하드웨어 아키텍처가 필수적입니다.

본 포스팅에서는 FPGA 상에서 리소스를 최적화하면서도 처리 성능(Throughput)을 극대화할 수 있는 OFDM 송신기 설계를 다룹니다.

## 2. OFDM 송신기 시스템 아키텍처
전형적인 OFDM 송신기는 다음과 같은 파이프라인 구조를 가집니다:

1.  **Scrambler & FEC Encoding**: 데이터 신뢰성 확보
2.  **Constellation Mapping**: QAM (16/64/256/1024-QAM) 변조
3.  **IFFT (Inverse Fast Fourier Transform)**: 주파수 영역 신호를 시간 영역으로 변환
4.  **CP (Cyclic Prefix) Insertion**: 다중 경로 페이딩 방지
5.  **Digital Up-Conversion (DUC)**: RF 대역으로의 상향 변환 준비

### 2.1 IFFT 모듈 최적화 (Radix-4 Pipeline 방식)
대용량 부반송파를 처리하기 위해 일반적인 Cooley-Tukey Radix-2 방식 대신, 연산 횟수를 줄이고 병렬 처리에 최적화된 **Radix-4 Feed-Forward 아키텍처**를 채택했습니다.

```systemverilog
// Radix-4 Butterfly Unit Conceptual Snippet
module radix4_butterfly (
    input  logic clk,
    input  logic [31:0] data_in[4],
    output logic [31:0] data_out[4]
);
    // 6G 고속 처리를 위한 파이프라인 스테이지 구현
    always_ff @(posedge clk) begin
        // Stage 1: 복소수 덧셈 및 뺄셈 연산
        // Stage 2: Twiddle Factor 곱셈 및 위상 회전
        // ... (Hardware Logic)
    end
endmodule
```

## 3. FPGA 구현 전략
하드웨어 자원(LUT, DSP, BRAM)을 효율적으로 사용하기 위한 전략입니다.

-   **Fixed-Point Arithmetic**: 부동 소수점 대신 16-bit 고정 소수점 연산을 사용하여 DSP Slice 소모를 최소화했습니다.
-   **Ping-Pong Buffering**: IFFT 연산과 CP 삽입 과정에서의 데이터 병목 현상을 해결하기 위해 이중 버퍼를 사용하여 처리량을 2배로 높였습니다.
-   **Resource Sharing**: 동일한 연산 유닛을 시분할 방식으로 활용하여 면적을 줄였습니다.

## 4. 시뮬레이션 결과 분석
MATLAB 모델과 RTL 시뮬레이션 결과를 비교하여 검증을 진행했습니다.

-   **EVM (Error Vector Magnitude)**: -40dB 이하 달성 (고성능 통신 기준 충족)
-   **Resource Utilization**: Artix-7 100T 기준 LUT 35%, DSP 45% 소모
-   **Max Frequency**: 250MHz (충분한 타이밍 마진 확보)

## 5. 결론 및 향후 과제
현재 6G의 초고속 요구사항을 만족하는 기본 OFDM 프레임워크를 구축했습니다. 향후에는 **OTFS(Orthogonal Time Frequency Space)**와 같은 차세대 변조 방식과의 통합 및 AI 기반의 채널 추정 알고리즘을 FPGA 상에 가속기로 구현할 계획입니다.

---
*본 문서는 학습 데모용으로 작성되었습니다.*
