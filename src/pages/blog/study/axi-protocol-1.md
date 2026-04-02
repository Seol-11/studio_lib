---
layout: ../../../layouts/BlogPostLayout.astro
title: "AMBA AXI 프로토콜 스터디 - 1"
date: "2026-03-18"
description: "ARM의 AMBA AXI 프로토콜의 기본 채널 구조와 Handshake 메커니즘 정리"
tags: ["study", "arch", "axi"]
category: "study/arch"
---

SoC(System on Chip) 설계에서 가장 널리 쓰이는 온칩 버스 프로토콜인 AMBA AXI에 대해 스터디한 내용을 정리한다.

## AXI의 5개 독립적인 채널

AXI는 Read와 Write 트랜잭션을 위해 총 5개의 독립적인 채널을 제공한다.

1. **Read Address Channel (AR)**
2. **Read Data Channel (R)**
3. **Write Address Channel (AW)**
4. **Write Data Channel (W)**
5. **Write Response Channel (B)**

채널이 독립적이라는 것은 데이터가 양방향으로 동시에 전송될 수 있으며(Full-duplex), 주소와 데이터 전송이 서로 다른 타이밍에 일어날 수 있음을 의미한다. 이를 통해 버스 대역폭의 효율성을 극대화할 수 있다.

## VALID / READY Handshake

모든 채널은 정보 전달을 위해 `VALID`와 `READY`라는 두 가지 신호를 사용한 핸드쉐이크 방식을 따른다.

- 송신자(Source)는 정보가 유효할 때 `VALID`를 High로 만든다.
- 수신자(Destination)는 정보를 받을 준비가 되었을 때 `READY`를 High로 만든다.
- 클럭의 Rising Edge에서 `VALID`와 `READY`가 모두 High일 때 전송이 완료된다.

이 단순하면서도 강력한 핸드쉐이크 규칙 덕분에 Master와 Slave의 처리 속도 차이를 쉽게 흡수할 수 있다.

다음 포스트에서는 Burst 전송과 Out-of-order 완료에 대해 다뤄볼 예정이다.
