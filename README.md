# 테트리스

HTML, CSS, JavaScript만 사용하는 브라우저 테트리스 게임입니다.  
빌드 도구나 외부 라이브러리 없이 바로 실행할 수 있는 입문자용 프론트엔드 프로젝트입니다.

## 프로젝트 구조

```
cursor-tetris/
├── index.html   # 화면 구조 (보드, 점수, 버튼, 조작법)
├── style.css    # 스타일
├── script.js    # 게임 로직
└── README.md    # 이 파일
```

## 실행 방법

### 로컬 실행

1. 이 폴더를 연다.
2. `index.html` 파일을 더블클릭하거나, 브라우저로 드래그한다.
3. **시작** 버튼을 누른 뒤 키보드로 블록을 조작한다.

### VS Code / Cursor에서 실행

1. `index.html` 파일을 연다.
2. 우클릭 → **Open with Live Server** (Live Server 확장이 설치된 경우)
3. 또는 파일 탐색기에서 `index.html`을 브라우저로 연다.

## 조작법

| 키 | 동작 |
|----|------|
| ArrowLeft (`←`) | 왼쪽 이동 |
| ArrowRight (`→`) | 오른쪽 이동 |
| ArrowDown (`↓`) | 한 칸 빠르게 내리기 |
| ArrowUp (`↑`) | 회전 |
| Space | 즉시 낙하 (hard drop) |

- 이동·회전은 충돌 판정을 통과할 때만 적용됩니다.
- 회전 후 벽이나 고정 블록과 겹치면 회전이 취소됩니다.
- 게임이 시작되지 않았거나 게임 오버 상태에서는 키 입력이 무시됩니다.

## 구현 기능

- 10×20 CSS Grid 게임 보드
- 7가지 테트로미노 (I, O, T, S, Z, J, L)
- 자동 낙하, 좌우 이동, 회전, soft/hard drop
- 충돌 판정 및 블록 고정
- 라인 삭제 및 점수 계산
- 게임 오버 및 재시작

## 게임 규칙

- 블록은 일정 시간마다 자동으로 한 칸씩 내려갑니다.
- 바닥이나 고정된 블록에 닿으면 현재 블록이 고정되고 새 블록이 생성됩니다.
- 가로 한 줄이 모두 채워지면 해당 줄이 삭제되고 점수가 올라갑니다.
- 새 블록을 스폰할 수 없으면 게임 오버가 됩니다.
- **재시작** 버튼으로 보드, 점수, 타이머, 게임 상태를 초기화합니다.

## 점수 규칙

| 삭제한 줄 수 | 점수 |
|-------------|------|
| 1줄 | 100 |
| 2줄 | 300 |
| 3줄 | 500 |
| 4줄 | 800 |

> 한 번에 여러 줄을 삭제할수록 줄 수당 점수가 더 높습니다.

## 품질 점검 방법

1. 브라우저에서 `index.html`을 연다.
2. 개발자 도구(F12) → **Console** 탭에서 에러가 없는지 확인한다.
3. **시작** → 키보드 조작 → 라인 삭제 → 게임 오버 → **재시작** 순서로 동작을 확인한다.

### Cursor 슬래시 커맨드 (선택)

`.cursor/commands/`에 QA·리뷰용 커맨드가 있습니다.

- `/qa-playtest` — 기능 테스트 시나리오 점검
- `/release-check` — 배포 전 최종 점검

## GitHub Pages 배포 방법

### 1. GitHub에 저장소 생성

저장소 이름 예: `cursor-tetris` (public 권장)

### 2. 파일 push

```bash
git init
git add index.html style.css script.js README.md .gitignore
git commit -m "Deploy Tetris game to GitHub Pages"
git branch -M main
git remote add origin https://github.com/yun-jang/cursor-tetris.git
git push -u origin main
```

### 3. GitHub Pages 설정

Repository → **Settings** → **Pages**

- Source: **Deploy from a branch**
- Branch: `main` / `/ (root)`

### 4. 배포 URL 확인

배포가 완료되면 아래 주소에서 게임을 실행할 수 있습니다.

```
https://yun-jang.github.io/cursor-tetris/
```

> 반영까지 1~2분 걸릴 수 있습니다.
