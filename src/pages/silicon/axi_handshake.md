---
layout: ../../layouts/TechLayout.astro
title: AXI4-Lite Valid/Ready Handshake Protocol
date: 2026-03-10
---

AXI 버스 프로토콜의 핵심은 비동기 환경에서의 신뢰성 있는 데이터 전송이다.

## 1. Handshake 메커니즘
Master와 Slave 간의 데이터 통신은 오직 `VALID` 신호와 `READY` 신호가 동시에 HIGH가 되는 클럭 엣지(Clock Edge)에서만 발생한다.

### 1.1 Deadlock 발생 조건
Slave가 `VALID`를 확인하기 전에 `READY`를 먼저 띄우거나, Master가 `READY`를 기다리며 `VALID`를 무한 대기시키는 잘못된 FSM(Finite State Machine) 설계는 시스템 전체에 데드락(Deadlock)을 유발한다.

## 2. RTL Implementation
아래는 Master 측의 전송 로직을 SystemVerilog로 구현한 파편이다.

### 2.1 Master Write Channel
```systemverilog
always_ff @(posedge aclk) begin
    if (!aresetn) begin
        m_axi_awvalid <= 1'b0;
    end else begin
        // VALID 신호는 READY에 종속되지 않고 선행되어야 함
        if (start_write && !m_axi_awvalid)
            m_axi_awvalid <= 1'b1;
        else if (m_axi_awvalid && m_axi_awready)
            m_axi_awvalid <= 1'b0;
    end
end
