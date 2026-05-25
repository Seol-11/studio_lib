---
layout: ~/layouts/BlogPostLayout.astro
title: "Appendix"
date: "2026-05-25"
description: "rsync & pigz, Makefile, ssh, ufw, crontab 사용법"
tags: ["reference", "tools", "linux"]
heroImage: none
---



## [Appendix A: High-Speed Data Control Cheat Sheet]

### 1. rsync (Remote Synchronization)
단순 복사(`cp`, `scp`)를 압도하는 최고의 동기화 툴입니다. 전송 중 인터넷이 끊기면 처음부터 다시 보내야 하는 `scp`와 달리, `rsync`는 변경된 블록만 전송(증분 동기화)하고 이어받기가 가능합니다.

**💡 실무 표준 콤보**
```bash
# 로컬의 sim_dir 전체를 서버의 /backup 폴더로 전송 (이어받기 + 압축 + 진행률 표시)
rsync -avzP ./sim_dir/ user@192.168.1.10:/backup/sim_dir/

# 특정 확장자(예: fsdb)만 빼고 전송 (용량 절약)
rsync -avzP --exclude="*.fsdb" ./sim_dir/ user@server:/backup/
```

**🛠️ 핵심 옵션 해부**
* `-a` (--archive): 파일의 권한(Permission), 소유자, 타임스탬프, 심볼릭 링크를 원본 그대로 유지하며 복사합니다.
* `-v` (--verbose): 전송 진행 상황을 터미널에 상세히 출력합니다.
* `-z` (--compress): 네트워크 전송 시 데이터를 압축하여 대역폭 소모를 줄입니다. 텍스트로 된 시뮬레이션 로그 전송 시 속도가 수 배 빨라집니다.
* `-P` (--partial --progress): **[가장 중요]** 전송 중 끊겨도 찌꺼기 파일을 남겨두어 훗날 **이어받기(Resume)**를 수행합니다.
* `--delete`: 원격 저장소에만 있고 로컬(원본)에는 없는 파일을 자동으로 삭제하여 두 폴더를 완벽한 거울(Mirroring) 상태로 만듭니다. (주의해서 사용)

### 2. pigz (Parallel Implementation of GZip)
일반적인 `tar.gz` 압축은 서버의 CPU 코어를 딱 1개만 씁니다. `pigz`는 **서버의 모든 다중 코어를 100% 갈아 넣어** 수십 GB의 데이터를 순식간에 압축하고 해제합니다.

**💡 실무 표준 콤보**
```bash
# 1. 아카이빙(tar)과 동시에 pigz로 병렬 압축하기
tar -I pigz -cvf backup_sim.tar.gz ./sim_dir

# 2. 압축 풀기
tar -I pigz -xvf backup_sim.tar.gz

# 3. 옵션 제어 (모든 코어를 다 쓰면 서버가 터지므로 코어 개수 제한)
tar -I 'pigz -p 8' -cvf backup.tar.gz ./src  # CPU 코어 8개만 할당
```

---

## [Appendix B: Build Automation & Remote GUI Cheat Sheet]

### 1. Makefile (디지털 설계 빌드 자동화의 알파와 오메가)
Verilog/SystemVerilog 파일이 수백 개로 늘어나면 쉘 스크립트(`.sh`)로는 의존성 관리가 불가능합니다. `make`는 타겟과 의존성을 비교하여 **"수정된 파일만"** 스마트하게 재컴파일합니다.

**💡 디지털 설계(VCS 기준) 실무 Makefile 템플릿**
폴더에 `Makefile` (M 대문자)이라는 이름으로 저장 후 사용합니다.
```makefile
# --- [변수 선언부] ---
COMPILER = vcs
CFLAGS = -full64 -sverilog -debug_access+all -timescale=1ns/1ps
RTL_SRC = top.sv router.sv
TB_SRC = router_tb.sv

# --- [규칙(Rule) 선언부] ---
# 구문: 
# 타겟(Target): 의존성(Dependencies)
#     명령어(Command) -> **반드시 Tab 키로 들여쓰기 할 것 (Space 금지)**

# 기본 타겟 (make만 치면 실행됨)
all: compile run

# 1. 컴파일: 소스 코드가 변경되었을 때만 실행됨
simv: $(RTL_SRC) $(TB_SRC)
    $(COMPILER) $(CFLAGS) $(RTL_SRC) $(TB_SRC) -o simv

# 강제 매핑 타겟 (이름만 지정)
compile: simv

# 2. 시뮬레이션 실행
run: simv
    ./simv -l run.log

# 3. 찌꺼기 청소 (가짜 타겟 선언 - 실제 파일명과 겹침 방지)
.PHONY: clean
clean:
    rm -rf csrc simv simv.daidir *.vcd *.fsdb *.log ucli.key
```

### 2. SSH (Secure Shell) & X11 포워딩
단순히 터미널 텍스트 창만 띄우는 것이 아니라, 원격 서버와 내 PC 사이를 완벽하게 연결하는 통로입니다.

**💡 실무 표준 콤보**
```bash
# 1. X11 포워딩 접속 (서버의 GUI 창을 내 PC로 끌어오기)
ssh -Y user@192.168.1.10
# 접속 후 터미널에 `verdi &`를 치면 내 모니터에 Verdi 창이 뜹니다.

# 2. 비밀번호 없이 자동 로그인 설정 (SSH Key-pair)
# (내 PC에서 실행)
ssh-keygen -t ed25519 -C "my_laptop"  # 엔터만 3번 쳐서 키 생성
ssh-copy-id user@192.168.1.10         # 생성된 공개키를 서버로 복사 (이때만 비번 입력)
# 이후부터는 ssh user@192.168.1.10 쳐도 비번을 묻지 않습니다.
```
* **Tip:** `-X` 옵션도 X11 포워딩이지만, 보안 제약 때문에 EDA 툴(Verdi 등)의 무거운 렌더링이 깨지는 경우가 잦습니다. 실무에서는 신뢰할 수 있는 서버(`-Y`) 옵션을 주로 사용합니다.

---

## [Appendix C: SysAdmin (Firewall & Scheduler) Cheat Sheet]

### 1. UFW (Uncomplicated Firewall)
리눅스 서버를 인터넷에 연결하는 순간 전 세계에서 해킹 봇(Bot)들이 포트 스캐닝을 시도합니다. 내가 접속할 포트만 열어두고 나머지는 콘크리트로 막아버려야 합니다.

**💡 실무 표준 콤보 (Root 권한 필요)**
```bash
# 1. 방화벽 상태 확인 (초기엔 inactive)
sudo ufw status

# 2. 기본 정책 설정 (들어오는 건 다 막고, 나가는 건 다 허용)
sudo ufw default deny incoming
sudo ufw default allow outgoing

# 3. SSH 접속 포트(22번) 허용 (이거 안 열고 방화벽 켜면 영원히 접속 불가됨)
sudo ufw allow 22/tcp

# 4. 방화벽 가동
sudo ufw enable

# 5. 적용된 룰 확인
sudo ufw status numbered

# 6. 잘못 만든 룰 삭제 (5번에서 확인한 번호 입력)
sudo ufw delete [번호]
```

### 2. Crontab (Cron Table)
새벽 3시마다 용량을 차지하는 오래된 `.fsdb` 덤프 파일을 지우거나, 백업 스크립트를 주기적으로 돌리게 만드는 백그라운드 스케줄러입니다.

**💡 기본 문법 및 설정**
```bash
# 스케줄 편집기 열기 (처음 실행 시 nano나 vim 선택)
crontab -e

# 스케줄 등록 목록 확인
crontab -l
```

**⏰ 크론탭 시간 설정 공식**
```text
* * * * * 실행할_명령어_또는_스크립트_절대경로
┬ ┬ ┬ ┬ ┬
│ │ │ │ └─ 요일 (0=일, 1=월, ..., 6=토)
│ │ │ └─── 월 (1~12)
│ │ └───── 일 (1~31)
│ └─────── 시 (0~23)
└───────── 분 (0~59)
```

**💡 실무 등록 예시 (crontab -e 창 내부에 작성)**
```bash
# 매일 새벽 4시 0분에 /backup 폴더로 rsync 동기화 실행
0 4 * * * rsync -avz --delete /home/user/sim/ /backup/sim/

# 매주 일요일(0) 밤 11시 30분에 오래된 로그 청소 스크립트 실행
30 23 * * 0 /home/user/scripts/auto_clean.sh

# 10분마다 특정 서버 상태 체크 스크립트 실행
*/10 * * * * /home/user/scripts/health_check.sh >/dev/null 2>&1
```
* **Tip:** Cron은 터미널 환경변수(PATH)를 공유하지 않으므로, 실행할 스크립트나 파일 경로는 무조건 **절대 경로(`/home/user/...`)**로 적는 것이 철칙입니다.