---
layout: ../../layouts/BlogPostLayout.astro
title: "NoC Routing & Arbitration 가벼운 복습"
date: "2026-03-14"
description: "Network-on-Chip (NoC)의 라우팅 알고리즘과 중재 방식에 대한 스터디 노트"
tags: ["study", "noc", "arch", "rtl"]
category: "study/arch"
---

최근 멀티코어 및 칩렛(Chiplet) 구조가 각광받으면서, 내부 컴포넌트 간의 통신 병목을 해결하기 위한 **Network-on-Chip (NoC)** 설계의 중요성이 더욱 커지고 있다. 주말 동안 전공 서적을 훑어보며 NoC의 핵심 요소인 Routing과 Arbitration에 대해 가볍게 복습한 내용을 남겨둔다.

## NoC의 기본 구조

일반적인 NoC는 크게 3가지 요소로 구성된다:
1. **Network Interface (NI)**: PE(Processing Element)와 NoC 라우터를 연결해주는 역할을 한다. AXI 같은 표준 프로토콜 패킷을 NoC 내부에서 사용하는 Flit(Flow control unit) 단위로 쪼개거나 묶는 역할을 수행한다.
2. **Router**: 각 노드에 위치하며 들어온 패킷이 목적지로 가기 위해 어떤 포트로 나가야 할지 결정한다.
3. **Link**: 라우터와 라우터를 연결하는 물리적인 와이어 버스.

## Routing Algorithm (라우팅 알고리즘)

라우팅은 편지가 목적지로 가기 위한 경로를 찾는 것과 같다. 설계의 복잡도와 데드락(Deadlock) 방지 여부에 따라 여러 가지 방식이 있다.

### 1. Deterministic Routing (결정적 라우팅)
출발지와 목적지가 같으면 항상 동일한 경로를 탄다.
- **XY Routing**: 2D Mesh 토폴로지에서 가장 흔하게 쓰이는 방식이다. X축으로 먼저 이동한 뒤, Y축으로 이동한다.
  - **장점**: 구현이 매우 간단하고(RTL 면적이 작음), Turn 제한 모델에 의해 데드락을 원천적으로 방지할 수 있다.
  - **단점**: 네트워크의 특정 구간(특히 중앙)에 트래픽이 몰리면 혼잡(Congestion)을 피해갈 방법이 없다.

### 2. Adaptive Routing (적응형 라우팅)
네트워크의 혼잡도나 링크의 상태에 따라 경로를 동적으로 변경한다.
- **장점**: 트래픽 분산을 통해 전체적인 Throughput을 높일 수 있다.
- **단점**: 구현이 복잡해지고 파이프라인 스테이지가 길어질 수 있으며, 데드락 회피 알고리즘(Escape VC 등)이 추가로 필요하다.

> **내 생각**: 학부 수준의 RTL 프로젝트에서는 XY Routing으로 시작해서 버그 없는 완벽한 흐름 제어(Flow Control)를 구현하는 것이 먼저다. Adaptive는 그 이후에 고민할 문제.

## Arbitration (중재 방식)

동일한 라우터 출력 포트로 여러 입력 패킷이 동시에 나가려고 할 때 누구에게 먼저 길을 내어줄지 결정하는 로직이다.

- **Round-Robin (RR)**: 공평하게 순서를 돌아가며 기회를 준다. 구현이 쉽고 Starvation(기아 상태)을 막을 수 있어 가장 널리 쓰인다.
- **Matrix Arbiter**: 최근 승리한 요청자를 가장 낮은 우선순위로 보내어 완벽한 LRU(Least Recently Used)를 구현할 수 있는 빠른 하드웨어 구조.
- **Priority-based**: 특정 트래픽(예: 캐시 일관성 메시지나 인터럽트)에 높은 우선순위를 부여한다.

### 코드 스니펫 예시 (Round-Robin Arbiter 아이디어)

```verilog
// 간단한 Round-Robin 포인터 업데이트 로직의 개념적 예시
always @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
        rr_ptr <= 4'b0001; // 초기 포인터
    end else if (grant_valid) begin
        // 승인된 포트 다음으로 포인터를 이동
        rr_ptr <= {grant_vector[2:0], grant_vector[3]}; 
    end
end
```

## 마무리
다음 스터디에서는 라우터 내부의 버퍼(Virtual Channel)와 Flow Control (Credit-based vs. STOP/GO) 방식에 대해 벤치마크해 볼 계획이다. 실제 SystemVerilog로 모듈을 하나씩 작성해보는 것도 좋겠다.
