---
layout: ~/layouts/BlogPostLayout.astro
title: "tmux 사용법"
date: "2026-05-25"
description: "Bash, Git, vim, markdown, tmux, etc. 사용법"
tags: ["reference", "tools", "linux"]
heroImage: none
---


## [Ultimate Tmux Cheat Sheet for Digital Design Eng.]
* 기본 Prefix Key: `Ctrl + a` 로 세팅 완료 가정 (`~/.tmux.conf` 적용)

### 1. 세션 제어 (Session Management) - 터미널 프롬프트에서
| 명령어 | 동작 원리 및 목적 |
| :--- | :--- |
| **`tmux new -s [이름]`** | 지정된 이름으로 새로운 독립 세션 생성 |
| **`tmux ls`** | 현재 백그라운드에 살아있는 세션 리스트 확인 |
| **`tmux a -t [이름]`** | 백그라운드의 특정 세션으로 재진입 (Attach) |
| **`tmux kill-session -t [이름]`** | 응답 없는 특정 세션 강제 완전 종료 |

### 2. 화면 분할 (Pane Management) - Tmux 내부에서
| 단축키 (`Ctrl+a` 누른 후) | 동작 원리 및 목적 |
| :--- | :--- |
| **`%`** (또는 셋팅한 `|`) | 현재 화면을 세로(좌/우)로 분할 |
| **`"`** (또는 셋팅한 `-`) | 현재 화면을 가로(상/하)로 분할 |
| **`방향키`** | 분할된 페인(창) 간 커서 이동 |
| **`Ctrl` + `방향키`** | 현재 페인의 크기(경계선) 늘리기/줄이기 |
| **`z`** | 현재 페인을 전체 화면으로 확대(Zoom) / 재입력 시 축소 |
| **`x`** | 현재 커서가 있는 페인만 강제 닫기 (kill) |
| **`:` -> `setw synchronize-panes`** | 현재 윈도우의 모든 페인에 키보드 입력 동시 전달 (On/Off) |

### 3. 윈도우 탭 제어 (Window Management)
| 단축키 (`Ctrl+a` 누른 후) | 동작 원리 및 목적 |
| :--- | :--- |
| **`c`** | 새로운 윈도우(탭) 생성 |
| **`n` / `p`** | 다음(Next) 윈도우 / 이전(Prev) 윈도우로 이동 |
| **`0~9` 숫자키** | 해당 번호가 부여된 윈도우로 즉시 이동 |
| **`w`** | 현재 세션의 전체 윈도우/페인 목록을 리스트로 보고 선택 이동 |

### 4. 백그라운드 전환 및 스크롤 (Detach & Scroll)
| 단축키 (`Ctrl+a` 누른 후) | 동작 원리 및 목적 |
| :--- | :--- |
| **`d` (Detach)** | **[핵심]** 현재 작업을 백그라운드에 살려둔 채 Tmux 밖으로 빠져나감 (퇴근 시 필수) |
| **`[` (Copy Mode)** | 스크롤 모드 진입. `PageUp/Down`이나 `j, k`로 과거 출력 로그 열람 가능 |
| *(스크롤 모드 중)* **`q`** | 스크롤 모드 종료 및 일반 프롬프트 복귀 |

---